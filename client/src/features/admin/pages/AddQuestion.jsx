import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useAssisment } from "../../assissment/hooks/useAssisment.js";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Loader2,
  Sparkles,
  Layers,
  ChevronRight,
  Eye,
} from "lucide-react";

const AddQuestion = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { handleAddQuestion } = useAssisment();

  // Form State
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctOption, setCorrectOption] = useState(0); // 0 to 3
  const [category, setCategory] = useState("Technical");
  const [difficulty, setDifficulty] = useState("Easy");
  const [explaination, setExplaination] = useState("");

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Guard: Only allow admin users
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    
    // Validation
    if (!question.trim()) return setErrorMsg("Question text is required.");
    if (!optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) {
      return setErrorMsg("All 4 options are required.");
    }
    if (!explaination.trim()) return setErrorMsg("Explanation text is required.");
    
    const payload = {
      question: question.trim(),
      options: [optionA.trim(), optionB.trim(), optionC.trim(), optionD.trim()],
      correctOption: Number(correctOption),
      category,
      difficulty,
      explaination: explaination.trim(),
    };
    

    setSubmitting(true);
    const success = await handleAddQuestion(payload);
    setSubmitting(false);

    if (success) {
      setSuccessMsg("Question added successfully to the database!");
      // Reset form
      setQuestion("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setOptionD("");
      setCorrectOption(0);
      setExplaination("");
      // Navigate back after a short delay
      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } else {
      setErrorMsg("Failed to add question. Please check fields or database connection.");
    }
  };
  useEffect(() => {
    setCorrectOption(0)
  },[])
  // Pre-calculated display helper variables for the Live Preview Pane
  const previewOptions = [
    optionA || "Option A text...",
    optionB || "Option B text...",
    optionC || "Option C text...",
    optionD || "Option D text...",
  ];

  let diffBadgeColor = "";
  if (difficulty === "Easy") diffBadgeColor = "bg-emerald-50 text-emerald-600";
  else if (difficulty === "Medium") diffBadgeColor = "bg-amber-50 text-amber-600";
  else if (difficulty === "Hard") diffBadgeColor = "bg-rose-50 text-rose-600";

  let catBadgeColor = "";
  if (category === "Technical") catBadgeColor = "bg-blue-50 text-blue-600";
  else if (category === "Aptitude") catBadgeColor = "bg-orange-50 text-orange-600";
  else if (category === "Reasoning") catBadgeColor = "bg-purple-50 text-purple-600";
  else if (category === "Verbal") catBadgeColor = "bg-teal-50 text-teal-600";

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="mx-auto max-w-6xl space-y-6">
        
        {/* ── Page Navigation/Breadcrumbs ── */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span
            className="cursor-pointer hover:text-orange-500 transition"
            onClick={() => navigate("/admin")}
          >
            Admin Panel
          </span>
          <ChevronRight size={14} />
          <span className="font-medium text-slate-900">Add Question</span>
        </div>

        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-orange-100/50 pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin")}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-orange-500 active:scale-95"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                Create Question
              </h1>
              <p className="text-xs text-slate-500">
                Populate assessment database with multiple-choice questions.
              </p>
            </div>
          </div>
        </div>

        {/* ── Success and Error Messages ── */}
        {successMsg && (
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 animate-fadeIn">
            <CheckCircle size={20} className="shrink-0 text-emerald-600 animate-pulse" />
            <p className="text-sm font-semibold">{successMsg}</p>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-rose-800 animate-fadeIn">
            <AlertTriangle size={20} className="shrink-0 text-rose-600" />
            <p className="text-sm font-semibold">{errorMsg}</p>
          </div>
        )}

        {/* ── Main Layout: Form and Live Preview ── */}
        <div className="grid gap-8 lg:grid-cols-5">
          
          {/* ── Question Form (Left Column, 3/5 width) ── */}
          <div className="lg:col-span-3 rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen size={18} className="text-orange-500" />
              Question Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Question Text */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Question Content *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Enter the question statement..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-900 transition focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Options Section */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700">Options & Correct Selection *</label>
                
                {/* Option A */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCorrectOption(0)}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold transition-all ${
                      correctOption === 0
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-100"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    A
                  </button>
                  <input
                    type="text"
                    required
                    placeholder="Option A text..."
                    value={optionA}
                    onChange={(e) => setOptionA(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 transition focus:border-orange-500 focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Option B */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCorrectOption(1)}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold transition-all ${
                      correctOption === 1
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-100"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    B
                  </button>
                  <input
                    type="text"
                    required
                    placeholder="Option B text..."
                    value={optionB}
                    onChange={(e) => setOptionB(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 transition focus:border-orange-500 focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Option C */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCorrectOption(2)}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold transition-all ${
                      correctOption === 2
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-100"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    C
                  </button>
                  <input
                    type="text"
                    required
                    placeholder="Option C text..."
                    value={optionC}
                    onChange={(e) => setOptionC(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 transition focus:border-orange-500 focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Option D */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCorrectOption(3)}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold transition-all ${
                      correctOption === 3
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-100"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    D
                  </button>
                  <input
                    type="text"
                    required
                    placeholder="Option D text..."
                    value={optionD}
                    onChange={(e) => setOptionD(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 transition focus:border-orange-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-medium pl-12">
                  * Click on the circle A, B, C, or D button to designate the correct answer.
                </p>
              </div>

              {/* Category and Difficulty Row */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Aptitude">Aptitude</option>
                    <option value="Reasoning">Reasoning</option>
                    <option value="Verbal">Verbal</option>
                  </select>
                </div>

                {/* Difficulty */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Difficulty *</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Explanation (spelled explaination to match schema) */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Explanation *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Explain why the designated option is correct..."
                  value={explaination}
                  onChange={(e) => setExplaination(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-900 transition focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-linear-to-br from-orange-500 to-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-100 transition hover:from-orange-600 hover:to-orange-700 active:scale-98 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:shadow-none"
                >
                  {submitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Sparkles size={16} />
                  )}
                  {submitting ? "Adding..." : "Add to Database"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/admin")}
                  className="rounded-2xl border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 active:scale-98"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* ── Student Live Preview (Right Column, 2/5 width) ── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-3xl border border-orange-100 bg-linear-to-br from-orange-50/40 to-amber-50/40 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider mb-4">
                <Eye size={16} className="text-orange-500 animate-pulse" />
                Live Assessment Preview
              </h2>
              
              {/* Assessment Question Card Mock */}
              <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-md space-y-4">
                {/* Header tags */}
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${catBadgeColor}`}>
                    {category}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${diffBadgeColor}`}>
                    {difficulty}
                  </span>
                </div>

                {/* Question body */}
                <h3 className="text-sm font-bold text-slate-800 leading-snug">
                  {question || "Drafting question content..."}
                </h3>

                {/* Options List */}
                <div className="space-y-2">
                  {previewOptions.map((opt, oIdx) => {
                    const isSelected = correctOption === oIdx;
                    return (
                      <div
                        key={oIdx}
                        className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-xs transition duration-200 ${
                          isSelected
                            ? "border-orange-500 bg-orange-50/20 text-orange-850"
                            : "border-slate-100 bg-slate-50/30 text-slate-600"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                            isSelected
                              ? "bg-orange-500 text-white"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="font-semibold">{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation text */}
                <div className="rounded-xl bg-orange-50/30 border border-orange-100/50 p-3">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-orange-500 mb-0.5">
                    Explanation Card
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {explaination || "Drafting explanation of why correctOption is chosen..."}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 leading-relaxed pl-1">
                <Layers size={14} className="mt-0.5 shrink-0 text-slate-400" />
                <span>
                  This preview renders the actual layout and styles that students see during the live pre-placement assessments.
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddQuestion;
