import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Trash2, Edit } from 'lucide-react';

export default function Teachers() {
  const { teachers, addTeacher, deleteTeacher } = useStore();
  const [name, setName] = useState('');
  const [block, setBlock] = useState('Chavara');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      addTeacher({ name: name.trim(), block });
      setName('');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Manage Teachers</h2>
      
      <form onSubmit={handleSubmit} className="flex gap-4 items-end bg-card p-6 rounded-xl border shadow-sm">
        <div className="space-y-2 flex-1">
          <label className="text-sm font-medium">Teacher Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            placeholder="e.g. Dr. Sooraj T R"
          />
        </div>
        <div className="space-y-2 w-48">
          <label className="text-sm font-medium">Block</label>
          <select
            value={block}
            onChange={(e) => setBlock(e.target.value)}
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="Chavara">Chavara (S1)</option>
            <option value="StMarys">St. Marys (Higher)</option>
          </select>
        </div>
        <button
          type="submit"
          className="h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Teacher
        </button>
      </form>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground border-b">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Block</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {teachers.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-muted-foreground">
                  No teachers added yet.
                </td>
              </tr>
            ) : (
              teachers.map((t) => (
                <tr key={t.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-3">{t.name}</td>
                  <td className="px-6 py-3">{t.block}</td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => deleteTeacher(t.id)}
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
