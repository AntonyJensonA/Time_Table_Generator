import React from 'react';
import { useStore } from '../store';

export default function Constraints() {
  const { constraints, updateConstraints } = useStore();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    updateConstraints({
      [name]:
        type === 'checkbox'
          ? checked
          : Number(value)
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">
        Constraints Setup
      </h2>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Global Rules */}

        <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">
            Global Rules
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium block">
                Max Hours Per Day
              </label>

              <span className="text-xs text-muted-foreground">
                Standard working hours
              </span>
            </div>

            <input
              type="number"
              name="maxHoursPerDay"
              value={constraints.maxHoursPerDay}
              onChange={handleChange}
              className="w-20 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-right"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium block">
                Library Capacity
              </label>

              <span className="text-xs text-muted-foreground">
                Maximum students in library
              </span>
            </div>

            <input
              type="number"
              name="libraryMaxCapacity"
              value={constraints.libraryMaxCapacity}
              onChange={handleChange}
              className="w-24 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-right"
            />
          </div>
        </div>

        {/* Teacher Rules */}

        <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">
            Teacher Rules
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium block">
                Max Subjects Per Teacher
              </label>

              <span className="text-xs text-muted-foreground">
                Department limit
              </span>
            </div>

            <input
              type="number"
              name="maxSubjectsPerTeacher"
              value={constraints.maxSubjectsPerTeacher}
              onChange={handleChange}
              className="w-20 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-right"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium block">
                Max Labs Per Teacher
              </label>

              <span className="text-xs text-muted-foreground">
                Department limit
              </span>
            </div>

            <input
              type="number"
              name="maxLabsPerTeacher"
              value={constraints.maxLabsPerTeacher}
              onChange={handleChange}
              className="w-20 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-right"
            />
          </div>
        </div>

        {/* Block Rules */}

        <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">
            Block Rules
          </h3>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="consecutiveBlockRule"
              name="consecutiveBlockRule"
              checked={constraints.consecutiveBlockRule}
              onChange={handleChange}
              className="h-4 w-4"
            />

            <div>
              <label
                htmlFor="consecutiveBlockRule"
                className="text-sm font-medium"
              >
                Prevent Consecutive Cross-Block Classes
              </label>

              <p className="text-xs text-muted-foreground">
                Teacher cannot move from Chavara to St Mary's
                (or vice versa) in consecutive periods.
              </p>
            </div>
          </div>
        </div>

        {/* Department Rules */}

        <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">
            Department Rules
          </h3>

          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• S2 and S4 → 8 periods/day</li>
            <li>• S6 and S8 → 7 periods/day</li>
            <li>• Sports fixed at Period 7</li>
            <li>• Labs occupy 3 consecutive periods</li>
            <li>• Library preferred before lunch</li>
            <li>• No teacher clashes allowed</li>
          </ul>
        </div>

      </div>
    </div>
  );
}