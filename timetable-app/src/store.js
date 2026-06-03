import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export const useStore = create(
  persist(
    (set) => ({
      // =========================
      // DATA
      // =========================
      teachers: [],
      subjects: [],
      classes: [],
      rooms: [],
      allocations: [],

      // =========================
      // CONSTRAINTS
      // =========================
      constraints: {
        maxHoursPerDay: 8,
        consecutiveBlockRule: true,
        maxSubjectsPerTeacher: 2,
        maxLabsPerTeacher: 2,
        libraryMaxCapacity: 126,
      },

      // =========================
      // TEACHERS
      // =========================
      addTeacher: (teacher) =>
        set((state) => ({
          teachers: [
            ...state.teachers,
            {
              id: uuidv4(),
              name: teacher.name,
              block: teacher.block || 'Chavara',
            },
          ],
        })),

      updateTeacher: (id, teacher) =>
        set((state) => ({
          teachers: state.teachers.map((t) =>
            t.id === id ? { ...t, ...teacher } : t
          ),
        })),

      deleteTeacher: (id) =>
        set((state) => ({
          teachers: state.teachers.filter((t) => t.id !== id),
        })),

      // =========================
      // SUBJECTS
      // =========================
      addSubject: (subject) =>
        set((state) => ({
          subjects: [
            ...state.subjects,
            {
              id: uuidv4(),
              name: subject.name,
              type: subject.type,
              hours: subject.hours,
            },
          ],
        })),

      updateSubject: (id, subject) =>
        set((state) => ({
          subjects: state.subjects.map((s) =>
            s.id === id ? { ...s, ...subject } : s
          ),
        })),

      deleteSubject: (id) =>
        set((state) => ({
          subjects: state.subjects.filter((s) => s.id !== id),
        })),

      // =========================
      // CLASSES
      // =========================
      addClass: (cls) =>
        set((state) => ({
          classes: [
            ...state.classes,
            {
              id: uuidv4(),
              name: cls.name,
              semester: cls.semester,
              studentCount: cls.studentCount,
              block: cls.block || 'Chavara',
            },
          ],
        })),

      updateClass: (id, cls) =>
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === id ? { ...c, ...cls } : c
          ),
        })),

      deleteClass: (id) =>
        set((state) => ({
          classes: state.classes.filter((c) => c.id !== id),
        })),

      // =========================
      // ROOMS
      // =========================
      addRoom: (room) =>
        set((state) => ({
          rooms: [
            ...state.rooms,
            {
              id: uuidv4(),
              name: room.name,
              type: room.type,
              capacity: room.capacity,
            },
          ],
        })),

      updateRoom: (id, room) =>
        set((state) => ({
          rooms: state.rooms.map((r) =>
            r.id === id ? { ...r, ...room } : r
          ),
        })),

      deleteRoom: (id) =>
        set((state) => ({
          rooms: state.rooms.filter((r) => r.id !== id),
        })),

      // =========================
      // ALLOCATIONS
      // =========================
      addAllocation: (allocation) =>
        set((state) => ({
          allocations: [
            ...state.allocations,
            {
              id: uuidv4(),
              classId: allocation.classId,
              subjectId: allocation.subjectId,
              teacherId: allocation.teacherId,
              hours: allocation.hours,
            },
          ],
        })),

      deleteAllocation: (id) =>
        set((state) => ({
          allocations: state.allocations.filter(
            (a) => a.id !== id
          ),
        })),

      // =========================
      // CONSTRAINTS
      // =========================
      updateConstraints: (constraints) =>
        set((state) => ({
          constraints: {
            ...state.constraints,
            ...constraints,
          },
        })),

      // =========================
      // IMPORT DATA
      // =========================
      loadData: (data) =>
        set((state) => ({
          teachers: data.teachers || state.teachers,
          subjects: data.subjects || state.subjects,
          classes: data.classes || state.classes,
          rooms: data.rooms || state.rooms,
          allocations: data.allocations || state.allocations,
          constraints: data.constraints || state.constraints,
        })),
    }),
    {
      name: 'timesync-storage',
    }
  )
);