import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

export const useStore = create(
  persist(
    (set) => ({
      teachers: [],
      subjects: [],
      classes: [],
      rooms: [],
      constraints: {
        maxHoursPerDay: 8,
        consecutiveBlockRule: true,
        maxSubjectsPerTeacher: 2,
        maxLabsPerTeacher: 2,
        libraryMaxCapacity: 126
      },

      addTeacher: (teacher) => set((state) => ({ teachers: [...state.teachers, { ...teacher, id: uuidv4() }] })),
      updateTeacher: (id, teacher) => set((state) => ({
        teachers: state.teachers.map((t) => (t.id === id ? { ...t, ...teacher } : t))
      })),
      deleteTeacher: (id) => set((state) => ({ teachers: state.teachers.filter((t) => t.id !== id) })),

      addSubject: (subject) => set((state) => ({ subjects: [...state.subjects, { ...subject, id: uuidv4() }] })),
      updateSubject: (id, subject) => set((state) => ({
        subjects: state.subjects.map((s) => (s.id === id ? { ...s, ...subject } : s))
      })),
      deleteSubject: (id) => set((state) => ({ subjects: state.subjects.filter((s) => s.id !== id) })),

      addClass: (cls) => set((state) => ({ classes: [...state.classes, { ...cls, id: uuidv4() }] })),
      updateClass: (id, cls) => set((state) => ({
        classes: state.classes.map((c) => (c.id === id ? { ...c, ...cls } : c))
      })),
      deleteClass: (id) => set((state) => ({ classes: state.classes.filter((c) => c.id !== id) })),

      addRoom: (room) => set((state) => ({ rooms: [...state.rooms, { ...room, id: uuidv4() }] })),
      updateRoom: (id, room) => set((state) => ({
        rooms: state.rooms.map((r) => (r.id === id ? { ...r, ...room } : r))
      })),
      deleteRoom: (id) => set((state) => ({ rooms: state.rooms.filter((r) => r.id !== id) })),

      updateConstraints: (constraints) => set((state) => ({ constraints: { ...state.constraints, ...constraints } })),
    }),
    {
      name: 'timesync-storage',
    }
  )
)
