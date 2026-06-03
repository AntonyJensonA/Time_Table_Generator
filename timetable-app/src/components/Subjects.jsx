import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Trash2 } from 'lucide-react';

export default function Subjects() {
  const { subjects, addSubject, deleteSubject } = useStore();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState('Theory');
  const [hours, setHours] = useState(4);
  const [tutorial, setTutorial] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    addSubject({
      name: name.trim(),
      code: code.trim(),
      type,
      hours: Number(hours),
      tutorial
    });

    setName('');
    setCode('');
    setType('Theory');
    setHours(4);
    setTutorial(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">
        Manage Subjects
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex gap-4 items-end bg-card p-6 rounded-xl border shadow-sm flex-wrap"
      >
        <div className="space-y-2 min-w-[200px] flex-1">
          <label className="text-sm font-medium">
            Subject Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="DBMS"
          />
        </div>

        <div className="space-y-2 w-40">
          <label className="text-sm font-medium">
            Subject Code
          </label>

          <input
            type="text"
            value={code}
            onChange={(e) =>
              setCode(e.target.value)
            }
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="CST202"
          />
        </div>

        <div className="space-y-2 w-40">
          <label className="text-sm font-medium">
            Type
          </label>

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="Theory">
              Theory
            </option>

            <option value="Lab">
              Lab
            </option>

            <option value="Elective">
              Elective
            </option>

            <option value="Minor">
              Minor / Honor
            </option>
          </select>
        </div>

        <div className="space-y-2 w-32">
          <label className="text-sm font-medium">
            Weekly Hours
          </label>

          <input
            type="number"
            min="1"
            max="10"
            value={hours}
            onChange={(e) =>
              setHours(e.target.value)
            }
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 pb-2">
          <input
            type="checkbox"
            checked={tutorial}
            onChange={(e) =>
              setTutorial(e.target.checked)
            }
          />

          <label className="text-sm">
            Tutorial
          </label>
        </div>

        <button
          type="submit"
          className="h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium"
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
                Code
              </th>

              <th className="px-6 py-3 font-medium">
                Name
              </th>

              <th className="px-6 py-3 font-medium">
                Type
              </th>

              <th className="px-6 py-3 font-medium">
                Hours
              </th>

              <th className="px-6 py-3 font-medium">
                Tutorial
              </th>

              <th className="px-6 py-3 font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {subjects.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  No subjects added yet.
                </td>
              </tr>
            ) : (
              subjects.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-muted/50"
                >
                  <td className="px-6 py-3">
                    {s.code}
                  </td>

                  <td className="px-6 py-3 font-medium">
                    {s.name}
                  </td>

                  <td className="px-6 py-3">
                    {s.type}
                  </td>

                  <td className="px-6 py-3">
                    {s.hours}
                  </td>

                  <td className="px-6 py-3">
                    {s.tutorial
                      ? 'Yes'
                      : 'No'}
                  </td>

                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() =>
                        deleteSubject(s.id)
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