"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export default function Navbar() {
  const [user, setUser] = useState<IUser | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [pathname]);

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center z-50 relative">
      <div className="text-xl font-bold text-pink-700">
        <Link href="/">Nail Salon Booking</Link>
      </div>
      <div className="space-x-4">
        {user ? (
          <>
            {user.role === "customer" && (
              <Link href="/book-appointment" className="text-pink-600 hover:text-pink-800">
                Book Appointment
              </Link>
            )}
            <Link href="/dashboard" className="text-pink-600 hover:text-pink-800">
              Dashboard
            </Link>
            <Link href="/logout" className="text-pink-600 hover:text-pink-800">
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link href="/services" className="text-pink-600 hover:text-pink-800">
              Services
            </Link>
            <Link href="/book-appointment" className="text-pink-600 hover:text-pink-800">
              Book
            </Link>
            <Link href="/login" className="text-pink-600 hover:text-pink-800">
              Login
            </Link>
            <Link href="/registration" className="text-pink-600 hover:text-pink-800">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
