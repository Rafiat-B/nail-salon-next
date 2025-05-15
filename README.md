# 💅 Nail Salon Booking System Project Documentation

## 📌 Project Overview
The **Nail Salon Booking System** simplifies the booking process and management of appointments for a nail salon. It features separate dashboards for customers and administrators, offering user-friendly tools to schedule, manage, and monitor appointments. The system is built using **Next.js**, **MongoDB**, and **Tailwind CSS** for a modern full-stack experience.

---

## 👩‍💻 Contributions by Rafiat Bolaji

I was responsible for designing and implementing the front-end UI components of the application, ensuring a modern, responsive, and accessible user experience.

### 1. Service Listing & Selection Page
- Designed and implemented the interface for browsing and selecting services.
- Created an intuitive dropdown system for users to choose service types.
- Ensured each service displays its name and can be selected for appointment creation.

### 2. Customer Appointment Management
- Developed the user dashboard that dynamically shows each user's appointments.
- Added features for canceling bookings with status updates reflected immediately in the UI.
- Integrated time formatting for appointments using `.toLocaleString()` for clarity.

### 3. Admin Dashboard
- Designed a visually clean and organized admin panel.
- Used grid and card layout systems to improve readability of large datasets.
- Enhanced UI responsiveness and ensured accessible layout for admin operations.

### 4. User Authentication & Profile UI
- Developed Login, Registration, and Settings pages for user profile updates.
- Added visual form validation and success/error feedback messages.
- Helped separate user experience between customers and admin via tailored UI routes.

### 5. General UI/UX Enhancements
- Applied consistent color themes, spacing, and shadow effects across all pages.
- Used Tailwind utilities to ensure the site is mobile- and tablet-friendly.
- Added role-based dashboard buttons to guide users effectively after login.

### 🔧 Technologies Used
- **Next.js with TypeScript** for frontend logic and routing.
- **Tailwind CSS** for modern styling and responsiveness.
- **Axios** for client-server communication.

### 🔮 Future Enhancements
- Add calendar-based booking visualization (drag-to-select time slots).
- Add service rating & feedback components post-appointment.
- Improve accessibility with ARIA roles and keyboard navigation support.

### ✅ Conclusion
Through my contributions, I aimed to deliver a polished and usable user interface that enhances the overall experience for both salon clients and administrators.

---

## 🔐 Contributions by Dariya Takenova

I focused on full-stack logic for secure user authentication, protected routing, and session management. These features safeguard user data and separate access based on user roles.

### 1. User Authentication & Registration (Full-Stack)
- Implemented secure login/registration APIs using JWT.
- Used bcrypt to hash user passwords before storing in MongoDB.
- Enabled cookie-based session handling with `Set-Cookie` in API responses.
- Implemented role-specific redirects (admin vs customer) on login.

### 2. Role-Based Route Protection (Frontend & Middleware)
- Used `Next.js` middleware (Edge runtime) to decode JWT tokens securely via `jose`.
- Implemented route guards for `/admin` and `/dashboard` pages.
- Blocked unauthorized access and redirected to login when token is invalid.

### 3. Middleware Setup
- Replaced incompatible `jsonwebtoken` with Edge-compatible `jose` library.
- Wrote reusable auth middleware for route access control.

### 4. Cookie Debugging & Session Fixes
- Debugged edge runtime cookie issues to ensure token is parsed and stored properly.
- Validated JWTs manually using DevTools for end-to-end debugging.

### 5. Navbar Integration
- Added conditional rendering to show login/logout links based on user session.
- Implemented a dynamic Navbar wrapper to avoid hydration mismatches.

### 6. Robust Error Handling
- Displayed alert messages on invalid credentials and token expiration.
- Used logging extensively to troubleshoot authentication edge cases.

### 🛠️ Technologies Used
- **Next.js App Router** with API routes
- **MongoDB** and **Mongoose** for user data persistence
- **bcrypt** for password encryption
- **jose** for JWT decoding in middleware

### 🔮 Future Enhancements
- Add "remember me" feature to keep users logged in across sessions.
- Enable 2FA or OTP for enhanced security.

### ✅ Conclusion
My backend and auth layer ensures secure access control for the entire system. Users are now protected with token-based auth and reliable session handling.

---

## 🧠 Contributions by Yuchen Wei

I focused on improving the appointment booking logic, creating admin CRUD functionalities, and enhancing appointment visibility and logic correctness in both the user and admin dashboards.

### 1. Time Picker Overhaul & Validation Fix
- Refactored date & time selection into split state variables (`selectedDay`, `selectedTime`).
- Rewrote custom `DatePicker` component using `react-day-picker` + manual 15-min interval logic.
- Ensured time was not stored on selection change but only committed on final submit (avoids early commit bugs).

### 2. Appointment Booking Logic (Customer)
- Linked selected service, date, and time to appointment POST logic.
- Composed precise ISO string from selected date + time at `onSubmit` stage.
- Validated time presence to prevent submitting null values.

### 3. Admin CRUD Functionality
- Built admin-facing appointment form supporting user/service selection, status control, and datetime input.
- Created backend API logic for POST, PUT, and DELETE for `/api/appointments`.
- Supported update of appointment `status` (e.g., cancelled, completed, confirmed).

### 4. Booking Table Enhancements (Admin & User)
- Adjusted appointment table rendering from `toLocaleDateString()` to `toLocaleString()` to show full timestamp.
- Ensured users only see their own bookings via backend header filtering (`user-id` header in GET).
- Admin can see all records, each enriched with user name and service name via `.map()` preprocessing.

### 5. Feedback & Interactivity
- Added UI alerts for action results (e.g., “Booking Cancelled!” or “Update Failed”).
- Used visual table indicators to improve admin readability of status.

### 🛠️ Technologies Used
- **Next.js App Router**
- **MongoDB** + **Mongoose**
- **Axios**, **React hooks**, and custom state management
- **react-day-picker** for calendar input

### 🔮 Future Enhancements
- Add live countdown timer in the admin booking table for upcoming appointments.
- Implement reminder badges for appointments within 15 minutes of starting.
- Enable inline admin appointment editing (e.g., update time directly in table).

### ✅ Conclusion
My contributions focused on bridging the gap between backend data and interactive frontend components, especially enhancing how bookings are created, edited, viewed, and updated across user roles.

---

## 👨‍💻 Team Members
- **Dariya Takenova** – Authentication, Middleware, Security, Route Protection
- **Rafiat Bolaji** – UI/UX Design, Customer & Admin Dashboards, Profile Management
- **Yuchen Wei** – Appointment Logic, Admin CRUD, Date-Time Validation, Table Enhancements


## Deployment
In Vercel --- https://nail-salon-booking-system.vercel.app/ 


