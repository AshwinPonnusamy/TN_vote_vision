import { useState, useEffect, useMemo, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import canvasConfetti from 'canvas-confetti';
import { cn } from './utils/cn';
import { PARTIES, INITIAL_CONSTITUENCIES } from './constants/data';

import Header from './components/Header';
import HeroSection from './components/HeroSection';
import StatsGrid from './components/StatsGrid';
import PartyScoreboard from './components/PartyScoreboard';
import TrendMapChart from './components/TrendMapChart';
import ConstituencyTable from './components/ConstituencyTable';
import Leaderboard from './components/Leaderboard';
import TightContests from './components/TightContests';
import NewsTicker from './components/NewsTicker';
import Footer from './components/Footer';
import PartyTrendsPage from './pages/PartyTrendsPage';
import LiveResultsPage from './pages/LiveResultsPage';
import AdminPage from './pages/AdminPage';
import PreviousResultsPage from './pages/PreviousResultsPage';

export default function App() {
  const [liveSeats, setLiveSeats] = useState({ DMK: 0, AIADMK: 0, TVK: 0, BJP: 0, NTK: 0, Others: 0 });
  const [voteShares, setVoteShares] = useState({ DMK: 38.2, AIADMK: 35.5, TVK: 18.3, BJP: 5.1, NTK: 2.2, Others: 0.7 });
  const [constituencies, setConstituencies] = useState(INITIAL_CONSTITUENCIES);
  const [filters, setFilters] = useState({ district: '', party: '', status: '', search: '' });
  const [isTamil, setIsTamil] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [previousWinner, setPreviousWinner] = useState(null);
  const [simulationOn, setSimulationOn] = useState(true);

  const randomizeLiveData = useCallback(() => {
    setLiveSeats(() => {
      let newSeats = {};
      PARTIES.forEach(p => {
        newSeats[p] = Math.floor(Math.random() * 45) + (p === 'DMK' ? 25 : (p === 'AIADMK' ? 20 : 5));
      });
      let total = Object.values(newSeats).reduce((a, b) => a + b, 0);
      if (total !== 234) newSeats['Others'] += (234 - total);

      if (newSeats.DMK >= 118 && previousWinner !== 'DMK') {
        canvasConfetti({ particleCount: 200, spread: 80, origin: { y: 0.6 }, colors: ['#ef4444', '#ffffff'] });
        setPreviousWinner('DMK');
      } else if (newSeats.AIADMK >= 118 && previousWinner !== 'AIADMK') {
        canvasConfetti({ particleCount: 200, spread: 80, origin: { y: 0.6 }, colors: ['#3b82f6', '#ffffff'] });
        setPreviousWinner('AIADMK');
      }
      return newSeats;
    });

    setVoteShares({
      DMK: 34 + Math.random() * 8, AIADMK: 32 + Math.random() * 8,
      TVK: 14 + Math.random() * 8, BJP: 4 + Math.random() * 4,
      NTK: 2 + Math.random() * 3, Others: 1,
    });

    setConstituencies(prev => prev.map(c => {
      const newRounds = Math.min(18, c.rounds + (Math.random() > 0.5 ? 1 : 0));
      const randStat = Math.random();
      let newStatus = randStat > 0.7 ? 'Tight Fight' : (randStat > 0.3 ? 'Leading' : 'Won');
      if (newRounds > 17) newStatus = 'Won';
      return { ...c, margin: Math.floor(Math.random() * 12000) + 100, rounds: newRounds, status: newStatus };
    }));
  }, [previousWinner]);

  useEffect(() => {
    // அனிமேஷன்கள் ஒருமுறை மட்டும் வருமாறு (once: true)
    AOS.init({ duration: 800, once: true, mirror: false });
  }, []);

  useEffect(() => {
    if (!simulationOn) return;
    const interval = setInterval(randomizeLiveData, 3000);
    return () => clearInterval(interval);
  }, [simulationOn, randomizeLiveData]);

  const filteredConstituencies = useMemo(() => {
    return constituencies.filter(c =>
      (!filters.district || c.district === filters.district) &&
      (!filters.party || c.party === filters.party) &&
      (!filters.status || c.status === filters.status) &&
      (!filters.search || c.name.toLowerCase().includes(filters.search.toLowerCase()))
    );
  }, [constituencies, filters]);

  const dashboard = (
    <div className="min-h-screen">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10 dark:opacity-20 transition-opacity duration-500">
        <svg width="100%" height="100%" viewBox="0 0 800 900" fill="none">
          <path d="M200,200 L600,150 L700,400 L500,600 L250,550 L150,350 Z" fill="#ef4444" fillOpacity="0.15" stroke="#ef4444" strokeWidth="2" />
          <circle cx="400" cy="400" r="280" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.3" />
        </svg>
      </div>
      <div className="relative z-10 max-w-[1600px] mx-auto px-3 md:px-6 py-4">
        <Header isTamil={isTamil} setIsTamil={setIsTamil} />
        <HeroSection isTamil={isTamil} />
        <StatsGrid liveSeats={liveSeats} isTamil={isTamil} />
        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          <PartyScoreboard liveSeats={liveSeats} voteShares={voteShares} />
          <TrendMapChart liveSeats={liveSeats} />
        </div>
        <ConstituencyTable filteredConstituencies={filteredConstituencies} filters={filters} setFilters={setFilters} isTamil={isTamil} />
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Leaderboard constituencies={constituencies} />
          <TightContests constituencies={constituencies} soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} />
        </div>
        <NewsTicker />
        <Footer />
      </div>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={dashboard} />
      <Route path="/party-trends" element={<PartyTrendsPage liveSeats={liveSeats} voteShares={voteShares} />} />
      <Route path="/live-results" element={<LiveResultsPage liveSeats={liveSeats} voteShares={voteShares} constituencies={constituencies} />} />
      <Route path="/previous-results" element={<PreviousResultsPage />} />
      <Route path="/admin" element={
        <AdminPage
          liveSeats={liveSeats} setLiveSeats={setLiveSeats}
          voteShares={voteShares} setVoteShares={setVoteShares}
          constituencies={constituencies} setConstituencies={setConstituencies}
          simulationOn={simulationOn} setSimulationOn={setSimulationOn}
        />
      } />
    </Routes>
  );
}
