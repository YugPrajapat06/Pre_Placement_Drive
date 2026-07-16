import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { useAssisment } from "../hooks/useAssisment.js";

import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Send,
  AlertCircle,
  Loader2,
  User,
  LayoutGrid,
  X,
} from "lucide-react";

/* ─── helpers ─── */
const pad = (n) => String(n).padStart(2, "0");

/* ─── sub-components ─── */

const TimerDisplay = ({ seconds }) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const isLow = seconds < 300; // under 5 min → red warning
  return (
    <span
      className={`font-mono text-lg font-bold tabular-nums transition-colors ${isLow ? "text-rose-500 animate-pulse" : "text-orange-600"
        }`}
    >
      {pad(m)}:{pad(s)}
    </span>
  );
};

const OptionButton = ({ letter, text, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`group flex w-full items-start gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-150 ${selected
        ? "border-orange-500 bg-orange-50 shadow-md shadow-orange-100"
        : "border-slate-200 bg-white hover:border-orange-300 hover:bg-orange-50/60"
      }`}
  >
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors ${selected
          ? "bg-orange-500 text-white"
          : "bg-slate-100 text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-600"
        }`}
    >
      {letter}
    </span>
    <span
      className={`mt-1 text-sm leading-relaxed ${selected ? "font-semibold text-orange-700" : "text-slate-700"
        }`}
    >
      {text}
    </span>
    {selected && (
      <CheckCircle2
        size={18}
        className="ml-auto mt-1 shrink-0 text-orange-500"
      />
    )}
  </button>
);

/* ─── Question Navigator Panel ─── */
const QuestionNav = ({
  questions,
  answers,
  current,
  onJump,
  onClose,
  isMobile,
}) => {
  const answered = questions.filter((_, i) => answers[i] !== undefined).length;
  const pct = Math.round((answered / questions.length) * 100);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-500">
            Questions
          </p>
          <p className="text-sm font-semibold text-slate-900">
            {questions.length} Total
          </p>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 hover:bg-slate-100 text-slate-400"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-1.5 text-xs text-slate-500">
          <span>{answered} answered</span>
          <span className="font-semibold text-orange-600">{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-linear-to-r from-orange-400 to-orange-600 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Grid of question buttons */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="grid grid-cols-5 gap-2">
          {questions.map((_, i) => {
            const isAnswered = answers[i] !== undefined;
            const isCurrent = i === current;
            return (
              <button
                key={i}
                onClick={() => onJump(i)}
                className={`h-9 w-9 rounded-xl text-xs font-bold transition-all duration-150 ${isCurrent
                    ? "ring-2 ring-orange-500 ring-offset-1 bg-orange-500 text-white shadow-md"
                    : isAnswered
                      ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="border-t border-slate-100 px-4 py-3 space-y-1.5">
        {[
          { color: "bg-orange-500", label: "Current" },
          { color: "bg-orange-100", label: "Answered" },
          { color: "bg-slate-100", label: "Unanswered" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2 text-xs text-slate-500">
            <span className={`h-3 w-3 rounded-sm ${color}`} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Confirm Submit Dialog ─── */
const ConfirmDialog = ({ onConfirm, onCancel, answeredCount, total }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl animate-in fade-in zoom-in-95">
      <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-orange-100 mb-5">
        <AlertCircle size={28} className="text-orange-500" />
      </div>
      <h2 className="text-center text-xl font-bold text-slate-900">
        Submit Assessment?
      </h2>
      <p className="mt-2 text-center text-sm text-slate-500">
        You've answered{" "}
        <strong className="text-slate-900">{answeredCount}</strong> out of{" "}
        <strong className="text-slate-900">{total}</strong> questions.
        {answeredCount < total && (
          <span className="block mt-1 text-amber-600 font-medium">
            {total - answeredCount} question(s) unanswered.
          </span>
        )}
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          Review
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 rounded-xl bg-linear-to-r from-orange-500 to-orange-600 py-2.5 text-sm font-semibold text-white shadow shadow-orange-200 hover:from-orange-600 hover:to-orange-700 transition"
        >
          Submit Now
        </button>
      </div>
    </div>
  </div>
);

/* ─── Main Component ─── */
const TakeAssessment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { currentAssisment, loading } = useSelector((state) => state.assisment);
  const { handleGetAssisment, handleSubmitAssisment } = useAssisment();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [seconds, setSeconds] = useState(null);
  const [showNav, setShowNav] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef(null);

  const assessment = currentAssisment?.assisment || currentAssisment;
  const questions = assessment?.questionsId ?? assessment?.questions ?? [];
  const answersRef = useRef(answers);
  const questionsRef = useRef(questions);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (id) handleGetAssisment(id);
  }, [id]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  const timeLimit = (assessment?.duration ?? assessment?.timeLimit ?? 30) * 60; // in seconds

  /* Start timer once we know the time limit */
  useEffect(() => {
    if (timeLimit && seconds === null) {
      setSeconds(timeLimit);
    }
  }, [timeLimit]);

  useEffect(() => {
    if (seconds === null || seconds <= 0) return;
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 10) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [seconds === null ? null : 0]); // run once when seconds initializes
  
  // handle browser back button - auto submit if the user tries to go back
  const handleAutoSubmit = useCallback(() => {
    if (submittingRef.current) return;
    doSubmit();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const handleBack = () => {
      handleAutoSubmit();
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [handleAutoSubmit, id]);

  const doSubmit = async () => {
    if (submittingRef.current) return;

    clearInterval(timerRef.current);
    submittingRef.current = true;
    setSubmitting(true);

    const currentQuestions = questionsRef.current;
    const currentAnswers = answersRef.current;

    const formattedAnswers = currentQuestions.map((q, i) => ({
      questionId: q._id,
      selectedOption: currentAnswers[i] ?? null,
    }));

    const ok = await handleSubmitAssisment(id, { answers: formattedAnswers });
    submittingRef.current = false;
    setSubmitting(false);
    if (ok) navigate("/home");
  };

  const selectAnswer = (optionIndex) => {
    setAnswers((prev) => ({ ...prev, [current]: optionIndex }));
  };

  const goNext = () => {
    if (current < questions.length - 1) setCurrent((c) => c + 1);
    // console.log("Check for answers ", answers); //Check the Answers
    // console.log("Check for questions ", questions); // Check the questions
  };

  const goPrev = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  const initials = user?.username?.split(" ").map((w) => w[0]).join("").toUpperCase() ?? "U";
  const answeredCount = Object.keys(answers).length;
  const q = questions[current];

  if (loading && !assessment) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={40} className="animate-spin text-orange-500" />
      </div>
    );
  }

  if (!q && !loading) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-3 text-slate-500">
        <AlertCircle size={40} className="text-orange-300" />
        <p>No questions found for this assessment.</p>
      </div>
    );
  }

  const letters = ["A", "B", "C", "D"];

  return (
    <div className="flex h-screen flex-col bg-[#F9FAFB] overflow-hidden">

      {/* ─── TOP BAR ─── */}
      <header className="flex shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
        {/* Left: title + mobile nav toggle */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={() => setShowNav((v) => !v)}
            className="lg:hidden flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-orange-500 hover:bg-orange-100"
          >
            <LayoutGrid size={16} />
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900 sm:text-base">
              {assessment?.title ?? "Assessment"}
            </p>
            <p className="hidden text-xs text-slate-400 sm:block">
              {questions.length} questions
            </p>
          </div>
        </div>

        {/* Center: Timer */}
        <div className="flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-4 py-2">
          <Clock size={15} className="text-orange-400" />
          {seconds !== null ? (
            <TimerDisplay seconds={seconds} />
          ) : (
            <span className="font-mono text-sm text-slate-400">--:--</span>
          )}
        </div>

        {/* Right: User + Submit */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-orange-400 to-orange-600 text-xs font-bold text-white">
              {initials}
            </div>
            <span className="text-xs font-medium text-slate-700 max-w-25 truncate">
              {user?.username}
            </span>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1.5 rounded-xl bg-linear-to-r from-orange-500 to-orange-600 px-3 py-2 text-xs font-bold text-white shadow shadow-orange-200 hover:from-orange-600 hover:to-orange-700 transition sm:px-4"
          >
            <Send size={13} />
            <span className="hidden sm:inline">Submit</span>
          </button>
        </div>
      </header>

      {/* ─── BODY ─── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ─── SIDEBAR: Question Navigator (Desktop always visible) ─── */}
        <aside className="hidden lg:flex w-56 xl:w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
          <QuestionNav
            questions={questions}
            answers={answers}
            current={current}
            onJump={(i) => setCurrent(i)}
            isMobile={false}
          />
        </aside>

        {/* ─── MOBILE: Slide-in Nav Drawer ─── */}
        {showNav && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setShowNav(false)}
            />
            <div className="relative w-64 bg-white shadow-2xl flex flex-col">
              <QuestionNav
                questions={questions}
                answers={answers}
                current={current}
                onJump={(i) => { setCurrent(i); setShowNav(false); }}
                onClose={() => setShowNav(false)}
                isMobile
              />
            </div>
          </div>
        )}

        {/* ─── MAIN QUESTION AREA ─── */}
        <main className="flex flex-1 flex-col overflow-y-auto">
          <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-5 min-h-full">

            {/* Progress mini-bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-linear-to-r from-orange-400 to-orange-600 transition-all duration-300"
                  style={{
                    width: `${((current + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                {current + 1} / {questions.length}
              </span>
            </div>

            {/* Question Card */}
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8 flex-1">

              {/* Q label */}
              <div className="flex items-center justify-between mb-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                  Question {current + 1}
                  <span className="text-orange-400 font-normal">of {questions.length}</span>
                </span>
                {answers[current] !== undefined && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 size={12} />
                    Answered
                  </span>
                )}
              </div>

              {/* Question text */}
              <p className="text-base font-semibold leading-relaxed text-slate-900 sm:text-lg mb-6">
                {q?.questionText ?? q?.question ?? "Question text not available."}
              </p>

              {/* Options */}
              <div className="space-y-3">
                {(q?.options ?? []).map((opt, i) => (
                  <OptionButton
                    key={i}
                    letter={letters[i]}
                    text={typeof opt === "string" ? opt : opt?.text ?? opt}
                    selected={answers[current] === i}
                    onClick={() => selectAnswer(i)}
                  />
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between gap-3 pb-4">
              <button
                onClick={goPrev}
                disabled={current === 0}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="font-semibold text-orange-500">{answeredCount}</span>
                /{questions.length} answered
              </div>

              {current < questions.length - 1 ? (
                <button
                  onClick={goNext}
                  className="flex items-center gap-2 rounded-xl bg-linear-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow shadow-orange-200 transition hover:from-orange-600 hover:to-orange-700 active:scale-95"
                >
                  Save & Next
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="flex items-center gap-2 rounded-xl bg-linear-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow shadow-orange-200 transition hover:from-orange-600 hover:to-orange-700 active:scale-95"
                >
                  <Send size={14} />
                  Submit
                </button>
              )}
            </div>

          </div>
        </main>

        {/* ─── RIGHT PANEL: User Info (Desktop only) ─── */}
        <aside className="hidden xl:flex w-56 shrink-0 flex-col border-l border-slate-200 bg-white px-4 py-6 gap-4">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-orange-400 to-orange-600 text-lg font-bold text-white shadow-md">
              {initials}
            </div>
            <p className="text-sm font-semibold text-slate-900 truncate">
              {user?.username}
            </p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
              Progress
            </p>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Answered</span>
              <span className="font-bold text-orange-600">{answeredCount}/{questions.length}</span>
            </div>
            <div className="h-2 rounded-full bg-orange-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-orange-400 to-orange-600 transition-all"
                style={{ width: `${(answeredCount / (questions.length || 1)) * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-orange-500 to-orange-600 py-2.5 text-sm font-semibold text-white shadow shadow-orange-200 hover:from-orange-600 hover:to-orange-700 transition"
          >
            <Send size={14} />
            Submit All
          </button>
        </aside>

      </div>

      {/* ─── CONFIRM DIALOG ─── */}
      {showConfirm && (
        <ConfirmDialog
          answeredCount={answeredCount}
          total={questions.length}
          onConfirm={doSubmit}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* ─── SUBMITTING OVERLAY ─── */}
      {submitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={48} className="animate-spin text-orange-500" />
            <p className="text-base font-semibold text-slate-700">
              Submitting your assessment…
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default TakeAssessment;
