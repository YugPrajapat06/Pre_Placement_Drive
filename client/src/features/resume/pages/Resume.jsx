import { FileText, ShieldCheck, Star, Trash2, Upload, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useResume } from '../hooks/useResume';
import { useSelector } from 'react-redux';
import { useCandidate } from '../../Interview/hooks/useCandidate.js';

const Resume = () => {

    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [resumeName, setResumeName] = useState('');
    const [isDefault, setIsDefault] = useState(true);
    // const [resumes, setResumes] = useState([]);


    const { handleUploadResume, handleGetResume, handleGetActiveResume } = useResume();
    const { handleGetCandidateProfile, handleUpdateActiveResume } = useCandidate();

    useEffect(() => {
        handleGetResume();
        handleGetCandidateProfile()

    }, [])

    const { resume } = useSelector((state) => state.resume)
    const { profile } = useSelector((state) => state.candidate)


    const activeResumeId = profile?.activeResumeId?.toString?.() || profile?.activeResumeId;


    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            setFile(selectedFile);
            setResumeName(selectedFile.name.replace(/\.pdf$/i, ''));
        }
    };

    const handleSaveResume = async (event) => {
        event.preventDefault();

        if (!file || !resumeName.trim()) return;

        const response = await handleUploadResume(file, resumeName.trim(), isDefault);
        if (response.success) {
            if (isDefault && profile && response.resume?._id) {
                await handleUpdateActiveResume(response.resume._id);
            }
            await Promise.all([handleGetResume(), handleGetCandidateProfile()]);
        }

        setFile(null);
        setResumeName('');
        setIsDefault(false);
        fileInputRef.current.value = '';
    };

    const handleMakeDefault = async (resumeId) => {
        if (String(resumeId) === String(activeResumeId)) return;
        const res = await handleUpdateActiveResume(resumeId);
        console.log('Check Res of handleUpdataActiveResume : ', res);
        console.log('Profile Check :', profile);

    };

    // const handleRemoveResume = (id) => {
    //     setResumes((currentResumes) => currentResumes.filter((resume) => resume.id !== id));
    // };

    return (
        <main className='min-h-screen w-full bg-slate-50 p-4 text-slate-900 sm:p-6 sm:px-8 lg:px-10'>
            <header className='flex flex-col gap-5 border-b border-slate-300 py-4 sm:flex-row sm:items-end sm:justify-between'>
                <div>
                    <p className='mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary'>Career toolkit</p>
                    <h1 className='font-display text-3xl font-bold tracking-tight'>My resumes</h1>
                    <p className='mt-1 max-w-xl text-sm text-slate-500'>Keep tailored versions ready for every opportunity.</p>
                </div>
                <button type='button' onClick={() => fileInputRef.current.click()} className='neu-button inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-slate-800 transition hover:text-primary sm:w-auto'><Upload size={17} />{file ? 'Choose another file' : 'Upload resume'}</button>
                <div className='hidden'>
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
            </header>

            <section className='mx-auto max-w-6xl py-8'>
                <div>
                    <div className='mb-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end'>
                        <div>
                            <h2 className='font-display text-xl font-bold'>Your resume library</h2>
                            <p className='mt-1 text-sm text-slate-500'>{resume.length ? `${resume.length} saved resume${resume.length === 1 ? '' : 's'}` : 'No resumes saved yet'}</p>
                        </div>
                        {resume.length > 0 && <span className='rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-primary'>PDF only</span>}
                    </div>

                    {resume.length === 0 ? (
                        <button type='button' onClick={() => fileInputRef.current.click()} className='group flex min-h-64 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white/50 px-6 text-center transition hover:border-primary hover:bg-orange-50/40'>
                            <span className='mb-4 grid size-14 place-items-center rounded-2xl bg-orange-100 text-primary transition group-hover:scale-105'><FileText size={27} /></span>
                            <span className='font-display text-lg font-bold'>Start with a resume</span>
                            <span className='mt-1 text-sm text-slate-500'>Upload a PDF and give it a name you will recognize.</span>
                        </button>
                    ) : (
                        <div className='space-y-4'>
                            {resume.map((resume) => (
                                <article key={resume._id} className={`neu-card border border-black/50 ${String(resume._id) == String(activeResumeId) ? 'border-emerald-400 ' : ''} flex flex-col md:flex-row lg:flex-row justify-between items-stretch gap-1 md:gap-3 lg:gap-4 p-4  sm:p-5`}>
                                    <div className='flex justify-center items-center gap-2'>
                                        <span className='grid size-12 shrink-0 place-items-center rounded-xl bg-orange-100 text-primary'><FileText size={22} /></span>
                                        <div className='min-w-0 flex-1'>
                                            <div className='flex flex-wrap items-center gap-2'>
                                                <h3 className='truncate text-sm font-display font-bold'>{resume.name}</h3>
                                                {String(resume._id) === String(activeResumeId) ? <span className='inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary'><Star size={11} fill='currentColor' /> Default</span> : ''}
                                            </div>
                                            <p className='mt-1 truncate text-xs text-slate-500'>{resume.fileName}</p>
                                        </div>
                                    </div>
                                    <div className='flex items-center justify-end gap-2 sm:shrink-0'>
                                        {String(resume._id) !== String(activeResumeId) && <button type='button' onClick={() => {
                                            handleMakeDefault(resume._id)
                                            handleGetActiveResume(resume._id)
                                        }} className='rounded-lg px-3 py-2 text-xs font-bold text-primary transition hover:bg-orange-50'>Make default</button>}
                                        <button type='button' aria-label={`Delete ${resume.name}`} className='rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500'><Trash2 size={17} /></button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>

                {file && (
                    <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-4 backdrop-blur-[2px] sm:p-6'>
                        <form onSubmit={handleSaveResume} className='neu-card max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto bg-white p-5 sm:max-h-[calc(100vh-3rem)] sm:p-6'>
                            <div className='mb-6 flex items-start justify-between gap-4'>
                                <div><p className='text-xs font-bold uppercase tracking-[0.16em] text-primary'>New upload</p><h2 className='mt-1 font-display text-xl font-bold'>Save your resume</h2></div>
                                <button type='button' onClick={() => { setFile(null); setResumeName(''); }} aria-label='Cancel upload' className='rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700'><X size={18} /></button>
                            </div>
                            <div className='mb-5 flex items-center gap-3 rounded-xl bg-slate-50 p-3'><FileText className='shrink-0 text-primary' size={20} /><p className='truncate text-sm font-semibold text-slate-700'>{file.name}</p></div>
                            <label className='block text-sm font-bold text-slate-700' htmlFor='resume-name'>Resume name</label>
                            <input id='resume-name' value={resumeName} onChange={(event) => setResumeName(event.target.value)} placeholder='e.g. Frontend Developer 2026' className='neu-input mt-2 w-full rounded-xl px-4 py-3 text-sm text-slate-800' required />
                            <label className='mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-orange-200'><input type='checkbox' checked={isDefault} onChange={(event) => setIsDefault(event.target.checked)} className='neu-checkbox mt-0.5 shrink-0' /><span><span className='block text-sm font-bold text-slate-700'>Make this my default resume</span><span className='mt-0.5 block text-xs leading-relaxed text-slate-500'>Use it automatically when a resume is requested.</span></span></label>
                            <button type='submit' className='mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700 active:scale-[0.98]'><ShieldCheck size={17} /> Save resume</button>
                        </form>
                    </div>
                )}
            </section>
        </main>
    )
}

export default Resume
