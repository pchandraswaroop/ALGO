import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Terminal, Award, Users, ShieldAlert } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { getProblemsStats } from "../api";

export default function Landing() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    usersCount: 2,
    problemsCount: 5,
    submissionsCount: 10,
    avgExecutionTime: 4.2,
  });

  useEffect(() => {
    getProblemsStats()
      .then((res) => {
        if (res && res.success) {
          setStats({
            usersCount: res.usersCount,
            problemsCount: res.problemsCount,
            submissionsCount: res.submissionsCount,
            avgExecutionTime: res.avgExecutionTime,
          });
        }
      })
      .catch((err) => {
        console.error("Error loading stats:", err);
      });
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 bg-grid-radial text-slate-800 py-10 px-6 flex flex-col justify-between relative overflow-hidden transition-colors duration-200">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/3 right-1/10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>

      <div className="flex-1 w-full max-w-5xl mx-auto px-4 pt-16 pb-12 text-center space-y-12 z-10 flex flex-col justify-center">
        {/* Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-xs font-semibold tracking-wider uppercase animate-pulse self-center">
          🚀 AlgoU Judge is Live
        </div>

        {/* Hero Headline */}
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight select-none text-slate-900">
            Practice Coding. <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Become a Master.
            </span>
          </h1>
          <div className="max-w-2xl mx-auto space-y-3">
            <p className="text-slate-600 text-lg sm:text-xl font-medium leading-relaxed">
              "Talk is cheap. Show me the code." — Linus Torvalds
            </p>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-sans">
              AlgoU Judge isolates, executes, and grades your code inside millisecond-fast sandboxes. Designed to train the world's best algorithmists.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={user ? "/problems" : "/login"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-emerald-600/10 transition-all hover:scale-105 duration-200"
          >
            Start solving
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/problems"
            className="w-full sm:w-auto inline-flex items-center justify-center border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-350 px-8 py-3.5 rounded-xl font-semibold text-slate-700 transition-all duration-200 shadow-sm"
          >
            Open dashboard
          </Link>
        </div>

        {/* Mock IDE & Sandbox Monitor Window */}
        <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xl text-left shadow-slate-200/50 transition-all duration-500 hover:border-emerald-500/30 w-full">
          {/* Mock Window Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-b border-slate-200/80 select-none">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-205 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-slate-205 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-slate-205 inline-block"></span>
            </div>
            <div className="flex gap-2">
              <span className="text-emerald-700 text-xs font-mono bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100">solution.py</span>
              <span className="text-slate-400 text-xs font-mono px-2.5 py-0.5">Solution.java</span>
              <span className="text-slate-400 text-xs font-mono px-2.5 py-0.5">main.cpp</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
              DOCKER SANDBOX ACTIVE
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200/80">
            {/* Sidebar Sandbox resource monitor */}
            <div className="p-5 bg-slate-50/30 space-y-4 font-mono text-[11px] text-slate-500 select-none">
              <div className="border-b border-slate-200 pb-2">
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">CONTAINER STATS</span>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="block text-[9px] text-slate-400 tracking-wider font-bold">SECURE SHIELD</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                    CAP-DROP SECURE
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-400 tracking-wider font-bold">NETWORKING</span>
                  <span className="text-red-500 font-bold flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
                    ISOLATED
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-400 tracking-wider font-bold">CPU RESOURCE</span>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1 border border-slate-200">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "35%" }}></div>
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 block">0.5 Cores Limit</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-400 tracking-wider font-bold">MEMORY CAP</span>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1 border border-slate-200">
                    <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: "15%" }}></div>
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 block">14.2MB / 256MB Cap</span>
                </div>
              </div>
            </div>

            {/* Code pane */}
            <div className="md:col-span-3 bg-white">
              <pre className="p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-slate-700 select-none">
                <code>
                  <span className="text-fuchsia-700 font-semibold">import </span>sys{"\n"}
                  <span className="text-fuchsia-700 font-semibold">from </span>collections <span className="text-fuchsia-700 font-semibold">import </span>deque{"\n\n"}
                  <span className="text-fuchsia-700 font-semibold">def </span><span className="text-emerald-700 font-bold">find_path</span>(grid, target):{"\n"}
                  {"    "}queue = deque([(0, 0, 0)]){"\n"}
                  {"    "}visited = {"{"}(0, 0){"}"}{"\n\n"}
                  {"    "}<span className="text-fuchsia-700 font-semibold">while </span>queue:{"\n"}
                  {"        "}r, c, dist = queue.popleft(){"\n"}
                  {"        "}<span className="text-fuchsia-700 font-semibold">if </span>grid[r][c] == target:{"\n"}
                  {"            "}<span className="text-fuchsia-700 font-semibold">print</span>(<span className="text-emerald-600 font-medium">"Verdict: ACCEPTED"</span>){"\n"}
                  {"            "}<span className="text-fuchsia-700 font-semibold">return </span>dist{"\n\n"}
                  {"        "}<span className="text-fuchsia-700 font-semibold">for </span>dr, dc <span className="text-fuchsia-700 font-semibold">in </span>[(-1,0), (1,0), (0,-1), (0,1)]:{"\n"}
                  {"            "}nr, nc = r + dr, c + dc{"\n"}
                  {"            "}<span className="text-fuchsia-700 font-semibold">if </span>0 &lt;= nr &lt; len(grid) <span className="text-fuchsia-700 font-semibold">and </span>0 &lt;= nc &lt; len(grid[0]):{"\n"}
                  {"                "}<span className="text-fuchsia-700 font-semibold">if </span>(nr, nc) <span className="text-fuchsia-700 font-semibold">not in </span>visited:{"\n"}
                  {"                    "}visited.add((nr, nc)){"\n"}
                  {"                    "}queue.append((nr, nc, dist + 1)){"\n"}
                </code>
              </pre>
            </div>
          </div>
        </div>

        {/* Platform Stats Grid - Uses Real Database Counts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-slate-200 max-w-4xl mx-auto w-full select-none">
          <div className="text-center">
            <span className="block text-2xl md:text-3xl font-extrabold text-emerald-600 font-mono">{stats.usersCount}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mt-1">Developers Active</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl md:text-3xl font-extrabold text-cyan-600 font-mono">{stats.submissionsCount}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mt-1">Docker Sandboxes</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl md:text-3xl font-extrabold text-teal-600 font-mono">{stats.problemsCount}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mt-1">Problems Available</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl md:text-3xl font-extrabold text-amber-600 font-mono">&lt; {stats.avgExecutionTime}ms</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mt-1">Execution Speed</span>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left space-y-3 shadow-sm hover:border-emerald-500/20 transition-all">
            <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl w-fit">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Multi-Language Sandbox</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Compile and run C, C++, Java, Python, and JavaScript securely inside isolated Docker containers with CPU/RAM caps.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left space-y-3 shadow-sm hover:border-emerald-500/20 transition-all">
            <div className="bg-cyan-50 text-cyan-600 p-2.5 rounded-xl w-fit">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">RabbitMQ Queue Manager</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Submit code asynchronously. Our RabbitMQ queue broker schedules running processes safely without lagging servers.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left space-y-3 shadow-sm hover:border-emerald-500/20 transition-all">
            <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl w-fit">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Premium Codespace</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Browse algorithm problems, edit code in Monaco, submit, and track live compilation outputs in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto border-t border-slate-200 py-6 text-center text-xs text-slate-500 font-mono relative z-10">
        <p className="text-slate-400">
          © {new Date().getFullYear()} AlgoU Judge. All rights reserved. · Created my <span className="text-emerald-600 font-bold">Swaroop</span>
        </p>
      </footer>
    </div>
  );
}
