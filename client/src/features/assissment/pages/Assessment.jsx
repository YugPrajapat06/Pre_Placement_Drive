import React, { useState } from "react";
import { ClipboardList, Clock, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useAssisment } from "../hooks/useAssisment.js";
import { useNavigate } from "react-router";

const assessmentTypes = [
  {
    title: "Consolidated Placement Test",
    desc: "A comprehensive test merging Aptitude, Reasoning, Verbal, and Technical questions to match placement patterns.",
    duration: "30 min",
    difficulty: "Medium",
    color: "from-orange-400 to-orange-500",
    badge: "bg-orange-100 text-orange-700",
  },
  {
    title: "Aptitude Round",
    desc: "Quantitative challenges, verbal logic, and analytical problem-solving.",
    duration: "15 min",
    difficulty: "Easy",
    color: "from-amber-400 to-amber-500",
    badge: "bg-amber-100 text-amber-700",
  },
  {
    title: "Logical Reasoning",
    desc: "Pattern recognition, puzzle solving, and decision-making logic.",
    duration: "20 min",
    difficulty: "Medium",
    color: "from-rose-400 to-rose-500",
    badge: "bg-rose-100 text-rose-700",
  },
  {
    title: "Technical Assessment",
    desc: "Core engineering subjects, coding concept MCQs, and tech fundamentals.",
    duration: "30 min",
    difficulty: "Hard",
    color: "from-violet-400 to-violet-500",
    badge: "bg-violet-100 text-violet-700",
  },
];

const Assessment = () => {
  const navigate = useNavigate();
  const { handleCreateAssisment } = useAssisment();
  const [creating, setCreating] = useState(false);

  const handleStart = async () => {
    setCreating(true);
    const res = await handleCreateAssisment();
    setCreating(false);
    const newId = res?.assisment?._id || res?._id;
    if (newId) {
      navigate(`/assessment/${newId}`);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 text-slate-900">
      <div className="mx-auto max-w-5xl flex flex-col gap-8">
        
        {/* Header */}
        <header className="rounded-4xl border border-orange-100 bg-white/80 px-6 py-6 shadow-[0_20px_60px_-25px_rgba(249,115,22,0.35)] backdrop-blur sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700 mb-3">
            <Sparkles size={14} />
            Choose Your Test
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Assessments
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base max-w-xl">
            Pick a category below and challenge yourself. Every test tracks your
            progress and helps you improve.
          </p>
        </header>

        {/* Cards grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          {assessmentTypes.map((item) => (
            <div
              key={item.title}
              className="group rounded-3xl border border-orange-100 bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-100 transition-all duration-200"
            >
              <div
                className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br ${item.color} text-white shadow-md mb-4`}
              >
                <ClipboardList size={20} />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                {item.title}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{item.desc}</p>

              <div className="mt-4 flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock size={13} />
                  {item.duration}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.badge}`}
                >
                  {item.difficulty}
                </span>
              </div>

              <button
                onClick={handleStart}
                disabled={creating}
                className="mt-5 flex items-center gap-2 rounded-xl bg-linear-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow shadow-orange-200 transition hover:from-orange-600 hover:to-orange-700 active:scale-95 disabled:opacity-50"
              >
                {creating ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <ArrowRight size={15} />
                )}
                {creating ? "Creating..." : "Start Test"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Assessment;
