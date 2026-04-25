import { Tv, Languages, Expand, Share2, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header({ isTamil, setIsTamil }) {
  const handleShare = async () => {
    const shareData = {
      title: 'Tamil Nadu Election Results 2026',
      text: 'Check out the live election results for Tamil Nadu 2026!',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-card rounded-2xl px-5 py-3 mb-6 backdrop-blur-lg border-b-2 border-red-500/30 shadow-xl shadow-black/5">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="live-badge-pulse" />
            <Tv className="text-red-500 w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-gray-900 to-red-600 dark:from-white dark:to-red-400 bg-clip-text text-transparent transition-all duration-500">
              LIVE ELECTION RESULTS <span className="text-sm font-mono bg-red-900/60 text-white px-2 py-0.5 rounded ml-2">TN 2026</span>
            </h1>
            <p className="text-[11px] theme-text-muted hidden md:block">Real-Time Constituency Counting Updates</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setIsTamil(!isTamil)} className="theme-btn px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
            <Languages className="w-4 h-4" /> {isTamil ? 'EN' : 'த'}
          </button>
          <button onClick={() => document.documentElement.requestFullscreen()} className="theme-btn px-3 py-1.5 rounded-full text-sm">
            <Expand className="w-4 h-4" />
          </button>
          <button onClick={handleShare} className="bg-red-700 hover:bg-red-800 text-white px-4 py-1.5 rounded-full text-sm flex items-center gap-2 transition-transform active:scale-95">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <Link to="/admin" className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-1.5 rounded-full text-sm flex items-center gap-2 transition-all">
            <Shield className="w-4 h-4" /> Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
