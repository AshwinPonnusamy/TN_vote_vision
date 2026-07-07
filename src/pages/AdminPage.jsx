import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Plus, Trash2, Edit3, Save, X, Play, Pause, Download, Upload, Lock, Unlock, Users, BarChart3, MapPin, CheckCircle } from 'lucide-react';
import { cn } from '../utils/cn';
import { PARTIES, PARTY_COLORS } from '../constants/data';

const DISTRICTS = ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Trichy', 'Tirunelveli', 'Vellore', 'Erode', 'Thanjavur', 'Kanyakumari'];
const STATUSES = ['Leading', 'Won', 'Tight Fight'];
const ADMIN_PIN = '2026';

const emptyForm = { name: '', candidate: '', party: 'DMK', margin: 0, rounds: 0, status: 'Leading', district: 'Chennai' };

export default function AdminPage({ liveSeats, setLiveSeats, voteShares, setVoteShares, constituencies, setConstituencies, simulationOn, setSimulationOn, theme }) {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [tab, setTab] = useState('constituencies');
  const [form, setForm] = useState({ ...emptyForm });
  const [editIdx, setEditIdx] = useState(-1);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState('');

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) { setAuthed(true); setPinError(false); }
    else setPinError(true);
  };

  const saveConstituency = () => {
    if (!form.name || !form.candidate) return flash('Name & Candidate required');
    if (editIdx >= 0) {
      setConstituencies(prev => prev.map((c, i) => i === editIdx ? { ...form, margin: Number(form.margin), rounds: Number(form.rounds) } : c));
      flash('Constituency updated');
    } else {
      setConstituencies(prev => [...prev, { ...form, margin: Number(form.margin), rounds: Number(form.rounds) }]);
      flash('Constituency added');
    }
    setForm({ ...emptyForm }); setEditIdx(-1); setShowForm(false);
  };

  const editRow = (i) => { setForm({ ...constituencies[i] }); setEditIdx(i); setShowForm(true); };
  const deleteRow = (i) => { setConstituencies(prev => prev.filter((_, j) => j !== i)); flash('Deleted'); };

  const exportData = () => {
    const data = JSON.stringify({ constituencies, liveSeats, voteShares }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'election_data.json'; a.click();
    flash('Data exported');
  };

  const importData = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        if (d.constituencies) setConstituencies(d.constituencies);
        if (d.liveSeats) setLiveSeats(d.liveSeats);
        if (d.voteShares) setVoteShares(d.voteShares);
        flash('Data imported');
      } catch { flash('Invalid JSON file'); }
    };
    reader.readAsText(file);
  };

  // Login screen
  if (!authed) return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] flex items-center justify-center transition-colors duration-500">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-3xl" />
      </div>
      <div className="glass-card rounded-3xl p-10 w-full max-w-md relative z-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-6"><Shield className="w-8 h-8 text-red-400" /></div>
        <h1 className="text-2xl font-black mb-2">Admin Access</h1>
        <p className="text-gray-500 text-sm mb-8">Enter PIN to access the data entry panel</p>
        <form onSubmit={handleLogin}>
          <input type="password" value={pin} onChange={e => { setPin(e.target.value); setPinError(false); }} placeholder="Enter PIN"
            className={cn("w-full bg-gray-100 dark:bg-gray-800/60 border text-center text-2xl tracking-[0.5em] rounded-xl px-6 py-4 outline-none focus:ring-2 ring-red-500 mb-4 transition-all", pinError ? "border-red-500 shake" : "border-black/10 dark:border-white/10")} autoFocus />
          {pinError && <p className="text-red-400 text-xs mb-4">Incorrect PIN. Try again.</p>}
          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-bold transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
            <Unlock className="w-4 h-4" /> Access Panel
          </button>
        </form>
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm mt-6 transition-colors"><ArrowLeft className="w-4 h-4" /> Back to Dashboard</Link>
        <p className="text-[10px] text-gray-600 mt-4">Default PIN: 2026</p>
      </div>
    </div>
  );

  const tabs = [
    { id: 'constituencies', label: 'Constituencies', icon: <MapPin className="w-4 h-4" /> },
    { id: 'seats', label: 'Party Seats', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'voteshare', label: 'Vote Share', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] transition-colors duration-500">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-red-600/5 rounded-full blur-3xl" />
      </div>

      {/* Toast */}
      {toast && <div className="fixed top-6 right-6 z-50 bg-green-600/90 backdrop-blur text-white px-6 py-3 rounded-xl text-sm font-bold shadow-2xl flex items-center gap-2 animate-bounce"><CheckCircle className="w-4 h-4" />{toast}</div>}

      <div className="relative z-10 max-w-[1400px] mx-auto px-3 md:px-6 py-4">
        {/* Top Nav */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"><ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> <span className="text-sm font-medium">Dashboard</span></Link>
          <div className="flex items-center gap-3">
            <button onClick={() => setSimulationOn(!simulationOn)}
              className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border", simulationOn ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400" : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400")}>
              {simulationOn ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              Simulation {simulationOn ? 'ON' : 'OFF'}
            </button>
            <button onClick={exportData} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 border border-black/10 dark:border-white/10 transition-all"><Download className="w-3.5 h-3.5" /> Export</button>
            <label className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 border border-black/10 dark:border-white/10 transition-all cursor-pointer"><Upload className="w-3.5 h-3.5" /> Import<input type="file" accept=".json" onChange={importData} className="hidden" /></label>
            <button onClick={() => setAuthed(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-red-400 transition-colors"><Lock className="w-3.5 h-3.5" /></button>
          </div>
        </div>

        {/* Header */}
        <div className="glass-card rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-red-600/5 to-orange-600/5" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center"><Shield className="w-5 h-5 text-purple-400" /></div>
            <div><h1 className="text-3xl md:text-4xl font-black tracking-tight">Admin Panel</h1><p className="text-gray-400 text-sm mt-1">Manage election data · Add/Edit/Delete constituencies · Control simulation</p></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn("flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all border", tab === t.id ? "bg-black/10 dark:bg-white/10 border-black/20 dark:border-white/20 text-[var(--text-primary)]" : "bg-black/[0.01] dark:bg-white/[0.02] border-black/5 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5")}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* CONSTITUENCIES TAB */}
        {tab === 'constituencies' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">{constituencies.length} Constituencies</h3>
              <button onClick={() => { setForm({ ...emptyForm }); setEditIdx(-1); setShowForm(true); }}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"><Plus className="w-4 h-4" /> Add New</button>
            </div>

            {/* Form Modal */}
            {showForm && (
              <div className="glass-card rounded-2xl p-6 border border-purple-500/10 dark:border-purple-500/20">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-bold text-lg">{editIdx >= 0 ? 'Edit' : 'Add'} Constituency</h4>
                  <button onClick={() => { setShowForm(false); setEditIdx(-1); }} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div><label className="text-xs text-gray-500 uppercase mb-1 block">Name *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-gray-100 dark:bg-gray-800/60 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 ring-red-500" placeholder="e.g. Chennai Central" /></div>
                  <div><label className="text-xs text-gray-500 uppercase mb-1 block">Candidate *</label><input value={form.candidate} onChange={e => setForm({ ...form, candidate: e.target.value })} className="w-full bg-gray-100 dark:bg-gray-800/60 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 ring-red-500" placeholder="e.g. John Doe" /></div>
                  <div><label className="text-xs text-gray-500 uppercase mb-1 block">Party</label><select value={form.party} onChange={e => setForm({ ...form, party: e.target.value })} className="w-full bg-gray-100 dark:bg-gray-800/60 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 ring-red-500">{PARTIES.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                  <div><label className="text-xs text-gray-500 uppercase mb-1 block">District</label><select value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} className="w-full bg-gray-100 dark:bg-gray-800/60 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 ring-red-500">{DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                  <div><label className="text-xs text-gray-500 uppercase mb-1 block">Margin</label><input type="number" value={form.margin} onChange={e => setForm({ ...form, margin: e.target.value })} className="w-full bg-gray-100 dark:bg-gray-800/60 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 ring-red-500" /></div>
                  <div><label className="text-xs text-gray-500 uppercase mb-1 block">Rounds (0-18)</label><input type="number" min="0" max="18" value={form.rounds} onChange={e => setForm({ ...form, rounds: e.target.value })} className="w-full bg-gray-100 dark:bg-gray-800/60 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 ring-red-500" /></div>
                  <div><label className="text-xs text-gray-500 uppercase mb-1 block">Status</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full bg-gray-100 dark:bg-gray-800/60 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 ring-red-500">{STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                  <div className="flex items-end"><button onClick={saveConstituency} className="w-full bg-green-600 hover:bg-green-700 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"><Save className="w-4 h-4" /> {editIdx >= 0 ? 'Update' : 'Add'}</button></div>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-black/5 dark:bg-white/5 text-gray-500 dark:text-gray-400 uppercase text-[10px] tracking-wider">
                    <tr><th className="p-4 text-left">Name</th><th className="p-4 text-left">Candidate</th><th className="p-4">Party</th><th className="p-4">District</th><th className="p-4 text-right">Margin</th><th className="p-4 text-center">Rounds</th><th className="p-4">Status</th><th className="p-4 text-center">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                    {constituencies.map((c, i) => (
                      <tr key={i} className="table-row-transition">
                        <td className="p-4 font-semibold">{c.name}</td>
                        <td className="p-4 text-[var(--text-secondary)]">{c.candidate}</td>
                        <td className="p-4"><span className="flex items-center gap-2 justify-center" style={{ color: PARTY_COLORS[c.party] }}><span className="w-2 h-2 rounded-full" style={{ backgroundColor: PARTY_COLORS[c.party] }} />{c.party}</span></td>
                        <td className="p-4 text-center text-gray-500 dark:text-gray-400">{c.district}</td>
                        <td className="p-4 text-right font-mono text-green-600 dark:text-green-400">+{Number(c.margin).toLocaleString()}</td>
                        <td className="p-4 text-center text-gray-500 dark:text-gray-400">{c.rounds}/18</td>
                        <td className="p-4"><span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase", c.status === 'Won' ? 'bg-blue-500/10 text-blue-400' : c.status === 'Leading' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400')}>{c.status}</span></td>
                        <td className="p-4"><div className="flex items-center justify-center gap-2"><button onClick={() => editRow(i)} className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-blue-400 transition-colors"><Edit3 className="w-3.5 h-3.5" /></button><button onClick={() => deleteRow(i)} className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SEATS TAB */}
        {tab === 'seats' && (
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-2">Manual Seat Entry</h3>
            <p className="text-gray-500 text-sm mb-6">Turn off simulation to use manual values. Total must equal 234.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PARTIES.map(p => (
                <div key={p} className="bg-black/[0.01] dark:bg-white/[0.02] rounded-xl p-5 border border-black/5 dark:border-white/5" style={{ borderLeftColor: PARTY_COLORS[p], borderLeftWidth: '3px' }}>
                  <div className="flex items-center gap-2 mb-3"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: PARTY_COLORS[p] }} /><span className="font-bold">{p}</span></div>
                  <input type="number" min="0" max="234" value={liveSeats[p] || 0} onChange={e => setLiveSeats(prev => ({ ...prev, [p]: Number(e.target.value) }))}
                    className="w-full bg-gray-100 dark:bg-gray-800/60 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-2xl font-black text-center outline-none focus:ring-2 transition-all" style={{ color: PARTY_COLORS[p], ringColor: PARTY_COLORS[p] }} />
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-xl bg-black/5 dark:bg-black/30 border border-black/5 dark:border-white/5 flex items-center justify-between">
              <span className="text-sm text-gray-400">Total Seats</span>
              <span className={cn("text-2xl font-black", Object.values(liveSeats).reduce((a, b) => a + b, 0) === 234 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>{Object.values(liveSeats).reduce((a, b) => a + b, 0)} / 234</span>
            </div>
          </div>
        )}

        {/* VOTE SHARE TAB */}
        {tab === 'voteshare' && (
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-2">Vote Share (%)</h3>
            <p className="text-gray-500 text-sm mb-6">Manually set each party's vote share percentage.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PARTIES.map(p => (
                <div key={p} className="bg-black/[0.01] dark:bg-white/[0.02] rounded-xl p-5 border border-black/5 dark:border-white/5" style={{ borderLeftColor: PARTY_COLORS[p], borderLeftWidth: '3px' }}>
                  <div className="flex items-center gap-2 mb-3"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: PARTY_COLORS[p] }} /><span className="font-bold">{p}</span></div>
                  <div className="relative">
                    <input type="number" step="0.1" min="0" max="100" value={Number(voteShares[p] || 0).toFixed(1)} onChange={e => setVoteShares(prev => ({ ...prev, [p]: Number(e.target.value) }))}
                      className="w-full bg-gray-100 dark:bg-gray-800/60 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-2xl font-black text-center outline-none focus:ring-2 transition-all pr-10" style={{ color: PARTY_COLORS[p] }} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 mt-3 overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (voteShares[p] || 0) * 2)}%`, backgroundColor: PARTY_COLORS[p] }} /></div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-xl bg-black/5 dark:bg-black/30 border border-black/5 dark:border-white/5 flex items-center justify-between">
              <span className="text-sm text-gray-400">Total Vote Share</span>
              <span className={cn("text-2xl font-black", Math.abs(Object.values(voteShares).reduce((a, b) => a + Number(b), 0) - 100) < 1 ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400")}>{Object.values(voteShares).reduce((a, b) => a + Number(b), 0).toFixed(1)}%</span>
            </div>
          </div>
        )}

        <footer className="text-center py-6 mt-8 border-t border-black/5 dark:border-white/5"><p className="text-[11px] text-gray-500">Admin Panel · Election Dashboard TN 2026</p></footer>
      </div>
    </div>
  );
}
