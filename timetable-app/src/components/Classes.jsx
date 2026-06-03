import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Trash2 } from 'lucide-react';

export default function Classes() {
  const { classes, addClass, deleteClass } = useStore();

  const [name, setName] = useState('');
  const [semester, setSemester] = useState('S4');
  const [studentCount, setStudentCount] = useState(60);
  const [block, setBlock] = useState('StMarys');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    addClass({
      name: name.trim(),
      semester,
      studentCount: Number(studentCount),
      block
    });

    setName('');
    setSemester('S4');
    setStudentCount(60);
    setBlock('StMarys');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">
        Manage Classes
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex gap-4 items-end bg-card p-6 rounded-xl border shadow-sm flex-wrap"
      >
        <div className="space-y-2 flex-1 min-w-[200px]">
          <label className="text-sm font-medium">
            Class Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="e.g. S4 CS A"
          />
        </div>

        <div className="space-y-2 w-32">
          <label className="text-sm font-medium">
            Semester
          </label>

          <select
            value={semester}
            onChange={(e) =>
              setSemester(e.target.value)
            }
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="S2">S2</option>
            <option value="S4">S4</option>
            <option value="S6">S6</option>
            <option value="S8">S8</option>
          </select>
        </div>

        <div className="space-y-2 w-40">
          <label className="text-sm font-medium">
            Block
          </label>

          <select
            value={block}
            onChange={(e) =>
              setBlock(e.target.value)
            }
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="StMarys">
              St Mary's
            </option>

            <option value="Chavara">
              Chavara
            </option>
          </select>
        </div>

        <div className="space-y-2 w-32">
          <label className="text-sm font-medium">
            Students
          </label>

          <input
            type="number"
            min="1"
            value={studentCount}
            onChange={(e) =>
              setStudentCount(e.target.value)
            }
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
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
              <th className="px-6 py-3 font-medium">
                Class Name
              </th>

              <th className="px-6 py-3 font-medium">
                Semester
              </th>

              <th className="px-6 py-3 font-medium">
                Block
              </th>

              <th className="px-6 py-3 font-medium">
                Students
              </th>

              <th className="px-6 py-3 font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {classes.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  No classes added yet.
                </td>
              </tr>
            ) : (
              classes.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-3 font-medium">
                    {c.name}
                  </td>

                  <td className="px-6 py-3">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                      {c.semester}
                    </span>
                  </td>

                  <td className="px-6 py-3">
                    {c.block}
                  </td>

                  <td className="px-6 py-3">
                    {c.studentCount}
                  </td>

                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() =>
                        deleteClass(c.id)
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