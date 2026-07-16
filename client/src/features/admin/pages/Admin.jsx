import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import {
  Plus,
  Search,
  Trash2,
  BookOpen,
  Award,
  HelpCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  FolderLock,
  Layers,
  Sparkles,
} from "lucide-react";
import { useAdmin } from "../hooks/useAdmin.js";

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { questions: adminQuestions } = useSelector((state) => state.admin)
  const { handleGetAllQuestions } = useAdmin()

  const [allQuestions, setAllQuestions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Guard: Only allow admin users
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/home");
    }
  }, [user, navigate]);

  useEffect(() => {
    const list = Array.isArray(adminQuestions) ? adminQuestions : adminQuestions?.questions || [];
    setAllQuestions(list);
  }, [adminQuestions]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const data = await handleGetAllQuestions();
      if (data?.questions) {
        setAllQuestions(data.questions);
      }
    };

    fetchQuestions();
  }, []);


  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      setAllQuestions((prevQuestions) => prevQuestions.filter((q) => q._id !== id));
      setAlertMessage("Question deleted successfully (UI Simulation)");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const toggleExpand = (id) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  // Filter logic
  const filteredQuestions = allQuestions.filter((q) => {
    const matchesSearch = q.question.toLowerCase().includes(searchText.toLowerCase()) ||
      q.explaination.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === "All" || q.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All" || q.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Calculate statistics
  const totalCount = allQuestions.length;
  const technicalCount = allQuestions.filter((q) => q.category === "Technical").length;
  const aptitudeCount = allQuestions.filter((q) => q.category === "Aptitude").length;
  const reasoningCount = allQuestions.filter((q) => q.category === "Reasoning").length;
  const verbalCount = allQuestions.filter((q) => q.category === "Verbal").length;

  const easyCount = allQuestions.filter((q) => q.difficulty === "Easy").length;
  const mediumCount = allQuestions.filter((q) => q.difficulty === "Medium").length;
  const hardCount = allQuestions.filter((q) => q.difficulty === "Hard").length;

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* ── Toast Alert ── */}
        {showAlert && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-white shadow-xl animate-bounce">
            <CheckCircle size={18} />
            <span className="text-sm font-semibold">{alertMessage}</span>
          </div>
        )}

        {/* ── Page Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-orange-100/55 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <FolderLock size={16} />
              </span>
              <p className="text-xs font-semibold uppercase tracking-widest text-orange-500">
                Admin Panel
              </p>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1 font-display">
              Manage Assessments
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Create, view, and organize placement questions and assessment banks.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/add-question")}
            className="flex z-20 items-center justify-center gap-2 rounded-2xl bg-linear-to-br from-orange-500 to-orange-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:from-orange-600 hover:to-orange-700 active:scale-98"
          >
            <Plus size={18} />
            Add New Question
          </button>
        </div>

        {/* ── Dashboard Stats Row ── */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {/* Total */}
          <div className="rounded-3xl border border-slate-100 bg-[linear-gradient(135deg,#0EA5E9,#38BDF8,#7DD3FC)] before:absolute before:inset-0 before:bg-[repeating-linear-gradient(-45deg,transparent,transparent_12px,rgba(255,255,255,.10)_12px,rgba(255,255,255,.10)_24px)] before:content-['']  p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <BookOpen size={18} />
              </div>
              <p className="text-sm font-semibold text-white mt-4">Total Questions</p>
            </div>
            <p className="text-3xl font-bold text-white mt-1 font-display">{totalCount}</p>
          </div>

          {/* Technical */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                <Layers size={18} />
              </div>
              <p className="text-sm font-semibold text-slate-500 mt-4">Technical</p>
            </div>
            <p className="text-3xl font-bold text-slate-950 mt-1 font-display">{technicalCount}</p>
          </div>

          {/* Aptitude */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500 animate-pulse">
                <Sparkles size={18} />
              </div>
              <p className="text-sm font-semibold text-slate-500 mt-4">Aptitude</p>
            </div>
            <p className="text-3xl font-bold text-slate-950 mt-1 font-display">{aptitudeCount}</p>
          </div>

          {/* Reasoning */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-500">
                <Award size={18} />
              </div>
              <p className="text-sm font-semibold text-slate-500 mt-4">Reasoning</p>
            </div>
            <p className="text-3xl font-bold text-slate-950 mt-1 font-display">{reasoningCount}</p>
          </div>

          {/* Verbal */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                <HelpCircle size={18} />
              </div>
              <p className="text-sm font-semibold text-slate-500 mt-4">Verbal</p>
            </div>
            <p className="text-3xl font-bold text-slate-950 mt-1 font-display">{verbalCount}</p>
          </div>
        </div>

        {/* ── Filter Controls Panel ── */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <SlidersHorizontal size={16} className="text-orange-500" />
            <span>Filters</span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search question content or explanation..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm text-slate-900 transition focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase shrink-0">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full z-20 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100"
              >
                <option value="All">All Categories</option>
                <option value="Aptitude">Aptitude</option>
                <option value="Reasoning">Reasoning</option>
                <option value="Verbal">Verbal</option>
                <option value="Technical">Technical</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase shrink-0">Difficulty:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full z-20 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Questions Table / list ── */}
        <div className="rounded-3xl border border-slate-100 bg-white overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Questions ({filteredQuestions.length})
            </h2>
            <span className="text-xs font-medium text-slate-400">
              Showing filtered results
            </span>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="p-12 text-center">
              <HelpCircle size={40} className="mx-auto text-slate-300 animate-pulse" />
              <p className="mt-4 text-base font-semibold text-slate-600">No questions found</p>
              <p className="mt-1 text-sm text-slate-400">
                Try adjusting your search criteria or add a new question to get started.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredQuestions.map((q, idx) => {
                const isExpanded = expandedQuestionId === q._id;

                // Difficulty Badge color mapping
                let diffBadgeColor = "";
                if (q.difficulty === "Easy") diffBadgeColor = "bg-emerald-50 text-emerald-600";
                else if (q.difficulty === "Medium") diffBadgeColor = "bg-amber-50 text-amber-600";
                else if (q.difficulty === "Hard") diffBadgeColor = "bg-rose-50 text-rose-600";

                // Category Badge color mapping
                let catBadgeColor = "";
                if (q.category === "Technical") catBadgeColor = "bg-blue-50 text-blue-600";
                else if (q.category === "Aptitude") catBadgeColor = "bg-orange-50 text-orange-600";
                else if (q.category === "Reasoning") catBadgeColor = "bg-purple-50 text-purple-600";
                else if (q.category === "Verbal") catBadgeColor = "bg-teal-50 text-teal-600";

                return (
                  <div
                    key={q._id}
                    className="p-6 transition hover:bg-slate-50/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${catBadgeColor}`}>
                            {q.category}
                          </span>
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${diffBadgeColor}`}>
                            {q.difficulty}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 leading-snug">
                          {q.question}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => toggleExpand(q._id)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition hover:bg-orange-50 hover:text-orange-500 active:scale-95"
                          title="Expand options and explanation"
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <button
                          onClick={() => handleDelete(q._id)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 active:scale-95"
                          title="Delete question"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Panel */}
                    {isExpanded && (
                      <div className="mt-4 pl-0 sm:pl-4 space-y-4 border-t border-dashed border-slate-200/80 pt-4">
                        {/* Options Grid */}
                        <div className="grid gap-3 sm:grid-cols-2">
                          {q.options.map((opt, oIdx) => {
                            const isCorrect = q.correctOption === oIdx;
                            return (
                              <div
                                key={oIdx}
                                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${isCorrect
                                  ? "border-emerald-200 bg-emerald-50/50 text-emerald-800"
                                  : "border-slate-100 bg-slate-50/30 text-slate-600"
                                  }`}
                              >
                                <span
                                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isCorrect
                                    ? "bg-emerald-500 text-white"
                                    : "bg-slate-200 text-slate-500"
                                    }`}
                                >
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span className="font-medium">{opt}</span>
                                {isCorrect && (
                                  <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                                    Correct
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation block */}
                        <div className="rounded-2xl bg-orange-50/30 border border-orange-100/50 p-4">
                          <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">
                            Explanation
                          </p>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {q.explaination}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Admin;
