import { CheckCircle, Flag, Activity, TrendingUp, Gavel, Users } from 'lucide-react';

export default function StatsGrid({ liveSeats, isTamil }) {
  const totalCounted = Object.values(liveSeats).reduce((a, b) => a + b, 0);

  const stats = [
    { label: isTamil ? 'மொத்த இடங்கள்' : 'Total Seats', val: 234, icon: <CheckCircle className="text-red-400" /> },
    { label: isTamil ? 'பெரும்பான்மை' : 'Majority Mark', val: 118, icon: <Flag className="text-yellow-400" /> },
    { label: isTamil ? 'எண்ணப்பட்டவை' : 'Counted Seats', val: totalCounted, icon: <Activity className="text-green-400" /> },
    { label: isTamil ? 'முன்னிலை' : 'Leading Seats', val: totalCounted, icon: <TrendingUp className="text-blue-400" /> },
    { label: isTamil ? 'அறிவிக்கப்பட்டவை' : 'Declared Seats', val: Math.floor(Math.random() * 30) + 50, icon: <Gavel className="text-purple-400" /> },
    { label: isTamil ? 'வாக்குப்பதிவு %' : 'Turnout %', val: (84.2 + Math.random()).toFixed(1) + '%', icon: <Users className="text-teal-400" /> },
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
