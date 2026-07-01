import { useAuth } from "../context/AuthContext";
import { Terminal, Award, BookOpen, Clock, Activity } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  // Temporary static list of demo problems to display a polished UI
  const demoProblems = [
    { id: "1", title: "Two Sum", difficulty: "Easy", acceptance: "48.2%", tags: ["Array", "Hash Table"] },
    { id: "2", title: "Add Two Numbers", difficulty: "Medium", acceptance: "38.9%", tags: ["Linked List", "Math"] },
    { id: "3", title: "Median of Two Sorted Arrays", difficulty: "Hard", acceptance: "34.5%", tags: ["Array", "Binary Search"] },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Welcome back, {user ? (user.fullName || user.username) : "Coder"}!
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Explore the algorithmic coding challenges, write code, run custom test inputs, and check your test case solutions against the judge.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-slate-500 text-xs block uppercase font-semibold">Solved Problems</span>
              <span className="text-2xl font-extrabold text-white">0</span>
            </div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="bg-indigo-500/10 text-indigo-400 p-3 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-slate-500 text-xs block uppercase font-semibold">Total Problems</span>
              <span className="text-2xl font-extrabold text-white">3</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="bg-amber-500/10 text-amber-400 p-3 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-slate-500 text-xs block uppercase font-semibold">Submissions</span>
              <span className="text-2xl font-extrabold text-white">0</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="bg-cyan-500/10 text-cyan-400 p-3 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-slate-500 text-xs block uppercase font-semibold">Acceptance Rate</span>
              <span className="text-2xl font-extrabold text-white">0.0%</span>
            </div>
          </div>
        </div>

        {/* Problem List Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold tracking-tight">Available Challenges</h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                    <th className="py-4 px-6">Problem ID</th>
                    <th className="py-4 px-6">Title</th>
                    <th className="py-4 px-6">Difficulty</th>
                    <th className="py-4 px-6">Acceptance</th>
                    <th className="py-4 px-6">Topics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {demoProblems.map((prob) => (
                    <tr key={prob.id} className="hover:bg-slate-850/30 transition-colors">
                      <td className="py-4 px-6 font-mono text-sm text-slate-500">#{prob.id}</td>
                      <td className="py-4 px-6 font-bold text-white hover:text-indigo-400 cursor-pointer">
                        {prob.title}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          prob.difficulty === "Easy"
                            ? "bg-emerald-955/20 text-emerald-400 border-emerald-900/50"
                            : prob.difficulty === "Medium"
                            ? "bg-amber-955/20 text-amber-400 border-amber-900/50"
                            : "bg-red-955/20 text-red-400 border-red-900/50"
                        }`}>
                          {prob.difficulty}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-300 text-sm font-medium">{prob.acceptance}</td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {prob.tags.map((tag, i) => (
                            <span key={i} className="text-slate-500 text-[10px] uppercase font-bold tracking-wider bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
