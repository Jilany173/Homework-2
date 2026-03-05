
import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import * as XLSX from 'xlsx';

const testRegistry = {
    listening: [
        {
            id: 'cam18_listening',
            title: 'Cambridge IELTS 18 – Listening test 1',
            type: 'listening',
            parts: 4,
            questions: 40,
            duration: '28 min',
            status: 'active',
            partAudios: [
                { part: 1, file: '/audio/cambridge18_part1.mp3' },
                { part: 2, file: '/audio/cambridge18_part2.mp3' },
                { part: 3, file: '/audio/cambridge18_part3.mp3' },
                { part: 4, file: '/audio/cambridge18_part4.mp3' },
            ],
        },
        {
            id: 'cam18_listening_test2',
            title: 'Cambridge IELTS 18 – Listening test 2',
            type: 'listening',
            parts: 4,
            questions: 40,
            duration: '30 min',
            status: 'active',
            partAudios: [
                { part: 1, file: '/audio/cam18_test2_part1.mp3' },
                { part: 2, file: '/audio/cam18_test2_part2.mp3' },
                { part: 3, file: '/audio/cam18_test2_part3.mp3' },
                { part: 4, file: '/audio/cam18_test2_part4.mp3' },
            ],
        }
    ],
    reading: [
        {
            id: 'cam18_reading',
            title: 'Cambridge IELTS 18 – Reading test 1',
            type: 'reading',
            parts: 3,
            questions: 40,
            duration: '60 min',
            status: 'active',
            partAudios: [],
        }
    ],
    writing: [
        {
            id: 'cam18_writing',
            title: 'Cambridge IELTS 18 – Writing test 1',
            type: 'writing',
            parts: 2,
            questions: 2,
            duration: '60 min',
            status: 'active',
            partAudios: [],
        }
    ],
    package: [] as any[],
};

type Tab = 'listening' | 'reading' | 'writing' | 'package';

const partRanges: Record<string, [number, number][]> = {
    cam18_listening: [[1, 10], [11, 20], [21, 30], [31, 40]],
    cam18_listening_test2: [[1, 10], [11, 20], [21, 30], [31, 40]],
    cam18_reading: [[1, 13], [14, 26], [27, 40]],
};

const statusBadge = (status: string) => {
    if (status === 'active')
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-600">Active</span>;
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">Draft</span>;
};

const TestLibrary: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('listening');
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState<string>('answers');
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const [answerKeys, setAnswerKeys] = useState<Record<string, Record<number, string>>>({});
    const [loading, setLoading] = useState<Record<string, boolean>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importingFor, setImportingFor] = useState<string | null>(null);
    const [isCreatingPackage, setIsCreatingPackage] = useState(false);
    const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
    const [editingPackageName, setEditingPackageName] = useState<string | null>(null);
    const [packages, setPackages] = useState<any[]>([]);
    const [dynamicListeningTests, setDynamicListeningTests] = useState<any[]>([]);

    // Package Builder state
    const [packageName, setPackageName] = useState('');
    const [activeTestTab, setActiveTestTab] = useState('Test 1');
    const defaultTestForm = { listeningId: '', readingId: '', writingId: '', speakingId: '', id: null as string | null };
    const [packageTests, setPackageTests] = useState<{ [key: string]: typeof defaultTestForm }>({
        'Test 1': { ...defaultTestForm },
        'Test 2': { ...defaultTestForm },
        'Test 3': { ...defaultTestForm },
        'Test 4': { ...defaultTestForm },
    }); useEffect(() => {
        const fetchPackages = async () => {
            const { data } = await supabase.from('test_packages').select('*').order('created_at', { ascending: false });
            if (data) setPackages(data);
        };
        fetchPackages();
    }, []);

    useEffect(() => {
        const fetchDynamicTests = async () => {
            const { data, error } = await supabase
                .from('listening_tests')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) {
                const formatted = data.map(item => ({
                    id: item.id,
                    title: item.title,
                    type: 'listening',
                    parts: item.data.parts.length,
                    questions: item.data.totalQuestions,
                    duration: `${item.data.totalMinutes} min`,
                    status: 'active',
                    dynamic: true // Mark as dynamic
                }));
                setDynamicListeningTests(formatted);
            }
        };
        fetchDynamicTests();
    }, []);

    const tabs: { key: Tab; label: string; icon: string }[] = [
        { key: 'listening', label: 'Listening', icon: '🎧' },
        { key: 'reading', label: 'Reading', icon: '📖' },
        { key: 'writing', label: 'Writing', icon: '✍️' },
        { key: 'package', label: 'Package', icon: '📦' },
    ];

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    // Download Excel template
    const downloadTemplate = (testId: string, totalQ: number) => {
        const ranges = partRanges[testId] || [[1, totalQ]];
        const rows: any[] = [['Question Number', 'Correct Answer', 'Part']];
        ranges.forEach(([start, end], pIdx) => {
            for (let q = start; q <= end; q++) {
                rows.push([q, '', `Part ${pIdx + 1}`]);
            }
        });
        const ws = XLSX.utils.aoa_to_sheet(rows);
        ws['!cols'] = [{ wch: 18 }, { wch: 20 }, { wch: 10 }];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Answer Key');
        XLSX.writeFile(wb, `${testId}_answer_key_template.xlsx`);
    };

    // Handle Excel file import
    const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !importingFor) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const data = new Uint8Array(evt.target?.result as ArrayBuffer);
                const wb = XLSX.read(data, { type: 'array' });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

                const parsed: Record<number, string> = {};
                // Skip header row, expect [Question Number, Correct Answer, ...]
                rows.slice(1).forEach(row => {
                    const qNum = Number(row[0]);
                    const ans = String(row[1] ?? '').trim();
                    if (!isNaN(qNum) && qNum > 0 && ans) {
                        parsed[qNum] = ans;
                    }
                });

                if (Object.keys(parsed).length === 0) {
                    showToast('Excel ফাইলে কোনো উত্তর পাওয়া যায়নি। Format চেক করুন।', 'error');
                    return;
                }

                setAnswerKeys(prev => ({ ...prev, [importingFor]: { ...(prev[importingFor] || {}), ...parsed } }));
                showToast(`✓ ${Object.keys(parsed).length}টি উত্তর Excel থেকে import হয়েছে!`);
            } catch {
                showToast('Excel পার্স করতে সমস্যা হয়েছে। সঠিক ফরম্যাটে ফাইল দিন।', 'error');
            }
        };
        reader.readAsArrayBuffer(file);
        // Reset input so same file can be re-imported
        e.target.value = '';
    };

    // Load answer key from Supabase when card opens
    const loadAnswerKey = async (testId: string) => {
        setLoading(prev => ({ ...prev, [testId]: true }));
        const { data, error } = await supabase
            .from('test_answer_keys')
            .select('answers')
            .eq('test_id', testId)
            .maybeSingle();

        if (data?.answers) {
            // Convert {"1": "B", "2": "market"} → {1: "B", 2: "market"}
            const numericKey: Record<number, string> = {};
            Object.entries(data.answers as Record<string, string>).forEach(([k, v]) => {
                numericKey[Number(k)] = String(v);
            });
            setAnswerKeys(prev => ({ ...prev, [testId]: numericKey }));
        }
        setLoading(prev => ({ ...prev, [testId]: false }));
    };

    const handleExpandCard = (testId: string) => {
        if (expandedCard === testId) {
            setExpandedCard(null);
        } else {
            setExpandedCard(testId);
            loadAnswerKey(testId);
        }
    };

    const handleAnswerChange = (testId: string, qNum: number, value: string) => {
        setAnswerKeys(prev => ({
            ...prev,
            [testId]: { ...(prev[testId] || {}), [qNum]: value },
        }));
    };

    const handleSaveAnswers = async (testId: string, testType: string) => {
        setLoading(prev => ({ ...prev, [`save_${testId}`]: true }));
        const key = answerKeys[testId] || {};

        // Convert {1: "B"} → {"1": "B"} for JSONB
        const jsonbAnswers: Record<string, string> = {};
        Object.entries(key).forEach(([k, v]) => { jsonbAnswers[String(k)] = String(v); });


        const { error } = await supabase
            .from('test_answer_keys')
            .upsert({
                test_id: testId,
                test_type: testType,
                answers: jsonbAnswers,
            }, { onConflict: 'test_id' });

        setLoading(prev => ({ ...prev, [`save_${testId}`]: false }));

        if (error) {
            showToast(`Error: ${error.message}`, 'error');
        } else {
            showToast('Answer key saved to Supabase ✓');
        }
    };

    const handleCreatePackage = async () => {
        if (!packageName.trim()) {
            showToast('Please enter a Package Name', 'error');
            return;
        }

        setIsCreatingPackage(true);
        let hasError = false;

        for (const testNum of ['Test 1', 'Test 2', 'Test 3', 'Test 4']) {
            const form = packageTests[testNum];
            const hasData = form.listeningId || form.readingId || form.writingId || form.speakingId;

            if (hasData || form.id) { // Only process if there's data or it's an existing record
                if (hasData) {
                    // If it has data, insert/update
                    if (form.id) {
                        const { error } = await supabase.from('test_packages').update({
                            name: packageName,
                            test_number: testNum,
                            listening_id: form.listeningId || null,
                            reading_id: form.readingId || null,
                            writing_id: form.writingId || null,
                            speaking_id: form.speakingId || null,
                        }).eq('id', form.id);
                        if (error) {
                            console.error(`Error updating package ${testNum} (ID: ${form.id}):`, error);
                            hasError = true;
                        }
                    } else {
                        const { error } = await supabase.from('test_packages').insert({
                            name: packageName,
                            test_number: testNum,
                            listening_id: form.listeningId || null,
                            reading_id: form.readingId || null,
                            writing_id: form.writingId || null,
                            speaking_id: form.speakingId || null,
                        });
                        if (error) {
                            console.error(`Error inserting package ${testNum}:`, error);
                            hasError = true;
                        }
                    }
                } else if (form.id && !hasData) {
                    // It had an ID, but now all fields are empty -> delete it.
                    const { error } = await supabase.from('test_packages').delete().eq('id', form.id);
                    if (error) {
                        console.error(`Error deleting package ${testNum} (ID: ${form.id}):`, error);
                        hasError = true;
                    }
                }
            }
        }

        setIsCreatingPackage(false);

        if (hasError) {
            showToast(`There was an error saving some tests. Please try again.`, 'error');
        } else {
            showToast(editingPackageName ? 'Test package updated successfully! ✓' : 'Test package created successfully! ✓');
            setPackageName('');
            setActiveTestTab('Test 1');
            setPackageTests({
                'Test 1': { listeningId: '', readingId: '', writingId: '', speakingId: '', id: null },
                'Test 2': { listeningId: '', readingId: '', writingId: '', speakingId: '', id: null },
                'Test 3': { listeningId: '', readingId: '', writingId: '', speakingId: '', id: null },
                'Test 4': { listeningId: '', readingId: '', writingId: '', speakingId: '', id: null },
            });
            setEditingPackageName(null);
            setIsPackageModalOpen(false);
            // Refresh packages list
            const { data } = await supabase.from('test_packages').select('*').order('created_at', { ascending: false });
            if (data) setPackages(data);
        }
    };

    const getAnsweredCount = (testId: string) => {
        const key = answerKeys[testId] || {};
        return Object.values(key).filter(v => (v as string).trim() !== '').length;
    };

    const mergedRegistry = {
        ...testRegistry,
        listening: [...testRegistry.listening, ...dynamicListeningTests]
    };
    const currentTests = mergedRegistry[activeTab] || [];

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Test Library</h1>
                <p className="mt-1 text-sm text-slate-500 font-medium">Manage IELTS practice tests — Listening, Reading & Writing.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.key
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        <span>{tab.icon}</span>{tab.label}
                        <span className={`ml-1 text-[11px] rounded-full px-1.5 py-0.5 font-black ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            {mergedRegistry[tab.key]?.length || 0}
                        </span>
                    </button>
                ))}
            </div>

            {/* Toast */}
            {toast && (
                <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${toast.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    : 'bg-rose-50 border border-rose-200 text-rose-700'
                    }`}>
                    {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
                </div>
            )}

            {/* Test Cards or Package Builder */}
            {activeTab === 'package' ? (
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Test Packages</h2>
                            <p className="text-sm font-medium text-slate-500 mt-0.5">Manage bundled tests for students.</p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingPackageName(null);
                                setPackageName('');
                                setActiveTestTab('Test 1');
                                setPackageTests({
                                    'Test 1': { listeningId: '', readingId: '', writingId: '', speakingId: '', id: null },
                                    'Test 2': { listeningId: '', readingId: '', writingId: '', speakingId: '', id: null },
                                    'Test 3': { listeningId: '', readingId: '', writingId: '', speakingId: '', id: null },
                                    'Test 4': { listeningId: '', readingId: '', writingId: '', speakingId: '', id: null },
                                });
                                setIsPackageModalOpen(true);
                            }}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
                        >
                            <span>+</span> Create Package
                        </button>
                    </div>

                    {packages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
                            <span className="text-5xl mb-4">📦</span>
                            <h3 className="text-lg font-black text-slate-700 mb-2">No Packages yet</h3>
                            <p className="text-sm text-slate-400 font-medium">Click the button above to create a test package.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {Object.entries(
                                packages.reduce((acc: Record<string, any[]>, pkg) => {
                                    if (!acc[pkg.name]) acc[pkg.name] = [];
                                    acc[pkg.name].push(pkg);
                                    return acc;
                                }, {})
                            ).map(([groupName, groupPkgs]) => (
                                <div key={groupName} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:border-blue-300 transition-colors">
                                    <div className="flex gap-3 items-center mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">📚</div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-black text-slate-800">{groupName}</h3>
                                            <p className="text-xs text-slate-400 font-bold mt-0.5">{(groupPkgs as any[]).length} Tests in bundle</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setEditingPackageName(groupName);
                                                setPackageName(groupName);
                                                setActiveTestTab('Test 1');

                                                const newTests = {
                                                    'Test 1': { listeningId: '', readingId: '', writingId: '', speakingId: '', id: null as string | null },
                                                    'Test 2': { listeningId: '', readingId: '', writingId: '', speakingId: '', id: null as string | null },
                                                    'Test 3': { listeningId: '', readingId: '', writingId: '', speakingId: '', id: null as string | null },
                                                    'Test 4': { listeningId: '', readingId: '', writingId: '', speakingId: '', id: null as string | null },
                                                };

                                                (groupPkgs as any[]).forEach(pkg => {
                                                    const tNum = pkg.test_number || 'Test 1';
                                                    if (newTests[tNum as keyof typeof newTests]) {
                                                        newTests[tNum as keyof typeof newTests] = {
                                                            listeningId: pkg.listening_id || '',
                                                            readingId: pkg.reading_id || '',
                                                            writingId: pkg.writing_id || '',
                                                            speakingId: pkg.speaking_id || '',
                                                            id: pkg.id
                                                        };
                                                    }
                                                });

                                                setPackageTests(newTests);
                                                setIsPackageModalOpen(true);
                                            }}
                                            className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg text-xs font-bold transition-colors"
                                        >
                                            Edit Tests
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : currentTests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <span className="text-5xl mb-4">{tabs.find(t => t.key === activeTab)?.icon}</span>
                    <h3 className="text-lg font-black text-slate-700 mb-2">No {activeTab} tests yet</h3>
                    <p className="text-sm text-slate-400 font-medium">Add test data files to <code className="bg-slate-100 px-1 rounded">src/data/mockTests/</code></p>
                </div>
            ) : (
                <div className="space-y-4">
                    {currentTests.map((test: any) => {
                        const isExpanded = expandedCard === test.id;
                        const answeredCount = getAnsweredCount(test.id);
                        const ranges = partRanges[test.id] || [[1, test.questions]];
                        const answerKey = answerKeys[test.id] || {};
                        const isSaving = loading[`save_${test.id}`];
                        const isLoadingKey = loading[test.id];

                        return (
                            <div key={test.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                {/* Card Header */}
                                <div className="flex items-start justify-between p-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-base font-black text-slate-800">{test.title}</h3>
                                            {statusBadge(test.status)}
                                            {answeredCount > 0 && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-600">
                                                    {answeredCount}/{test.questions} Answers
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-2">
                                            <span>📋 {test.parts} Parts</span>
                                            <span>❓ {test.questions} Questions</span>
                                            <span>⏱ {test.duration}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <a
                                            href={`/#/practice-zone/listening/${test.id}`}
                                            target="_blank" rel="noreferrer"
                                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                                        >
                                            Preview →
                                        </a>
                                        <button
                                            onClick={() => handleExpandCard(test.id)}
                                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${isExpanded ? 'bg-slate-800 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                }`}
                                        >
                                            {isExpanded ? '▲ Close' : '✏️ Manage'}
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded */}
                                {isExpanded && (
                                    <div className="border-t border-slate-100">
                                        {/* Sub-tabs */}
                                        <div className="flex border-b border-slate-100 bg-slate-50">
                                            {['answers', ...(test.type === 'listening' ? ['audio'] : [])].map(sec => (
                                                <button
                                                    key={sec}
                                                    onClick={() => setActiveSection(sec)}
                                                    className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeSection === sec
                                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                                        : 'text-slate-500 hover:text-slate-700'
                                                        }`}
                                                >
                                                    {sec === 'answers' ? '✅ Answer Key' : '🎧 Audio Files'}
                                                </button>
                                            ))}
                                        </div>

                                        {/* ANSWER KEY */}
                                        {activeSection === 'answers' && (
                                            <div className="p-6">
                                                {isLoadingKey ? (
                                                    <div className="flex items-center gap-3 py-12 justify-center text-slate-400">
                                                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                                        Loading from Supabase...
                                                    </div>
                                                ) : (
                                                    <>
                                                        {/* Hidden file input */}
                                                        <input
                                                            ref={fileInputRef}
                                                            type="file"
                                                            accept=".xlsx,.xls"
                                                            className="hidden"
                                                            onChange={handleExcelImport}
                                                        />

                                                        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                                                            <p className="text-sm font-bold text-slate-600">
                                                                Correct answers: <span className="text-blue-600">{answeredCount}/{test.questions}</span>
                                                            </p>
                                                            <div className="flex gap-2">
                                                                {/* Download Template */}
                                                                <button
                                                                    onClick={() => downloadTemplate(test.id, test.questions)}
                                                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                                                                >
                                                                    📥 Template Download
                                                                </button>
                                                                {/* Import Excel */}
                                                                <button
                                                                    onClick={() => { setImportingFor(test.id); setTimeout(() => fileInputRef.current?.click(), 50); }}
                                                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                                                                >
                                                                    📤 Import from Excel
                                                                </button>
                                                                {/* Save to Supabase */}
                                                                <button
                                                                    onClick={() => handleSaveAnswers(test.id, test.type)}
                                                                    disabled={isSaving}
                                                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                                                                >
                                                                    {isSaving ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</> : '💾 Save to Supabase'}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {ranges.map(([start, end], pIdx) => (

                                                            <div key={pIdx} className="mb-8">
                                                                <div className="flex items-center gap-3 mb-4">
                                                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Part {pIdx + 1}</span>
                                                                    <span className="text-xs text-slate-300 font-medium">Q{start}–{end}</span>
                                                                    <div className="flex-1 h-px bg-slate-100" />
                                                                </div>
                                                                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                                                                    {Array.from({ length: end - start + 1 }, (_, i) => {
                                                                        const qNum = start + i;
                                                                        return (
                                                                            <div key={qNum} className="flex flex-col">
                                                                                <label className="text-[10px] font-black text-slate-400 mb-1 ml-0.5">Q{qNum}</label>
                                                                                <input
                                                                                    type="text"
                                                                                    value={answerKey[qNum] || ''}
                                                                                    onChange={e => handleAnswerChange(test.id, qNum, e.target.value)}
                                                                                    placeholder="—"
                                                                                    className={`px-3 py-2 border rounded-lg text-sm font-medium text-slate-700 bg-white focus:outline-none focus:border-blue-400 transition-colors ${answerKey[qNum] ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-200'
                                                                                        }`}
                                                                                />
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {/* AUDIO FILES */}
                                        {activeSection === 'audio' && (
                                            <div className="p-6 space-y-3">
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Per-Part Audio Files</p>
                                                {(test.partAudios || []).map((pa: any) => (
                                                    <div key={pa.part} className="flex items-center gap-4 bg-slate-50 rounded-xl px-4 py-3">
                                                        <span className="text-xs font-black text-slate-500 w-16 shrink-0">Part {pa.part}</span>
                                                        <code className="flex-1 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2 font-mono">{pa.file}</code>
                                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full shrink-0">✓ Uploaded</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Package Creation Modal */}
            {isPackageModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
                            <div>
                                <h2 className="text-2xl font-black text-slate-800">{editingPackageName ? `Edit ${editingPackageName}` : 'Create New Full Package'}</h2>
                                <p className="text-sm font-medium text-slate-500 mt-1">Bundle multiple mock tests into a single full-length exam.</p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsPackageModalOpen(false);
                                    setEditingPackageName(null);
                                }}
                                className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors text-xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Listening */}
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                                <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">
                                    <span className="text-lg">🎧</span> Listening Test
                                </label>
                                <select
                                    value={packageTests[activeTestTab].listeningId}
                                    onChange={e => setPackageTests(p => ({ ...p, [activeTestTab]: { ...p[activeTestTab], listeningId: e.target.value } }))}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:border-blue-500 shadow-sm"
                                >
                                    <option value="" className="text-slate-400">-- Select Listening Module --</option>
                                    {testRegistry.listening.map((t: any) => <option key={t.id} value={t.id}>{t.title}</option>)}
                                </select>
                            </div>

                            {/* Reading */}
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                                <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">
                                    <span className="text-lg">📖</span> Reading Test
                                </label>
                                <select
                                    value={packageTests[activeTestTab].readingId}
                                    onChange={e => setPackageTests(p => ({ ...p, [activeTestTab]: { ...p[activeTestTab], readingId: e.target.value } }))}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:border-blue-500 shadow-sm"
                                >
                                    <option value="" className="text-slate-400">-- Select Reading Module --</option>
                                    {testRegistry.reading.map((t: any) => <option key={t.id} value={t.id}>{t.title}</option>)}
                                </select>
                            </div>

                            {/* Writing */}
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                                <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">
                                    <span className="text-lg">✍️</span> Writing Test
                                </label>
                                <select
                                    value={packageTests[activeTestTab].writingId}
                                    onChange={e => setPackageTests(p => ({ ...p, [activeTestTab]: { ...p[activeTestTab], writingId: e.target.value } }))}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:border-blue-500 shadow-sm"
                                >
                                    <option value="" className="text-slate-400">-- Select Writing Module --</option>
                                    {testRegistry.writing.map((t: any) => <option key={t.id} value={t.id}>{t.title}</option>)}
                                </select>
                            </div>

                            {/* Speaking */}
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                                <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">
                                    <span className="text-lg">🎤</span> Speaking Test
                                </label>
                                <select
                                    value={packageTests[activeTestTab].speakingId}
                                    onChange={e => setPackageTests(p => ({ ...p, [activeTestTab]: { ...p[activeTestTab], speakingId: e.target.value } }))}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:border-blue-500 shadow-sm"
                                >
                                    <option value="" className="text-slate-400">-- Select Speaking Module --</option>
                                    {/* Speaking registry will map here futurely */}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-3xl">
                        <button
                            onClick={() => {
                                setIsPackageModalOpen(false);
                                setEditingPackageName(null);
                            }}
                            className="px-6 py-3 text-slate-500 hover:text-slate-700 text-xs font-black uppercase tracking-widest rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreatePackage}
                            disabled={isCreatingPackage}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isCreatingPackage ? 'Saving...' : (editingPackageName ? 'Update Package' : 'Save Package')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestLibrary;
