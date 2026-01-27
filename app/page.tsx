import { ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';
import { FeaturesCarousel } from './components/ui/FeatureCarousel';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center w-full px-6 gap-12 lg:gap-24 py-12 max-w-7xl mx-auto">
        
        {/* Left Side */}
        <div className="flex-1 space-y-8 text-center md:text-left z-20 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-300 text-xs font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Live Collaboration Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]">
            Code Together. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Build Faster.
            </span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-xl leading-relaxed mx-auto md:mx-0">
            The ultimate collaborative workspace. Pair program, run technical interviews, and learn with friends—all in real-time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link 
              href="/dashboard"
              className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-500 transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              Start Coding <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-bold text-lg transition flex items-center justify-center gap-2">
              <Play className="w-4 h-4 fill-current" /> Watch Demo
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 w-full max-w-[480px] h-[520px] hidden md:flex items-center justify-center">
          <FeaturesCarousel />
        </div>
      </div>
    </main>
  );
}