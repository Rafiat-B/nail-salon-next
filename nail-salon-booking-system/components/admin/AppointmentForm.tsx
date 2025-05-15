'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import "react-datepicker/dist/react-datepicker.css";

const DatePicker = dynamic(() => import("../../components/shared/DatePicker"), {
  ssr: false,
});

interface IUser {
  _id: string;
  email: string;
}

interface IService {
  _id: string;
  name: string;
}

interface AppointmentFormProps {
  onSuccess?: () => void;
}

export default function AppointmentForm({ onSuccess }: AppointmentFormProps) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [services, setServices] = useState<IService[]>([]);

  const [user_id, setUserId] = useState("");
  const [service_id, setServiceId] = useState("");
  const [status, setStatus] = useState("pending");
  const [message, setMessage] = useState("");

  // ⬇️ new states matching new DatePicker props
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await axios.get<IUser[]>("/api/users");
        const servicesRes = await axios.get<IService[]>("/api/services");
        setUsers(usersRes.data);
        setServices(servicesRes.data);
      } catch (err) {
        console.error("Error fetching users/services:", err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDay || !selectedTime) {
      setMessage("Please select both a date and time.");
      return;
    }

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const combined = new Date(selectedDay);
    combined.setHours(hours, minutes, 0, 0);

    try {
      await axios.post("/api/appointments", {
        user_id,
        service_id,
        appointment_date: combined.toISOString(),
        status,
      });

      setMessage("Booking Created!");
      setUserId("");
      setServiceId("");
      setStatus("pending");
      setSelectedDay(null);
      setSelectedTime("");

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setMessage("Booking Failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 text-gray-700">Select User:</label>
        <select
          value={user_id}
          onChange={(e) => setUserId(e.target.value)}
          required
          className="border p-2 rounded w-full"
        >
          <option value="">-- Select User --</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.email}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 text-gray-700">Select Service:</label>
        <select
          value={service_id}
          onChange={(e) => setServiceId(e.target.value)}
          required
          className="border p-2 rounded w-full"
        >
          <option value="">-- Select Service --</option>
          {services.map((service) => (
            <option key={service._id} value={service._id}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 text-gray-700">Select Date & Time:</label>
        <DatePicker
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />
      </div>

      <div>
        <label className="block mb-1 text-gray-700">Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
          className="border p-2 rounded w-full"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded">
        Create Booking
      </button>

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </form>
  );
}
