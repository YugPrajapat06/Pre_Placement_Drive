import React, { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useCandidate } from "../hooks/useCandidate.js";

const initialForm = {
  college: "",
  course: "",
  branch: "",
  Experience: "Fresher",
  targetCompany: "",
  targetCompanyRole: "",
};

const CandidateRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { error, loading, handleRegisterCandidate } = useCandidate();
  const [form, setForm] = useState(initialForm);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const registered = await handleRegisterCandidate(form);
    if (registered) navigate(location.state?.from || "/interview", { replace: true });
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-orange-200 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100";

  return (
    <div className="px-4 py-7 text-slate-900 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100"><UserRound size={14} /></span>
              Candidate profile
            </div>
            <h1 className="font-[Outfit] text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Let&apos;s make your practice count.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">A few details help us shape interview practice around your education, experience, and dream role.</p>
          </div>
          <div className="flex items-center gap-3 self-start rounded-2xl border border-orange-100 bg-white px-4 py-3 shadow-sm sm:self-auto">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">1</div>
            <div><p className="text-xs font-semibold text-slate-900">Profile setup</p><p className="text-xs text-slate-400">One quick step</p></div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <aside className="relative overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-xl shadow-orange-200 sm:p-8">
            <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full border-18 border-orange-500/20" />
            <div className="relative">
              <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 shadow-lg shadow-orange-500/30"><GraduationCap size={24} /></div>
              <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-300"><Sparkles size={14} /> Ready when you are</p>
              <h2 className="font-[Outfit] text-2xl font-bold tracking-tight sm:text-3xl">Your next opportunity starts with context.</h2>
              <p className="mt-4 text-sm leading-6 text-slate-300">Complete your profile to unlock focused mock interviews that match where you are headed.</p>
              <div className="mt-9 space-y-4 border-t border-white/10 pt-6">
                {["Personalized interview rounds", "Role-focused practice prompts", "Progress built around your goals"].map((item) => (
                  <p key={item} className="flex items-center gap-3 text-sm text-slate-200"><CheckCircle2 size={17} className="shrink-0 text-orange-400" />{item}</p>
                ))}
              </div>
            </div>
          </aside>

          <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-[0_20px_60px_-25px_rgba(249,115,22,0.3)] sm:p-9">
            <div className="mb-8 flex items-start gap-3 border-b border-slate-100 pb-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600"><BriefcaseBusiness size={19} /></div>
              <div><h2 className="font-[Outfit] text-2xl font-bold tracking-tight">Tell us about you</h2><p className="mt-1 text-sm text-slate-500">Everything marked with <span className="font-semibold text-orange-500">*</span> is required.</p></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7">
              <fieldset>
                <legend className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900"><GraduationCap size={17} className="text-orange-500" /> Education</legend>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-slate-700 sm:col-span-2">College / University <span className="text-orange-500">*</span><input name="college" value={form.college} onChange={handleChange} placeholder="e.g. Delhi Technological University" required className={inputClass} /></label>
                  <label className="text-sm font-semibold text-slate-700">Course <span className="text-orange-500">*</span><input name="course" value={form.course} onChange={handleChange} placeholder="e.g. B.Tech" required className={inputClass} /></label>
                  <label className="text-sm font-semibold text-slate-700">Branch / Specialization <span className="text-orange-500">*</span><input name="branch" value={form.branch} onChange={handleChange} placeholder="e.g. Computer Science" required className={inputClass} /></label>
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900"><Target size={17} className="text-orange-500" /> Career direction</legend>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-slate-700">Experience level <span className="text-orange-500">*</span><select name="Experience" value={form.Experience} onChange={handleChange} required className={inputClass}><option value="Fresher">Fresher</option><option value="Internship">Internship</option><option value="Experienced">Experienced</option></select></label>
                  <label className="text-sm font-semibold text-slate-700">Target company <span className="text-orange-500">*</span><input name="targetCompany" value={form.targetCompany} onChange={handleChange} placeholder="e.g. Microsoft" required className={inputClass} /></label>
                  <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Target role <span className="text-orange-500">*</span><input name="targetCompanyRole" value={form.targetCompanyRole} onChange={handleChange} placeholder="e.g. Frontend Developer" required className={inputClass} /></label>
                </div>
              </fieldset>

              {error && <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
              <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                {loading ? "Creating your profile..." : "Continue to Interview Prep"}
              </button>
              <p className="text-center text-xs text-slate-400">Your profile details are used to personalize your preparation.</p>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CandidateRegister;