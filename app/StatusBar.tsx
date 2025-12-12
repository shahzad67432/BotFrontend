import React from 'react';
import Lottie from 'lottie-react';
import mailAnimation from '../public/Email.json'; // Adjust path as needed

const processEmailStats = (history: any[]) => {
    if (!history || history.length === 0) {
        return { 
            sentToday: 0, 
            successRate: 0, 
            activityData: [0, 0, 0, 0, 0], 
            dayLabels: ['M', 'T', 'W', 'T', 'F'],
            rawCounts: [0, 0, 0, 0, 0]
        };
    }

    const now = new Date();
    // Function to strip time and normalize to the start of the day for accurate comparison
    const normalizeDate = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const todayNormalized = normalizeDate(now);
    
    // ... (1. Calculate Today's Count & 2. Calculate Success Rate - Logic remains the same) ...

    // 1. Calculate Today's Count
    const sentToday = history.filter(email => 
        normalizeDate(new Date(email.sentAt)).getTime() === todayNormalized.getTime()
    ).length;

    // 2. Calculate Success Rate (Adjust status list if needed)
    const total = history.length;
    const successful = history.filter(email => 
        ['sent', 'delivered', 'success'].includes(email.status?.toLowerCase())
    ).length;
    const successRate = total === 0 ? 0 : Math.round((successful / total) * 100);


    // 3. Generate Last 5 Days Activity and Counts
    const rawCounts: number[] = [];
    const dayLabels: string[] = [];

    for (let i = 4; i >= 0; i--) {
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() - i);
        const targetNormalized = normalizeDate(targetDate);
        
        dayLabels.push(targetDate.toLocaleDateString('en-US', { weekday: 'narrow' }));
        
        const count = history.filter(email => 
            normalizeDate(new Date(email.sentAt)).getTime() === targetNormalized.getTime()
        ).length;
        
        rawCounts.push(count);
    }

    // --- TIERED SCALING LOGIC IMPLEMENTATION ---
    const trueMaxCount = Math.max(...rawCounts, 1); // Get the absolute highest count (min 1)

    let maxVal: number;

    if (trueMaxCount <= 10) {
        // If max is 10 or less, scale against 10
        maxVal = 10;
    } else if (trueMaxCount <= 50) {
        // If max is between 11 and 50, scale against 50
        maxVal = 50;
    } else {
        // If max is over 50 (e.g., 75), scale against the true max (75)
        maxVal = trueMaxCount;
    }
    // --- END TIERED SCALING LOGIC ---

    // Normalize data for bar height using the calculated maxVal
    const activityData = rawCounts.map(count => (count / maxVal) * 100);

    return { sentToday, successRate, activityData, dayLabels, rawCounts };
};


const PhantomStatsBar = ({ credits = 0, history = [] }) => {
  const { sentToday, successRate, activityData, dayLabels, rawCounts } = processEmailStats(history);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-6 hidden md:block">
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 flex items-center justify-between relative overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Activity Chart */}
        <div className="flex flex-col gap-4 w-1/3 lg:w-[28%] border-r border-gray-100 pr-8">
        <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 text-sm font-medium">Activity (5 Days)</h3>
            <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">Live</span>
        </div>
        <div className="h-32 flex items-end justify-between gap-3">
            {activityData.map((height, i) => {
                const count = rawCounts[i]; // Get the raw count
                
                return (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer h-full">
                        
                        {/* Outer Bar Container (Gray Background) */}
                        <div className="relative w-full h-full bg-gray-100 rounded-t-lg overflow-hidden flex items-end">
                            
                            {/* Colored Bar (Progress) */}
                            <div 
                                className={`w-full rounded-t-lg transition-all duration-1000 ease-out group-hover:opacity-80 flex flex-col items-center justify-center pt-1`}
                                style={{ 
                                    // Use Math.max(height, 20) to ensure a visible bar/space for the number when count > 0
                                    height: height > 0 ? `${Math.max(height, 20)}%` : '0px', 
                                    background: height > 0 
                                        ? 'linear-gradient(180deg, #cc39f5 0%, #6366f1 100%)' 
                                        : 'transparent',
                                    minHeight: height > 0 ? '20px' : '0px'
                                }} 
                            >
                                {/* Count Number inside the Bar */}
                                {count > 0 && (
                                    <span className="text-white font-bold text-xs leading-none">{count}</span>
                                )}
                            </div>
                        </div>
                        
                        {/* Day Label */}
                        <span className="text-[10px] text-gray-400 font-medium">
                            {dayLabels[i]}
                        </span>
                    </div>
                );
            })}
        </div>
    </div>

        {/* Header */}
        <div className="text-center mb-12 mt-8 flex flex-col items-center justify-center">
          <h1 className=" relative text-5xl font-bold text-[#cc39f5] mb-4 flex flex-row items-center justify-center text-center gap-6" style={{ fontFamily: 'Mauline, sans-serif' }}>
            NEURAL 
            <span className=" w-[100px] items-center justify-center">
                <Lottie 
                  animationData={mailAnimation}
                  loop={true}
                  width={48}
                  height={48}
                />
            </span>
          </h1>
          <p className='relative text-5xl text-[#cc39f5] mb-4 flex flex-row items-center justify-center text-center gap-6 font-pixel font-medium ' style={{ fontFamily: 'Mauline, sans-serif' }}> ASSISTANT</p>
        </div>

        {/* 2. Credits Gauge - Enhanced with surrounding stats */}
        <div className="flex flex-col items-center justify-center w-1/3 px-8 relative border-l border-gray-100">
          {/* Top Left - Max Credits */}
          {/* <div className="absolute top-0 left-12 text-center">
            <p className="text-2xl font-bold text-gray-800">10</p>
            <p className="text-[10px] text-gray-400 font-medium">Max Credits</p>
          </div> */}
          
          {/* Top Right - Used Credits */}
          <div className="absolute top-0 right-12 text-center">
            <p className="text-2xl font-bold text-gray-800">{10 - credits}</p>
            <p className="text-[10px] text-gray-400 font-medium">Used Credits</p>
          </div>
          
          {/* Bottom - Success Rate */}
          {/* <div className="absolute bottom-0 text-center">
            <p className="text-2xl font-bold text-green-500">{successRate}%</p>
            <p className="text-[10px] text-gray-400 font-medium">Success Rate</p>
          </div> */}

          {/* Main Gauge */}
          <div className="relative w-56 h-32 flex items-center justify-center">
            <svg viewBox="0 0 200 110" className="w-full h-full">
              {/* Generate line-based semicircle */}
              {Array.from({ length: 50 }).map((_, i) => {
                const angle = (i / 49) * 180; // 0 to 180 degrees (left to right)
                const radians = (angle * Math.PI) / 180;
                const radius = 85;
                const centerX = 100;
                const centerY = 100;
                const x1 = centerX + Math.cos(radians) * (radius - 12);
                const y1 = centerY - Math.sin(radians) * (radius - 12);
                const x2 = centerX + Math.cos(radians) * radius;
                const y2 = centerY - Math.sin(radians) * radius;
                
                const progress = (credits / 10) * 50;
                const isActive = i < progress;
                
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isActive ? (i < progress * 0.6 ? '#cc39f5' : '#6366f1') : '#e5e7eb'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                    style={{ transitionDelay: `${i * 10}ms` }}
                  />
                );
              })}
            </svg>
            
            {/* Center text */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 text-center">
              <p className="text-5xl font-bold text-gray-800">{credits}</p>
              <p className="text-xs text-gray-400 font-medium mt-1">Available Credits</p>
            </div>
          </div>
        </div>

        {/* 3. Metrics */}
        {/* <div className="flex flex-col gap-6 w-1/3 border-l border-gray-100 pl-8 justify-center">
          <div className="flex items-center justify-between group cursor-pointer">
            <div>
              <p className="text-3xl font-bold text-gray-800 group-hover:text-[#cc39f5] transition-colors">{sentToday}</p>
              <p className="text-sm text-gray-500">Emails Sent Today</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-purple-50 transition-colors">
              <ArrowRight size={20} className="text-gray-400 group-hover:text-[#cc39f5]" />
            </div>
          </div>
          <div className="flex items-center justify-between group cursor-pointer">
            <div>
              <p className="text-3xl font-bold text-gray-800 group-hover:text-green-500 transition-colors">{successRate}%</p>
              <p className="text-sm text-gray-500">Success Rate</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-green-50 transition-colors">
              <TrendingUp size={20} className="text-gray-400 group-hover:text-green-500" />
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default PhantomStatsBar;