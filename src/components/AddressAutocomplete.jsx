import { useEffect, useRef, useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
let googlePlacesPromise;

const loadGooglePlaces = () => {
  if (!GOOGLE_MAPS_API_KEY) return Promise.resolve(null);
  if (window.google?.maps?.places) return Promise.resolve(window.google.maps.places);
  if (googlePlacesPromise) return googlePlacesPromise;
  googlePlacesPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`;
    script.async = true;
    script.onload = () => window.google?.maps?.places ? resolve(window.google.maps.places) : reject(new Error('Google Places failed to load.'));
    script.onerror = () => reject(new Error('Google Places failed to load.'));
    document.head.appendChild(script);
  });
  return googlePlacesPromise;
};

const AddressAutocomplete = ({ value, onSelect, placeholder = 'Search your address...', required }) => {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimer = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const closeDropdown = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', closeDropdown);
    return () => document.removeEventListener('mousedown', closeDropdown);
  }, []);

  useEffect(() => () => clearTimeout(debounceTimer.current), []);

  const fetchNominatimSuggestions = async (input) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(input)}&format=json&limit=5&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } },
    );
    if (!response.ok) throw new Error('Address search failed.');
    const data = await response.json();
    setSuggestions(data.map((item) => ({ place_id: item.place_id, description: item.display_name, lat: item.lat, lon: item.lon, provider: 'nominatim' })));
    setShowDropdown(data.length > 0);
  };

  const fetchSuggestions = async (input) => {
    if (!input || input.trim().length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setIsLoading(true);
    try {
      if (!GOOGLE_MAPS_API_KEY) {
        await fetchNominatimSuggestions(input);
        return;
      }
      const places = await loadGooglePlaces();
      const service = new places.AutocompleteService();
      const predictions = await new Promise((resolve, reject) => {
        service.getPlacePredictions(
          { input, types: ['establishment', 'geocode'] },
          (results, status) => status === window.google.maps.places.PlacesServiceStatus.OK ? resolve(results || []) : reject(new Error(`Places autocomplete failed: ${status}`)),
        );
      });
      setSuggestions(predictions.slice(0, 5).map((prediction) => ({ ...prediction, provider: 'google' })));
      setShowDropdown(predictions.length > 0);
    } catch {
      try {
        await fetchNominatimSuggestions(input);
      } catch {
        setSuggestions([]);
        setShowDropdown(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const nextQuery = event.target.value;
    setQuery(nextQuery);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchSuggestions(nextQuery), 350);
  };

  const handleSelect = async (suggestion) => {
    setShowDropdown(false);
    setQuery(suggestion.description);
    if (suggestion.provider === 'google') {
      try {
        await loadGooglePlaces();
        const service = new window.google.maps.places.PlacesService(document.createElement('div'));
        const place = await new Promise((resolve, reject) => {
          service.getDetails(
            { placeId: suggestion.place_id, fields: ['geometry', 'rating', 'user_ratings_total', 'url'] },
            (result, status) => status === window.google.maps.places.PlacesServiceStatus.OK ? resolve(result) : reject(new Error(`Place details failed: ${status}`)),
          );
        });
        const location = place.geometry?.location;
        onSelect({ address: suggestion.description, latitude: location?.lat() ?? null, longitude: location?.lng() ?? null, googleMapLink: place.url || null, rating: place.rating || 0, userRatingCount: place.user_ratings_total || 0 });
        return;
      } catch {
        // If Google details are unavailable, leave a selectable text address below.
      }
    }
    onSelect({
      address: suggestion.description,
      latitude: parseFloat(suggestion.lat) || null,
      longitude: parseFloat(suggestion.lon) || null,
      googleMapLink: suggestion.lat && suggestion.lon ? `https://www.openstreetmap.org/?mlat=${suggestion.lat}&mlon=${suggestion.lon}` : null,
      rating: 0,
      userRatingCount: 0,
    });
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative flex items-center">
        <MapPin className="absolute left-3 z-10 text-slate-400 pointer-events-none" size={17} />
        <input type="text" value={query} onChange={handleInputChange} onFocus={() => suggestions.length > 0 && setShowDropdown(true)} className="w-full py-2 sm:py-2.5 pl-9 pr-9 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 text-xs sm:text-sm transition duration-200 focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/10" placeholder={placeholder} required={required} autoComplete="off" />
        {isLoading && <Loader2 className="absolute right-3 text-orange-400 animate-spin" size={16} />}
      </div>
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-100 shadow-xl rounded-lg overflow-hidden z-50 max-h-56 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button key={suggestion.place_id || index} type="button" className="w-full text-left px-4 py-3 text-xs sm:text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-700 transition-colors border-b border-slate-50 last:border-0 flex items-start gap-2.5" onMouseDown={(event) => { event.preventDefault(); handleSelect(suggestion); }}>
              <MapPin size={14} className="text-orange-400 mt-0.5 shrink-0" />
              <span className="leading-snug">{suggestion.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
