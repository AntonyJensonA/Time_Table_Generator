import React from 'react';
import { useStore } from '../store';

export default function Constraints() {
  const { constraints, updateConstraints } = useStore();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateConstraints({
      [name]: type === 'checkbox' ? checked : Number(value)
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Constraints Setup</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Global Rules</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium block">Max Hours Per Day</label>
              <span className="text-xs text-muted-foreground">Standard periods in a day</span>
            </div>
            <input
              type="number"
              name="maxHoursPerDay"
              value={constraints.maxHoursPerDay}
              onChange={handleChange}
              className="w-20 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-right"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium block">Library Max Capacity</label>
              <span className="text-xs text-muted-foreground">Max students in library at once</span>
            </div>
            <input
              type="number"
              name="libraryMaxCapacity"
              value={constraints.libraryMaxCapacity}
              onChange={handleChange}
              className="w-24 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-right"
            />
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Teacher Rules</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium block">Max Subjects Per Teacher</label>
              <span className="text-xs text-muted-foreground">Excluding labs</span>
            </div>
            <input
              type="number"
              name="maxSubjectsPerTeacher"
              value={constraints.maxSubjectsPerTeacher}
              onChange={handleChange}
              className="w-20 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-right"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium block">Max Labs Per Teacher</label>
            </div>
            <input
              type="number"
              name="maxLabsPerTeacher"
              value={constraints.maxLabsPerTeacher}
              onChange={handleChange}
              className="w-20 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-right"
            />
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <input
              type="checkbox"
              id="consecutiveBlockRule"
              name="consecutiveBlockRule"
              checked={constraints.consecutiveBlockRule}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <div className="grid gap-1.5 leading-none">
              <label htmlFor="consecutiveBlockRule" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Block Transition Rule
              </label>
              <p className="text-sm text-muted-foreground">
                Prevent consecutive hours if switching between Chavara and St. Marys blocks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
