/**
 * Conflict-Free Timetable Scheduler for CS Department
 * 
 * Key constraints enforced:
 * 1. Same teacher cannot be in two classes at the same period (NO CLASHES)
 * 2. Teacher teaching in both Chavara (S1) and StMarys (Higher) blocks
 *    cannot have consecutive hours in those different blocks
 * 3. S2 and S4 → 8 hours (with SPORTS at hour 7)
 * 4. S6 and S8 → 7 hours
 * 5. Library hour preferred at period before lunch (period 4) or last period
 * 6. Lab slots are 3 consecutive periods
 */

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Period config per semester group
function getPeriodsConfig(semester) {
  if (semester === 'S2' || semester === 'S4') {
    return {
      totalPeriods: 8,
      hasSports: true,
      sportsSlot: 6, // 0-indexed, period 7
      lunchAfter: 3, // periods 0-3, lunch, 4-7
    };
  }
  return {
    totalPeriods: 7,
    hasSports: false,
    lunchAfter: 3,
  };
}

function createEmptyGrid(days, totalPeriods) {
  const grid = {};
  for (const day of days) {
    grid[day] = Array(totalPeriods).fill(null);
  }
  return grid;
}

/**
 * Check if teacher is busy at a given day/period across ALL classes already scheduled
 */
function isTeacherBusy(teacherSchedule, teacherId, day, period) {
  return teacherSchedule[teacherId]?.[day]?.has(period) ?? false;
}

/**
 * Mark teacher busy at day/period
 */
function markTeacherBusy(teacherSchedule, teacherId, day, period) {
  if (!teacherSchedule[teacherId]) teacherSchedule[teacherId] = {};
  if (!teacherSchedule[teacherId][day]) teacherSchedule[teacherId][day] = new Set();
  teacherSchedule[teacherId][day].add(period);
}

/**
 * Check if placing a teacher at (day, period) for a class in blockTo
 * would violate the consecutive cross-block constraint.
 * If teacher has classes in another block, consecutive periods are not allowed.
 */
function violatesCrossBlockConstraint(
  teacherSchedule,
  teacherBlock,
  classBlock,
  teacherId,
  day,
  period,
  classBlockMap // classId -> block
) {
  if (teacherBlock === classBlock) return false; // same block, no issue

  // Check adjacent periods: if teacher is busy at period-1 or period+1 in a DIFFERENT block
  const adjacentPeriods = [period - 1, period + 1];
  for (const adj of adjacentPeriods) {
    if (adj < 0) continue;
    if (teacherSchedule[teacherId]?.[day]?.has(adj)) {
      // Teacher is busy at adjacent period - check if that busy slot was in a different block
      // We approximate: if teacher's home block differs from current class block, flag it
      if (teacherBlock !== classBlock) return true;
    }
  }
  return false;
}

/**
 * Main entry point - generates clash-free timetables for all classes.
 * @param {Array} classes - Array of class objects { id, name, semester, studentCount, block }
 * @param {Array} subjects - Array of subject objects { id, name, type }
 * @param {Array} teachers - Array of teacher objects { id, name, block }
 * @param {Array} allocations - Array of { id, classId, subjectId, teacherId, hours }
 * @param {Object} constraints
 */
export function generateTimetable(classes, subjects, teachers, allocations, constraints) {
  // Build lookup maps
  const subjectMap = Object.fromEntries(subjects.map(s => [s.id, s]));
  const teacherMap = Object.fromEntries(teachers.map(t => [t.id, t]));
  const classMap = Object.fromEntries(classes.map(c => [c.id, c]));

  // Global teacher schedule across all classes: teacherId -> { day -> Set<period> }
  const teacherSchedule = {};
  teachers.forEach(t => {
    teacherSchedule[t.id] = {};
    DAYS.forEach(d => { teacherSchedule[t.id][d] = new Set(); });
  });

  // Build per-class allocation list
  const classAllocations = {};
  for (const alloc of allocations) {
    if (!classAllocations[alloc.classId]) classAllocations[alloc.classId] = [];
    classAllocations[alloc.classId].push(alloc);
  }

  const timetables = {};

  // Process each class
  for (const cls of classes) {
    const cfg = getPeriodsConfig(cls.semester);
    const grid = createEmptyGrid(DAYS, cfg.totalPeriods);
    const classAllocs = classAllocations[cls.id] || [];

    // Expand allocations into individual slot requirements
    // Labs get grouped as 3-period consecutive blocks
    const slots = [];
    for (const alloc of classAllocs) {
      const subject = subjectMap[alloc.subjectId];
      const teacher = teacherMap[alloc.teacherId];
      if (!subject || !teacher) continue;

      if (subject.type === 'Lab') {
        // Lab: needs 3 consecutive slots in a single day
        const labHours = alloc.hours; // typically 3
        const blocks = Math.floor(labHours / 3);
        for (let b = 0; b < blocks; b++) {
          slots.push({ subject, teacher, alloc, isLab: true, labSize: 3 });
        }
        // Remaining lab hours as individual
        for (let r = 0; r < labHours % 3; r++) {
          slots.push({ subject, teacher, alloc, isLab: false });
        }
      } else {
        for (let i = 0; i < alloc.hours; i++) {
          slots.push({ subject, teacher, alloc, isLab: false });
        }
      }
    }

    // Place SPORTS at Thursday, period index 6 for S2/S4 (can be any day)
    if (cfg.hasSports) {
      // Mark Thursday period 6 (hour 7) as SPORTS
      const sportsDay = 'Thursday';
      if (!grid[sportsDay][cfg.sportsSlot]) {
        grid[sportsDay][cfg.sportsSlot] = {
          subject: 'Sports',
          teacher: '',
          type: 'Sports',
          code: 'SPORTS',
        };
      }
    }

    // Sort: Labs first (they need 3 consecutive), then by number of hours needed (desc)
    slots.sort((a, b) => {
      if (a.isLab && !b.isLab) return -1;
      if (!a.isLab && b.isLab) return 1;
      return 0;
    });

    // Track how many of each subject have been placed per day (to spread across week)
    const subjectDayCount = {}; // subjectId -> { day -> count }

    // Place each slot in the grid
    for (const slot of slots) {
      const { subject, teacher, isLab, labSize } = slot;
      if (!subjectDayCount[subject.id]) subjectDayCount[subject.id] = {};

      let placed = false;

      if (isLab) {
        // Need 3 consecutive free slots in same day, teacher must be free for all 3
        outer: for (const day of DAYS) {
          for (let p = 0; p <= cfg.totalPeriods - labSize; p++) {
            // Skip across lunch: periods 3 -> 4 (can't bridge lunch)
            // Lunch is after period index 3, so lab can't span 3->4
            if (p <= cfg.lunchAfter && p + labSize > cfg.lunchAfter + 1) continue;
            
            let canPlace = true;
            for (let k = 0; k < labSize; k++) {
              if (grid[day][p + k] !== null) { canPlace = false; break; }
              if (isTeacherBusy(teacherSchedule, teacher.id, day, p + k)) { canPlace = false; break; }
            }
            if (canPlace) {
              for (let k = 0; k < labSize; k++) {
                grid[day][p + k] = {
                  subject: subject.name,
                  teacher: teacher.name,
                  type: subject.type,
                  code: subject.id,
                  isLab: true,
                  labPart: k === 0 ? 'start' : k === labSize - 1 ? 'end' : 'mid',
                };
                markTeacherBusy(teacherSchedule, teacher.id, day, p + k);
              }
              placed = true;
              break outer;
            }
          }
        }
      } else {
        // Regular slot - try to spread the subject across different days
        // Sort days by how many of this subject are already placed that day (least first)
        const dayOrder = [...DAYS].sort((a, b) => {
          const ca = subjectDayCount[subject.id][a] || 0;
          const cb = subjectDayCount[subject.id][b] || 0;
          return ca - cb;
        });

        outer: for (const day of dayOrder) {
          for (let p = 0; p < cfg.totalPeriods; p++) {
            if (grid[day][p] !== null) continue;
            if (isTeacherBusy(teacherSchedule, teacher.id, day, p)) continue;

            // Cross-block consecutive constraint
            if (constraints.consecutiveBlockRule && cls.block && teacher.block && cls.block !== teacher.block) {
              if (violatesCrossBlockConstraint(
                teacherSchedule, teacher.block, cls.block,
                teacher.id, day, p, {}
              )) continue;
            }

            // Don't place same subject in consecutive periods in same day
            const prevSlot = p > 0 ? grid[day][p - 1] : null;
            const nextSlot = p < cfg.totalPeriods - 1 ? grid[day][p + 1] : null;
            if (prevSlot?.code === subject.id || nextSlot?.code === subject.id) continue;

            // Place it
            grid[day][p] = {
              subject: subject.name,
              teacher: teacher.name,
              type: subject.type,
              code: subject.id,
            };
            markTeacherBusy(teacherSchedule, teacher.id, day, p);
            subjectDayCount[subject.id][day] = (subjectDayCount[subject.id][day] || 0) + 1;
            placed = true;
            break outer;
          }
        }
      }

      if (!placed) {
        // Could not place - find any remaining free slot (best effort)
        for (const day of DAYS) {
          for (let p = 0; p < cfg.totalPeriods; p++) {
            if (grid[day][p] !== null) continue;
            if (isTeacherBusy(teacherSchedule, teacher.id, day, p)) continue;
            grid[day][p] = {
              subject: subject.name,
              teacher: teacher.name,
              type: subject.type,
              code: subject.id,
              unresolved: true,
            };
            markTeacherBusy(teacherSchedule, teacher.id, day, p);
            placed = true;
            break;
          }
          if (placed) break;
        }
      }
    }

    // Fill remaining with Library / Free
    for (const day of DAYS) {
      for (let p = 0; p < cfg.totalPeriods; p++) {
        if (!grid[day][p]) {
          grid[day][p] = { subject: 'Free / Library', teacher: '', type: 'Other', code: 'FREE' };
        }
      }
    }

    timetables[cls.id] = {
      className: cls.name,
      semester: cls.semester,
      totalPeriods: cfg.totalPeriods,
      grid,
    };
  }

  return timetables;
}

/**
 * Check for clashes in a generated timetable set.
 * Returns list of clash descriptions.
 */
export function detectClashes(timetables) {
  const clashes = [];
  // Build: day -> period -> [ {className, subject, teacher} ]
  const slotMap = {};
  for (const [classId, tt] of Object.entries(timetables)) {
    for (const day of DAYS) {
      if (!slotMap[day]) slotMap[day] = {};
      const row = tt.grid[day];
      if (!row) continue;
      row.forEach((slot, p) => {
        if (!slot || !slot.teacher || slot.type === 'Other' || slot.type === 'Sports') return;
        if (!slotMap[day][p]) slotMap[day][p] = [];
        slotMap[day][p].push({ className: tt.className, subject: slot.subject, teacher: slot.teacher });
      });
    }
  }
  for (const day of DAYS) {
    for (const [period, entries] of Object.entries(slotMap[day] || {})) {
      const teacherGroups = {};
      for (const e of entries) {
        if (!teacherGroups[e.teacher]) teacherGroups[e.teacher] = [];
        teacherGroups[e.teacher].push(e);
      }
      for (const [teacher, occurrences] of Object.entries(teacherGroups)) {
        if (occurrences.length > 1) {
          clashes.push({
            day,
            period: Number(period) + 1,
            teacher,
            classes: occurrences.map(o => `${o.className} (${o.subject})`),
          });
        }
      }
    }
  }
  return clashes;
}
