import React, { useState } from 'react';
import { useStore } from '../store';
import { generateTimetable, detectClashes } from '../lib/scheduler';
import { Play, Download, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const {
    classes,
    subjects,
    teachers,
    allocations,
    constraints,
  } = useStore();

  const [timetables, setTimetables] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [clashes, setClashes] = useState([]);

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];

  const handleGenerate = () => {
    try {
      if (
        classes.length === 0 ||
        subjects.length === 0 ||
        teachers.length === 0 ||
        allocations.length === 0
      ) {
        alert(
          'Please add classes, teachers, subjects and allocations before generating.'
        );
        return;
      }

      const result = generateTimetable(
        classes,
        subjects,
        teachers,
        allocations,
        constraints
      );

      const foundClashes = detectClashes(result);

      setTimetables(result);
      setClashes(foundClashes);

      if (classes.length > 0) {
        setSelectedClass(classes[0].id);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to generate timetable.');
    }
  };

  const currentTimetable =
    timetables && selectedClass
      ? timetables[selectedClass]
      : null;

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Timetable Generator
        </h2>

        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
            className="h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium shadow"
          >
            <Play className="w-4 h-4 mr-2" />
            Generate
          </button>

          {timetables && (
            <button
              className="h-10 px-4 py-2 border rounded-md inline-flex items-center justify-center text-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          )}
        </div>
      </div>

      {!timetables ? (
        <div className="p-12 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground">
          <CalendarIcon className="w-16 h-16 mb-4" />
          <p className="text-lg font-medium">
            No timetable generated yet
          </p>
          <p className="text-sm">
            Add data and click Generate.
          </p>
        </div>
      ) : (
        <div className="space-y-4">

          {clashes.length > 0 && (
            <div className="border border-red-300 bg-red-50 text-red-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-semibold">
                  Teacher Conflicts Detected
                </span>
              </div>

              {clashes.map((clash, index) => (
                <div
                  key={index}
                  className="text-sm"
                >
                  {clash.teacher} - {clash.day} Period{' '}
                  {clash.period}
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">
              Select Class
            </label>

            <select
              value={selectedClass}
              onChange={(e) =>
                setSelectedClass(e.target.value)
              }
              className="w-56 h-10 rounded-md border px-3"
            >
              {classes.map((cls) => (
                <option
                  key={cls.id}
                  value={cls.id}
                >
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {currentTimetable && (
            <div className="bg-card rounded-xl border shadow-sm overflow-auto">

              <table className="w-full min-w-[900px] text-sm">

                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      Day
                    </th>

                    {(currentTimetable.grid?.Monday || []).map(
                      (_, idx) => (
                        <th
                          key={idx}
                          className="px-4 py-3 text-center border-l"
                        >
                          Period {idx + 1}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>
                  {days.map((day) => (
                    <tr
                      key={day}
                      className="border-b"
                    >
                      <td className="px-4 py-4 font-semibold bg-muted/20">
                        {day}
                      </td>

                      {(currentTimetable.grid?.[day] || []).map(
                        (slot, idx) => (
                          <td
                            key={idx}
                            className="p-2 border-l"
                          >
                            {slot ? (
                              <div
                                className={`p-2 rounded text-center
                                  ${slot.type === 'Lab'
                                    ? 'bg-blue-100 text-blue-800'
                                    : slot.type === 'Sports'
                                      ? 'bg-orange-100 text-orange-800'
                                      : slot.type === 'Other'
                                        ? 'bg-gray-100 text-gray-600'
                                        : 'bg-green-100 text-green-800'
                                  }`}
                              >
                                <div className="font-semibold text-xs">
                                  {slot.subject}
                                </div>

                                {slot.teacher && (
                                  <div className="text-[10px] mt-1">
                                    {slot.teacher}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-center text-xs text-muted-foreground">
                                Empty
                              </div>
                            )}
                          </td>
                        )
                      )}
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
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="2"
      />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}