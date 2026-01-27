
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { 
//   Code2, Menu, X, Bell, Settings, LogOut, 
//   CreditCard, User as UserIcon, Moon, Sun, 
//   Github, Mail, Lock, Palette, Check, Cloud, Edit2, Camera, ChevronDown, ChevronUp
// } from 'lucide-react';
// import { DashboardTheme } from '../../types';

// export const MarketingLayout = ({ children, onOpenAuth }: { children?: React.ReactNode; onOpenAuth: () => void }) => {
//   return (
//     <div className="min-h-screen flex flex-col bg-[#0f172a] text-white font-sans relative selection:bg-blue-500/30 overflow-x-hidden">
//       {/* Background Gradients for the whole page */}
//       <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-blob" />
//       <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-blob animation-delay-2000" />

//       {/* Navbar - Sticky & Glassy */}
//       <nav className="sticky top-0 w-full h-20 flex items-center justify-between px-6 md:px-12 z-50 bg-[#0f172a]/20 backdrop-blur-md border-b border-white/5 transition-all">
//         <div className="flex items-center gap-2 cursor-pointer">
//           <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
//              <Code2 className="w-6 h-6 text-white" />
//           </div>
//           <span className="font-bold text-xl tracking-tight text-white">CodeCollab</span>
//         </div>
        
//         {/* Right side grouped nav */}
//         <div className="flex items-center gap-8">
//             <div className="hidden md:flex items-center gap-6">
//                 <a href="#features" className="text-slate-300 hover:text-white font-medium transition-colors text-sm">Features</a>
//                 <a href="#pricing" className="text-slate-300 hover:text-white font-medium transition-colors text-sm">Pricing</a>
//             </div>
//             <div className="w-px h-5 bg-white/10 hidden md:block"></div>
//             <div className="flex items-center gap-4">
//                 <button onClick={onOpenAuth} className="text-slate-300 hover:text-white font-medium transition-colors text-sm">Log In</button>
//                 <button 
//                     onClick={onOpenAuth}
//                     className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110 px-5 py-2.5 rounded-full font-bold transition shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] text-sm"
//                 >
//                     Get Started
//                 </button>
//             </div>
//         </div>
//       </nav>

//       <main className="flex-grow flex flex-col relative z-10 w-full max-w-7xl mx-auto">
//         {children}
//       </main>

//       <footer className="h-16 flex items-center justify-center text-slate-500 text-sm z-40 bg-transparent relative">
//         <p>© 2024 CodeCollab Inc. Built for developers.</p>
//       </footer>
//     </div>
//   );
// };

// // --- Theme Background Logic ---
// const ThemeBackground = ({ theme }: { theme: DashboardTheme }) => {
//     switch (theme) {
//         case 'Galaxy':
//             return (
//                 <div className="absolute inset-0 bg-[#050505]">
//                     {/* Stars */}
//                     <div className="absolute inset-0" style={{ 
//                         backgroundImage: 'radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 3px), radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 2px), radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 3px)',
//                         backgroundSize: '550px 550px, 350px 350px, 250px 250px',
//                         backgroundPosition: '0 0, 40px 60px, 130px 270px'
//                     }}></div>
//                     {/* Deep Space Glow */}
//                     <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-purple-900/20 rounded-full blur-[150px] animate-pulse" />
//                     <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-blue-900/10 rounded-full blur-[150px]" />
//                 </div>
//             );
//         case 'Vector':
//             return (
//                 <div className="absolute inset-0 bg-[#121212]">
//                     {/* Grid Pattern - Pronounced */}
//                     <div className="absolute inset-0 opacity-20" style={{
//                         backgroundImage: `linear-gradient(rgba(200, 200, 200, 0.3) 1px, transparent 1px),
//                         linear-gradient(90deg, rgba(200, 200, 200, 0.3) 1px, transparent 1px)`,
//                         backgroundSize: '40px 40px'
//                     }}></div>
//                     {/* Radial Vignette */}
//                     <div className="absolute inset-0 bg-[radial-gradient(transparent_30%,#121212_100%)]"></div>
//                     <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-white/5 blur-[120px]" />
//                 </div>
//             );
//         case 'BlueSky':
//             return (
//                 <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-blue-300 to-blue-100">
//                     {/* Clouds (Abstract Blobs) */}
//                     <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-white/20 rounded-full blur-[60px] animate-blob" />
//                     <div className="absolute top-[40%] right-[20%] w-96 h-96 bg-white/30 rounded-full blur-[80px] animate-blob animation-delay-2000" />
//                     <div className="absolute bottom-[-10%] left-[30%] w-[80%] h-64 bg-white/40 rounded-full blur-[100px]" />
//                 </div>
//             );
//         case 'Nebula':
//             return (
//                 <div className="absolute inset-0 bg-[#1e0b24]">
//                     <div className="absolute top-0 left-0 w-full h-full opacity-60" style={{
//                         background: 'radial-gradient(circle at 50% 50%, #701a75 0%, transparent 60%)'
//                     }}></div>
//                     <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-pink-600/20 rounded-full blur-[100px] animate-blob" />
//                     <div className="absolute bottom-[10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />
//                 </div>
//             );
//         case 'Ocean':
//             return (
//                 <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0f172a] to-[#083344]">
//                     {/* Watery reflections - Cleaned noise */}
//                     <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-900/20 rounded-full blur-[100px]" />
//                     <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-900/10 rounded-full blur-[100px]" />
//                 </div>
//             );
//         case 'Default':
//         default:
//             return (
//                 <div className="absolute inset-0 bg-[#0f172a]">
//                     {/* Original default background */}
//                     <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
//                     <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
//                 </div>
//             );
//     }
// };

// export const AppLayout = ({ children }: { children?: React.ReactNode }) => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen flex flex-col font-sans relative selection:bg-blue-500/30 transition-colors duration-700 overflow-x-hidden text-slate-200">
      
//       {/* Animated Complex Background */}
//       <div className="fixed inset-0 z-0 pointer-events-none transition-all duration-700 ease-out">
//           <ThemeBackground theme={user?.dashboardTheme || 'Default'} />
//       </div>

//       {/* App Navbar */}
//       <nav className="h-16 border-b border-white/10 bg-black/10 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50 transition-all">
//         <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/dashboard')}>
//           <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-1.5 rounded-lg shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300">
//             <Code2 className="w-5 h-5 text-white" />
//           </div>
//           <span className="font-bold text-lg tracking-tight text-white group-hover:text-blue-200 transition-colors drop-shadow-md">CodeCollab</span>
//         </div>
        
//         <div className="flex items-center gap-5">
//           <div className="flex items-center gap-3 pl-5 border-l border-white/10">
//             <div className="text-right hidden sm:block">
//               <div className="text-sm font-bold text-white leading-none mb-1 drop-shadow-sm">{user?.name}</div>
//               <div className="text-[10px] text-blue-300 uppercase tracking-widest font-bold">{user?.tier} Plan</div>
//             </div>
//             <button 
//               onClick={() => navigate('/settings')}
//               className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-blue-500 to-purple-500 overflow-hidden hover:scale-105 transition shadow-lg"
//               title="Go to Settings"
//             >
//               <div className="w-full h-full rounded-full bg-slate-900 p-[2px]">
//                  <img src={user?.avatar} alt="User" className="w-full h-full object-cover rounded-full" />
//               </div>
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="flex-grow flex flex-col relative z-10">
//         {children}
//       </main>
//     </div>
//   );
// };
