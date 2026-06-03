import * as XLSX from "xlsx";
import { useStore } from "../store";

export default function ImportExcel() {
  const { loadData } = useStore();

  const handleImport = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const workbook = XLSX.read(evt.target.result, {
        type: "binary",
      });

      const teachersRaw =
        XLSX.utils.sheet_to_json(
          workbook.Sheets["Teachers"]
        ) || [];

      const subjectsRaw =
        XLSX.utils.sheet_to_json(
          workbook.Sheets["Subjects"]
        ) || [];

      const classesRaw =
        XLSX.utils.sheet_to_json(
          workbook.Sheets["Classes"]
        ) || [];

      const roomsRaw =
        XLSX.utils.sheet_to_json(
          workbook.Sheets["Rooms"]
        ) || [];

      const allocationsRaw =
        XLSX.utils.sheet_to_json(
          workbook.Sheets["Allocations"]
        ) || [];

      // Generate IDs
      const teachers = teachersRaw.map((t) => ({
        id: crypto.randomUUID(),
        ...t,
      }));

      const subjects = subjectsRaw.map((s) => ({
        id: crypto.randomUUID(),
        ...s,
      }));

      const classes = classesRaw.map((c) => ({
        id: crypto.randomUUID(),
        ...c,
      }));

      const rooms = roomsRaw.map((r) => ({
        id: crypto.randomUUID(),
        ...r,
      }));

      // Convert names → IDs
      const allocations = allocationsRaw
        .map((a) => {
          const cls = classes.find(
            (c) => c.name === a.Class
          );

          const subj = subjects.find(
            (s) => s.name === a.Subject
          );

          const teacher = teachers.find(
            (t) => t.name === a.Teacher
          );

          if (!cls || !subj || !teacher) {
            console.warn(
              "Allocation skipped:",
              a
            );
            return null;
          }

          return {
            id: crypto.randomUUID(),
            classId: cls.id,
            subjectId: subj.id,
            teacherId: teacher.id,
            hours: Number(a.Hours),
          };
        })
        .filter(Boolean);

      loadData({
        teachers,
        subjects,
        classes,
        rooms,
        allocations,
      });

      alert(
        `Imported:
Teachers: ${teachers.length}
Subjects: ${subjects.length}
Classes: ${classes.length}
Rooms: ${rooms.length}
Allocations: ${allocations.length}`
      );
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        Import Excel Data
      </h2>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleImport}
        className="border p-2 rounded"
      />

      <div className="text-sm text-muted-foreground">
        Required Sheets:
        <ul className="list-disc ml-6 mt-2">
          <li>Teachers</li>
          <li>Subjects</li>
          <li>Classes</li>
          <li>Rooms</li>
          <li>Allocations</li>
        </ul>
      </div>
    </div>
  );
}