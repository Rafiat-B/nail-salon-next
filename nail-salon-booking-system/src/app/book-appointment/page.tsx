"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IUser } from "@/models/User";
import dynamic from "next/dynamic";
import "react-datepicker/dist/react-datepicker.css";

// Load custom DatePicker component without SSR
const DatePicker = dynamic(() => import("../../../components/shared/DatePicker"), {
  ssr: false,
});

interface IService {
  _id: string;
  name: string;
}

export default function BookAppointment() {
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);

  const [services, setServices] = useState<IService[]>([]);
  const [selectedService, setSelectedService] = useState("");

  // Split date and time into separate state variables
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");

  useEffect(() => {
    setIsClient(true);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }

    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        if (data.length > 0) setSelectedService(data[0]._id);
      })
      .catch((err) => console.error("Failed to fetch services:", err));
  }, []);

  // Booking handler
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (!selectedDay || !selectedTime) {
      alert("Please select both a date and time before booking.");
      return;
    }

    // Compose date and time into single Date object
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const combined = new Date(selectedDay);
    combined.setHours(hours, minutes, 0, 0);

    const bookingData = {
      user_id: user?._id,
      service_id: selectedService,
      appointment_date: combined.toISOString(),
    };

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    if (res.ok) {
      alert("Booking Confirmed!");
      router.push(user?.role === "admin" ? "/admin" : "/dashboard");
    } else {
      alert("Failed to book appointment.");
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {isLoggedIn && (
        <button
          onClick={() => router.push(user?.role === "admin" ? "/admin" : "/dashboard")}
          className="mb-4 bg-pink-600 text-white px-4 py-2 rounded"
        >
          Back to Dashboard
        </button>
      )}

      <h2 className="text-2xl font-bold text-pink-700">Book an Appointment</h2>
      <p className="text-gray-600">Select a service and choose a time slot.</p>

      <form className="mt-4" onSubmit={handleBooking}>
        {/* Service Selector */}
        <label className="block text-gray-700">Select Service</label>
        <select
          className="border p-2 w-full rounded"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
        >
          {services.map((service) => (
            <option key={service._id} value={service._id}>
              {service.name}
            </option>
          ))}
        </select>

        {/* Custom Date + Time Picker */}
        <label className="block text-gray-700 mt-4">Choose Date & Time</label>
        <DatePicker
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />


        {/* Submit Button */}
        <button type="submit" className="mt-4 bg-pink-600 text-white px-4 py-2 rounded">
          Book Now
        </button>
      </form>
    </div>
  );
}
