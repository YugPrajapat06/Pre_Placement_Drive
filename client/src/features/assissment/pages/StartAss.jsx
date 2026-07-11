import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Award,
  CalendarDays,
  Clock3,
  PlayCircle,
  Sparkles,
  TrendingUp,
  Loader2,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { useAssisment } from "../hooks/useAssisment.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const StartAss = () => {
  const navigate = useNavigate();
  const { handleGetAllAssisments, handleCreateAssisment } = useAssisment();
  const { user } = useSelector((state) => state.auth);
  const { allAssisments } = useSelector((state) => state.assisment);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (user) {
      handleGetAllAssisments();
    }
  }, [user]);

  const list = allAssisments?.assisments ?? [];
  const countAss = list.length;

  const totalScore = () => {
    let total = 0;
    list.forEach((element) => {
      if (element?.isSubmitted) {
        total += Number(element?.score ?? 0);
      }
    });
    return total;
  };

  const avgScore = countAss === 0 ? 0 : Math.round((totalScore() / countAss) * 10) / 10;
  const maxScore = list.reduce((acc, curr) => Math.max(acc, curr.score ?? 0), 0);

  const stats = [
    {
      label: "Average Score",
      value: `${avgScore} %`,
      hint: "Your average score per assessment",
      accent: "bg-orange-100 text-orange-700",
    },
    {
      label: "Assessments Taken",
      value: countAss,
      hint: "Assessments completed/started by you",
      accent: "bg-amber-100 text-amber-700",
    },
    {
      label: "Maximum Score",
      value: `${maxScore} %`,
      hint: "Your highest score achieved",
      accent: "bg-orange-50 text-orange-600",
    },
  ];

  const handleStartNewAssessment = async () => {
    setCreating(true);
    const res = await handleCreateAssisment();
    setCreating(false);
    const newId = res?.assisment?._id || res?._id;
    if (newId) {
      navigate(`/assessment/${newId}`);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        
        {/* Header banner */}
        <header className="rounded-4xl border border-orange-100 bg-white/80 px-6 py-6 shadow-[0_20px_60px_-25px_rgba(249,115,22,0.4)] backdrop-blur sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                <Sparkles size={16} />
                Assessment Dashboard
              </div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Welcome back, {user?.username?.split(" ")[0]}!
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                Review your previous assessments, track your growth, and start a fresh challenge whenever you are ready.
              </p>
            </div>

            <button
              onClick={handleStartNewAssessment}
              disabled={creating}
              className="flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 disabled:opacity-50 active:scale-95"
            >
              {creating ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <PlayCircle size={18} />
              )}
              {creating ? "Creating..." : "Start New Assessment"}
            </button>
          </div>
        </header>

        {/* Content layout */}
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6">
            
            {/* Stats row */}
            <div className="grid gap-4 md:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-orange-100 bg-white p-4 shadow-sm">
                  <div className={`inline-flex rounded-full p-2 ${stat.accent}`}>
                    {stat.label.includes("Score") ? (
                      <Award size={16} />
                    ) : stat.label.includes("Assessments") ? (
                      <TrendingUp size={16} />
                    ) : (
                      <Clock3 size={16} />
                    )}
                  </div>
                  <p className="mt-4 text-2xl font-semibold text-slate-900">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-600">{stat.hint}</p>
                </div>
              ))}
            </div>

            {/* List of Previous/Active Assessments */}
            <div className="rounded-4xl border border-orange-100 bg-white p-6 shadow-sm sm:p-8 flex flex-col justify-between">
              <div className="flex items-center w-full justify-between mb-6">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-500">Recent work</p>
                  <h2 className="mt-1 text-2xl font-semibold">Your Assessments</h2>
                </div>
                <button
                  onClick={() => navigate("/assessment")}
                  className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                >
                  View all
                </button>
              </div>

              {list.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <HelpCircle size={48} className="text-orange-200 mb-3" />
                  <p className="text-sm">You haven't started any assessments yet.</p>
                  <button
                    onClick={handleStartNewAssessment}
                    className="mt-4 text-sm font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1"
                  >
                    Start your first test <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2 max-h-105 overflow-y-auto pr-1">
                  {list.map((item, index) => {
                    const isSub = item.isSubmitted;
                    const totalQ = item.questionsId?.length ?? 30;
                    const scoreVal = item.score ?? 0;
                    
                    return (
                      <div
                        key={item._id}
                        onClick={() => {
                          if (!isSub) {
                            navigate(`/assessment/${item._id}`);
                          }
                        }}
                        className={`rounded-2xl border border-orange-100 p-4 shadow-sm transition duration-200 ${
                          !isSub
                            ? "cursor-pointer bg-orange-50/50 hover:bg-orange-50 hover:-translate-y-0.5"
                            : "bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              Assessment #{index + 1}
                            </p>
                            <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                              <CalendarDays size={13} />
                              <span>{formatDate(item.createdAt)}</span>
                            </div>
                          </div>
                          <div
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              isSub
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-orange-100 text-orange-700 border border-orange-200 animate-pulse"
                            }`}
                          >
                            {isSub ? "Submitted" : "Resume"}
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <span className="text-xs text-slate-500">
                            {isSub ? (
                              <span className="flex items-center gap-1 text-emerald-600">
                                <CheckCircle size={12} />
                                Score: {scoreVal}/{totalQ} pts
                              </span>
                            ) : (
                              <span>Pending Start/Submit</span>
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Right sidebar */}
          <aside className="space-y-6">
            <div className="rounded-4xl border border-orange-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-lg font-semibold text-white shadow-md">
                  {user?.username
                    ?.split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase() ?? "U"}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{user?.username}</h3>
                  <p className="text-sm text-slate-500">{user?.email}</p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-orange-100 bg-orange-50 p-4">
                <p className="text-sm font-medium text-orange-700">Profile Summary</p>
                <p className="mt-2 text-sm text-slate-600">
                  {countAss === 0
                    ? "Start your journey with your first assessment. Best of luck!"
                    : avgScore >= 15
                    ? "You are performing strongly! Keep practicing to maintain your high score."
                    : avgScore >= 10
                    ? "Good job! Regular assessments will help you get placement-ready."
                    : "Keep trying! Practice makes perfect, and consistency is the key to placement success."}
                </p>
              </div>
            </div>

            <div className="rounded-4xl border border-orange-100 bg-linear-to-br from-orange-500 to-orange-600 p-6 text-white shadow-lg shadow-orange-200">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-100">Ready to begin?</p>
              <h3 className="mt-2 text-2xl font-semibold">Start a new assessment</h3>
              <p className="mt-3 text-sm text-orange-50">
                Choose a fresh test and begin your next challenge with focused preparation.
              </p>
              <button
                onClick={handleStartNewAssessment}
                disabled={creating}
                className="mt-5 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 font-semibold text-orange-600 transition hover:bg-orange-50 disabled:opacity-50"
              >
                {creating ? "Creating..." : "Begin Now"}
                <ArrowRight size={16} />
              </button>
            </div>
          </aside>
        </div>

      </div>
    </div>
  );
};

export default StartAss;