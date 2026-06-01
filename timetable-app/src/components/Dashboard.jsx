import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { generateTimetable } from '../lib/scheduler';
import { Play, Download, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const { classes, subjects, teachers, constraints } = useStore();
  const [timetables, setTimetables] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');

  const handleGenerate = () => {
    if (classes.length === 0 || subjects.length === 0) {
      alert("Please add at least one class and subject before generating.");
      return;
    }
    const result = generateTimetable(classes, subjects, teachers, constraints);
    setTimetables(result);
    if (classes.length > 0) {
      setSelectedClass(classes[0].id);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  const currentTimetable = timetables && selectedClass ? timetables[selectedClass] : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Timetable Generator</h2>
        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
            className="h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium shadow transition-colors"
          >
            <Play className="w-4 h-4 mr-2" />
            Generate
          </button>
          {timetables && (
            <button className="h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          )}
        </div>
      </div>

      {!timetables ? (
        <div className="p-12 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
          <CalendarIcon className="w-16 h-16 mb-4 text-muted" />
          <p className="text-lg font-medium">No timetable generated yet</p>
          <p className="text-sm">Add data in the tabs on the left and click Generate.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">View Class:</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-48 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {currentTimetable && (
            <div className="bg-card rounded-xl border shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[800px]">
                <thead className="bg-muted/50 text-muted-foreground border-b">
                  <tr>
                    <th className="px-4 py-3 font-medium w-24">Day</th>
                    {currentTimetable.grid['Monday'].map((_, idx) => (
                      <th key={idx} className="px-4 py-3 font-medium text-center border-l">Period {idx + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {days.map(day => (
                    <tr key={day}>
                      <td className="px-4 py-4 font-semibold bg-muted/20">{day}</td>
                      {currentTimetable.grid[day].map((slot, idx) => (
                        <td key={idx} className="px-2 py-2 border-l relative group">
                          {slot ? (
                            <div className={`p-2 rounded-md h-full flex flex-col justify-center items-center text-center ${
                              slot.type === 'Lab' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                              slot.type === 'Other' ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' :
                              'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            }`}>
                              <span className="font-bold text-xs truncate w-full" title={slot.subject}>{slot.subject}</span>
                              {slot.teacher && <span className="text-[10px] mt-1 opacity-80 truncate w-full" title={slot.teacher}>{slot.teacher}</span>}
                            </div>
                          ) : (
                            <div className="p-2 text-center text-muted-foreground/50 text-xs">Empty</div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CalendarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
