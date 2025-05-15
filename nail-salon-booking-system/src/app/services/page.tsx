"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface IService {
  _id?: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image?: string;
}

export default function Services() {
  const [services, setServices] = useState<IService[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get<IService[]>("/api/services")
      .then(res => setServices(res.data))
      .catch(() => setError("Failed to load services."));
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      <h2 className="text-3xl font-bold text-center text-pink-700 mb-10">Our Services</h2>
      <p className="text-gray-600 text-center mb-6">Choose from a variety of nail treatments.</p>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-8">
        {services.map(service => (
          <div key={service._id || service.name} className="max-w-[400px] mx-auto bg-gray-100 p-4 rounded-lg shadow-md text-center h-[450px]">
            <img src={service.image || "/images/default-nail.jpg"} alt={service.name} className="w-full h-56 object-cover rounded-md" />
            <h3 className="text-lg font-bold text-pink-600 mt-4">{service.name}</h3>
            <p className="text-gray-600">{service.description}</p>
            <p className="text-gray-700 font-semibold">${service.price}</p>
            <p className="text-gray-500">{service.duration} min</p>
          </div>
        ))}
      </div>
    </div>
  );
}
