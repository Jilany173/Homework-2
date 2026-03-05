import React from 'react';

// --- Utils ---
export const parseSimpleContent = (text: string) => {
    // Regex to match [id, number]
    const regex = /\[(\w+),\s*(\d+)\]/g;
    const parts: { text: string; type: 'text' | 'inline'; inline?: { inputId: string; number: number } }[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        // Add preceding text
        if (match.index > lastIndex) {
            parts.push({ text: text.substring(lastIndex, match.index), type: 'text' });
        }
        // Add inline input
        parts.push({
            text: '',
            type: 'inline',
            inline: { inputId: match[1], number: parseInt(match[2], 10) }
        });
        lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
        parts.push({ text: text.substring(lastIndex), type: 'text' });
    }

    return parts;
};

export interface QuestionBase {
    id: string;
    number: number;
    type: 'multiple_choice' | 'fill_in_blanks' | 'inline_blanks' | 'multiple_choice_checkbox' | 'matching_dropdown' | 'matching_table' | 'matching_drag_drop' | 'fill_in_table';
    imageUrl?: string;
    instructionGroup?: {
        title: string;
        prompt: string;
    };
}

export interface MultipleChoiceQuestion extends QuestionBase {
    type: 'multiple_choice';
    questionText: string;
    options: { label: string; text: string }[];
}

export interface FillInBlanksQuestion extends QuestionBase {
    type: 'fill_in_blanks';
    prefixText?: string;
    suffixText?: string;
}

// --- Props ---
interface QuestionProps {
    data: MultipleChoiceQuestion | FillInBlanksQuestion;
    currentAnswer: string;
    onAnswerChange: (answer: string) => void;
}

export const MultipleChoiceRenderer: React.FC<QuestionProps> = ({ data, currentAnswer, onAnswerChange }) => {
    const q = data as MultipleChoiceQuestion;
    return (
        <div className="mb-8">
            <div className="flex items-start gap-3 mb-4">
                <span className="flex-shrink-0 w-6 h-6 border border-slate-300 rounded bg-slate-50 flex items-center justify-center text-[11px] font-bold text-slate-700">
                    {q.number}
                </span>
                <p className="text-[13px] text-slate-800 font-medium leading-relaxed pt-0.5">{q.questionText}</p>
            </div>
            <div className="pl-9 space-y-3">
                {q.options.map((opt, idx) => (
                    <label key={idx} className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center pt-0.5">
                            <input
                                type="radio"
                                name={`question_${q.id}`}
                                value={opt.label}
                                checked={currentAnswer === opt.label}
                                onChange={() => onAnswerChange(opt.label)}
                                className="peer sr-only"
                            />
                            <div className="w-4 h-4 rounded-full border border-slate-400 group-hover:border-slate-600 peer-checked:border-slate-800 peer-checked:border-4 transition-all"></div>
                        </div>
                        <span className="text-[13px] text-slate-700">... {opt.text}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export interface MultipleChoiceCheckboxQuestion extends QuestionBase {
    type: 'multiple_choice_checkbox';
    questionText: string;
    options: { label: string; text: string }[];
    maxSelections: number;
}

export const MultipleChoiceCheckboxRenderer: React.FC<QuestionProps> = ({ data, currentAnswer, onAnswerChange }) => {
    const q = data as MultipleChoiceCheckboxQuestion;
    const selectedOptions = currentAnswer ? currentAnswer.split(',') : [];

    const handleToggle = (label: string) => {
        let newSelection = [...selectedOptions];
        if (newSelection.includes(label)) {
            newSelection = newSelection.filter(item => item !== label);
        } else {
            if (newSelection.length < q.maxSelections) {
                newSelection.push(label);
            }
        }
        onAnswerChange(newSelection.sort().join(','));
    };

    return (
        <div className="mb-8">
            <div className="flex items-start gap-3 mb-4">
                <span className="flex-shrink-0 w-6 h-6 border border-slate-300 rounded bg-slate-50 flex items-center justify-center text-[11px] font-bold text-slate-700">
                    {q.number}
                </span>
                <p className="text-[13px] text-slate-800 font-medium leading-relaxed pt-0.5">{q.questionText}</p>
            </div>
            <div className="space-y-3">
                {q.options.map((opt, idx) => {
                    const isSelected = selectedOptions.includes(opt.label);
                    const isDisabled = !isSelected && selectedOptions.length >= q.maxSelections;
                    return (
                        <label key={idx} className={`flex items-start gap-3 cursor-pointer group ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
                            <div className="relative flex items-center justify-center pt-0.5">
                                <input
                                    type="checkbox"
                                    name={`question_${q.id}`}
                                    value={opt.label}
                                    checked={isSelected}
                                    onChange={() => handleToggle(opt.label)}
                                    className="peer sr-only"
                                    disabled={isDisabled}
                                />
                                <div className={`w-[22px] h-[22px] rounded-md transition-all flex items-center justify-center ${isSelected ? 'bg-slate-900 border-slate-900' : 'bg-slate-50 border-slate-300 border group-hover:border-slate-400'}`}>
                                    {isSelected && (
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    )}
                                </div>
                            </div>
                            <span className="text-[15px] pt-[1px]">
                                <span className={`font-bold mr-2 ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>{opt.label}.</span>
                                <span className={isSelected ? 'text-slate-900 font-medium' : 'text-slate-600 font-medium'}>{opt.text}</span>
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
};

export const FillInBlanksRenderer: React.FC<QuestionProps> = ({ data, currentAnswer, onAnswerChange }) => {
    const q = data as FillInBlanksQuestion;
    return (
        <div className="mb-6 flex items-center gap-3">
            {q.prefixText && (
                <span className="text-[13px] text-slate-800 font-medium">{q.prefixText}</span>
            )}
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={currentAnswer || ''}
                    onChange={(e) => onAnswerChange(e.target.value)}
                    className="w-48 px-3 py-1.5 border border-slate-300 rounded focus:border-slate-600 focus:ring-1 focus:ring-slate-600 outline-none transition-all text-[13px] text-slate-900 font-medium"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-100 border border-slate-200 rounded flex items-center justify-center">
                    <span className="text-[9px] font-bold text-slate-500">{q.number}</span>
                </div>
            </div>
            {q.suffixText && (
                <span className="text-[13px] text-slate-800 font-medium">{q.suffixText}</span>
            )}
        </div>
    );
};

export interface InlineBlanksQuestion extends QuestionBase {
    type: 'inline_blanks';
    content: {
        type: 'title' | 'bullet' | 'sub_bullet' | 'sub_sub_bullet' | 'text';
        text: string;
        inline?: { inputId: string; number: number };
    }[];
    simpleContent?: string[]; // New: Array of strings that can contain [id, num] and bullets
}

export const InlineBlanksRenderer: React.FC<{
    data: InlineBlanksQuestion;
    answers: Record<string, string>;
    onAnswerChange: (id: string, answer: string) => void;
}> = ({ data, answers, onAnswerChange }) => {
    // Process simpleContent if it exists
    const content = data.simpleContent ? data.simpleContent.map(line => {
        let type: 'title' | 'bullet' | 'sub_bullet' | 'sub_sub_bullet' | 'text' = 'text';
        let cleanLine = line;

        if (line.startsWith('### ')) {
            type = 'title';
            cleanLine = line.substring(4);
        } else if (line.startsWith('  * ') || line.startsWith('  - ')) {
            type = 'sub_bullet';
            cleanLine = line.substring(4);
        } else if (line.startsWith('    * ') || line.startsWith('    - ')) {
            type = 'sub_sub_bullet';
            cleanLine = line.substring(6);
        } else if (line.startsWith('* ') || line.startsWith('- ')) {
            type = 'bullet';
            cleanLine = line.substring(2);
        }

        const parts = parseSimpleContent(cleanLine);
        // We take the first part's text and its inline if it exists
        // This is a simplified version, but for IELTS it usually fits
        return {
            type,
            text: parts.map(p => p.text).join(' '), // concat all text parts
            inline: parts.find(p => p.type === 'inline')?.inline
        };
    }) : data.content;

    return (
        <div className="bg-white border border-slate-900 mx-auto w-full max-w-[700px] p-8 mt-4 text-[15px] text-slate-900 leading-relaxed">
            {content.map((part, idx) => {

                // Helper to render the inline input if it exists
                const renderInline = () => part.inline ? (
                    <span className="inline-flex items-center gap-2 mx-1">
                        <span className="flex-shrink-0 w-6 h-6 border border-slate-300 rounded-full bg-slate-50 flex items-center justify-center text-[11px] font-bold text-slate-500">
                            {part.inline.number}
                        </span>
                        <input
                            type="text"
                            value={answers[part.inline.inputId] || ''}
                            onChange={(e) => onAnswerChange(part.inline!.inputId, e.target.value)}
                            className="w-48 px-3 py-1.5 border border-slate-300 rounded focus:border-slate-600 focus:ring-1 focus:ring-slate-600 outline-none transition-all text-[15px] font-medium"
                        />
                    </span>
                ) : null;

                if (part.type === 'title') {
                    return <h3 key={idx} className="text-[20px] font-bold text-center mb-8">{part.text}</h3>;
                }

                if (part.type === 'bullet') {
                    return (
                        <div key={idx} className="flex items-start gap-3 mb-4">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-800 flex-shrink-0"></span>
                            <div>
                                {part.text}
                                {renderInline()}
                            </div>
                        </div>
                    );
                }

                if (part.type === 'sub_bullet') {
                    return (
                        <div key={idx} className="flex items-start gap-3 mb-4 ml-8">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-800 flex-shrink-0"></span>
                            <div>
                                {part.text}
                                {renderInline()}
                            </div>
                        </div>
                    );
                }

                if (part.type === 'sub_sub_bullet') {
                    return (
                        <div key={idx} className="flex items-start gap-3 mb-4 ml-16">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-800 flex-shrink-0"></span>
                            <div>
                                {part.text}
                                {renderInline()}
                            </div>
                        </div>
                    );
                }

                // Normal inline text
                return (
                    <span key={idx}>
                        {part.text}
                        {renderInline()}
                    </span>
                );
            })}
        </div>
    );
};

export interface FillInTableQuestion extends QuestionBase {
    type: 'fill_in_table';
    headers: string[];
    rows?: {
        cells: {
            content: {
                text: string;
                type: 'text' | 'bullet';
                inline?: { inputId: string; number: number };
            }[];
        }[];
    }[];
    simpleRows?: string[][]; // New: Array of row arrays, each cell is a string
}

export const FillInTableRenderer: React.FC<{
    data: FillInTableQuestion;
    answers: Record<string, string>;
    onAnswerChange: (id: string, answer: string) => void;
}> = ({ data, answers, onAnswerChange }) => {
    // Process simpleRows if they exist
    const rows = data.simpleRows ? data.simpleRows.map(row => ({
        cells: row.map(cellText => ({
            content: parseSimpleContent(cellText).map(p => ({
                text: p.text,
                type: cellText.startsWith('* ') || cellText.startsWith('- ') ? 'bullet' as const : 'text' as const,
                inline: p.inline
            }))
        }))
    })) : (data.rows || []);

    return (
        <div className="mb-8 max-w-[1000px] overflow-x-auto w-full">
            <table className="w-full border-collapse border border-slate-900 bg-white text-[14px]">
                <thead>
                    <tr className="border-b border-slate-900">
                        {data.headers.map((header, idx) => (
                            <th key={idx} className="p-3 text-center font-bold border-r border-slate-900 bg-slate-50 last:border-r-0">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="border-b border-slate-900 last:border-b-0">
                            {row.cells.map((cell, cellIdx) => (
                                <td key={cellIdx} className="p-4 border-r border-slate-900 last:border-r-0 align-top">
                                    {cell.content.map((item, itemIdx) => (
                                        <div key={itemIdx} className={`${item.type === 'bullet' ? 'flex items-start gap-2 ml-2 mb-2' : 'mb-2'}`}>
                                            {item.type === 'bullet' && <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-800 flex-shrink-0"></span>}
                                            <div className="flex-1 leading-relaxed">
                                                {item.text}
                                                {item.inline && (
                                                    <span className="inline-flex items-center gap-2 mx-1">
                                                        <span className="flex-shrink-0 w-5 h-5 border border-slate-300 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                            {item.inline.number}
                                                        </span>
                                                        <input
                                                            type="text"
                                                            value={answers[item.inline.inputId] || ''}
                                                            onChange={(e) => onAnswerChange(item.inline!.inputId, e.target.value)}
                                                            className="w-32 px-2 py-1 border border-slate-300 rounded focus:border-slate-600 focus:ring-1 focus:ring-slate-600 outline-none transition-all text-[14px] font-medium"
                                                        />
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export interface MatchingDropdownQuestion extends QuestionBase {
    type: 'matching_dropdown';
    questionText: string;
    optionsBoxTitle: string;
    options: { label: string; text: string }[];
    subQuestions: { id: string; number: number; text: string }[];
}

export const MatchingDropdownRenderer: React.FC<{
    data: MatchingDropdownQuestion;
    answers: Record<string, string>;
    onAnswerChange: (id: string, answer: string) => void;
}> = ({ data, answers, onAnswerChange }) => {
    return (
        <div className="mb-8 max-w-[800px]">
            <p className="text-[14px] text-slate-800 font-medium mb-6">{data.questionText}</p>

            {data.imageUrl && (
                <div className="mb-6">
                    <img src={data.imageUrl} alt="Question Diagram" className="max-w-full rounded-xl border border-slate-200 shadow-sm" />
                </div>
            )}

            {data.optionsBoxTitle && (
                <div className="border border-slate-800 p-6 mb-8 max-w-[600px] ml-auto mr-0">
                    <h4 className="text-[15px] font-bold text-slate-900 mb-4">{data.optionsBoxTitle}</h4>
                    <div className="space-y-2">
                        {data.options.map((opt, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <span className="text-[14px] font-bold text-slate-800 w-4">{opt.label}</span>
                                <span className="text-[14px] text-slate-800">{opt.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {data.subQuestions.map((sq, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-slate-100 pb-4 max-w-[400px]">
                        <div className="flex items-center gap-3">
                            <span className="text-[13px] font-bold text-slate-900 w-5">{sq.number}</span>
                            <span className="text-[14px] text-slate-800">{sq.text}</span>
                        </div>
                        <div className="relative">
                            <select
                                value={answers[sq.id] || ''}
                                onChange={(e) => onAnswerChange(sq.id, e.target.value)}
                                className="w-16 px-2 py-1.5 border border-slate-300 rounded focus:border-slate-600 focus:ring-1 focus:ring-slate-600 outline-none transition-all text-[13px] text-slate-900 font-bold bg-white text-center cursor-pointer appearance-none"
                            >
                                <option value="" disabled></option>
                                {data.options.map(opt => (
                                    <option key={opt.label} value={opt.label}>{opt.label}</option>
                                ))}
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export interface MatchingTableQuestion extends QuestionBase {
    type: 'matching_table';
    questionText: string;
    options: { label: string; text: string }[];
    subQuestions: { id: string; number: number; text: string }[];
}

export const MatchingTableRenderer: React.FC<{
    data: MatchingTableQuestion;
    answers: Record<string, string>;
    onAnswerChange: (id: string, answer: string) => void;
}> = ({ data, answers, onAnswerChange }) => {
    return (
        <div className="mb-8 max-w-[1000px] overflow-x-auto w-full">
            <p className="text-[14px] text-slate-800 font-medium mb-6">{data.questionText}</p>

            {data.imageUrl && (
                <div className="mb-6">
                    <img src={data.imageUrl} alt="Question Diagram" className="max-w-full rounded-xl border border-slate-200 shadow-sm" />
                </div>
            )}

            <table className="w-full border-collapse border border-slate-300 min-w-[600px] bg-white text-[13px]">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-300">
                        <th className="py-3 px-4 text-left font-bold text-slate-800 border-r border-slate-300 w-12 text-center">#</th>
                        <th className="py-3 px-4 text-left font-bold text-slate-800 border-r border-slate-300">Location</th>
                        {data.options.map((opt) => (
                            <th key={opt.label} className="py-3 px-4 font-bold text-slate-800 border-r border-slate-300 text-center w-12" title={opt.text} style={{ minWidth: '40px' }}>
                                {opt.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.subQuestions.map((sq, idx) => (
                        <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4 text-center font-bold text-slate-900 border-r border-slate-300">{sq.number}</td>
                            <td className="py-3 px-4 text-slate-800 font-medium border-r border-slate-300">{sq.text}</td>
                            {data.options.map((opt) => {
                                const isSelected = answers[sq.id] === opt.label;
                                return (
                                    <td key={opt.label} className="border-r border-slate-300 p-0 hover:bg-slate-100 transition-colors cursor-pointer text-center relative" onClick={() => onAnswerChange(sq.id, opt.label)}>
                                        <div className={`w-full h-full min-h-[44px] flex items-center justify-center absolute inset-0 ${isSelected ? 'bg-emerald-100/50' : ''}`}>
                                            {isSelected && <span className="text-emerald-500 font-bold text-lg leading-none">✓</span>}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export interface MatchingDragDropQuestion extends QuestionBase {
    type: 'matching_drag_drop';
    questionText: string;
    optionsBoxTitle: string;
    options: { label: string; text: string }[];
    subQuestions: { id: string; number: number; text: string }[];
}

export const MatchingDragDropRenderer: React.FC<{
    data: MatchingDragDropQuestion;
    answers: Record<string, string>;
    onAnswerChange: (id: string, answer: string) => void;
}> = ({ data, answers, onAnswerChange }) => {

    // Get all options that are currently placed in answers for *this* question
    const currentSubQuestionIds = data.subQuestions.map(sq => sq.id);
    const usedAnswers = currentSubQuestionIds.map(id => answers[id]).filter(Boolean);
    const availableOptions = data.options.filter(opt => !usedAnswers.includes(opt.label));

    const handleDragStart = (e: React.DragEvent, optionLabel: string, sourceId: string) => {
        e.dataTransfer.setData('application/json', JSON.stringify({ label: optionLabel, source: sourceId }));
    };

    const handleDropOnZone = (e: React.DragEvent, targetSubQuestionId: string) => {
        e.preventDefault();
        const dataStr = e.dataTransfer.getData('application/json');
        if (!dataStr) return;
        try {
            const { label, source } = JSON.parse(dataStr);
            if (!label) return;

            const existingAnswerInTarget = answers[targetSubQuestionId];

            if (source === 'options') {
                // Dragging from options list to a drop zone
                onAnswerChange(targetSubQuestionId, label);
            } else if (source !== targetSubQuestionId) {
                // Dragging from one drop zone to another (No longer swap, just overwrite and clear source)
                onAnswerChange(targetSubQuestionId, label);
                onAnswerChange(source, '');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDropOnOptions = (e: React.DragEvent) => {
        e.preventDefault();
        const dataStr = e.dataTransfer.getData('application/json');
        if (!dataStr) return;
        try {
            const { source } = JSON.parse(dataStr);
            if (source !== 'options') {
                // Dragged from a box back into the options area, means clear it
                onAnswerChange(source, '');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <div className="mb-8">
            {data.questionText && <p className="text-[14px] text-slate-800 font-medium mb-6">{data.questionText}</p>}

            <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                {/* Left Side: SubQuestions with Drop Zones */}
                <div className="flex-1 space-y-4">
                    {data.subQuestions.map((sq) => {
                        const currentAns = answers[sq.id];
                        const displayOption = currentAns ? data.options.find(o => o.label === currentAns) : null;

                        return (
                            <div key={sq.id} className="flex items-center gap-4">
                                <span className="text-[14px] text-slate-800 font-medium w-32">{sq.text}</span>
                                <div
                                    onDrop={(e) => handleDropOnZone(e, sq.id)}
                                    onDragOver={handleDragOver}
                                    draggable={!!currentAns}
                                    onDragStart={(e) => currentAns && handleDragStart(e, currentAns, sq.id)}
                                    className={`w-48 min-h-[36px] border flex items-center justify-center p-2 text-[13px] transition-colors rounded ${currentAns
                                        ? 'bg-blue-50 border-blue-400 text-slate-800 shadow-sm cursor-grab active:cursor-grabbing'
                                        : 'bg-white border-blue-300 text-slate-900 font-bold hover:bg-slate-50'
                                        }`}
                                    title={currentAns ? 'Drag to another box or the options list' : 'Drop answer here'}
                                >
                                    {displayOption ? (
                                        <div className="flex items-center justify-between w-full pointer-events-none">
                                            <span className="font-bold mr-2">{displayOption.label}</span>
                                            <span className="truncate" title={displayOption.text}>{displayOption.text}</span>
                                        </div>
                                    ) : (
                                        sq.number
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Right Side: Draggable Options */}
                <div
                    className="flex-1 p-6"
                    onDrop={handleDropOnOptions}
                    onDragOver={handleDragOver}
                >
                    <h3 className="text-[15px] font-bold text-slate-800 mb-6 text-center">{data.optionsBoxTitle}</h3>
                    <div className="flex flex-col gap-3 items-end min-h-[100px]">
                        {availableOptions.map((opt) => (
                            <div
                                key={opt.label}
                                draggable
                                onDragStart={(e) => handleDragStart(e, opt.label, 'options')}
                                className="flex items-center gap-3 bg-slate-100 p-3 rounded border border-slate-200 shadow-sm cursor-grab active:cursor-grabbing hover:bg-slate-200 transition-all w-fit min-w-[200px]"
                            >
                                <span className="font-bold text-slate-700 text-[13px] pointer-events-none">{opt.label}</span>
                                <span className="text-[13px] text-slate-700 pointer-events-none">{opt.text}</span>
                            </div>
                        ))}
                        {availableOptions.length === 0 && (
                            <p className="text-[13px] text-slate-400 italic text-center w-full mt-4">All options used</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
