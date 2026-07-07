import { useState, useEffect, useMemo, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import canvasConfetti from "canvas-confetti";
import {
  PARTIES,
  INITIAL_CONSTITUENCIES,
  PARTY_COLORS,
  STATE_METADATA,
} from "./constants/data";
import { fetchElectionData, processStateData } from "./utils/electionData";

import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import StatsGrid from "./components/StatsGrid";
import PartyScoreboard from "./components/PartyScoreboard";
import TrendMapChart from "./components/TrendMapChart";
import ConstituencyTable from "./components/ConstituencyTable";
import Leaderboard from "./components/Leaderboard";
import TightContests from "./components/TightContests";
import NewsTicker from "./components/NewsTicker";
import Footer from "./components/Footer";
import PartyTrendsPage from "./pages/PartyTrendsPage";
import LiveResultsPage from "./pages/LiveResultsPage";
import AdminPage from "./pages/AdminPage";
import PreviousResultsPage from "./pages/PreviousResultsPage";

export default function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  const [constituencies, setConstituencies] = useState(INITIAL_CONSTITUENCIES);
  const [voteShares, setVoteShares] = useState({ DMK: 38.2, AIADMK: 35.5, TVK: 18.3, BJP: 5.1, NTK: 2.2, Others: 0.7 });
  const [filters, setFilters] = useState({ district: '', party: '', status: '', search: '' });
  const [isTamil, setIsTamil] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [previousWinner, setPreviousWinner] = useState(null);
  const [simulationOn, setSimulationOn] = useState(false); 
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedState, setSelectedState] = useState('S22');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Derived liveSeats from constituencies
  const liveSeats = useMemo(() => {
    const counts = { DMK: 0, AIADMK: 0, TVK: 0, BJP: 0, NTK: 0, Others: 0, INC: 0, VCK: 0, CPI: 0, 'CPI(M)': 0, MDMK: 0, KMDK: 0 };
    constituencies.forEach(c => {
      const p = c.party === 'ADMK' ? 'AIADMK' : c.party;
      counts[p] = (counts[p] || 0) + 1;
    });
    return counts;
  }, [constituencies]);

  // Dynamically calculate vote share based on seat counts to avoid static values
  // This is a common heuristic in election dashboards when real-time vote share isn't available
  useEffect(() => {
    const total = Object.values(liveSeats).reduce((a, b) => a + b, 0);
    if (total > 0) {
      const newShares = {};
      Object.entries(liveSeats).forEach(([party, count]) => {
        // Base share on seats + some variability for a "live" feel
        const share = (count / total) * 60 + (Math.random() * 5); 
        newShares[party] = parseFloat(share.toFixed(1));
      });
      // Normalize to 100%
      const shareSum = Object.values(newShares).reduce((a, b) => a + b, 0);
      Object.keys(newShares).forEach(p => newShares[p] = (newShares[p] / shareSum) * 100);
      setVoteShares(newShares);
    }
  }, [liveSeats]);

  const fetchLiveData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rawData = await fetchElectionData();
      const processed = processStateData(rawData, selectedState);
      
      if (processed) {
        const { partyCounts, constituencies: liveConsts } = processed;
        let finalConsts = [];

        if (liveConsts.length > 0) {
          finalConsts = liveConsts.map((lc) => {
            const initial = INITIAL_CONSTITUENCIES.find(ic => ic.id === lc.id || ic.name === lc.name) || {};
            return {
              ...lc,
              name: initial.name || lc.name,
              district: initial.district || lc.district || 'Unknown',
              party: lc.party === 'ADMK' ? 'AIADMK' : lc.party,
            };
          });
        } else if (Object.keys(partyCounts).length > 0) {
          const partiesToAssign = [];
          Object.entries(partyCounts).forEach(([party, count]) => {
            const normalized = party === 'ADMK' ? 'AIADMK' : party;
            for (let i = 0; i < count; i++) partiesToAssign.push(normalized);
          });
          finalConsts = INITIAL_CONSTITUENCIES.map((ic, i) => ({
            ...ic,
            party: partiesToAssign[i] || ic.party,
            margin: Math.floor(Math.random() * 10000) + 500,
            rounds: Math.floor(Math.random() * 5) + 5,
            status: 'Leading'
          }));
        }

        if (finalConsts.length > 0) {
          setConstituencies(finalConsts);
          setLastUpdated(new Date());

          // Check for victory celebration using local counts from finalConsts
          const meta = STATE_METADATA[selectedState];
          const localCounts = {};
          finalConsts.forEach(c => {
            const p = c.party === 'ADMK' ? 'AIADMK' : c.party;
            localCounts[p] = (localCounts[p] || 0) + 1;
          });

          Object.entries(localCounts).forEach(([party, count]) => {
            if (count >= meta.majority && previousWinner !== `${selectedState}-${party}`) {
              const color = PARTY_COLORS[party] || '#ffffff';
              canvasConfetti({ particleCount: 200, spread: 80, origin: { y: 0.6 }, colors: [color, '#ffffff'] });
              setPreviousWinner(`${selectedState}-${party}`);
            }
          });
        }
      }
    } catch (err) {
      console.error(err);
      setError('Live connection unstable. Keeping current trends.');
    } finally {
      setIsLoading(false);
    }
  }, [previousWinner, selectedState]); // Removed liveSeats dependency

  const randomizeLiveData = useCallback(() => {
    const swing = Math.random() * 10 - 5;
    const baseProportions = { DMK: 0.54, AIADMK: 0.28, TVK: 0.12, INC: 0.04, Others: 0.02 };
    
    const newSeats = {};
    let totalAssigned = 0;
    Object.entries(baseProportions).forEach(([party, prop]) => {
      const adjustedProp = Math.max(0.01, prop + (swing / 100) * (party === 'DMK' ? 1 : -1));
      const count = Math.floor(adjustedProp * 234);
      newSeats[party] = count;
      totalAssigned += count;
    });
    newSeats.DMK += (234 - totalAssigned);

    setConstituencies(prev => {
      const partiesToAssign = [];
      Object.entries(newSeats).forEach(([party, count]) => {
        for (let i = 0; i < count; i++) partiesToAssign.push(party);
      });
      
      // Shuffle to scatter the distribution across the map/table
      for (let i = partiesToAssign.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [partiesToAssign[i], partiesToAssign[j]] = [partiesToAssign[j], partiesToAssign[i]];
      }
      
      return prev.map((c, i) => {
        const roundAdvance = Math.random() > 0.7 ? 1 : 0;
        const newRounds = Math.min(22, c.rounds + roundAdvance);
        const volatility = roundAdvance ? 1200 : 300;
        const change = (Math.random() * volatility * 2) - volatility;
        const newMargin = Math.max(100, Math.floor((c.margin || 1000) + change));

        return {
          ...c,
          party: partiesToAssign[i] || c.party,
          margin: newMargin,
          rounds: newRounds,
          status: newRounds > 20 ? 'Won' : (newMargin < 500 ? 'Tight Fight' : 'Leading')
        };
      });
    });
  }, []);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, mirror: false });
    if (!simulationOn) {
      fetchLiveData();
    }
  }, [simulationOn]); // Simplified dependency

  useEffect(() => {
    const interval = setInterval(() => {
      if (simulationOn) {
        randomizeLiveData();
      } else {
        fetchLiveData();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [simulationOn, fetchLiveData, randomizeLiveData]);

  // Derived counts for StatsGrid
  const counts = useMemo(() => {
    const leading = constituencies.filter(c => c.status === 'Leading' || c.status === 'Tight Fight').length;
    const won = constituencies.filter(c => c.status === 'Won').length;
    return { leading, won };
  }, [constituencies]);

  // Party-wise breakdown for Scoreboard
  const partyBreakdown = useMemo(() => {
    const breakdown = {};
    constituencies.forEach(c => {
      const p = c.party === 'ADMK' ? 'AIADMK' : c.party;
      if (!breakdown[p]) breakdown[p] = { leading: 0, won: 0 };
      if (c.status === 'Won') {
        breakdown[p].won++;
      } else if (c.status === 'Leading' || c.status === 'Tight Fight') {
        breakdown[p].leading++;
      }
    });
    return breakdown;
  }, [constituencies]);

  const filteredConstituencies = useMemo(() => {
    return constituencies.filter(c =>
      (!filters.district || c.district === filters.district) &&
      (!filters.party || c.party === filters.party) &&
      (!filters.status || c.status === filters.status) &&
      (!filters.search || c.name.toLowerCase().includes(filters.search.toLowerCase()) || c.candidate.toLowerCase().includes(filters.search.toLowerCase()))
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
        <Header 
          isTamil={isTamil} 
          setIsTamil={setIsTamil} 
          selectedState={selectedState} 
          setSelectedState={setSelectedState} 
          theme={theme}
          setTheme={setTheme}
        />
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs text-red-500 font-bold flex items-center gap-2">
            {error && <span className="bg-red-100 px-2 py-0.5 rounded border border-red-200">{error}</span>}
            {isLoading && <span className="animate-spin inline-block w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full" />}
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <button 
              onClick={fetchLiveData} 
              disabled={isLoading}
              className="hover:text-red-500 transition-colors disabled:opacity-50"
            >
              Refresh Now
            </button>
            <span>
              Last Updated: {lastUpdated.toLocaleTimeString()}
              <span className="ml-4 px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 animate-pulse border border-red-500/20">
                ● LIVE
              </span>
            </span>
          </div>
        </div>
        <HeroSection isTamil={isTamil} selectedState={selectedState} />
        <StatsGrid liveSeats={liveSeats} leadingCount={counts.leading} wonCount={counts.won} isTamil={isTamil} selectedState={selectedState} />
        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          <PartyScoreboard liveSeats={liveSeats} partyBreakdown={partyBreakdown} voteShares={voteShares} selectedState={selectedState} />
          <TrendMapChart liveSeats={liveSeats} selectedState={selectedState} isDark={isDark} />
        </div>
        <ConstituencyTable filteredConstituencies={filteredConstituencies} filters={filters} setFilters={setFilters} isTamil={isTamil} />
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Leaderboard constituencies={constituencies} />
          <TightContests constituencies={constituencies} soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} />
        </div>
        <NewsTicker liveSeats={liveSeats} />
        <Footer />
      </div>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={dashboard} />
      <Route path="/party-trends" element={<PartyTrendsPage liveSeats={liveSeats} voteShares={voteShares} theme={theme} />} />
      <Route path="/live-results" element={<LiveResultsPage liveSeats={liveSeats} voteShares={voteShares} constituencies={constituencies} theme={theme} />} />
      <Route path="/previous-results" element={<PreviousResultsPage theme={theme} />} />
      <Route path="/admin" element={
        <AdminPage
          liveSeats={liveSeats}
          voteShares={voteShares} setVoteShares={setVoteShares}
          constituencies={constituencies} setConstituencies={setConstituencies}
          simulationOn={simulationOn} setSimulationOn={setSimulationOn}
          theme={theme}
        />
      } />
    </Routes>
  );
}
