import { useState } from 'react';
import { Clock } from 'lucide-react';

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];
const PERIODS = ['AM', 'PM'];

/**
 * SimpleTimePicker
 * Props:
 *  - label: string
 *  - value: string  (e.g. "09:30 AM")
 *  - onChange: (timeString: string) => void
 *  - defaultPeriod: 'AM' | 'PM'
 */
const SimpleTimePicker = ({ label, value, onChange, defaultPeriod = 'AM' }) => {
  const parse = (v) => {
    if (!v) return { hour: '09', minute: '00', period: defaultPeriod };
    const match = v.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (match) return { hour: match[1].padStart(2, '0'), minute: match[2], period: match[3].toUpperCase() };
    return { hour: '09', minute: '00', period: defaultPeriod };
  };

  const { hour: initH, minute: initM, period: initP } = parse(value);
  const [hour, setHour] = useState(initH);
  const [minute, setMinute] = useState(initM);
  const [period, setPeriod] = useState(initP);

  const emit = (h, m, p) => {
    onChange(`${h}:${m} ${p}`);
  };

  const handleHour = (h) => { setHour(h); emit(h, minute, period); };
  const handleMinute = (m) => { setMinute(m); emit(hour, m, period); };
  const handlePeriod = (p) => { setPeriod(p); emit(hour, minute, p); };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold mb-2 text-slate-700 flex items-center gap-1.5">
          <Clock size={15} className="text-orange-500" />
          {label}
        </label>
      )}
      <div className="flex items-center gap-2 p-3 rounded-xl border-2 border-slate-200 bg-slate-50 focus-within:border-orange-500 focus-within:bg-white transition-colors">
        {/* Hour */}
        <select
          value={hour}
          onChange={(e) => handleHour(e.target.value)}
          className="bg-transparent text-slate-900 font-semibold text-lg focus:outline-none cursor-pointer"
        >
          {HOURS.map(h => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>

        <span className="text-slate-400 font-bold text-xl select-none">:</span>

        {/* Minute */}
        <select
          value={minute}
          onChange={(e) => handleMinute(e.target.value)}
          className="bg-transparent text-slate-900 font-semibold text-lg focus:outline-none cursor-pointer"
        >
          {MINUTES.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        {/* AM/PM */}
        <div className="ml-auto flex rounded-lg overflow-hidden border border-slate-200">
          {PERIODS.map(p => (
            <button
              key={p}
              type="button"
              onClick={() => handlePeriod(p)}
              className={`px-3 py-1 text-sm font-bold transition-colors ${
                period === p
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-slate-500 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimpleTimePicker;
