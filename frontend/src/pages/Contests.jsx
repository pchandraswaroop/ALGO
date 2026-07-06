import { Trophy, Calendar, Users, Award } from "lucide-react";

export default function Contests() {
  const contests = {
    active: {
      title: "Weekly Contest 42",
      endsIn: "01h 45m 12s",
      participants: 1245,
      questions: 4,
    },
    upcoming: [
      {
        title: "Biweekly Contest 12",
        startsAt: "July 12, 2026, 19:30 IST",
        participants: 890,
        duration: "1h 30m",
      },
      {
        title: "CodeArena Speedrun Round 5",
        startsAt: "July 18, 2026, 21:00 IST",
        participants: 412,
        duration: "1h 00m",
      },
    ],
    past: [
      {
        title: "Weekly Contest 41",
        winner: "Swaroop",
        date: "July 04, 2026",
        solved: "4/4 Questions",
      },
      {
        title: "Weekly Contest 40",
        winner: "Eshwar",
        date: "June 27, 2026",
        solved: "4/4 Questions",
      },
    ],
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-white py-10 px-6 sm:px-10 max-w-5xl space-y-8 select-none">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Trophy className="w-8 h-8 text-emerald-400" />
          Contests
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Compete in real-time coding challenges, solve problems, and rise in global rating ranks.
        </p>
      </div>

      {/* Active Contest Card */}
      <div className="bg-gradient-to-br from-emerald-950/30 to-slate-900 border border-emerald-500/20 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden transition-all hover:border-emerald-500/35">
        <div className="absolute top-0 right-0 p-3 bg-emerald-500/10 rounded-bl-3xl border-l border-b border-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-wider animate-pulse">
          Active Now
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white">{contests.active.title}</h2>
          <p className="text-slate-400 text-sm max-w-md leading-relaxed">
            Four algorithm challenges. Compete with top developers worldwide. Ends shortly!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
          <div>
            <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Remaining Time</span>
            <span className="text-xl font-extrabold text-emerald-400 font-mono mt-1 block">{contests.active.endsIn}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Registered Users</span>
            <span className="text-xl font-extrabold text-white font-mono mt-1 block">{contests.active.participants} Registered</span>
          </div>
          <div className="flex items-end">
            <button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/10">
              Enter Contest
            </button>
          </div>
        </div>
      </div>

      {/* Grid for Upcoming & Past */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            Upcoming Contests
          </h3>

          <div className="space-y-4">
            {contests.upcoming.map((c, index) => (
              <div key={index} className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-start gap-3">
                  <span className="font-bold text-sm text-white">{c.title}</span>
                  <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/10 px-2 py-0.5 rounded font-mono">
                    {c.duration}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 space-y-1 font-mono">
                  <div>Starts: {c.startsAt}</div>
                  <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-600" /> {c.participants} registerings</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Contests */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            Past Winners
          </h3>

          <div className="space-y-4">
            {contests.past.map((c, index) => (
              <div key={index} className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-bold text-sm text-white block">{c.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    Held on {c.date} · {c.solved}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Winner</span>
                  <span className="text-xs font-bold text-amber-400 font-mono mt-0.5 block">{c.winner}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
