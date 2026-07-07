import PropTypes from 'prop-types';
import { CheckCircle, Flag, Activity, TrendingUp, Gavel, Users } from 'lucide-react';
import { STATE_METADATA } from '../constants/data';

export default function StatsGrid({ liveSeats, leadingCount, wonCount, isTamil, selectedState }) {
  const safeLiveSeats = liveSeats || {};
  const totalCounted = Object.values(safeLiveSeats).reduce((a, b) => a + b, 0);
  const meta = STATE_METADATA[selectedState] || STATE_METADATA['S22'];

  const stats = [
    { label: isTamil ? 'மொத்த இடங்கள்' : 'Total Seats', val: meta.seats, icon: <CheckCircle className="text-red-400" /> },
    { label: isTamil ? 'பெரும்பான்மை' : 'Majority Mark', val: meta.majority, icon: <Flag className="text-yellow-400" /> },
    { label: isTamil ? 'எண்ணப்பட்டவை' : 'Counted Seats', val: totalCounted, icon: <Activity className="text-green-400" /> },
    { label: isTamil ? 'முன்னிலை' : 'Leading', val: leadingCount || 0, icon: <TrendingUp className="text-blue-400" /> },
    { label: isTamil ? 'வெற்றி' : 'Won', val: wonCount || 0, icon: <Gavel className="text-purple-400" /> },
    { label: isTamil ? 'வாக்குப்பதிவு %' : 'Turnout %', val: '72.5%', icon: <Users className="text-teal-400" /> },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
      {stats.map((stat, i) => (
        <div key={i} className="glass-card p-4 rounded-xl text-center transition-all group hover:bg-white/5 shadow-sm">
          <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform">{stat.icon}</div>
          <div className="text-2xl font-bold theme-text-primary">{stat.val}</div>
          <div className="text-xs font-medium uppercase tracking-wider theme-text-muted">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

StatsGrid.propTypes = {
  liveSeats: PropTypes.object.isRequired,
  leadingCount: PropTypes.number.isRequired,
  wonCount: PropTypes.number.isRequired,
  isTamil: PropTypes.bool.isRequired,
  selectedState: PropTypes.string.isRequired,
};
