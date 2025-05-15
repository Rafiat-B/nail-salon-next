"use client";
import { useState, useEffect } from "react";
import axios from "axios";

interface IService {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image?: string;
}

export default function ManageServices() {
  const [services, setServices] = useState<IService[]>([]);
  const [showForm, setShowForm] = useState(false); // Controls form visibility
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    image: ""
  });

  useEffect(() => {
    axios.get<IService[]>("/api/services")
      .then(res => setServices(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewService({ ...newService, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post<{ message: string; service: IService }>("/api/services", newService);
      
      if (res.status === 201) {
        setServices([...services, res.data.service]); // ✅ No more TypeScript error
        setShowForm(false); 
        setNewService({ name: "", description: "", price: "", duration: "", image: "" }); 
      }
    } catch (error) {
      console.error("Error adding service:", error);
    }
  };
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-pink-700">Manage Services</h2>

      {/* Add Service Button */}
      <button
        onClick={() => setShowForm(true)}
        className="bg-pink-600 text-white px-4 py-2 rounded mt-4"
      >
        + Add Service
      </button>

      {/* Form (Hidden Until Button Clicked) */}
      {showForm && (
        <div className="bg-white p-6 mt-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700">Add New Service</h3>
          <form onSubmit={handleSubmit} className="mt-4">
            <input type="text" name="name" placeholder="Service Name" value={newService.name} onChange={handleInputChange} className="border p-2 w-full rounded mt-2" required />
            <textarea name="description" placeholder="Description" value={newService.description} onChange={handleInputChange} className="border p-2 w-full rounded mt-2" required />
            <input type="number" name="price" placeholder="Price" value={newService.price} onChange={handleInputChange} className="border p-2 w-full rounded mt-2" required />
            <input type="number" name="duration" placeholder="Duration (mins)" value={newService.duration} onChange={handleInputChange} className="border p-2 w-full rounded mt-2" required />
            <input type="text" name="image" placeholder="Image URL" value={newService.image} onChange={handleInputChange} className="border p-2 w-full rounded mt-2" />
            
            <div className="mt-4 flex gap-2">
              <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Service List */}
      <table className="w-full border mt-6">
        <thead>
          <tr className="bg-pink-600 text-white">
            <th className="p-2">Name</th>
            <th className="p-2">Description</th>
            <th className="p-2">Price</th>
            <th className="p-2">Duration</th>
          </tr>
        </thead>
        <tbody>
          {services.map(service => (
            <tr key={service._id} className="border-t">
              <td className="p-2">{service.name}</td>
              <td className="p-2">{service.description}</td>
              <td className="p-2">${service.price}</td>
              <td className="p-2">{service.duration} min</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
