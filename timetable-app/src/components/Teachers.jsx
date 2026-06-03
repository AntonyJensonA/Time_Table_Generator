import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Trash2 } from 'lucide-react';

export default function Teachers() {
  const { teachers, addTeacher, deleteTeacher } = useStore();

  const [name, setName] = useState('');
  const [block, setBlock] = useState('Chavara');
  const [maxSubjects, setMaxSubjects] = useState(2);
  const [maxLabs, setMaxLabs] = useState(2);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    addTeacher({
      name: name.trim(),
      block,
      maxSubjects: Number(maxSubjects),
      maxLabs: Number(maxLabs)
    });

    setName('');
    setBlock('Chavara');
    setMaxSubjects(2);
    setMaxLabs(2);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">
        Manage Teachers
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex gap-4 items-end bg-card p-6 rounded-xl border shadow-sm flex-wrap"
      >
        <div className="space-y-2 flex-1 min-w-[220px]">
          <label className="text-sm font-medium">
            Teacher Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="e.g. Dr. Sooraj T R"
          />
        </div>

        <div className="space-y-2 w-44">
          <label className="text-sm font-medium">
            Block
          </label>

          <select
            value={block}
            onChange={(e) => setBlock(e.target.value)}
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="Chavara">
              Chavara (S1)
            </option>

            <option value="StMarys">
              St. Mary's (Higher)
            </option>
          </select>
        </div>

        <div className="space-y-2 w-32">
          <label className="text-sm font-medium">
            Max Subjects
          </label>

          <input
            type="number"
            min="1"
            value={maxSubjects}
            onChange={(e) =>
              setMaxSubjects(e.target.value)
            }
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2 w-28">
          <label className="text-sm font-medium">
            Max Labs
          </label>

          <input
            type="number"
            min="0"
            value={maxLabs}
            onChange={(e) =>
              setMaxLabs(e.target.value)
            }
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
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
              <th className="px-6 py-3 font-medium">
                Name
              </th>

              <th className="px-6 py-3 font-medium">
                Block
              </th>

              <th className="px-6 py-3 font-medium">
                Max Subjects
              </th>

              <th className="px-6 py-3 font-medium">
                Max Labs
              </th>

              <th className="px-6 py-3 font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {teachers.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  No teachers added yet.
                </td>
              </tr>
            ) : (
              teachers.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-3">
                    {t.name}
                  </td>

                  <td className="px-6 py-3">
                    {t.block}
                  </td>

                  <td className="px-6 py-3">
                    {t.maxSubjects}
                  </td>

                  <td className="px-6 py-3">
                    {t.maxLabs}
                  </td>

                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() =>
                        deleteTeacher(t.id)
                      }
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