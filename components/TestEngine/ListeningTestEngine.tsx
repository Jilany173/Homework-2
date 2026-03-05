import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    MultipleChoiceRenderer,
    FillInBlanksRenderer,
    InlineBlanksRenderer,
    MultipleChoiceCheckboxRenderer,
    MatchingDropdownRenderer,
    MatchingTableRenderer,
    MatchingDragDropRenderer,
    FillInTableRenderer,
    parseSimpleContent,
} from './QuestionTypes';
import { cambridge18_listening } from '../../src/data/mockTests/cambridge18_listening';
import { cambridge18_listening_test2 } from '../../src/data/mockTests/cambridge18_listening_test2';
import { supabase } from '../../lib/supabase';

// --- Test Data ---
const mockTestRegistry: Record<string, any> = {
    'cam18_listening': cambridge18_listening,
    'cam18_listening_test2': cambridge18_listening_test2,
};

// ─── Results Screen ────────────────────────────────────────────────────────────
interface ResultsScreenProps {
    answers: Record<string, string>;
    testData: any;
    answerKey: Record<number, string>;
    onBack: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ answers, testData, answerKey, onBack }) => {
    const [activeTab, setActiveTab] = useState<'brief' | 'question-wise'>('brief');
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [studentName, setStudentName] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from('profiles').select('username').eq('id', user.id).single();
                if (data?.username) setStudentName(data.username);
            }
        };
        fetchUser();
    }, []);

    const allQuestions: { qNum: number; studentAnswer: string; correctAnswer: string; type: string; isCorrect: boolean; isBlank: boolean }[] = [];

    testData.parts.forEach(part => {
        part.questions.forEach((q: any) => {
            const processQ = (qNum: number, ans: string = '', type: string) => {
                const correct = answerKey[qNum] || '—';
                const isBlank = ans === '—' || ans.trim() === '';
                let isCorrect = false;
                if (!isBlank && correct !== '—') {
                    const validAnswers = correct.split('|').map(a => a.trim().toLowerCase());
                    isCorrect = validAnswers.includes(ans.trim().toLowerCase());
                }
                allQuestions.push({
                    qNum,
                    studentAnswer: ans || '—',
                    correctAnswer: correct,
                    type,
                    isCorrect,
                    isBlank
                });
            };

            if (q.type === 'inline_blanks') {
                q.content.forEach((item: any) => {
                    if (item.inline) processQ(item.inline.number, answers[item.inline.inputId], 'fill');
                });
            } else if (q.type === 'fill_in_table') {
                q.rows.forEach((row: any) => {
                    row.cells.forEach((cell: any) => {
                        cell.content.forEach((item: any) => {
                            if (item.inline) processQ(item.inline.number, answers[item.inline.inputId], 'fill');
                        });
                    });
                });
            } else if (q.type === 'multiple_choice_checkbox') {
                const selectedArr = answers[q.id] ? answers[q.id].split(',') : [];
                for (let i = 0; i < q.maxSelections; i++) {
                    processQ(q.number + i, selectedArr[i], 'mc');
                }
            } else if (q.type === 'matching_dropdown' || q.type === 'matching_table' || q.type === 'matching_drag_drop') {
                q.subQuestions.forEach((sq: any) => processQ(sq.number, answers[sq.id], 'mc'));
            } else {
                processQ(q.number, answers[q.id], 'mc');
            }
        });
    });

    allQuestions.sort((a, b) => a.qNum - b.qNum);

    const attemptedQuestions = allQuestions.filter(q => !q.isBlank);
    const attemptedCount = attemptedQuestions.length;
    const correctCount = allQuestions.filter(q => q.isCorrect).length;
    const hasAnswerKey = Object.keys(answerKey).length > 0;
    const band = hasAnswerKey ? (correctCount >= 39 ? 9 : correctCount >= 37 ? 8.5 : correctCount >= 35 ? 8 : correctCount >= 33 ? 7.5 : correctCount >= 30 ? 7 : correctCount >= 27 ? 6.5 : correctCount >= 23 ? 6 : correctCount >= 20 ? 5.5 : correctCount >= 16 ? 5 : '< 5') : 'N/A';

    const partRanges = [[1, 10], [11, 20], [21, 30], [31, 40]];
    const activeQ = attemptedQuestions[activeQuestionIndex];

    return (
        <div className="min-h-screen relative font-sans text-slate-800 pb-16 overflow-hidden bg-slate-50">
            {/* Elegant Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-indigo-900 via-indigo-800 to-slate-50 -z-10"></div>
            <div className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full bg-purple-500/20 blur-[100px] pointer-events-none -z-10"></div>
            <div className="absolute top-[10%] right-[-5%] w-80 h-80 rounded-full bg-blue-400/20 blur-[100px] pointer-events-none -z-10"></div>

            <div className="max-w-5xl mx-auto pt-10 px-4">
                {/* Header Profile Card */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-indigo-900/5 overflow-hidden mb-8 border border-white">
                    <div className="px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                        {/* Decorative subtle accent */}
                        <div className="absolute -right-16 -top-16 w-48 h-48 bg-gradient-to-br from-indigo-100 to-purple-50 rounded-full blur-2xl opacity-50 pointer-events-none"></div>

                        <div className="flex flex-col md:flex-row items-center gap-6 z-10 w-full">
                            <div className="text-center md:text-left flex-1">
                                {studentName && <h1 className="text-3xl font-bold text-slate-800 tracking-tight break-all">{studentName}</h1>}
                                <p className="text-sm font-medium text-indigo-600 mt-1 flex items-center justify-center md:justify-start gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Listening Test Results
                                </p>
                            </div>
                        </div>

                        <div className="z-10 shrink-0 w-full md:w-auto">
                            <div className="bg-gradient-to-br from-indigo-600 to-blue-600 p-[2px] rounded-2xl shadow-lg shadow-indigo-500/20">
                                <div className="bg-white px-8 py-5 rounded-[14px] h-full flex flex-col items-center justify-center">
                                    <div className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">Overall Band</div>
                                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 leading-none">
                                        {band}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex border-t border-slate-100 px-6 bg-slate-50/50 backdrop-blur-sm">
                        <button
                            onClick={() => setActiveTab('brief')}
                            className={`px-8 py-4 text-sm font-bold transition-all relative ${activeTab === 'brief' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'} `}
                        >
                            Brief Overview
                            {activeTab === 'brief' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full shadow-[0_-2px_8px_rgba(79,70,229,0.5)]"></div>}
                        </button>
                        <button
                            onClick={() => { setActiveTab('question-wise'); setActiveQuestionIndex(0); }}
                            className={`px-8 py-4 text-sm font-bold transition-all relative ${activeTab === 'question-wise' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'} `}
                        >
                            Question-Wise Analysis
                            {activeTab === 'question-wise' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full shadow-[0_-2px_8px_rgba(79,70,229,0.5)]"></div>}
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                {activeTab === 'brief' && (
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 space-y-4">
                            {/* Summary Cards */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Questions</div>
                                    <div className="text-2xl font-black text-slate-700">40</div>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Attempted</div>
                                    <div className="text-2xl font-black text-slate-700">{attemptedCount}</div>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden">
                                <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-emerald-50 to-transparent pointer-events-none"></div>
                                <div>
                                    <div className="text-xs font-bold text-emerald-600/70 uppercase tracking-wider mb-1">Correct Answers</div>
                                    <div className="text-3xl font-black text-emerald-600">{correctCount}</div>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 relative z-10 shadow-sm shadow-emerald-200">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full">
                                <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-700">Part Breakdown</h3>
                                </div>
                                <div className="p-0 overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-white text-slate-400 text-xs uppercase tracking-wider font-bold border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-4 font-bold">Part</th>
                                                <th className="px-6 py-4 font-bold text-center">Questions</th>
                                                <th className="px-6 py-4 font-bold text-center">Attempted</th>
                                                <th className="px-6 py-4 font-bold text-center">Correct</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {partRanges.map(([start, end], pIdx) => {
                                                const pFiltered = allQuestions.filter(q => q.qNum >= start && q.qNum <= end);
                                                const pAttempted = pFiltered.filter(q => !q.isBlank).length;
                                                const pCorrect = pFiltered.filter(q => q.isCorrect).length;
                                                return (
                                                    <tr key={pIdx} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-4 font-semibold text-slate-700">Listening Part {pIdx + 1}</td>
                                                        <td className="px-6 py-4 text-center text-slate-500">{end - start + 1}</td>
                                                        <td className="px-6 py-4 text-center text-slate-500">{pAttempted}</td>
                                                        <td className="px-6 py-4 text-center font-bold text-emerald-600 bg-emerald-50/30">{pCorrect}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'question-wise' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                        {attemptedQuestions.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="inline-flex w-20 h-20 bg-slate-50 rounded-full items-center justify-center text-slate-300 mb-4">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-600">No questions attempted</h3>
                                <p className="text-slate-400 mt-2">You didn't answer any questions in this test.</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">Attempted Answers Analysis</h3>
                                        <p className="text-sm text-slate-500 mt-1">Reviewing {attemptedCount} answered questions</p>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
                                        <div className="flex items-center gap-1.5 text-emerald-600"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span> Correct</div>
                                        <div className="flex items-center gap-1.5 text-rose-500"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></span> Incorrect</div>
                                    </div>
                                </div>

                                {/* Custom Scrollbar Navigator */}
                                <div className="relative mb-10 group">
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full -z-10"></div>
                                    <div className="flex gap-2.5 overflow-x-auto py-4 px-2 scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
                                        {attemptedQuestions.map((q, idx) => {
                                            const isActive = idx === activeQuestionIndex;
                                            const bgClass = q.isCorrect
                                                ? (isActive ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 ring-4 ring-emerald-100" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200")
                                                : (isActive ? "bg-rose-500 text-white shadow-lg shadow-rose-500/40 ring-4 ring-rose-100" : "bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-200");

                                            return (
                                                <button
                                                    key={q.qNum}
                                                    onClick={() => setActiveQuestionIndex(idx)}
                                                    className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center font-black text-sm transition-all duration-300 ${bgClass} ${isActive ? 'scale-110 -translate-y-1' : ''} `}
                                                >
                                                    {q.qNum}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Detail Card */}
                                {activeQ && (
                                    <div className="max-w-3xl mx-auto">
                                        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 relative overflow-hidden">
                                            {/* Top corner indicator */}
                                            <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl opacity-40 ${activeQ.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'} `}></div>

                                            <div className="flex items-center gap-4 mb-8 border-b border-slate-200/60 pb-6">
                                                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl font-black text-slate-700 border border-slate-100">
                                                    Q{activeQ.qNum}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-0.5">Status</div>
                                                    {activeQ.isCorrect ? (
                                                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold bg-emerald-100/50 px-3 py-1 rounded-lg w-max shadow-sm border border-emerald-100">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg> Correct
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 text-rose-500 font-bold bg-rose-100/50 px-3 py-1 rounded-lg w-max shadow-sm border border-rose-100">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg> Incorrect
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-8 relative z-10">
                                                <div className="space-y-2">
                                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                                        Your Answer
                                                    </div>
                                                    <div className={`w - full bg - white border - 2 p - 5 rounded - xl text - lg font - bold shadow - sm ${activeQ.isCorrect ? 'border-emerald-200 text-emerald-700' : 'border-rose-200 text-rose-600'} `}>
                                                        {activeQ.studentAnswer}
                                                    </div>
                                                </div>

                                                {hasAnswerKey && (
                                                    <div className="space-y-2">
                                                        <div className="text-xs font-bold text-emerald-600/70 uppercase tracking-widest flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                            Correct Answer
                                                        </div>
                                                        <div className="w-full bg-emerald-50 border-2 border-emerald-100 p-5 rounded-xl text-lg font-bold text-emerald-700 shadow-sm">
                                                            {activeQ.correctAnswer.split('|').join('  OR  ')}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-200/60">
                                                <button
                                                    onClick={() => setActiveQuestionIndex(Math.max(0, activeQuestionIndex - 1))}
                                                    disabled={activeQuestionIndex === 0}
                                                    className="px-5 py-2.5 rounded-xl font-bold font-sm text-slate-600 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all disabled:opacity-30 disabled:hover:bg-transparent border border-transparent hover:border-slate-200 flex items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg> Previous
                                                </button>
                                                <div className="text-sm font-bold text-slate-400">
                                                    {activeQuestionIndex + 1} of {attemptedCount}
                                                </div>
                                                <button
                                                    onClick={() => setActiveQuestionIndex(Math.min(attemptedQuestions.length - 1, activeQuestionIndex + 1))}
                                                    disabled={activeQuestionIndex === attemptedQuestions.length - 1}
                                                    className="px-5 py-2.5 rounded-xl font-bold font-sm text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-500/20 transition-all disabled:opacity-30 flex items-center gap-2"
                                                >
                                                    Next <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                <div className="mt-10 text-center">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-600 hover:text-slate-900 shadow-sm border border-slate-200 rounded-xl font-bold transition-all hover:shadow-md"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Engine ───────────────────────────────────────────────────────────────
const ListeningTestEngine: React.FC = () => {
    const navigate = useNavigate();
    const { testId } = useParams<{ testId: string }>();
    const TEST_ID = testId || 'cam18_listening';

    const [mockTestData, setMockTestData] = useState<any>(mockTestRegistry[TEST_ID] || mockTestRegistry['cam18_listening']);
    const [isLoadingTest, setIsLoadingTest] = useState(!mockTestRegistry[TEST_ID]);

    const TOTAL_PARTS = mockTestData?.parts?.length || 4;
    const TOTAL_SECONDS = (mockTestData?.totalMinutes || 30) * 60;

    const audioRef = useRef<HTMLAudioElement>(null);

    const [activePart, setActivePart] = useState(1);
    const [audioPart, setAudioPart] = useState(1);
    const [testMode, setTestMode] = useState<'full' | 'practice'>('full');
    const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showFinishModal, setShowFinishModal] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [testFinished, setTestFinished] = useState(false);
    const [answerKey, setAnswerKey] = useState<Record<number, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(true);
    const [testStarted, setTestStarted] = useState(false);
    const startTimeRef = useRef(Date.now());

    // ── Highlight & Note state ──────────────────────────────────────────────────
    type HighlightEntry = { id: string; text: string };
    type NoteEntry = { id: string; text: string; noteText: string; x: number; y: number };

    const [highlights, setHighlights] = useState<HighlightEntry[]>([]);
    const [notes, setNotes] = useState<NoteEntry[]>([]);
    const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; selectedText: string; range: Range | null } | null>(null);
    const [activeNote, setActiveNote] = useState<NoteEntry | null>(null);
    const [showNotesPanel, setShowNotesPanel] = useState(false);
    const mainRef = useRef<HTMLDivElement>(null);
    const noteDragRef = useRef<{ dragging: boolean; startX: number; startY: number; origX: number; origY: number }>({ dragging: false, startX: 0, startY: 0, origX: 0, origY: 0 });

    // Start dragging the note popup
    const handleNoteDragStart = (e: React.MouseEvent) => {
        if (!activeNote) return;
        e.preventDefault();
        noteDragRef.current = { dragging: true, startX: e.clientX, startY: e.clientY, origX: activeNote.x, origY: activeNote.y + 30 };
        const onMove = (ev: MouseEvent) => {
            if (!noteDragRef.current.dragging) return;
            const dx = ev.clientX - noteDragRef.current.startX;
            const dy = ev.clientY - noteDragRef.current.startY;
            const newX = Math.max(0, Math.min(noteDragRef.current.origX + dx, window.innerWidth - 244));
            const newY = Math.max(0, Math.min(noteDragRef.current.origY + dy, window.innerHeight - 200));
            setActiveNote(prev => prev ? { ...prev, x: newX, y: newY - 30 } : prev);
        };
        const onUp = () => {
            noteDragRef.current.dragging = false;
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    };

    // Block Ctrl+F during test
    useEffect(() => {
        const blockFind = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                e.stopPropagation();
            }
        };
        document.addEventListener('keydown', blockFind, true);
        return () => document.removeEventListener('keydown', blockFind, true);
    }, []);

    // Block right-click context menu during test
    useEffect(() => {
        const blockCtx = (e: MouseEvent) => e.preventDefault();
        document.addEventListener('contextmenu', blockCtx);
        return () => document.removeEventListener('contextmenu', blockCtx);
    }, []);

    // Load dynamic test data if not in registry
    useEffect(() => {
        const fetchDynamicTest = async () => {
            if (mockTestRegistry[TEST_ID]) {
                setIsLoadingTest(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('listening_tests')
                    .select('data')
                    .eq('id', TEST_ID) // Assuming the ID passed is the UUID or we can search by title/slug
                    .maybeSingle();

                if (data?.data) {
                    setMockTestData(data.data);
                }
            } catch (err) {
                console.error("Error fetching dynamic test:", err);
            } finally {
                setIsLoadingTest(false);
            }
        };
        fetchDynamicTest();
    }, [TEST_ID]);

    // Load answer key from Supabase on mount
    useEffect(() => {
        const fetchAnswerKey = async () => {
            const { data } = await supabase
                .from('test_answer_keys')
                .select('answers')
                .eq('test_id', TEST_ID)
                .maybeSingle();
            if (data?.answers && Object.keys(data.answers).length > 0) {
                const numericKey: Record<number, string> = {};
                Object.entries(data.answers).forEach(([k, v]) => {
                    numericKey[Number(k)] = String(v);
                });
                setAnswerKey(numericKey);
            }
        };
        fetchAnswerKey();
    }, []);

    // ── Timer ──────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (testFinished || !testStarted) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    finishTest();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [testFinished, testStarted]);

    // ── Audio: change source when audioPart changes ───────────────────────────
    useEffect(() => {
        const currentPartData = mockTestData.parts.find(p => p.id === audioPart) as any;
        const audioUrl = currentPartData?.audioUrl;
        if (audioRef.current && audioUrl) {
            audioRef.current.src = audioUrl;
            audioRef.current.load();
            if (testStarted) {
                audioRef.current.play().catch(() => {/* autoplay blocked is fine */ });
            }
        }
    }, [audioPart, testStarted]);

    // ── Audio ended: advance part ──────────────────────────────────────────────
    const handleAudioEnded = useCallback(() => {
        if (audioPart < TOTAL_PARTS) {
            setAudioPart(prev => prev + 1);
            if (testMode === 'full') {
                setActivePart(audioPart + 1);
            }
        } else {
            finishTest();
        }
    }, [audioPart, testMode, TOTAL_PARTS]);

    // ── Finish test ────────────────────────────────────────────────────────────
    const finishTest = useCallback(async () => {
        if (audioRef.current) audioRef.current.pause();
        setTestFinished(true);
        setShowFinishModal(false);
        setIsSubmitting(true);

        // Calculate score
        const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
        let attempted = 0;
        let correct = 0;
        let totalQ = 0;

        mockTestData.parts.forEach(part => {
            part.questions.forEach((q: any) => {
                const checkQ = (qNum: number, studentAns: string) => {
                    totalQ++;
                    if (studentAns && studentAns !== '') attempted++;
                    const correctAns = answerKey[qNum];
                    if (correctAns && studentAns && studentAns.trim() !== '') {
                        const validAnswers = correctAns.split('|').map(a => a.trim().toLowerCase());
                        if (validAnswers.includes(studentAns.trim().toLowerCase())) correct++;
                    }
                };

                if (q.type === 'inline_blanks') {
                    q.content.forEach((item: any) => {
                        if (item.inline) checkQ(item.inline.number, answers[item.inline.inputId]);
                    });
                } else if (q.type === 'fill_in_table') {
                    q.rows.forEach((row: any) => {
                        row.cells.forEach((cell: any) => {
                            cell.content.forEach((item: any) => {
                                if (item.inline) checkQ(item.inline.number, answers[item.inline.inputId]);
                            });
                        });
                    });
                } else if (q.type === 'multiple_choice_checkbox') {
                    const sel = answers[q.id]?.split(',') || [];
                    for (let i = 0; i < q.maxSelections; i++) checkQ(q.number + i, sel[i]);
                } else if (q.type === 'matching_dropdown' || q.type === 'matching_table' || q.type === 'matching_drag_drop') {
                    q.subQuestions.forEach((sq: any) => checkQ(sq.number, answers[sq.id]));
                } else {
                    checkQ(q.number, answers[q.id]);
                }
            });
        });

        const bandScore = Object.keys(answerKey).length > 0
            ? (correct >= 39 ? '9.0' : correct >= 37 ? '8.5' : correct >= 35 ? '8.0' : correct >= 33 ? '7.5' : correct >= 30 ? '7.0' : correct >= 27 ? '6.5' : correct >= 23 ? '6.0' : correct >= 20 ? '5.5' : correct >= 16 ? '5.0' : '< 5.0')
            : null;

        // Get student ID
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            // Convert answers to JSONB-friendly format
            await supabase.from('test_submissions').insert({
                student_id: user.id,
                test_id: TEST_ID,
                test_type: 'listening',
                answers: answers,
                total_questions: totalQ,
                attempted,
                correct,
                band_score: bandScore,
                time_spent_sec: timeSpent,
            });
        }

        // Exit fullscreen when test finishes
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => { });
        }

        setIsSubmitting(false);
        setShowResults(true);
    }, [answers, answerKey]);

    // ── Highlight / Note handlers ───────────────────────────────────────────────
    const handleContextMenu = (e: React.MouseEvent) => {
        const sel = window.getSelection();
        const text = sel?.toString().trim();
        if (!text) return; // No selection — skip custom menu
        e.preventDefault();
        const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
        setCtxMenu({ x: e.clientX, y: e.clientY, selectedText: text, range });
        setActiveNote(null);
        setShowNotesPanel(false);
    };

    const applyHighlight = () => {
        if (!ctxMenu?.range) return;
        const hlId = Date.now().toString();
        const range = ctxMenu.range;

        try {
            const treeWalker = document.createTreeWalker(
                range.commonAncestorContainer,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: (node) => {
                        if (!range.intersectsNode(node)) return NodeFilter.FILTER_REJECT;
                        if (node.nodeValue?.trim() === '') return NodeFilter.FILTER_REJECT;
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            const nodesToWrap: Text[] = [];
            if (range.commonAncestorContainer.nodeType === Node.TEXT_NODE) {
                nodesToWrap.push(range.commonAncestorContainer as Text);
            } else {
                let currentNode = treeWalker.nextNode();
                while (currentNode) {
                    nodesToWrap.push(currentNode as Text);
                    currentNode = treeWalker.nextNode();
                }
            }

            nodesToWrap.forEach((node) => {
                const isFirst = node === range.startContainer;
                const isLast = node === range.endContainer;

                let startOffset = isFirst ? range.startOffset : 0;
                let endOffset = isLast ? range.endOffset : (node.nodeValue?.length || 0);

                if (startOffset >= endOffset) return;

                const textToWrap = node.nodeValue?.substring(startOffset, endOffset) || "";
                const beforeText = node.nodeValue?.substring(0, startOffset) || "";
                const afterText = node.nodeValue?.substring(endOffset) || "";

                if (!textToWrap.trim()) return;

                const mark = document.createElement('mark');
                mark.className = 'hl-yellow';
                mark.dataset.hlId = hlId;
                mark.textContent = textToWrap;

                const parent = node.parentNode;
                if (parent) {
                    if (beforeText) parent.insertBefore(document.createTextNode(beforeText), node);
                    parent.insertBefore(mark, node);
                    if (afterText) parent.insertBefore(document.createTextNode(afterText), node);
                    parent.removeChild(node);
                }
            });

            setHighlights(prev => [...prev, { id: hlId, text: ctxMenu.selectedText }]);
        } catch (e) {
            console.error("Highlight error:", e);
        }

        window.getSelection()?.removeAllRanges();
        setCtxMenu(null);
    };

    const openNote = () => {
        if (!ctxMenu) return;
        const newNote: NoteEntry = {
            id: Date.now().toString(),
            text: ctxMenu.selectedText,
            noteText: ctxMenu.selectedText,
            x: Math.min(ctxMenu.x, window.innerWidth - 280),
            y: Math.min(ctxMenu.y, window.innerHeight - 220),
        };
        setNotes(prev => [...prev, newNote]);
        setActiveNote(newNote);
        window.getSelection()?.removeAllRanges();
        setCtxMenu(null);
    };

    const clearHighlightsFromDom = () => {
        document.querySelectorAll('mark.hl-yellow').forEach(el => {
            const parent = el.parentNode;
            if (parent) {
                while (el.firstChild) parent.insertBefore(el.firstChild, el);
                parent.removeChild(el);
            }
        });
        setHighlights([]);
    };

    const clearHighlightSelection = () => {
        // Clear only closest mark to context menu
        if (!ctxMenu?.range) { setCtxMenu(null); return; }
        const container = ctxMenu.range.commonAncestorContainer;
        const mark = (container instanceof Element ? container : container.parentElement)?.closest('mark.hl-yellow');
        if (mark) {
            const parent = mark.parentNode!;
            while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
            parent.removeChild(mark);
            setHighlights(prev => prev.filter(h => h.id !== (mark as HTMLElement).dataset.hlId));
        }
        setCtxMenu(null);
    };

    const clearAllAction = () => {
        clearHighlightsFromDom();
        setNotes([]);
        setActiveNote(null);
        setCtxMenu(null);
    };

    const dismissCtxMenu = () => setCtxMenu(null);

    const handleBodyClick = (e: React.MouseEvent) => {
        // Close context menu and note popup when clicking outside
        if (ctxMenu) setCtxMenu(null);
        const target = e.target as Element;
        if (activeNote && !target.closest('.note-popup')) {
            setActiveNote(null);
        }
    };

    const handleAnswer = (questionId: string, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')} `;
    };

    const currentPartData = mockTestData.parts.find(p => p.id === activePart);

    // ── Footer helpers ─────────────────────────────────────────────────────────
    const getAnsweredCountForPart = (partId: number) => {
        const part = mockTestData.parts.find(p => p.id === partId);
        if (!part) return 0;
        let count = 0;
        part.questions.forEach((q: any) => {
            if (q.type === 'inline_blanks') {
                if (q.simpleContent) {
                    q.simpleContent.forEach((text: string) => {
                        parseSimpleContent(text).forEach(p => { if (p.type === 'inline' && answers[p.inline!.inputId]) count++; });
                    });
                } else if (q.content) {
                    q.content.forEach((item: any) => { if (item.inline && answers[item.inline.inputId]) count++; });
                }
            } else if (q.type === 'fill_in_table') {
                if (q.simpleRows) {
                    q.simpleRows.forEach((row: string[]) => {
                        row.forEach(cellText => {
                            parseSimpleContent(cellText).forEach(p => { if (p.type === 'inline' && answers[p.inline!.inputId]) count++; });
                        });
                    });
                } else if (q.rows) {
                    q.rows.forEach((row: any) => {
                        row.cells.forEach((cell: any) => {
                            cell.content.forEach((item: any) => { if (item.inline && answers[item.inline.inputId]) count++; });
                        });
                    });
                }
            } else if (q.type === 'multiple_choice_checkbox') {
                count += answers[q.id] ? answers[q.id].split(',').length : 0;
            } else if (q.type === 'matching_dropdown' || q.type === 'matching_table' || q.type === 'matching_drag_drop') {
                q.subQuestions.forEach((sq: any) => { if (answers[sq.id]) count++; });
            } else if (answers[q.id]) {
                count++;
            }
        });
        return count;
    };

    const getTotalQuestionsForPart = (partId: number) => {
        const part = mockTestData.parts.find((p: any) => p.id === partId);
        if (!part) return 0;
        let count = 0;
        part.questions.forEach((q: any) => {
            if (q.type === 'inline_blanks') {
                if (q.simpleContent) {
                    q.simpleContent.forEach((text: string) => {
                        count += parseSimpleContent(text).filter(p => p.type === 'inline').length;
                    });
                } else {
                    count += (q.content?.filter((c: any) => c.type === 'inline' || (c.type === 'sub_bullet' && c.inline) || (c.type === 'sub_sub_bullet' && c.inline)).length || 0);
                }
            } else if (q.type === 'fill_in_table') {
                if (q.simpleRows) {
                    q.simpleRows.forEach((row: string[]) => {
                        row.forEach(cellText => {
                            count += parseSimpleContent(cellText).filter(p => p.type === 'inline').length;
                        });
                    });
                } else if (q.rows) {
                    q.rows.forEach((row: any) => {
                        row.cells.forEach((cell: any) => {
                            count += (cell.content?.filter((c: any) => c.inline).length || 0);
                        });
                    });
                }
            } else if (q.type === 'matching_dropdown' || q.type === 'matching_table' || q.type === 'matching_drag_drop') {
                count += (q.subQuestions?.length || 0);
            } else if (q.type === 'multiple_choice_checkbox') {
                count += q.maxSelections || 1;
            } else {
                count += 1;
            }
        });
        return count;
    };

    const getQuestionRangeForPart = (partId: number) => {
        const part = mockTestData.parts.find((p: any) => p.id === partId);
        if (!part || !part.questions || part.questions.length === 0) return '';

        let firstQuestionNum: number | null = null;
        let lastQuestionNum: number | null = null;

        part.questions.forEach((q: any) => {
            if (firstQuestionNum === null || q.number < firstQuestionNum) {
                firstQuestionNum = q.number;
            }

            let qEndNumber = q.number;

            if (q.type === 'inline_blanks') {
                const inputs = q.content?.filter((c: any) => c.inline)?.map((c: any) => c.inline.number) || [];
                if (inputs.length > 0) {
                    qEndNumber = Math.max(...inputs);
                }
            } else if (q.type === 'matching_dropdown' || q.type === 'matching_table' || q.type === 'matching_drag_drop') {
                const subs = q.subQuestions?.map((sq: any) => sq.number) || [];
                if (subs.length > 0) {
                    qEndNumber = Math.max(...subs);
                }
            } else if (q.type === 'multiple_choice_checkbox') {
                qEndNumber = q.number + (q.maxSelections || 1) - 1;
            }

            if (lastQuestionNum === null || qEndNumber > lastQuestionNum) {
                lastQuestionNum = qEndNumber;
            }
        });

        if (firstQuestionNum !== null && lastQuestionNum !== null) {
            return `Questions ${firstQuestionNum} -${lastQuestionNum} `;
        }
        return '';
    };

    const getQuestionsListForPart = (partId: number) => {
        const part = mockTestData.parts.find(p => p.id === partId);
        if (!part) return [];
        let list: { id: string; number: number }[] = [];
        part.questions.forEach((q: any) => {
            if (q.type === 'inline_blanks') {
                if (q.simpleContent) {
                    q.simpleContent.forEach((text: string) => {
                        parseSimpleContent(text).forEach(p => { if (p.type === 'inline') list.push({ id: p.inline!.inputId, number: p.inline!.number }); });
                    });
                } else {
                    q.content.forEach((item: any) => { if (item.inline) list.push({ id: item.inline.inputId, number: item.inline.number }); });
                }
            } else if (q.type === 'fill_in_table') {
                if (q.simpleRows) {
                    q.simpleRows.forEach((row: string[]) => {
                        row.forEach(cellText => {
                            parseSimpleContent(cellText).forEach(p => { if (p.type === 'inline') list.push({ id: p.inline!.inputId, number: p.inline!.number }); });
                        });
                    });
                } else if (q.rows) {
                    q.rows.forEach((row: any) => {
                        row.cells.forEach((cell: any) => {
                            cell.content.forEach((item: any) => { if (item.inline) list.push({ id: item.inline.inputId, number: item.inline.number }); });
                        });
                    });
                }
            } else if (q.type === 'multiple_choice_checkbox') {
                for (let i = 0; i < (q.maxSelections || 1); i++) list.push({ id: `${q.id}_part_${i}`, number: q.number + i });
            } else if (q.type === 'matching_dropdown' || q.type === 'matching_table' || q.type === 'matching_drag_drop') {
                q.subQuestions.forEach((sq: any) => list.push({ id: sq.id, number: sq.number }));
            } else {
                list.push({ id: q.id, number: q.number });
            }
        });
        return list;
    };

    // ── Show results screen ────────────────────────────────────────────────────
    if (showResults) {
        return (
            <ResultsScreen
                answers={answers}
                testData={mockTestData}
                answerKey={answerKey}
                onBack={() => navigate('/practice-zone')}
            />
        );
    }

    // ── Main Test UI ───────────────────────────────────────────────────────────
    return (
        <div
            className="min-h-screen bg-white font-sans text-slate-900 flex flex-col"
            onContextMenu={handleContextMenu}
            onClick={handleBodyClick}
            ref={mainRef}
        >
            {/* Yellow highlight style injected globally */}
            <style>{`
mark.hl-yellow { background: #ffe066; color: inherit; border-radius: 2px; padding: 0 1px; }
                .ctx-menu { box-shadow: 0 4px 18px rgba(0, 0, 0, 0.18); border-radius: 4px; overflow: hidden; min-width: 140px; }
                .ctx-item { display: flex; align-items: center; gap: 8px; padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer; color: #1e293b; background: white; border: none; width: 100%; text-align: left; }
                .ctx-item:hover { background: #f1f5f9; }
                .ctx-item.disabled { color: #94a3b8; cursor: default; pointer-events: none; }
`}</style>
            {/* Hidden audio element */}
            <audio ref={audioRef} onEnded={handleAudioEnded} style={{ display: 'none' }} />

            {/* Fullscreen Entry Prompt / Mode Selection */}
            {showFullscreenPrompt && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 overflow-y-auto" style={{ background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(8px)' }}>
                    <div className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full overflow-hidden border border-white/20">
                        {/* Header Section */}
                        <div className="bg-gradient-to-br from-[#f8e7e7] to-[#f1d4d4] px-10 py-10 text-center relative overflow-hidden">
                            <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>
                            <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-rose-400/10 rounded-full blur-2xl"></div>

                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-sm mb-6 text-4xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                                🎧
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-tight mb-2">IELTS Listening Test</h2>
                            <p className="text-sm font-bold text-rose-500 uppercase tracking-widest">{mockTestData.title}</p>
                        </div>

                        {/* Mode Selection Cards */}
                        <div className="px-10 py-10">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Select your preferred test mode</p>

                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                {/* Full Mock Card */}
                                <button
                                    onClick={() => setTestMode('full')}
                                    className={`group relative text - left p - 6 rounded - 2xl border - 2 transition - all duration - 300 hover: shadow - xl ${testMode === 'full' ? 'border-rose-400 bg-rose-50/30 ring-4 ring-rose-100' : 'border-slate-100 hover:border-slate-300 bg-slate-50'} `}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w - 12 h - 12 rounded - xl flex items - center justify - center text - xl ${testMode === 'full' ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : 'bg-white text-slate-400'} `}>🏆</div>
                                        {testMode === 'full' && <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center"><svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>}
                                    </div>
                                    <h3 className="text-lg font-black text-slate-800 mb-1">Full Mock Test</h3>
                                    <p className="text-[13px] text-slate-500 leading-relaxed font-medium">Sequential flow from Part 1 to 4. Strict exam conditions.</p>
                                </button>

                                {/* Practice Card */}
                                <button
                                    onClick={() => setTestMode('practice')}
                                    className={`group relative text - left p - 6 rounded - 2xl border - 2 transition - all duration - 300 hover: shadow - xl ${testMode === 'practice' ? 'border-rose-400 bg-rose-50/30 ring-4 ring-rose-100' : 'border-slate-100 hover:border-slate-300 bg-slate-50'} `}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w - 12 h - 12 rounded - xl flex items - center justify - center text - xl ${testMode === 'practice' ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : 'bg-white text-slate-400'} `}>🎯</div>
                                        {testMode === 'practice' && <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center"><svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>}
                                    </div>
                                    <h3 className="text-lg font-black text-slate-800 mb-1">Practice Mode</h3>
                                    <p className="text-[13px] text-slate-500 leading-relaxed font-medium">Select individual parts to practice. Jump between parts freely.</p>
                                </button>
                            </div>

                            <button
                                onClick={() => {
                                    setShowFullscreenPrompt(false);
                                    setTestStarted(true);
                                    const el = document.documentElement;
                                    if (el.requestFullscreen) el.requestFullscreen().catch(() => { });
                                    // Start audio on interaction
                                    audioRef.current?.play().catch(e => console.error("Audio trigger failed:", e));
                                }}
                                className="w-full py-5 bg-slate-900 border-2 border-slate-900 hover:bg-slate-800 text-white font-black text-base rounded-2xl transition-all duration-300 shadow-xl shadow-slate-900/20 active:scale-[0.98]"
                            >
                                Start Your Test Now
                            </button>

                            <p className="mt-4 text-[11px] text-center font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                                <span className="w-1.5 h-1.5 bg-rose-400 rounded-full"></span>
                                Good luck with your preparation
                                <span className="w-1.5 h-1.5 bg-rose-400 rounded-full"></span>
                            </p>
                        </div>
                    </div>
                </div>
            )}


            {/* Right-click Context Menu */}
            {ctxMenu && (
                <div
                    className="ctx-menu fixed z-[300]"
                    style={{ top: ctxMenu.y, left: ctxMenu.x }}
                    onClick={e => e.stopPropagation()}
                >
                    <button className="ctx-item" onClick={applyHighlight}>Highlight</button>
                    <button className="ctx-item" style={{ background: '#2563eb', color: 'white' }} onMouseEnter={e => (e.currentTarget.style.background = '#1d4ed8')} onMouseLeave={e => (e.currentTarget.style.background = '#2563eb')} onClick={openNote}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm17.71-10.21a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
                        Notes
                    </button>
                    <button className="ctx-item" onClick={clearHighlightSelection}>Clear</button>
                    <button className="ctx-item" onClick={clearAllAction}>Clear all</button>
                </div>
            )}

            {/* Active sticky note popup */}
            {activeNote && (
                <div
                    className="note-popup fixed z-[250] shadow-xl"
                    style={{ top: activeNote.y + 30, left: activeNote.x, width: 240, background: '#ffe14d', border: '1px solid #e6c800', borderRadius: 2 }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Title bar — drag handle */}
                    <div
                        onMouseDown={handleNoteDragStart}
                        style={{ background: '#f5c800', padding: '4px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'move', userSelect: 'none' }}
                    >
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#5a4000', letterSpacing: '0.08em' }}>✎ NOTE</span>
                        <button onClick={() => setActiveNote(null)} style={{ fontSize: 12, color: '#5a4000', background: 'none', border: '1px solid #b8970a', borderRadius: 2, width: 16, height: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>&times;</button>
                    </div>
                    {/* Note textarea — just write freely */}
                    <textarea
                        autoFocus
                        value={activeNote.noteText}
                        onChange={e => {
                            const updated = { ...activeNote, noteText: e.target.value };
                            setActiveNote(updated);
                            setNotes(prev => prev.map(n => n.id === activeNote.id ? updated : n));
                        }}
                        style={{ width: '100%', minHeight: 140, background: '#ffe14d', border: 'none', outline: 'none', padding: '8px', fontSize: 13, fontWeight: 600, color: '#3b2e00', resize: 'none', boxSizing: 'border-box', display: 'block' }}
                    />

                </div>
            )}

            {/* Notes side panel */}
            {showNotesPanel && (
                <div
                    className="fixed right-0 top-14 bottom-16 z-[150] bg-white border-l border-slate-200 shadow-2xl overflow-y-auto"
                    style={{ width: 280 }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Clean header */}
                    <div style={{ background: '#f7d0d0', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e8baba' }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>Notes</span>
                        <button onClick={() => setShowNotesPanel(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#64748b', lineHeight: 1 }}>×</button>
                    </div>
                    {notes.length === 0 ? (
                        <p style={{ fontSize: 12, color: '#94a3b8', padding: '20px 16px', textAlign: 'center' }}>No notes yet.<br />Select text → right-click → Notes</p>
                    ) : (
                        <div>
                            {notes.map(n => (
                                <div
                                    key={n.id}
                                    style={{ padding: '18px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                                    onDoubleClick={() => setActiveNote(n)}
                                >
                                    <span style={{ fontSize: 13, color: '#334155', fontWeight: 500 }}>{n.noteText}</span>
                                </div>
                            ))}
                            {/* Clear All at bottom */}
                            <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f5f9' }}>
                                <button
                                    onClick={() => { setNotes([]); clearHighlightsFromDom(); }}
                                    style={{ fontSize: 12, color: '#ef4444', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}


            {/* Submitting overlay */}
            {isSubmitting && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm font-bold text-slate-700">Saving your results...</p>
                    </div>
                </div>
            )}

            {/* Finish Test Confirmation Modal */}
            {showFinishModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center">
                        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">⚠️</div>
                        <h2 className="text-xl font-black text-slate-800 mb-2">Finish Test?</h2>
                        <p className="text-sm text-slate-500 font-medium mb-6">
                            Are you sure you want to finish? Once submitted, you cannot change your answers.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowFinishModal(false)}
                                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={finishTest}
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors"
                            >
                                Yes, Finish
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sticky Top Header */}
            <header className="fixed top-0 left-0 right-0 h-14 bg-[#f1d4d4] flex items-center justify-between px-6 z-50 border-b border-rose-200">
                <div className="flex flex-col justify-center h-full">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 leading-none">{mockTestData.title}</span>
                    <div className="flex items-center gap-3 mt-0.5">
                        <span className={`text - [11px] font - bold tabular - nums ${timeLeft < 300 ? 'text-rose-600 animate-pulse' : 'text-slate-700'} `}>
                            ⏱ {formatTime(timeLeft)} remaining
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 h-full">
                    <button
                        onClick={() => setShowFinishModal(true)}
                        className="px-6 py-1.5 bg-white border border-rose-300 rounded text-[11px] font-bold text-slate-900 hover:bg-rose-50 transition-colors shadow-sm"
                    >
                        Finish test
                    </button>
                    {/* Notes Icon */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowNotesPanel(v => !v); setCtxMenu(null); }}
                        className="relative flex items-center gap-1 px-2 py-1 rounded hover:bg-rose-100/60 transition-colors"
                        title="My Notes"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        {notes.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full text-[9px] font-black text-white flex items-center justify-center">{notes.length}</span>
                        )}
                    </button>
                    <div className="flex items-center gap-3 text-slate-600">
                        <button title="Wi-Fi">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.906 14.142 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
                        </button>
                        <button title="Menu">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 mt-14 mb-16 overflow-y-auto px-6 py-6 pb-24">
                {currentPartData && (
                    <div className="max-w-[1200px] mx-auto bg-white border border-slate-300 shadow-sm min-h-[600px]">
                        {/* Part Header */}
                        <div className="border-b border-slate-200 bg-slate-50/50 p-6">
                            <h2 className="text-[22px] font-medium text-slate-800 mb-2">{currentPartData.name}</h2>
                            {getQuestionRangeForPart(currentPartData.id) && (
                                <p className="text-[14px] text-slate-600 font-medium">{getQuestionRangeForPart(currentPartData.id)}</p>
                            )}
                        </div>

                        {/* Questions */}
                        <div className="p-8">
                            <div className="space-y-10">
                                {currentPartData.questions.map((q: any) => (
                                    <div key={q.id}>
                                        {/* Instruction Block */}
                                        {q.instructionGroup && (
                                            <div className="mb-8">
                                                <div className="bg-[#fcfaf7] border-l-4 border-rose-400 rounded-r-xl p-5 shadow-sm">
                                                    <h3 className="text-[15px] font-black text-slate-800 mb-2">{q.instructionGroup.title}</h3>
                                                    <div className="text-[14px] text-slate-700 font-medium leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: q.instructionGroup.prompt }} />
                                                </div>
                                            </div>
                                        )}

                                        {/* Question Renderers */}
                                        <div className="w-full">
                                            {q.type === 'multiple_choice' && <MultipleChoiceRenderer data={q} currentAnswer={answers[q.id]} onAnswerChange={(a) => handleAnswer(q.id, a)} />}
                                            {q.type === 'fill_in_blanks' && <FillInBlanksRenderer data={q} currentAnswer={answers[q.id]} onAnswerChange={(a) => handleAnswer(q.id, a)} />}
                                            {q.type === 'inline_blanks' && <InlineBlanksRenderer data={q} answers={answers} onAnswerChange={handleAnswer} />}
                                            {q.type === 'multiple_choice_checkbox' && <MultipleChoiceCheckboxRenderer data={q} currentAnswer={answers[q.id]} onAnswerChange={(a) => handleAnswer(q.id, a)} />}
                                            {q.type === 'matching_dropdown' && <MatchingDropdownRenderer data={q} answers={answers} onAnswerChange={handleAnswer} />}
                                            {q.type === 'matching_table' && <MatchingTableRenderer data={q} answers={answers} onAnswerChange={handleAnswer} />}
                                            {q.type === 'matching_drag_drop' && <MatchingDragDropRenderer data={q} answers={answers} onAnswerChange={handleAnswer} />}
                                            {q.type === 'fill_in_table' && <FillInTableRenderer data={q} answers={answers} onAnswerChange={handleAnswer} />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Sticky Bottom Footer */}
            <footer className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-300 flex items-center px-4 z-50">
                <div className="flex gap-8 lg:gap-16 w-full px-4 justify-center">
                    {mockTestData.parts.map((part: any) => {
                        const answered = getAnsweredCountForPart(part.id);
                        const total = getTotalQuestionsForPart(part.id);
                        const isActive = activePart === part.id;
                        const questionList = getQuestionsListForPart(part.id);

                        return (
                            <div
                                key={part.id}
                                className={`flex items - center gap - 3 cursor - pointer group`}
                                onClick={() => {
                                    setActivePart(part.id);
                                    if (testMode === 'practice') {
                                        setAudioPart(part.id);
                                    }
                                }}
                            >
                                {/* Part Label */}
                                <div className="flex items-center gap-1.5">
                                    <span className={`text-[13px] font-black transition-colors ${isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'} `}>
                                        {part.name}
                                    </span>
                                    {!isActive && (
                                        <span className="text-[11px] text-slate-300 font-medium">{answered}/{total || 10}</span>
                                    )}
                                </div>

                                {/* Question Boxes (active part only) */}
                                {isActive && total > 0 && (
                                    <div className="flex items-center gap-1">
                                        {questionList.map((q, idx) => {
                                            let isAnswered = false;
                                            if (q.id.includes('_part_')) {
                                                const baseId = q.id.split('_part_')[0];
                                                const partIdx = parseInt(q.id.split('_part_')[1], 10);
                                                isAnswered = (answers[baseId]?.split(',').length || 0) > partIdx;
                                            } else {
                                                isAnswered = !!answers[q.id];
                                            }
                                            return (
                                                <div
                                                    key={idx}
                                                    className={`w-6 h-6 flex items-center justify-center text-[11px] font-medium border transition-colors ${isAnswered ? 'border-slate-800 bg-slate-800 text-white' : 'border-blue-400 text-slate-700 bg-white'
                                                        } `}
                                                >
                                                    {q.number}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </footer>
        </div>
    );
};

export default ListeningTestEngine;
