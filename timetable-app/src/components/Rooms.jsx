import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Trash2 } from 'lucide-react';

export default function Rooms() {
  const { rooms, addRoom, deleteRoom } = useStore();
  const [name, setName] = useState('');
  const [type, setType] = useState('Lecture');
  const [capacity, setCapacity] = useState(60);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      addRoom({ name: name.trim(), type, capacity: Number(capacity) });
      setName('');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Manage Rooms & Labs</h2>
      
      <form onSubmit={handleSubmit} className="flex gap-4 items-end bg-card p-6 rounded-xl border shadow-sm flex-wrap">
        <div className="space-y-2 flex-1 min-w-[200px]">
          <label className="text-sm font-medium">Room Name / Lab Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            placeholder="e.g. Software Lab 1"
          />
        </div>
        <div className="space-y-2 w-40">
          <label className="text-sm font-medium">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="Lecture">Lecture Hall</option>
            <option value="Lab">Laboratory</option>
            <option value="Library">Library</option>
          </select>
        </div>
        <div className="space-y-2 w-32">
          <label className="text-sm font-medium">Capacity</label>
          <input
            type="number"
            min="1"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
        <button
          type="submit"
          className="h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </button>
      </form>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground border-b">
            <tr>
              <th className="px-6 py-3 font-medium">Room Name</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Capacity</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rooms.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-muted-foreground">
                  No rooms added yet.
                </td>
              </tr>
            ) : (
              rooms.map((r) => (
                <tr key={r.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-3 font-medium">{r.name}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                      {r.type}
                    </span>
                  </td>
                  <td className="px-6 py-3">{r.capacity}</td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => deleteRoom(r.id)}
                      className="text-destructive hover:text-destructive/80 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
