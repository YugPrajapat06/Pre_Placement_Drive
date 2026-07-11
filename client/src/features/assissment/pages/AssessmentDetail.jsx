import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { useAssisment } from "../hooks/useAssisment.js";
import {
  ShieldCheck,
  Clock,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  User,
  Mail,
  Lock,
  ChevronRight,
  Loader2,
  BarChart3,
} from "lucide-react";

const rules = [
  "Do not switch tabs or leave the browser window during the assessment.",
  "Copy-pasting text from external sources is strictly prohibited.",
  "Ensure a stable internet connection before starting.",
  "Do not refresh the page — your progress will be lost.",
  "All questions must be attempted within the time limit.",
  "Each question has only one correct answer. Choose wisely.",
];

const StatBadge = ({ icon: Icon, label, value, color }) => (
  <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white px-6 py-4 shadow-sm">
    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
      <Icon size={20} className="text-white" />
    </div>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
    <p className="text-xs font-medium text-slate-500">{label}</p>
  </div>
);

const AssessmentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { currentAssisment, loading } = useSelector((state) => state.assisment);
  const { handleGetAssisment, handleStartAssisment } = useAssisment();

  const [agreed, setAgreed] = useState(false);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (id) handleGetAssisment(id);
  }, [id]);

  const assessment = currentAssisment?.assisment || currentAssisment;
  const totalQuestions = assessment?.questionsId?.length ?? assessment?.questions?.length ?? 20;
  const timeLimit = assessment?.duration ?? assessment?.timeLimit ?? 30;

  const handleStart = async () => {
    if (!agreed) return;
    setStarting(true);
    const ok = await handleStartAssisment(id);
    if (ok) navigate(`/assessment/${id}/take`);
    setStarting(false);
  };

  const initials = user?.username
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase() ?? "U";

  if (loading && !assessment) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={40} className="animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* ── Page Header ── */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span
            className="cursor-pointer hover:text-orange-500 transition"
            onClick={() => navigate("/assessment")}
          >
            Assessments
          </span>
          <ChevronRight size={14} />
          <span className="font-medium text-slate-900">Assessment Details</span>
        </div>

        {/* ── Assessment Summary Card ── */}
        <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-[0_4px_24px_rgba(249,115,22,0.12)]">
          {/* Gradient Banner */}
          <div className="relative h-28 bg-linear-to-r from-orange-500 via-orange-500 to-amber-400 px-8 flex items-end pb-4">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(255,255,255,0.05)_20px,rgba(255,255,255,0.05)_40px)]" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                <BarChart3 size={12} />
                Intermediate
              </span>
            </div>
          </div>

          <div className="px-6 pt-5 pb-6 sm:px-8">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {assessment?.title ?? "Full Stack Assessment"}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              {assessment?.description ??
                "This assessment evaluates your technical competency across core placement topics. Attempt all questions carefully within the allotted time."}
            </p>

            {/* Stats Row */}
            <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
              <StatBadge
                icon={HelpCircle}
                label="Questions"
                value={totalQuestions}
                color="bg-gradient-to-br from-orange-400 to-orange-600"
              />
              <StatBadge
                icon={Clock}
                label="Minutes"
                value={timeLimit}
                color="bg-gradient-to-br from-amber-400 to-orange-500"
              />
              <StatBadge
                icon={BarChart3}
                label="Max Score"
                value="100%"
                color="bg-gradient-to-br from-orange-500 to-rose-500"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
          {/* ── Left Column ── */}
          <div className="space-y-6">

            {/* User Info Card */}
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-orange-500">
                Candidate
              </p>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-orange-400 to-orange-600 text-lg font-bold text-white shadow-md">
                  {initials}
                </div>
                <div>
                  <p className="flex items-center gap-2 text-base font-semibold text-slate-900">
                    <User size={14} className="text-slate-400" />
                    {user?.username ?? "—"}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                    <Mail size={13} className="text-slate-400" />
                    {user?.email ?? "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Rules Card */}
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100">
                  <AlertTriangle size={15} className="text-orange-600" />
                </div>
                <p className="font-semibold text-slate-900">Important Instructions</p>
              </div>

              <ul className="space-y-3">
                {rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-orange-400"
                    />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Right Column: Start Panel ── */}
          <div className="lg:w-72 space-y-4">

            {/* Timer Preview */}
            <div className="rounded-3xl border border-orange-100 bg-linear-to-br from-orange-50 to-amber-50 p-6 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-3">
                Time Limit
              </p>
              <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full border-4 border-orange-200 bg-white shadow-inner">
                <div className="absolute inset-0 rounded-full border-4 border-orange-500 opacity-20 animate-pulse" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600 font-mono">
                    {String(timeLimit).padStart(2, "0")}:00
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">minutes</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Timer starts when you click <strong>Start</strong>
              </p>
            </div>

            {/* Consent + Start */}
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-5">
              {/* Consent */}
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-orange-300 hover:bg-orange-50">
                <div className="relative mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <div className="h-5 w-5 rounded border-2 border-slate-300 bg-white transition peer-checked:border-orange-500 peer-checked:bg-orange-500 flex items-center justify-center">
                    {agreed && (
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 12 12">
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-slate-600 leading-relaxed">
                  I agree to the terms and will attempt this assessment{" "}
                  <strong className="text-slate-800">honestly</strong> and without
                  any external assistance.
                </span>
              </label>

              {/* Start Button */}
              <button
                onClick={handleStart}
                disabled={!agreed || starting}
                className={`w-full flex items-center justify-center gap-2.5 rounded-2xl py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 ${
                  agreed
                    ? "bg-linear-to-r from-orange-500 to-orange-600 shadow-orange-200 hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-300 active:scale-95"
                    : "cursor-not-allowed bg-slate-200 text-slate-400 shadow-none"
                }`}
              >
                {starting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ShieldCheck size={16} />
                )}
                {starting ? "Starting..." : "Start Assessment"}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <Lock size={11} />
                <span>Secure, proctored exam environment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentDetail;
