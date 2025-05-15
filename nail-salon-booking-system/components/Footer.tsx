export default function Footer() {
    return (
      <footer className="w-full bg-pink-600 text-center p-4 mt-10 shadow-md">
        <p className="text-white-700 font-bold">
          Nail Salon Appointment Booking System</p>
        <p className="text-sm mt-1">&copy; {new Date().getFullYear()} WDR DevHub</p>
      </footer>
    );
  }
  