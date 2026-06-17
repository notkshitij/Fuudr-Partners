import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  UtensilsCrossed, 
  Video, 
  Star 
} from 'lucide-react';
import { supabase } from '../../supabaseClient';

const Overview = ({ user }) => {
  const [stats, setStats] = useState({
    menuItems: 0,
    reels: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch menu count
        const { count: menuCount } = await supabase
          .from('menu_items')
          .select('*', { count: 'exact', head: true })
          .eq('partner_id', user.id);

        // Fetch reels count
        const { count: reelsCount } = await supabase
          .from('reels')
          .select('*', { count: 'exact', head: true })
          .eq('partner_id', user.id);

        setStats({
          menuItems: menuCount || 0,
          reels: reelsCount || 0
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user.id]);

  const statCards = [
    { title: 'Total Menu Items', value: stats.menuItems, icon: UtensilsCrossed, color: 'text-orange-500', bg: 'bg-orange-100' },
    { title: 'Reels Uploaded', value: stats.reels, icon: Video, color: 'text-blue-500', bg: 'bg-blue-100' },
    { title: 'Profile Rating', value: 'New', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { title: 'Profile Views', value: '0', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-100' },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to your Dashboard!</h1>
        <p className="text-slate-500 text-lg">Here's a quick overview of how {user.restaurant_name} is doing.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={stat.color} size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Placeholder for future charts or recent activity */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 min-h-[300px] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <TrendingUp className="text-slate-300" size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Analytics coming soon</h3>
        <p className="text-slate-500 max-w-md">
          Once your restaurant goes live and customers start interacting with your menu and reels, you'll see detailed analytics here.
        </p>
      </div>
    </div>
  );
};

export default Overview;
