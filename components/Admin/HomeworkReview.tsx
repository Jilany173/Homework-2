
import React, { useState } from 'react';

const HomeworkReview: React.FC = () => {
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  const submissions = [
    { id: 1, name: 'Sabbir Ahmed', course: 'IELTS', day: 12, task: 'Writing', date: 'Oct 24, 10:15 AM', status: 'Pending' },
    { id: 2, name: 'Fatima Zohra', course: 'HICU', day: 5, task: 'Speaking', date: 'Oct 24, 09:40 AM', status: 'Pending' },
    { id: 3, name: 'Tanvir Hossain', course: 'IELTS', day: 1, task: 'Reading', date: 'Oct 23, 08:20 PM', status: 'Checked' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Homework Review</h1>
        <p className="text-slate-500 font-medium">Evaluate student responses and provide expert feedback.</p>
      </div>

      <div className={`flex flex-col lg:flex-row gap-8 overflow-hidden ${selectedSubmission ? 'h-[800px] lg:h-[calc(100vh-280px)]' : 'h-auto'}`}>
        {/* List Section - Hidden on mobile if viewing detail */}
        <div className={`w-full lg:w-1/3 flex flex-col gap-3 overflow-y-auto pr-1 scrollbar-hide ${selectedSubmission ? 'hidden lg:flex' : 'flex'}`}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Incoming Tasks</h2>
            <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{submissions.length}</span>
          </div>
          {submissions.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubmission(sub)}
              className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all duration-300 group ${
                selectedSubmission?.id === sub.id 
                ? 'bg-white border-blue-600 shadow-2xl shadow-blue-900/10 scale-[1.02]' 
                : 'bg-white border-transparent hover:border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                  sub.status === 'Checked' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {sub.status}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{sub.date}</span>
              </div>
              <p className="font-black text-slate-900 text-lg leading-tight mb-2">{sub.name}</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[9px] font-black text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-widest">{sub.course}</span>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{sub.task} • Day {sub.day}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Detail/Review Section */}
        <div className={`flex-1 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl overflow-hidden flex flex-col ${!selectedSubmission ? 'hidden lg:flex' : 'flex'}`}>
          {selectedSubmission ? (
            <div className="flex flex-col h-full">
              {/* Review Header */}
              <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedSubmission(null)}
                    className="lg:hidden p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 leading-none mb-1">{selectedSubmission.name}</h3>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">{selectedSubmission.course} Program • {selectedSubmission.task} Module</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <button className="flex-1 md:flex-none px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">Download</button>
                   <button className="flex-1 md:flex-none px-5 py-3 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all">Submit Evaluation</button>
                </div>
              </div>
              
              {/* Review Content Area */}
              <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-slate-50/20">
                <div className="max-w-3xl mx-auto space-y-10">
                  {/* Student Output */}
                  <div className="animate-in fade-in duration-500">
                    <h4 className="text-slate-400 text-[9px] uppercase font-black tracking-[0.3em] mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      Student Response Output
                    </h4>
                    <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-100 shadow-sm relative">
                      <div className="absolute top-6 right-8 opacity-10">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V5C14.017 3.89543 14.9124 3 16.017 3H19.017C21.2261 3 23.017 4.79086 23.017 7V15C23.017 18.3137 20.3307 21 17.017 21H14.017ZM1 21L1 18C1 16.8954 1.89543 16 3 16H6C6.55228 16 7 15.5523 7 15V9C7 8.44772 6.55228 8 6 8H3C1.89543 8 1 7.10457 1 6V5C1 3.89543 1.89543 3 3 3H6C8.20914 3 10 4.79086 10 7V15C10 18.3137 7.31371 21 4 21H1Z" />
                         </svg>
                      </div>
                      <p className="text-slate-700 text-lg md:text-xl leading-relaxed font-medium italic">
                        {selectedSubmission.task === 'Writing' ? (
                          "Over the past decade, the integration of global communication systems has seen a dramatic rise. The primary catalyst for this shift is the decentralization of digital infrastructure, which allows for near-instantaneous data exchange between disparate geographical regions. This trend suggests that traditional methods of textual reporting will eventually be superseded by real-time interactive dashboards..."
                        ) : (
                          "Voice transcript preview: 'The prompt was to describe a city I enjoy visiting. I chose Sylhet because of its unique mix of urban bustle and serene tea garden surroundings...'"
                        )}
                      </p>
                      <div className="mt-8 pt-8 border-t border-slate-50 flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Word Count:</span>
                        <span className="text-[10px] font-black text-slate-900">214 Words</span>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Tool */}
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h4 className="text-slate-400 text-[9px] uppercase font-black tracking-[0.3em] mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Professional Feedback
                    </h4>
                    <div className="relative">
                      <textarea 
                        className="w-full p-8 bg-white border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm h-48 md:h-64 shadow-sm"
                        placeholder="Provide detailed corrections on grammar, coherence, and lexical resource..."
                      ></textarea>
                      <div className="absolute bottom-6 right-8 flex items-center gap-4">
                        <div className="flex flex-col items-end">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Estimated Score</span>
                           <input type="text" placeholder="7.5" className="w-12 text-center bg-slate-50 border border-slate-200 rounded-lg py-1 font-black text-blue-600 outline-none focus:border-blue-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/20">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-inner mb-6">
                <span className="text-6xl">📝</span>
              </div>
              <p className="font-black uppercase tracking-[0.3em] text-xs text-slate-400">Station Idle • Awaiting Selection</p>
              <p className="text-[11px] text-slate-300 mt-2 italic font-medium">Select a student submission to begin the evaluation process.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeworkReview;
