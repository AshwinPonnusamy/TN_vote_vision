import { Tv, Share2, Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="text-center py-8 border-t border-gray-500/10">
      <div className="text-[11px] theme-text-muted max-w-2xl mx-auto mb-6">
        Disclaimer: Results based on official EC counting trends. Final declaration subject to Election Commission of India.
        Live simulation data for Tamil Nadu 2026 Assembly Elections.
      </div>
      <div className="flex justify-center gap-6 theme-text-secondary mb-4">
        <a href="#" className="hover:text-red-500 transition-colors"><Tv className="w-5 h-5" /></a>
        <a href="#" className="hover:text-red-500 transition-colors"><Share2 className="w-5 h-5" /></a>
        <a href="#" className="hover:text-red-500 transition-colors"><Activity className="w-5 h-5" /></a>
      </div>
      <p className="text-xs theme-text-muted opacity-60">© 2026 LIVE ELECTION COUNT DASHBOARD | POWERED BY REAL-TIME PULSE</p>
    </footer>
  );
}
