import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/ui/Navbar';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Dashboard routes - will be protected later */}
        <Route path="/dashboard" element={<DashboardPage />} />
        
        <Route path="/dashboard/settings" element={
          <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
            <h1 className="text-4xl">Settings Page</h1>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;