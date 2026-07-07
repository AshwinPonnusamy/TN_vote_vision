import PropTypes from 'prop-types';
import { Circle, TrendingUp, BarChart3, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { STATE_METADATA } from '../constants/data';

export default function HeroSection({ isTamil, selectedState }) {
  const meta = STATE_METADATA[selectedState] || STATE_METADATA['S22'];

  return (
    <section className="relative rounded-3xl overflow-hidden mb-8 border border-gray-200 dark:border-white/10 shadow-2xl transition-all duration-500 bg-gradient-to-r from-red-100 via-blue-50 to-white dark:from-red-950/70 dark:via-blue-950/30 dark:to-black/70" data-aos="fade-up">
      <div className="p-6 md:p-10 text-center relative z-10">
        <div className="flex justify-center items-center gap-3 mb-4">
          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-2">
            <Circle className="w-2 h-2 fill-white animate-pulse" /> LIVE COUNTING
          </span>
          <span className="text-xs px-3 py-1 rounded-full border theme-btn">Counting Day · {meta.seats} Seats</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight bg-clip-text text-transparent transition-all duration-500 bg-gradient-to-r from-red-600 via-gray-900 to-blue-600 dark:from-red-500 dark:via-white dark:to-blue-500">
          {selectedState} 2026 LIVE ELECTION RESULTS
        </h2>
        <p className="text-lg mt-4 max-w-2xl mx-auto theme-text-secondary">
          {isTamil 
            ? `${meta.name} சட்டமன்றத் தேர்தல் 2026 - நேரடி முடிவுகள்` 
            : `Real-Time Constituency Counting Updates · ${meta.name} Assembly`
          }
        </p>
        <div className="flex gap-4 justify-center mt-8 flex-wrap">
          <Link to="/live-results" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all hover:scale-105 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> View Live Results
          </Link>
          <Link to="/party-trends" className="bg-blue-700/70 hover:bg-blue-800 text-white backdrop-blur px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all hover:scale-105">
            <BarChart3 className="w-5 h-5" /> See Party Trends
          </Link>
          <Link to="/previous-results" className="bg-amber-700/70 hover:bg-amber-800 text-white backdrop-blur px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all hover:scale-105">
            <History className="w-5 h-5" /> Previous Results
          </Link>
        </div>
      </div>
      <div className="absolute inset-0 bg-no-repeat bg-center bg-contain mix-blend-overlay transition-opacity duration-500 opacity-5 dark:opacity-10"></div>
    </section>
  );
}

HeroSection.propTypes = {
  isTamil: PropTypes.bool.isRequired,
  selectedState: PropTypes.string.isRequired,
};
