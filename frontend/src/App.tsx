import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Chat from './pages/Chat.tsx';
import Portfolio from './pages/Portfolio.tsx';
import Strategies from './pages/Strategies.tsx';
import Analytics from './pages/Analytics.tsx';
import RiskManager from './pages/RiskManager.tsx';
import YieldFarming from './pages/YieldFarming.tsx';
import FlashLoans from './pages/FlashLoans.tsx';
import DeFiLab from './pages/DeFiLab.tsx';
import { APIProvider } from './contexts/APIContext.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000, // 30 seconds
    },
  },
});

function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <APIProvider>
        <Router>
          <div className="min-h-screen bg-slate-900 text-white">
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/strategies" element={<Strategies />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/risk-manager" element={<RiskManager />} />
                <Route path="/yield-farming" element={<YieldFarming />} />
                <Route path="/flash-loans" element={<FlashLoans />} />
                <Route path="/defi-lab" element={<DeFiLab />} />
              </Routes>
            </main>
            
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: darkMode ? '#1f2937' : '#ffffff',
                  color: darkMode ? '#f9fafb' : '#111827',
                  border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                },
              }}
            />
          </div>
        </Router>
      </APIProvider>
    </QueryClientProvider>
  );
}

export default App;
