import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, CheckCircle2, X, Upload, UtensilsCrossed } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const MenuManager = ({ user }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main Course',
    is_veg: true
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('partner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMenuItems(data || []);
    } catch (err) {
      console.error("Error fetching menu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [user.id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      setErrorMsg('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      let imageUrl = null;

      // Upload image if exists
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}_dish_${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('menu_images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('menu_images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrlData.publicUrl;
      }

      // Insert into database
      const { error } = await supabase
        .from('menu_items')
        .insert([{
          partner_id: user.id,
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          is_veg: formData.is_veg,
          image_url: imageUrl
        }]);

      if (error) throw error;

      // Success
      setIsModalOpen(false);
      setFormData({ name: '', description: '', price: '', category: 'Main Course', is_veg: true });
      setImageFile(null);
      fetchMenu(); // Refresh the list

    } catch (err) {
      console.error("Error adding dish:", err);
      setErrorMsg(err.message || "Failed to add dish.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Menu Management</h1>
          <p className="text-slate-500">Manage your restaurant's dishes and pricing.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-orange-500/30"
        >
          <Plus size={20} />
          Add New Dish
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : menuItems.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-4">
            <UtensilsCrossed className="text-orange-400" size={40} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Your menu is empty</h3>
          <p className="text-slate-500 max-w-md mb-6">
            Start adding your delicious dishes to attract more customers. Don't forget to add mouth-watering photos!
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors"
          >
            <Plus size={20} />
            Add Your First Dish
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {menuItems.map(item => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all group">
              <div className="h-48 bg-slate-100 relative">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <ImageIcon size={40} className="mb-2 opacity-50" />
                    <span className="text-sm font-medium">No Image</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-bold shadow-sm">
                  ₹{item.price}
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm">
                  <div className={`w-3 h-3 rounded-full ${item.is_veg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">{item.category}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{item.name}</h3>
                <p className="text-slate-500 text-sm line-clamp-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Dish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl my-8 relative animate-slideUp">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Add New Dish</h2>
              
              {errorMsg && (
                <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-200">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-slate-700">Dish Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full py-3 px-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="e.g. Paneer Butter Masala"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-2 text-slate-700">Description</label>
                    <textarea 
                      name="description"
                      required
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full py-3 px-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors resize-none"
                      placeholder="Briefly describe the dish and its ingredients..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700">Price (₹)</label>
                    <input 
                      type="number" 
                      name="price"
                      min="0"
                      required
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full py-3 px-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="299"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700">Category</label>
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full py-3 px-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors bg-white"
                    >
                      <option value="Starters">Starters</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Breads">Breads</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Beverages">Beverages</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">Food Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="is_veg" 
                        checked={formData.is_veg === true}
                        onChange={() => setFormData(prev => ({ ...prev, is_veg: true }))}
                        className="w-4 h-4 text-orange-500 focus:ring-orange-500" 
                      />
                      <span className="font-medium text-slate-700">Vegetarian</span>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="is_veg" 
                        checked={formData.is_veg === false}
                        onChange={() => setFormData(prev => ({ ...prev, is_veg: false }))}
                        className="w-4 h-4 text-orange-500 focus:ring-orange-500" 
                      />
                      <span className="font-medium text-slate-700">Non-Vegetarian</span>
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">Dish Photo (Optional but recommended)</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      id="dishImage"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label 
                      htmlFor="dishImage" 
                      className="flex items-center justify-center w-full p-6 border-2 border-dashed border-slate-300 rounded-xl hover:bg-orange-50 hover:border-orange-300 transition-colors cursor-pointer"
                    >
                      {imageFile ? (
                        <div className="flex items-center gap-2 text-orange-600 font-medium">
                          <ImageIcon size={20} />
                          {imageFile.name}
                        </div>
                      ) : (
                        <div className="text-slate-500 flex items-center gap-2">
                          <Upload size={20} />
                          <span>Click to upload image (Max 5MB)</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors disabled:opacity-70"
                  >
                    {isSubmitting ? 'Saving...' : 'Add Dish'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManager;
