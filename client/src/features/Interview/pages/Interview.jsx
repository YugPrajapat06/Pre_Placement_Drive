import React, { useEffect } from "react";
import { Mic2, Video, MessageSquare, CheckCircle2, ArrowRight, Sparkles, Dot } from "lucide-react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useRef } from "react";
import { useCandidate } from "../hooks/useCandidate";
import { useResume } from "../../resume/hooks/useResume";

const interviewTypes = [
  {
    title: "Mock HR Interview",
    desc: "Practice common HR & behavioral questions",
    icon: MessageSquare,
    duration: "20 min",
    tag: "Behavioral",
    color: "from-orange-400 to-orange-500",
    tagColor: "bg-orange-100 text-orange-700",
    tips: ["Be concise", "Use STAR method", "Stay confident"],
  },
  {
    title: "Technical Interview",
    desc: "Coding, system design & problem-solving",
    icon: Video,
    duration: "45 min",
    tag: "Technical",
    color: "from-violet-400 to-violet-500",
    tagColor: "bg-violet-100 text-violet-700",
    tips: ["Think aloud", "Ask clarifying Qs", "Optimize after solving"],
  },
  {
    title: "Group Discussion",
    desc: "Demonstrate leadership & communication",
    icon: Mic2,
    duration: "30 min",
    tag: "Group",
    color: "from-emerald-400 to-emerald-500",
    tagColor: "bg-emerald-100 text-emerald-700",
    tips: ["Listen actively", "Build on others' ideas", "Summarize well"],
  },
];

const Interview = () => {

  const { handleGetCandidateProfile } = useCandidate();
  const { handleGetActiveResume } = useResume();

  useEffect(() => {
    handleGetCandidateProfile()
  }, [])

  const { profile } = useSelector((state) => state.candidate);

  useEffect(() => {
    handleGetActiveResume(profile.activeResumeId)


  }, [])

  const { activeResume } = useSelector((state) => state.resume)

  console.log(" Active Check :: ", activeResume);

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 text-slate-900">
      <div className="mx-auto max-w-5xl flex flex-col gap-8">
        {/* Header */}
        <header className="rounded-4xl border flex flex-col justify-center items-center text-center border-orange-100 bg-white/80 px-6 py-6 shadow-[0_20px_60px_-25px_rgba(249,115,22,0.35)] backdrop-blur sm:px-8">

          <h1 className="text-2xl uppercase tracking-widest font-semibold  sm:text-4xl">
            Interview Rounds
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base max-w-xl">
            Prepare for every stage of the hiring process. Choose a round and
            start practicing with AI-powered mock sessions.
          </p>
          <div className="flex flex-col justify-center items-center gap-1 py-5">
            <p className="text-xl font-semibold text-amber-500"> {profile.education.college}</p>
            <div className="flex justify-center items-center  text-[14px]">
              <p>{profile.education.course}</p>
              <Dot />
              <p>{profile.education.branch}</p>
            </div>
            <div className="w-full flex flex-col justify-center items-center">
              <div className="bg-black/10 px-2 py-1 ">
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="cursor-pointer  text-sm font-semibold font-sans uppercase tracking-widest bg-linear-60 from-emerald-950  to-emerald-700 bg-clip-text text-transparent">{activeResume ?'Your Resume : ' + activeResume.name : "Upload Resume"}</button>

              </div>
            </div>

          </div>
        </header>

        {/* Cards */}
        <div className="grid gap-5 md:grid-cols-3">
          {interviewTypes.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group rounded-3xl border border-orange-100 bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-100 transition-all duration-200 flex flex-col"
              >
                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br ${item.color} text-white shadow-md mb-4`}
                >
                  <Icon size={20} />
                </div>

                <h2 className="text-base font-semibold text-slate-900">
                  {item.title}
                </h2>
                <p className="mt-1 text-sm text-slate-500 flex-1">{item.desc}</p>

                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.tagColor}`}
                  >
                    {item.tag}
                  </span>
                  <span className="text-xs text-slate-400">{item.duration}</span>
                </div>

                <ul className="mt-4 space-y-1.5">
                  {item.tips.map((tip) => (
                    <li key={tip} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 size={12} className="text-orange-400 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>

                <button className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow shadow-orange-200 transition hover:from-orange-600 hover:to-orange-700 active:scale-95">
                  Start Session
                  <ArrowRight size={15} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Coming soon banner */}
        <div className="rounded-4xl border border-orange-100 bg-linear-to-br from-orange-500 to-orange-600 p-6 text-white shadow-lg shadow-orange-200">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-200 mb-2">
            Coming Soon
          </p>
          <h3 className="text-xl font-semibold">
            AI-Powered Real-time Feedback
          </h3>
          <p className="mt-2 text-sm text-orange-100 max-w-md">
            Soon you'll receive instant feedback on your communication, body
            language, and technical depth during mock interviews.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Interview;
