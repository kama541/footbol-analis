import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import LiveTagging from './pages/LiveTagging';
import Matches from './pages/Matches';
import Playlists from './pages/Playlists';
import PlaylistDetail from './pages/PlaylistDetail';
import Calendar from './pages/Calendar';
import Users from './pages/Users';
import Devices from './pages/Devices';
import Training from './pages/Training';
import AiInsights from './components/AiInsights';
import { MatchProvider } from './context/MatchContext';

function App() {
  const [isAiOpen, setIsAiOpen] = useState(false);

  return (
    <MatchProvider>
      <Router>
        <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 relative">
          <Sidebar />
          <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            <TopHeader onOpenAi={() => setIsAiOpen(true)} />
            <main className="flex-1 overflow-y-auto overflow-x-hidden">
              <Routes>
                <Route path="/" element={<Navigate to="/live" replace />} />
                <Route path="/live" element={<LiveTagging />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/playlists" element={<Playlists />} />
                <Route path="/playlists/:id" element={<PlaylistDetail />} />
                <Route path="/training" element={<Training />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/users" element={<Users />} />
                <Route path="/devices" element={<Devices />} />
              </Routes>
            </main>
          </div>
          <AiInsights isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
        </div>
      </Router>
    </MatchProvider>
  );
}

export default App;
