
import React, { useState } from 'react';

const ContentManager: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState('ielts');
  const [selectedDay, setSelectedDay] = useState(1);
  const [activeTab, setActiveTab] = useState('Reading');

  const tabs = ['Speaking', 'Listening', 'Reading', 'Writing'];

  const handleSave = () => {
    alert(`Content for ${selectedCourse.toUpperCase()} Day ${selectedDay} (${activeTab}) has been updated!`);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Content Manager</h1>
          <p className="text-slate-500 font-medium">Upload curriculum materials and define session topics.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedCourse} 
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
          >
            <option value="ielts">CD IELTS Premium</option>
            <option value="hicu">CD HICU Premium</option>
          </select>
          <select 
            value={selectedDay} 
            onChange={(e) => setSelectedDay(parseInt(e.target.value))}
            className="px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
          >
            {Array.from({ length: 36 }, (_, i) => (
              <option key={i+1} value={i+1}>Day {i+1}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-5 text-[10px] font-black transition-all uppercase tracking-[0.2em] ${
                activeTab === tab
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-10">
          <div className="space-y-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Module Identity / Title</label>
              <input 
                type="text" 
                placeholder={`e.g., Intensive ${activeTab} Strategy Drill`}
                className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
              />
            </div>

            {activeTab === 'Listening' ? (
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Multimedia Link (Vimeo/YouTube/S3)</label>
                <input 
                  type="text" 
                  placeholder="https://vimeo.com/7654321..."
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                />
              </div>
            ) : (
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Curriculum Content Body</label>
                <textarea 
                  rows={10}
                  placeholder={`Draft the ${activeTab} task requirements, passages, or instructions here for the students to see in their portal...`}
                  className="w-full px-6 py-6 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-300 resize-none leading-relaxed"
                ></textarea>
              </div>
            )}

            <div className="flex flex-col md:flex-row items-center gap-4 pt-4">
              <button className="w-full md:flex-1 px-8 py-5 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-[10px]">
                Preview Mode
              </button>
              <button 
                onClick={handleSave}
                className="w-full md:flex-[2] px-8 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 uppercase tracking-[0.2em] text-[10px]"
              >
                Publish Curriculum
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-3xl flex items-center gap-4">
         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">💡</div>
         <p className="text-[11px] font-bold text-blue-800 leading-relaxed uppercase tracking-tight">
           Note: Once published, the content will be available to all students enrolled in {selectedCourse.toUpperCase()} programs when their teacher unlocks Day {selectedDay}.
         </p>
      </div>
    </div>
  );
};

export default ContentManager;
