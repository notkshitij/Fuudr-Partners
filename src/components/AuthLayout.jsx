import React from 'react';
import { ChefHat } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex bg-slate-50 font-outfit text-slate-900">
      
      {/* Left Pane - Image with padding and rounded corners */}
      <div className="hidden lg:flex flex-1 relative flex-col justify-center items-center p-6">
        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl">
          {/* New Image - Dark mood, pizza/burger/hidden gems vibe */}
          <img 
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Delicious Pizza and Burgers" 
            className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-[20000ms] hover:scale-110"
          />
          
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
          
          {/* Huge stylized Fuudr text */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
            <div className="flex items-center gap-4 mb-2">
              <ChefHat className="text-orange-500 w-24 h-24 lg:w-32 lg:h-32 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]" />
              <h1 className="text-[6rem] lg:text-[8rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500 drop-shadow-lg">
                Fuudr
              </h1>
            </div>
            <p className="text-orange-100 text-2xl lg:text-3xl font-medium tracking-[0.3em] uppercase bg-black/30 px-6 py-2 rounded-full backdrop-blur-sm border border-white/10">
              Partner Portal
            </p>
          </div>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex-1 flex flex-col justify-center p-8 max-w-2xl mx-auto w-full">
        <div className="bg-white p-10 rounded-3xl shadow-xl w-full animate-slideUp border border-slate-100">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2 text-slate-900">{title}</h1>
            <p className="text-slate-500">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>

    </div>
  );
};

export default AuthLayout;
