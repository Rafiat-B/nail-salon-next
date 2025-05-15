"use client";
// import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Array of background images (update with actual image paths)
const images = [
  "/images/nail-background.jpg", 
  "/images/nail-background1.jpg", 
  "/images/nail-background2.jpg",
  "/images/nail-background3.jpg",
  "/images/nail-background4.jpg",
  "/images/nail-background5.jpg",
];

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center text-white">
      
      {/* Background Slideshow */}
      <div className="absolute inset-0">
        {images.map((img, i) => (
          <motion.div
            key={i}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
      </div>

      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      {/* Hero Content */}
      <main className="relative p-10">
        <motion.h2
          className="text-4xl font-bold tracking-wide"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Pamper Yourself with the Best Nail Services
        </motion.h2>
        <motion.p
          className="mt-4 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        >
          Book an appointment and enjoy a relaxing experience.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
        >
          <Link
            href="/services"
            className="mt-6 inline-block bg-pink-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-pink-700 transition"
          >
            View Services
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
