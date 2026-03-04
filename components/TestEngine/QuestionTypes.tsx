import React from 'react';

export interface QuestionBase {
    id: string;
    number: number;
    type: 'multiple_choice' | 'fill_in_blanks' | 'inline_blanks' | 'multiple_choice_checkbox' | 'matching_dropdown';
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
            <div className="pl-9 space-y-3">
                {q.options.map((opt, idx) => (
                    <label key={idx} className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center pt-0.5">
                            <input
                                type="checkbox"
                                name={`question_${q.id}`}
                                value={opt.label}
                                checked={selectedOptions.includes(opt.label)}
                                onChange={() => handleToggle(opt.label)}
                                className="peer sr-only"
                                disabled={!selectedOptions.includes(opt.label) && selectedOptions.length >= q.maxSelections}
                            />
                            <div className="w-4 h-4 rounded border border-slate-400 group-hover:border-slate-600 peer-checked:bg-slate-800 peer-checked:border-slate-800 transition-all flex items-center justify-center">
                                {selectedOptions.includes(opt.label) && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                )}
                            </div>
                        </div>
                        <span className="text-[13px] text-slate-700 font-medium"><span className="font-bold mr-1">{opt.label}.</span> {opt.text}</span>
                    </label>
                ))}
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
}

export const InlineBlanksRenderer: React.FC<{
    data: InlineBlanksQuestion;
    answers: Record<string, string>;
    onAnswerChange: (id: string, answer: string) => void;
}> = ({ data, answers, onAnswerChange }) => {
    return (
        <div className="bg-white border border-slate-900 mx-auto w-full max-w-[700px] p-8 mt-4 text-[15px] text-slate-900 leading-relaxed">
            {data.content.map((part, idx) => {

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

            <div className="border border-slate-800 p-6 mb-8 max-w-[400px] ml-auto mr-0">
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
