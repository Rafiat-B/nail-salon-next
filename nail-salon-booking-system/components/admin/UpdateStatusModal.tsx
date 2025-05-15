"use client";
import axios from "axios";
import { useState } from "react";
import { Appointment } from "../../appointment";

export default function UpdateStatusModal({ appointment, onClose }: { appointment: Appointment; onClose: () => void }) {
  const [status, setStatus] = useState(appointment.status);

  const updateStatus = async () => {
    await axios.put("/api/appointments", { id: appointment._id, status });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Update Booking Status</h2>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-2 border rounded w-full">
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded mr-2">Cancel</button>
          <button onClick={updateStatus} className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
        </div>
      </div>
    </div>
  );
}
