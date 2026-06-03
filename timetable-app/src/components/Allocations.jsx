import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Trash2 } from 'lucide-react';

export default function Allocations() {
  const {
    allocations,
    addAllocation,
    deleteAllocation,
    classes,
    subjects,
    teachers,
  } = useStore();

  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [hours, setHours] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!classId || !subjectId || !teacherId) {
      alert('Please fill all fields');
      return;
    }

    const alreadyExists = allocations.some(
      (a) =>
        a.classId === classId &&
        a.subjectId === subjectId
    );

    if (alreadyExists) {
      alert(
        'This subject is already assigned to this class.'
      );
      return;
    }

    addAllocation({
      classId,
      subjectId,
      teacherId,
      hours: Number(hours),
    });

    setSubjectId('');
    setTeacherId('');
    setHours('');
  };

  const getClassName = (id) =>
    classes.find((c) => c.id === id)?.name ||
    'Unknown Class';

  const getSubjectName = (id) =>
    subjects.find((s) => s.id === id)?.name ||
    'Unknown Subject';

  const getTeacherName = (id) =>
    teachers.find((t) => t.id === id)?.name ||
    'Unknown Teacher';

  const getSubjectType = (id) =>
    subjects.find((s) => s.id === id)?.type ||
    '-';

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">
        Course Allocations
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex gap-4 items-end bg-card p-6 rounded-xl border shadow-sm flex-wrap"
      >
        {/* Class */}

        <div className="space-y-2 flex-1 min-w-[180px]">
          <label className="text-sm font-medium">
            Class
          </label>

          <select
            value={classId}
            onChange={(e) =>
              setClassId(e.target.value)
            }
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          >
            <option value="">
              Select Class
            </option>

            {classes.map((c) => (
              <option
                key={c.id}
                value={c.id}
              >
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}

        <div className="space-y-2 flex-1 min-w-[220px]">
          <label className="text-sm font-medium">
            Subject
          </label>

          <select
            value={subjectId}
            onChange={(e) => {
              const selectedId =
                e.target.value;

              setSubjectId(selectedId);

              const subject =
                subjects.find(
                  (s) =>
                    s.id === selectedId
                );

              if (subject) {
                setHours(subject.hours);
              }
            }}
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          >
            <option value="">
              Select Subject
            </option>

            {subjects.map((s) => (
              <option
                key={s.id}
                value={s.id}
              >
                {s.name} ({s.type})
              </option>
            ))}
          </select>
        </div>

        {/* Teacher */}

        <div className="space-y-2 flex-1 min-w-[220px]">
          <label className="text-sm font-medium">
            Teacher
          </label>

          <select
            value={teacherId}
            onChange={(e) =>
              setTeacherId(
                e.target.value
              )
            }
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          >
            <option value="">
              Select Teacher
            </option>

            {teachers.map((t) => (
              <option
                key={t.id}
                value={t.id}
              >
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Hours */}

        <div className="space-y-2 w-24">
          <label className="text-sm font-medium">
            Hours
          </label>

          <input
            type="number"
            value={hours}
            readOnly
            className="w-full flex h-10 rounded-md border border-input bg-muted px-3 py-2 text-sm"
          />
        </div>

        {/* Button */}

        <button
          type="submit"
          className="h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Assign
        </button>
      </form>

      {/* Table */}

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground border-b">
            <tr>
              <th className="px-6 py-3 font-medium">
                Class
              </th>

              <th className="px-6 py-3 font-medium">
                Subject
              </th>

              <th className="px-6 py-3 font-medium">
                Type
              </th>

              <th className="px-6 py-3 font-medium">
                Teacher
              </th>

              <th className="px-6 py-3 font-medium">
                Hours/Week
              </th>

              <th className="px-6 py-3 font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {allocations.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  No allocations added yet.
                </td>
              </tr>
            ) : (
              allocations.map((a) => (
                <tr
                  key={a.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-3 font-medium">
                    {getClassName(
                      a.classId
                    )}
                  </td>

                  <td className="px-6 py-3">
                    {getSubjectName(
                      a.subjectId
                    )}
                  </td>

                  <td className="px-6 py-3">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                      {getSubjectType(
                        a.subjectId
                      )}
                    </span>
                  </td>

                  <td className="px-6 py-3">
                    {getTeacherName(
                      a.teacherId
                    )}
                  </td>

                  <td className="px-6 py-3">
                    {a.hours}
                  </td>

                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() =>
                        deleteAllocation(
                          a.id
                        )
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