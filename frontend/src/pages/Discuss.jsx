import { MessageSquare, Flame, MessageCircle, Heart } from "lucide-react";

export default function Discuss() {
  const posts = [
    {
      title: "Weekly Contest 42 Editorial (Python/C++/Java)",
      author: "Swaroop",
      replies: 28,
      likes: 142,
      category: "Editorial",
    },
    {
      title: "How to solve Two Sum in O(N) linear time complexity?",
      author: "Eshwar",
      replies: 12,
      likes: 64,
      category: "Tutorial",
    },
    {
      title: "Tips on practicing binary search and sliding window challenges",
      author: "coder_101",
      replies: 8,
      likes: 31,
      category: "General",
    },
    {
      title: "Docker sandbox execution timeout: C++ vs JavaScript benchmarks",
      author: "sys_admin",
      replies: 19,
      likes: 95,
      category: "Development",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-white py-10 px-6 sm:px-10 max-w-5xl space-y-8 select-none">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-emerald-400" />
          Discuss
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Share solutions, post editorials, analyze run times, and learn from top coders.
        </p>
      </div>

      {/* Action header */}
      <div className="flex justify-between items-center gap-4">
        <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Forum Threads</span>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-emerald-500/10">
          New Topic
        </button>
      </div>

      {/* Threads list */}
      <div className="space-y-4 max-w-4xl">
        {posts.map((p, index) => (
          <div
            key={index}
            className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 hover:border-emerald-500/10 transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="font-bold text-sm text-white hover:text-emerald-400 cursor-pointer transition-colors block">
                  {p.title}
                </span>
                <span className="text-[10px] text-slate-500 font-mono block">
                  Posted by <span className="text-slate-400 font-semibold">{p.author}</span> · Category: {p.category}
                </span>
              </div>
              <span className="text-[9px] bg-slate-950 border border-slate-850 text-slate-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                {p.category}
              </span>
            </div>

            <div className="flex items-center gap-6 pt-3 border-t border-slate-950 text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1.5 hover:text-emerald-400 cursor-pointer">
                <MessageCircle className="w-4 h-4" /> {p.replies} Replies
              </span>
              <span className="flex items-center gap-1.5 hover:text-red-400 cursor-pointer">
                <Heart className="w-4 h-4" /> {p.likes} Likes
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
