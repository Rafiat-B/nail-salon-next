'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'customer',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (/\d/.test(formData.name)) {
      setError('Name cannot contain numbers');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('Invalid email format');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError('Phone number must be exactly 10 digits');
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, role: 'customer' }),
    });
    const data = await res.json();

    if (res.ok) router.push('/login');
    else setError(data.error || 'Registration failed');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-pink-700">Be A Family!</h2>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <form onSubmit={handleRegister}>
          <label className="block text-gray-700">Name</label>
          <input type="text" name="name" className="border p-2 w-full rounded" value={formData.name} onChange={handleChange} required />
          <label className="block text-gray-700 mt-4">Email</label>
          <input type="email" name="email" className="border p-2 w-full rounded" value={formData.email} onChange={handleChange} required />
          <label className="block text-gray-700 mt-4">Phone</label>
          <input type="text" name="phone" className="border p-2 w-full rounded" value={formData.phone} onChange={handleChange} required />
          <label className="block text-gray-700 mt-4">Password</label>
          <input type="password" name="password" className="border p-2 w-full rounded" value={formData.password} onChange={handleChange} required />
          <label className="block text-gray-700 mt-4">Confirm Password</label>
          <input type="password" name="confirmPassword" className="border p-2 w-full rounded" value={formData.confirmPassword} onChange={handleChange} required />
          <button type="submit" className="mt-4 bg-pink-600 text-white px-4 py-2 rounded w-full">Register</button>
        </form>
      </div>
    </div>
  );
}
