import React, { useEffect, useRef, useState } from "react";
import FluxVortex from "../components/AnimationComponent";
import { ChevronsDown, ChevronsUp, SquareArrowOutUpRight } from "lucide-react";
import gsap from "gsap";
import { useSelector } from "react-redux";
import { useInterview } from "../hooks/useInterview";
import { useReactMediaRecorder } from 'react-media-recorder'


const Mock_Interview = () => {
    const cursorRef = useRef(null);
    const loaderRef = useRef(null);
    const loadingSliderRef = useRef(null);


    /**
     * States
     */
    const [countdown, setCountdown] = useState(4)
    const [startCount, setStartCount] = useState(false)
    const [openDeshboard, setOpenDeshboard] = useState(false)

    /**
     * Hooks
     */
    const { handleStartInterviewSession, handleEndInterviewSession, handleAskQuestion, handleSubmitAnswer } = useInterview()
    const { startRecording, stopRecording, mediaBlobUrl, status } = useReactMediaRecorder({ audio: true })

    // Selectors 
    const interview = useSelector((state) => state.interview)

    useEffect(() => {
        const loader = loaderRef.current;
        const slider = loadingSliderRef.current;

        if (!loader || !slider) return;

        const tl = gsap.timeline();

        // Initial position
        tl.set(slider, {
            x: -80,
        });

        // Loading slider
        tl.to(slider, {
            x: 200,
            duration: 1,
            repeat: -1,
            ease: "power4.inOut",
        });

        // Loader fade-out
        const loaderFade = gsap.to(loader, {
            opacity: 0,
            duration: 1,
            delay: 1,
            ease: "power2.out",
            onComplete: () => {
                loader.style.display = "none";
            },
        });

        return () => {
            tl.kill();
            loaderFade.kill();
        };
    }, []);

    useEffect(() => {
        const tl = gsap.timeline();

        tl.set('.loading-slider', {
            x: -100,
        }).to('.loading-slider', {
            x: 200,
            duration: 1,
            repeat: -1,
            ease: "power4.inOut"
        })

        return () => {
            tl.kill();
        }
    }, [interview.loading]);

    useEffect(() => {
        const moveCursor = (e) => {
            if (cursorRef.current) {
                cursorRef.current.style.transform =
                    `translate(${e.clientX - 32}px, ${e.clientY - 32}px)`;
            }
        };

        window.addEventListener(
            "mousemove",
            moveCursor
        );

        return () => {
            window.removeEventListener(
                "mousemove",
                moveCursor
            );
        };
    }, []);

    useEffect(() => {
        speakQuestion(interview.currentQuestion?.question || "Hey, Are you ready to start the interview?");
    }, [interview.currentQuestion])

    useEffect(() => {
        const tl = gsap.timeline();

        tl.to('.counterAnimation', {
            fontSize: 20,
            duration: 1,
            ease: "power2.out",
            repeat: -1,
        })
    }, [startCount])

    /**
     * Callback Functions
     */

    const startInterview = async (interviewSessionId) => {
        const session = await handleStartInterviewSession(interviewSessionId)
        askQuestion(session._id)
    }

    const askQuestion = async (interviewSessionId) => {
        const question = await handleAskQuestion(interviewSessionId)
    }
    const speakQuestion = (text) => {

        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(text);

            utterance.lang = "en-US";
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 1;

            utterance.onstart = () => {
                console.log("Speech started");
            };


            utterance.onend = () => {
                console.log("Speech ended");

                if (!interview.isActive) return;

                setCountdown(4);
                setStartCount(true);

                const interval = setInterval(() => {
                    setCountdown(prev => {
                        if (prev <= 1) {
                            clearInterval(interval);

                            setTimeout(() => {
                                setStartCount(false);
                                startRecordingFnc();
                            }, 200);

                            return 0;
                        }

                        return prev - 1;
                    });
                }, 1000);
            };

            utterance.onerror = (event) => {
                console.log("Speech error:", event);
            };

            window.speechSynthesis.speak(utterance);
        }, 1000)
    };

    const startRecordingFnc = () => {
        startRecording();
    }

    const stopRecordingFnc = async () => {
        stopRecording();

    }

    useEffect(() => {
        if (!mediaBlobUrl) return;

        const submitRecordedAnswer = async () => {
            const blob = await fetch(mediaBlobUrl).then(res => res.blob());

            console.log("Recorded Blob:", blob);
            console.log("Blob type:", blob.type);
            console.log("Blob size:", blob.size);

            const formData = new FormData();

            formData.append(
                "answerAudio",
                blob,
                "candidate-answer.webm"
            );

            const question = await handleSubmitAnswer(
                interview.session?._id,
                interview.currentQuestion?._id,
                formData
            );

            if (
                question &&
                interview.session.maxQuestion > interview.questionNo
            ) {
                askQuestion(interview.session?._id);
            }
        };

        submitRecordedAnswer();
    }, [mediaBlobUrl]);

    return (
        <main className="relative h-screen w-full overflow-hidden bg-black p-10 text-white">
            <FluxVortex />
            {/* -----------------------------------------------------------------
                Loader
                Now controlled by Mock_Interview instead of FluxVortex
            ------------------------------------------------------------------ */}
            <div
                ref={loaderRef}
                className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]"
            >
                <div className="flex flex-col items-center gap-4">
                    {/* Loading Line */}
                    <div className="relative h-px w-24 overflow-hidden bg-neutral-800">
                        <div
                            ref={loadingSliderRef}
                            className="absolute inset-y-0 left-0 w-full -translate-x-full bg-white"
                        />
                    </div>

                    {/* Loading Text */}
                    <p className="text-xs font-light uppercase tracking-[0.2em] text-neutral-500">
                        Booting Sequence
                    </p>
                </div>
            </div>
            {/* Error Area */}
            { interview.error && <div className="absolute pointer-events-none top-10 left-1/2 -translate-x-1/2 bg-red-500 text-white border rounded-4xl border-white/50">
                {interview.error}
            </div>}

            {/* Display Area */}
            { interview.questionAnalysis && <div className={`absolute top-0 left-1/2 z-30 -translate-x-1/2 ${openDeshboard ? 'h-3/4' : 'h-20'} w-3/5 transition-all duration-150 flex flex-col gap-4 px-4 py-3 justify-center items-center bg-white/10 backdrop-blur-xl border-white/40 border-b rounded-b-2xl`}>
                <div className="flex gap-4 justify-center items-center">
                    <p className="text-md font-semibold flex flex-col justify-center items-center gap-1 "> Score <div className="gap-1 flex">
                        {Array.from({ length: 10 }, (_, index) => {
                            return <div className={`h-2 w-2 border border-white/30 rounded-full ${index < interview.questionAnalysis?.score ? "bg-green-600 border-0" : "bg-transparent"}`}></div>
                        })}
                    </div> </p>
                    <p className="text-md font-semibold flex flex-col justify-center items-center gap-1 "> Relevance <div className="gap-1 flex">
                        {Array.from({ length: 10 }, (_, index) => {
                            return <div className={`h-2 w-2 border border-white/30 rounded-full ${index < interview.questionAnalysis?.score ? "bg-green-600 border-0" : "bg-transparent"}`}></div>
                        })}
                    </div> </p>
                    <p className="text-md font-semibold flex flex-col justify-center items-center gap-1 "> Technical Accuracy <div className="gap-1 flex">
                        {Array.from({ length: 10 }, (_, index) => {
                            return <div className={`h-2 w-2 border border-white/30 rounded-full ${index < interview.questionAnalysis?.score ? "bg-green-600 border-0" : "bg-transparent"}`}></div>
                        })}
                    </div> </p>
                    <p className="text-md font-semibold flex flex-col justify-center items-center gap-1 "> Completeness <div className="gap-1 flex">
                        {Array.from({ length: 10 }, (_, index) => {
                            return <div className={`h-2 w-2 border border-white/30 rounded-full ${index < interview.questionAnalysis?.score ? "bg-green-600 border-0" : "bg-transparent"}`}></div>
                        })}
                    </div> </p>
                </div>
                { openDeshboard && <div className="w-full px-8 flex flex-col gap-3 text-sm justify-center items-start">
                    <div className="flex flex-col justify-center items-start">
                        <p>Missing Points</p>
                        <div className="flex flex-col justify-center items-start">
                            {
                                interview.questionAnalysis?.missingPoints?.map((index) => {
                                    <p key={index}>{interview.questionAnalysis?.missingPoints[index]}</p>
                                })
                            }
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-start ">
                        <p>Weaknesses</p>
                        <p>{interview.questionAnalysis?.weaknesses}</p>
                    </div>
                    <div className="flex flex-col justify-center items-start ">
                        <p>Strengths</p>
                        <p>{interview.questionAnalysis?.strengths}</p>
                    </div>
                    <div className="flex flex-col justify-center items-start ">
                        <p>Feedback</p>
                        <p>{interview.questionAnalysis?.feedback}</p>
                    </div>
                </div>}

                {openDeshboard ? <div onClick={() => setOpenDeshboard(false)} className="absolute bottom-2 z-40 right-2 flex font-semibold hover:text-red-700 cursor-pointer"> Down
                    <ChevronsUp />
                </div> : <div onClick={() => setOpenDeshboard(true)} className="absolute bottom-2 z-40 right-2 flex font-semibold hover:text-red-700 cursor-pointer"> Down
                    <ChevronsDown />
                </div>}
            </div>}

            {/* Header */}
            <section className="relative z-20 flex h-full w-full flex-col justify-between">

                <div className="flex justify-between p-5 -z-10">

                    {/* Logo */}
                    <div className="group flex items-center gap-3">
                        <div className="flex items-center justify-center rounded-none border border-neutral-800 bg-[#050505] px-2 py-1 transition-colors duration-300 group-hover:border-neutral-400">
                            <span className="text-sm font-light tracking-tighter text-white">
                                PPD
                            </span>
                        </div>
                        <span className="glitch-target text-xs font-light uppercase tracking-widest text-neutral-400 transition-colors group-hover:text-white">
                            Interview
                        </span>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center justify-between gap-2 rounded-none border border-neutral-800 bg-[#050505] px-4 py-2 transition-colors duration-300 hover:border-neutral-400 hover:text-white active:scale-95">
                        <button>
                            Submit
                        </button>
                        <SquareArrowOutUpRight className="size-auto" />
                    </div>
                </div>

                {/* -----------------------------------------------------------------
                    Main Interview Section
                ------------------------------------------------------------------ */}

                <main className=" mb-5 flex h-full w-full items-center justify-center">
                    <section className="flex h-full w-4/5 flex-col items-center justify-between px-5 py-3">
                        <h1 className="text-4xl font-semibold font-sans uppercase tracking-widest">Mock Interview</h1>
                        <div className="flex justify-between items-center h-full w-full gap-2 py-10">
                            <div className="h-full w-fit flex flex-col justify-between items-center text-white/50">
                                <ChevronsUp />
                                <div className="h-full w-1 bg-white/50"></div>
                                <ChevronsDown />
                            </div>
                            <div className="h-50 w-full flex flex-col items-center justify-start py-2 overflow-hidden overflow-y-scroll hideScrollBar ">
                                <p className="text-2xl uppercase tracking-wider">{interview.loading ? "Preparing ..." : (interview.currentQuestion?.question || "Hey, Are you ready to start the interview?")} </p>
                            </div>
                            <div className="h-full w-fit flex flex-col justify-between items-center text-white/50">
                                <ChevronsUp />
                                <div className="h-full w-1 bg-white/50"></div>
                                <ChevronsDown />
                            </div>
                        </div>
                        {
                            interview.loading ? '' : interview.isActive ? <div className="w-full px-10 flex justify-around items-center">
                                <button
                                    onClick={() => { stopRecordingFnc() }}
                                    className="bg-black text-white px-6 py-2 rounded hover:text-blue-600 border tracking-widest uppercase">
                                    Submit Answer
                                </button>
                                {startCount && <p className="counterAnimation text-5xl font-semibold text-neutral-400">{countdown}</p>}
                                <button
                                    onClick={() => { askQuestion(interview.session?._id) }}
                                    className="bg-black text-white px-6 py-2 rounded hover:text-blue-600 border tracking-widest uppercase">
                                    Next
                                </button>
                            </div> : <button
                                onClick={() => { startInterview(interview.session?._id) }}
                                className="bg-black text-white px-6 py-2 rounded hover:text-blue-600 border tracking-widest uppercase">
                                Start
                            </button>
                        }
                    </section>

                </main>

                {/* -----------------------------------------------------------------
                    Footer
                ------------------------------------------------------------------ */}

                <div className="mb-5 flex w-full items-center justify-center">
                    <section className="flex w-4/5 items-center justify-between gap-4">
                        {/* Description */}
                        <div className="max-w-lg px-4">
                            {interview.isActive ? <div className=" flex justify-between items-center mask-word text-sm font-extralight leading-relaxed text-neutral-500 md:text-base">
                                <div className="flex items-center justify-center gap-4">
                                    <div className="flex items-center justify-center gap-3">
                                        <p>Q : {interview.currentQuestion?.questionNo}</p>
                                        <p className="font-semibold text-shadow-neutral-200">|</p>
                                    </div>
                                    <div className="flex items-center justify-center gap-3">
                                        <p>Audio Status : {status}</p>
                                        <p className="font-semibold text-shadow-neutral-200">|</p>
                                    </div>

                                </div>
                            </div> : <p className="mask-word text-sm font-extralight leading-relaxed text-neutral-500 md:text-base">
                                An autonomous AI interview system driven by personalized question generation, real-time voice analysis, and intelligent performance evaluation.
                            </p>}
                        </div>

                        {/* Status + Loading */}
                        <div className="flex flex-col items-center justify-center gap-2">
                            {/* Status */}
                            <div className="flex items-center justify-center gap-3 text-xs uppercase">
                                <div className={`h-2 w-2 animate-pulse ${interview.isActive ? 'bg-emerald-500' : 'bg-white'}`} />
                                <p>
                                    Status : {interview.isActive ? 'Active' : 'Inactive'}
                                </p>
                                <p>/</p>
                                <p>{interview.type || 'Not known Type'}</p>
                            </div>

                            {/* Loading */}
                            {interview.loading && (
                                <div className="flex items-center gap-4">
                                    <p>
                                        Loading...
                                    </p>
                                    <div className="h-2 w-50 overflow-hidden rounded-2xl bg-white">
                                        <div
                                            className="loading-slider h-full w-20 bg-emerald-500"
                                        />
                                    </div>
                                </div>)}
                        </div>
                    </section>
                </div>
            </section>

        </main>
    );
};

export default Mock_Interview;