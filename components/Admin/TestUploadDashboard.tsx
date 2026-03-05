
import React, { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { parseSimpleContent } from '../TestEngine/QuestionTypes';

interface TestPart {
    id: number;
    name: string;
    audioUrl: string;
    instructions: string;
    questions: any[];
    simpleContent?: string;
}

const TestUploadDashboard: React.FC = () => {
    const [title, setTitle] = useState('');
    const [testType, setTestType] = useState<'Listening' | 'Reading'>('Listening');
    const [totalQuestions, setTotalQuestions] = useState(40);
    const [totalMinutes, setTotalMinutes] = useState(30);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [parts, setParts] = useState<TestPart[]>([
        { id: 1, name: 'Part 1', audioUrl: '', instructions: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.', questions: [], simpleContent: '' }
    ]);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddPart = () => {
        const nextId = parts.length + 1;
        setParts([...parts, {
            id: nextId,
            name: `Part ${nextId}`,
            audioUrl: '',
            instructions: '',
            questions: [],
            simpleContent: ''
        }]);
    };

    const handlePartChange = (index: number, field: keyof TestPart, value: any) => {
        const newParts = [...parts];
        newParts[index] = { ...newParts[index], [field]: value };
        setParts(newParts);
    };

    const handleFileUpload = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `test-audio/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
            .from('tests')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('tests')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        setMessage({ type: '', text: '' });

        try {
            let finalImageUrl = '';
            if (audioFile) {
                finalImageUrl = await handleFileUpload(audioFile);
            }

            // Convert simpleContent to the structure the engine expects
            const formattedParts = parts.map(part => {
                const lines = (part.simpleContent || '').split('\n').filter(l => l.trim());

                // For now, we'll treat the entire simpleContent as one 'inline_blanks' question for simplicity in this V1
                // In a more complex version, we could split by headers to create multiple questions
                return {
                    id: part.id,
                    name: part.name,
                    audioUrl: part.audioUrl || finalImageUrl, // Use part audio or global audio
                    instructions: part.instructions,
                    questions: [
                        {
                            id: `p${part.id}_q1`,
                            number: (part.id - 1) * 10 + 1,
                            type: 'inline_blanks',
                            simpleContent: lines
                        }
                    ]
                };
            });

            const testData = {
                title,
                testType,
                totalQuestions,
                totalMinutes,
                audioUrl: finalImageUrl,
                parts: formattedParts
            };

            const tableName = testType === 'Listening' ? 'listening_tests' : 'reading_tests';

            const { error } = await supabase
                .from(tableName)
                .insert([{
                    title,
                    type: testType,
                    data: testData,
                    created_at: new Date()
                }]);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Test uploaded successfully!' });
            // Reset form
            setTitle('');
            setAudioFile(null);
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Error uploading test' });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto pb-24">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">UPLOAD NEW TEST</h1>
                    <p className="text-slate-500 font-medium mt-1">Create premium IELTS tests using Simple Syntax.</p>
                </div>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl mb-6 font-bold text-sm flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}>
                    <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info Card */}
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Test Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Cambridge IELTS 18 – Test 2"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-slate-700"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Test Type</label>
                            <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                                {['Listening', 'Reading'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setTestType(type as any)}
                                        className={`flex-1 py-3 rounded-xl font-bold transition-all ${testType === type ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Audio Pass (MP3)</label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full bg-blue-50/50 border-2 border-dashed border-blue-100 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-all group"
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                                    accept="audio/*"
                                    className="hidden"
                                />
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-blue-50 flex items-center justify-center text-blue-500 mb-2 group-hover:scale-110 transition-transform">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                </div>
                                <span className="text-[11px] font-black text-blue-600 uppercase tracking-wider">
                                    {audioFile ? audioFile.name : 'Select MP3 File'}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Total Qs</label>
                            <input
                                type="number"
                                value={totalQuestions}
                                onChange={(e) => setTotalQuestions(parseInt(e.target.value))}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-slate-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Duration (Min)</label>
                            <input
                                type="number"
                                value={totalMinutes}
                                onChange={(e) => setTotalMinutes(parseInt(e.target.value))}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-slate-700"
                            />
                        </div>
                    </div>
                </div>

                {/* Parts Content */}
                <div className="space-y-6">
                    {parts.map((part, index) => (
                        <div key={part.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="font-black text-slate-800 tracking-wide text-sm">{part.name.toUpperCase()}</h3>
                                <div className="text-[10px] font-bold text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full bg-white capitalize">{testType} Mode</div>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Instructions</label>
                                    <input
                                        type="text"
                                        value={part.instructions}
                                        onChange={(e) => handlePartChange(index, 'instructions', e.target.value)}
                                        placeholder="e.g. Complete the notes below..."
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 focus:bg-white outline-none transition-all font-bold text-slate-700 text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Question Content (Simple Syntax)</label>
                                        <div className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">Use [q1, 1] for blanks</div>
                                    </div>
                                    <textarea
                                        value={part.simpleContent}
                                        onChange={(e) => handlePartChange(index, 'simpleContent', e.target.value)}
                                        placeholder={`### Section Title\n* Point one [q1, 1]\n* Point two [q2, 2]`}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:bg-white outline-none transition-all font-medium text-slate-700 h-40 resize-none leading-relaxed text-[15px]"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Part Button */}
                <button
                    type="button"
                    onClick={handleAddPart}
                    className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-black text-xs uppercase tracking-widest hover:border-blue-200 hover:text-blue-500 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                    Add Another Part
                </button>

                {/* Submit Action */}
                <div className="pt-8 sticky bottom-8">
                    <button
                        type="submit"
                        disabled={isUploading}
                        className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 ${isUploading
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-900 text-white hover:bg-blue-600 hover:-translate-y-1 active:translate-y-0 shadow-slate-900/10'
                            }`}
                    >
                        {isUploading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-slate-300 border-t-white rounded-full animate-spin"></div>
                                Uploading to Server...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                PUBLISH TEST NOW
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TestUploadDashboard;
