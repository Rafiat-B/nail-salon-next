"use client";

import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface ClientDatePickerProps {
  selectedDay: Date | null;
  setSelectedDay: (date: Date | null) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
}

export default function ClientDatePicker({
  selectedDay,
  setSelectedDay,
  selectedTime,
  setSelectedTime,
}: ClientDatePickerProps) {
  const timeOptions = Array.from({ length: 96 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minutes = (i % 4) * 15;
    return `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  });

  return (
    <div className="bg-white border p-4 rounded shadow space-y-4">
      <style jsx global>{`
        :root {
          --rdp-accent-color: #ec4899;
        }
      `}</style>

      <div className="flex gap-6">
        {/* Date Picker */}
        <div className="text-sm">
          <DayPicker
            mode="single"
            required
            selected={selectedDay ?? undefined}
            onSelect={setSelectedDay}
            styles={{
              caption: { fontSize: "1rem" },
              head_cell: { fontSize: "0.8rem" },
              day: { fontSize: "0.85rem" },
            }}
          />

        </div>

        {/* Time Dropdown */}
        <div className="flex flex-col justify-start w-40">
          <label className="mb-1 text-gray-700 text-sm">Select Time:</label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="border p-2 rounded text-sm"
          >
            <option value="">-- Select Time --</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Optional Preview */}
      {selectedDay && selectedTime && (
        <p className="text-sm text-gray-600 text-center">
          Selected Time:{" "}
          {format(
            new Date(
              new Date(selectedDay).setHours(
                parseInt(selectedTime.split(":")[0]),
                parseInt(selectedTime.split(":")[1])
              )
            ),
            "PPpp"
          )}
        </p>
      )}
    </div>
  );
}
