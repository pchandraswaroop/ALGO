import { Trophy, TrendingUp, Search } from "lucide-react";

export default function Leaderboard() {
  const users = [
    { rank: 1, name: "Swaroop", solved: 412, rating: 2850, country: "India" },
    { rank: 2, name: "Eshwar", solved: 380, rating: 2710, country: "India" },
    { rank: 3, name: "alankit", solved: 345, rating: 2540, country: "United States" },
    { rank: 4, name: "alex_code", solved: 310, rating: 2420, country: "Germany" },
    { rank: 5, name: "byte_knight", solved: 290, rating: 2310, country: "Canada" },
    { rank: 6, name: "judger_pro", solved: 260, rating: 2190, country: "United Kingdom" },
    { rank: 7, name: "null_pointer", solved: 245, rating: 2100, country: "India" },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-white py-10 px-6 sm:px-10 max-w-5xl space-y-8 select-none">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-emerald-400" />
          Leaderboard
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Rankings of the top coders globally based on solved problems and active contest performance ratings.
        </p>
      </div>

      {/* Main Ranking Table */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                <th className="py-4 px-6 text-center w-20">Rank</th>
                <th className="py-4 px-6">Developer</th>
                <th className="py-4 px-6 text-center">Problems Solved</th>
                <th className="py-4 px-6 text-center">Rating</th>
                <th className="py-4 px-6">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {users.map((u) => (
                <tr
                  key={u.rank}
                  className="hover:bg-slate-850/20 transition-colors"
                >
                  <td className="py-4 px-6 text-center font-mono text-sm">
                    {u.rank === 1 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-xs">
                        1
                      </span>
                    ) : u.rank === 2 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-400/20 text-slate-300 border border-slate-400/30 font-bold text-xs">
                        2
                      </span>
                    ) : u.rank === 3 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-600 border border-amber-700/30 font-bold text-xs">
                        3
                      </span>
                    ) : (
                      <span className="text-slate-500 font-semibold">{u.rank}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 font-bold text-white flex items-center gap-2">
                    {u.name}
                    {u.rank <= 2 && (
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </td>
                  <td className="py-4 px-6 text-center font-semibold text-slate-300 font-mono">
                    {u.solved}
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-emerald-400 font-mono">
                    {u.rating}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-400 font-medium">
                    {u.country}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
