'use client';
import React, { useState, useEffect } from 'react';
import { FEATURES } from './Features';
import { FeatureVisual } from './FeatureVisual';

export function FeaturesCarousel() {
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % FEATURES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const feature = FEATURES[activeFeature];

  return (
    <div className="w-full h-full glass-panel p-1 rounded-3xl bg-gradient-to-br from-white/10 to-white/0 border border-white/20 shadow-2xl backdrop-blur-3xl flex flex-col overflow-hidden">
      <div className="bg-[#0f172a]/80 rounded-[20px] p-6 lg:p-8 flex-1 flex flex-col">
        
        {/* Animated Content Wrapper */}
        <div key={activeFeature} className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col items-center text-center gap-3 mb-6 h-[110px] justify-end">
            <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center ring-1 ring-white/10 shadow-lg`}>
              <feature.Icon className={`w-7 h-7 ${feature.color}`} />
            </div>
            <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
            <p className="text-slate-400 text-sm max-w-[300px] line-clamp-2">{feature.desc}</p>
          </div>

          <div className="flex-1 relative min-h-[200px]">
            <FeatureVisual activeFeature={activeFeature} />
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-6">
          {FEATURES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveFeature(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${activeFeature === idx ? 'w-8 bg-blue-500' : 'w-2 bg-slate-700'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}