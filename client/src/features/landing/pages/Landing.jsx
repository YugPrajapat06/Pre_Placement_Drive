import React, { useEffect } from 'react'
import DemoCircles from '../components/Usage'
import { useNavigate } from "react-router"
import { ArrowRight, BarChart3, BookMarked, Clock3, ShieldCheck, Sparkles, Target, Users } from 'lucide-react'
import {useAuth} from "../../auth/hooks/useAuth.js"
import { useSelector } from 'react-redux'

const Landing = () => {
    const navigate = useNavigate()
    const featureCards = [
        {
            title: 'Timed Practice Tests',
            description: 'Sharpen your speed and confidence with real placement-style mock rounds.',
            icon: Clock3,
        },
        {
            title: 'Skill-Based Categories',
            description: 'Prepare through aptitude, reasoning, verbal ability, and technical topics.',
            icon: Target,
        },
        {
            title: 'Progress Insights',
            description: 'Track improvement and stay ahead with clear performance feedback.',
            icon: BarChart3,
        },
    ]
    const { handleGetMe } = useAuth()
    const {user} = useSelector(state => state.auth)

    useEffect(()=>{
        handleGetMe()
        if(user){
            navigate('/home')
            
        }
    },[])

    return (
        <div className='min-h-screen w-full bg-[linear-gradient(135deg,#fff7ed_0%,#fffaf5_100%)] p-4 sm:p-6 lg:p-8'>
            <div className='relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col overflow-hidden rounded-4xl border border-orange-100 bg-white/80 shadow-[0_30px_80px_rgba(15,23,42,0.16)] backdrop-blur-xl'>
                <div className=' relative h-screen w-full'>
                    <DemoCircles />
                    <div className='absolute top-0 h-full w-full flex flex-col  items-start justify-start'>
                        <div className='max-h-full bg-white/30 backdrop-blur w-full p-6 sm:p-8 lg:p-10 flex justify-between items-start'>
                            <div className='flex gap-1 h-20 '>
                                <img className='h-full' src="icon.png" alt="" />
                                <div className='flex flex-col'>
                                    <p className='text-[10px] font-semibold uppercase tracking-[0.35em] text-orange-500'>Placement Platform</p>
                                    <h1 className='text-5xl font-bold text-black'>Pre Placement <span className='text-orange-500'>Drive</span></h1>
                                    <p className='text-[12px] font-semibold text-olive-900 tracking-[0.25em] uppercase'>:: Your path to success starts here</p>
                                </div>
                            </div>
                            <div className='flex flex-col '>
                                <button onClick={() => {
                                    navigate("/register")
                                }} className='px-6 py-2 bg-white rounded active:scale-95 border-2 border-black/20'>Signup Now</button>
                                <button className='text-[12px] font-semibold text-red-500' onClick={() => {
                                    navigate("/login")
                                }}>SIGN IN <span className='text-black'>IF ALREADY REGISTER</span></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='h-2 w-full bg-amber-400'></div>
                <div className='relative z-10 flex flex-1 flex-col justify-between p-6 sm:p-8 lg:p-10'>
                    <header className='flex flex-wrap items-center justify-between gap-4'>
                        <div className='flex items-center gap-3'>
                            <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-200'>
                                <BookMarked className='h-6 w-6' />
                            </div>
                            <div>
                                <p className='text-[10px] font-semibold uppercase tracking-[0.35em] text-orange-500'>Placement Platform</p>
                                <h1 className='text-2xl font-bold text-slate-900'>Pre Placement <span className='text-orange-500'>Drive</span></h1>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                navigate('/login')
                            }}
                            className='rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:text-orange-600'>Login</button>
                    </header>

                    <main className='grid flex-1 gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center'>
                        <section className='max-w-2xl'>
                            <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700'>
                                <Sparkles className='h-4 w-4' />
                                Smart preparation for placement season
                            </div>

                            <h2 className='text-4xl font-bold leading-tight text-slate-900 sm:text-5xl'>Prepare smarter and perform better in every round.</h2>
                            <p className='mt-4 text-lg leading-8 text-slate-600'>Pre Placement Drive helps students practice targeted assessments in aptitude, reasoning, verbal ability, and technical topics while offering admins a simple way to manage exams and track results.</p>

                            <div className='mt-8 flex flex-wrap gap-4'>
                                <button className='inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-600'>
                                    Start preparing
                                    <ArrowRight className='h-4 w-4' />
                                </button>
                                <button className='rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600'>Explore assessments</button>
                            </div>

                            <div className='mt-8 grid gap-4 sm:grid-cols-3'>
                                <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                                    <p className='text-2xl font-bold text-slate-900'>4+</p>
                                    <p className='mt-1 text-sm text-slate-600'>Skill tracks</p>
                                </div>
                                <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                                    <p className='text-2xl font-bold text-slate-900'>Timed</p>
                                    <p className='mt-1 text-sm text-slate-600'>Mock rounds</p>
                                </div>
                                <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                                    <p className='text-2xl font-bold text-slate-900'>Live</p>
                                    <p className='mt-1 text-sm text-slate-600'>Progress view</p>
                                </div>
                            </div>
                        </section>

                        <section className='space-y-4'>
                            <div className='border border-slate-200 bg-white p-4 shadow-sm'>
                                <h2 className='text-xl uppercase tracking-wide text-orange-700 font-semibold'>Developer Profile</h2>
                                <div className='flex flex-col justify-center items-center p-6'>
                                    <div className='h-30 w-30 rounded-full overflow-hidden'>
                                        <img className='h-full w-full object-fill' src="profile.png" alt="" />
                                    </div>
                                </div>
                                <div className='rounded-[1.75rem] border text-center border-slate-200 bg-linear-to-br from-slate-950 via-slate-900 to-orange-600 p-6 text-white shadow-2xl shadow-slate-300'>
                                    <h1 className='font-semibold'>YUGVENDRA PRAJAPAT, <span className='text-teal-500'>MERN STACK DEVELOPER</span></h1>
                                </div>
                                <p className='mt-2'>I am YUGVENDRA PRAJAPAT, Currently i am in 4th year of my collage. I am student of SIRT College Bhopal which is affilated with RGPV University, Bhopal.</p>
                                <p className='text-orange-600 text-sm mt-2'>yugprajapat6@gmail.com</p>
                            </div>

                            <div className='grid gap-4 sm:grid-cols-2'>
                                <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
                                    <div className='flex items-center gap-2 text-orange-500'>
                                        <Users className='h-4 w-4' />
                                        <span className='text-sm font-semibold'>Student friendly</span>
                                    </div>
                                    <p className='mt-2 text-sm text-slate-600'>Easy to follow tests and a calm preparation experience.</p>
                                </div>
                                <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
                                    <div className='flex items-center gap-2 text-orange-500'>
                                        <ShieldCheck className='h-4 w-4' />
                                        <span className='text-sm font-semibold'>Admin ready</span>
                                    </div>
                                    <p className='mt-2 text-sm text-slate-600'>Manage assessments and review performance in one place.</p>
                                </div>
                            </div>
                        </section>
                    </main>

                    <footer className='flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm text-slate-500'>
                        <p>Built for students preparing for the next big opportunity.</p>
                        <div className='flex flex-wrap gap-3'>
                            <span className='rounded-full bg-slate-100 px-3 py-1'>Aptitude</span>
                            <span className='rounded-full bg-slate-100 px-3 py-1'>Reasoning</span>
                            <span className='rounded-full bg-slate-100 px-3 py-1'>Verbal</span>
                            <span className='rounded-full bg-slate-100 px-3 py-1'>Technical</span>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    )
}

export default Landing