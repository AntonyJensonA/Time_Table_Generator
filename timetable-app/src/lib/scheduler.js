// A basic greedy scheduler for the timetable

function createEmptyGrid(days, periods) {
  const grid = {};
  for (let d = 0; d < days.length; d++) {
    grid[days[d]] = Array(periods).fill(null);
  }
  return grid;
}

export function generateTimetable(classes, subjects, teachers, constraints) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timetables = {};
  
  // Track teacher assignments: teacherId -> { day -> set of periods }
  const teacherSchedule = {};
  teachers.forEach(t => {
    teacherSchedule[t.id] = {};
    days.forEach(d => teacherSchedule[t.id][d] = new Set());
  });

  // Assign subjects to classes greedily
  classes.forEach(cls => {
    const is8Hours = cls.semester === 'S2' || cls.semester === 'S4';
    const periods = is8Hours ? 8 : 7;
    const grid = createEmptyGrid(days, periods);
    
    // Flatten subjects into an array of needed slots
    // For simplicity, we assume each class needs all subjects. 
    // In a real app, we would map subjects to specific classes.
    let slotsNeeded = [];
    subjects.forEach(sub => {
      for(let i=0; i<sub.hours; i++) {
        slotsNeeded.push({ ...sub });
      }
    });

    // We also need to map a teacher to a subject.
    // For this prototype, we'll assign a random teacher to each subject if not defined.
    // In a full app, subject-teacher mapping is pre-defined.

    let slotIdx = 0;
    
    for (let d = 0; d < days.length; d++) {
      for (let p = 0; p < periods; p++) {
        if (slotIdx >= slotsNeeded.length) break;

        // Find a subject that can be placed here (teacher is free)
        // Since we don't have explicit teacher-subject mapping yet, we'll just place the subject
        // and randomly assign a free teacher for demonstration of the grid.
        let assigned = false;
        
        for (let i = slotIdx; i < slotsNeeded.length; i++) {
          const subject = slotsNeeded[i];
          // Pick a random teacher
          const teacher = teachers[Math.floor(Math.random() * teachers.length)];
          
          if (!teacher) {
             // No teachers available in system, just place subject
             grid[days[d]][p] = { subject: subject.name, teacher: 'TBD', type: subject.type };
             slotsNeeded.splice(i, 1);
             assigned = true;
             break;
          }

          if (!teacherSchedule[teacher.id][days[d]].has(p)) {
            // Teacher is free
            teacherSchedule[teacher.id][days[d]].add(p);
            grid[days[d]][p] = { subject: subject.name, teacher: teacher.name, type: subject.type };
            slotsNeeded.splice(i, 1);
            assigned = true;
            break;
          }
        }
        
        if (!assigned) {
           grid[days[d]][p] = { subject: 'Free / Library', teacher: '', type: 'Other' };
        }
      }
    }
    
    timetables[cls.id] = {
      className: cls.name,
      grid
    };
  });

  return timetables;
}
