import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Wifi, Menu, Maximize2, Type } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cambridge18_writing } from '../../src/data/mockTests/cambridge18_writing';

// For now, we only have one mocked test.
const allWriteTests = [cambridge18_writing];

const WritingTestEngine = () => {
    const { testId } = useParams();
    const navigate = useNavigate();

    // Load actual test data based on ID (or fallback)
    const testData = allWriteTests.find(t => t.testId === testId) || cambridge18_writing;

    // Timer state
    const [timeLeft, setTimeLeft] = useState(testData.totalMinutes * 60);
    const [isTimerRunning, setIsTimerRunning] = useState(true);

    // Testing State
    const [activePart, setActivePart] = useState(1);

    // Answers state matching part IDs
    const [answers, setAnswers] = useState<{ [partId: number]: string }>({
        1: '',
        2: ''
    });

    // Handle Timer
    useEffect(() => {
        if (!isTimerRunning || timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [isTimerRunning, timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Derived variables for the current part
    const currentPartData = testData.parts.find(p => p.id === activePart);

    // Calculate word count for the current part's answer
    const currentWordCount = (answers[activePart] || '')
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0).length;

    const handleAnswerChange = (text: string) => {
        setAnswers(prev => ({
            ...prev,
            [activePart]: text
        }));
    };

    const submitTest = async () => {
        setIsTimerRunning(false);
        if (window.confirm("Are you sure you want to finish the test?")) {
            // Future logic for saving to Supabase will go here
            navigate('/practice-zone');
        } else {
            setIsTimerRunning(true);
        }
    };

    if (!currentPartData) return <div>Test Part not found</div>;

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
            {/* Fullscreen Entry Prompt (matching ListeningTestEngine) */}
            {/* Keeping it simple for writing unless asked; we can add the prompt if needed, but for now we focus on layout */}

            {/* Sticky Top Header */}
            <header className="fixed top-0 left-0 right-0 h-14 bg-[#f1d4d4] flex items-center justify-between px-6 z-50 border-b border-rose-200">
                <div className="flex flex-col justify-center h-full">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/practice-zone')}
                            className="p-1 hover:bg-rose-200/50 rounded transition-colors"
                            title="Exit Test"
                        >
                            <ArrowLeft className="w-4 h-4 text-slate-800" />
                        </button>
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 leading-none">
                            {testData.title}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 ml-8">
                        <span className={`text-[11px] font-bold tabular-nums ${timeLeft < 300 ? 'text-rose-600 animate-pulse' : 'text-slate-700'}`}>
                            ⏱ {formatTime(timeLeft)} remaining
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 h-full">
                    <button
                        onClick={submitTest}
                        className="px-6 py-1.5 bg-white border border-rose-300 rounded text-[11px] font-bold text-slate-900 hover:bg-rose-50 transition-colors shadow-sm"
                    >
                        Finish test
                    </button>
                    <div className="flex items-center gap-3 text-slate-600">
                        <button title="Wi-Fi">
                            <Wifi className="h-[18px] w-[18px]" />
                        </button>
                        <button title="Settings">
                            <Menu className="h-[18px] w-[18px]" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Split layout: Left for Prompt/Image, Right for Text Area */}
            <main className="flex-1 flex overflow-hidden lg:flex-row flex-col" style={{ marginTop: '56px', height: 'calc(100vh - 120px)' }}>
                <style>{`
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                    .scrollbar-hide {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
                {/* Left Panel: Prompt */}
                <div className="lg:w-1/2 w-full border-r border-slate-200 bg-white overflow-y-auto p-8 lg:p-12 relative">
                    <div className="max-w-xl mx-auto">
                        <div className="mb-8">
                            <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wider rounded border border-slate-200 mb-4">
                                {currentPartData.name}
                            </span>
                            <h2 className="text-[22px] font-medium text-slate-800 mb-2">Instructions</h2>
                            <p className="text-[14px] text-slate-600 italic font-medium">{currentPartData.instructions}</p>
                        </div>

                        <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-p:text-slate-800 text-[15px]">
                            {currentPartData.promptText.map((block, idx) => {
                                if (block.tag === 'p') return <p key={idx} className="mb-4">{block.text}</p>;
                                if (block.tag === 'blockquote') return <blockquote key={idx} className="border-l-4 border-slate-300 pl-4 py-1 bg-slate-50 text-slate-700 mb-4 font-medium">{block.text}</blockquote>;
                                return null;
                            })}
                        </div>

                        {currentPartData.imageUrl && (
                            <div className="mt-8 border border-slate-200 bg-white p-2 text-center">
                                <img src={currentPartData.imageUrl} alt="Prompt Visual" className="max-w-full h-auto object-contain inline-block" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Typing Area */}
                <div className="lg:w-1/2 w-full flex flex-col bg-slate-50 relative pb-20 overflow-y-auto">
                    <div className="p-6 lg:p-10 w-full max-w-3xl mx-auto flex flex-col">
                        <textarea
                            className="w-full h-[55vh] bg-white border border-slate-300 rounded-lg p-6 text-[15px] leading-relaxed text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-shadow resize-none shadow-sm scrollbar-hide"
                            placeholder="Type your answer here..."
                            value={answers[activePart]}
                            onChange={(e) => handleAnswerChange(e.target.value)}
                            spellCheck={false}
                            style={{ overflowY: 'auto' }} /* Ensure scroll works but without scrollbar via class */
                        />
                        <div className="mt-4 flex items-center justify-start shrink-0">
                            <div className={`text-[12px] font-bold tracking-wide ${currentWordCount >= currentPartData.minimumWords ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {currentWordCount} / {currentPartData.minimumWords} words
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            {/* ── FOOTER ── */}
            <footer className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-300 flex items-center px-6 z-50">
                <div className="flex gap-8 lg:gap-16 w-full justify-center">
                    {testData.parts.map(part => {
                        const isActive = activePart === part.id;
                        return (
                            <div
                                key={part.id}
                                className={`flex items-center gap-3 cursor-pointer group`}
                                onClick={() => setActivePart(part.id)}
                            >
                                <div className="flex items-center gap-1.5">
                                    <span className={`text-[13px] font-black transition-colors ${isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                        {part.name}
                                    </span>
                                </div>
                                {isActive && (
                                    <div className="flex items-center gap-1">
                                        <div
                                            className={`w-6 h-6 flex items-center justify-center text-[11px] font-medium border transition-colors border-slate-800 bg-slate-800 text-white`}
                                        >
                                            {part.id}
                                        </div>
                                    </div>
                                )}
                                {!isActive && answers[part.id] && answers[part.id].trim().length > 0 && (
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </footer>
        </div>
    );
};

export default WritingTestEngine;
