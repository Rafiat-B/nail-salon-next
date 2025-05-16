"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";

interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export default function Settings() {
  const router = useRouter();
  const [userData, setUserData] = useState<IUser | null>(null);
  const [originalData, setOriginalData] = useState<IUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      setOriginalData(parsedUser);
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userData) {
      setUserData({ ...userData, [e.target.name]: e.target.value });
    }
  };

  const toggleEditMode = () => {
    if (isEditing) {
      setUserData(originalData);
    }
    setIsEditing(!isEditing);
  };

  const handleUpdateProfile = async () => {
    if (!userData) return;

    try {
      const res = await axios.put(`/api/users/${userData._id}`, userData);
      localStorage.setItem("user", JSON.stringify(res.data));
      setUserData(res.data as IUser);
      setOriginalData(res.data as IUser);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update Error:", err);
      alert("Failed to update profile.");
    }
  };

  const handleChangePassword = async () => {
    if (!userData || !oldPassword || !newPassword) {
      setPasswordError("Both old and new passwords are required.");
      return;
    }

try {
  await axios.put(`/api/users/${userData._id}/password`, { oldPassword, newPassword });
  setOldPassword("");
  setNewPassword("");
  setPasswordError("");
  alert("Password updated successfully!");
} catch (err: unknown) {
  if (
    err &&
    typeof err === "object" &&
    "response" in err &&
    typeof (err as { response?: { data?: { error?: string } } }).response === "object"
  ) {
    setPasswordError(
      (err as { response?: { data?: { error?: string } } }).response?.data?.error ||
        "Login failed. Please try again."
    );
  } else {
    setPasswordError("An unexpected error occurred.");
  }
}

  };

  const handleDeleteAccount = async () => {
    if (!userData) return;

    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/users/${userData._id}`);
      localStorage.removeItem("user");
      router.push("/register");
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen flex bg-white">
      <aside className="w-1/4 bg-pink-600 p-4 h-screen">
        <h2 className="text-xl font-bold text-white">Dashboard</h2>
        <nav className="mt-4">
          <Link href="/dashboard" className="block text-white py-2">
            My Appointments
          </Link>
          <Link href="/settings" className="block text-white py-2">
            Settings
          </Link>
          <Link href="/logout" className="block text-white py-2">
            Logout
          </Link>
        </nav>
      </aside>

      <div className="w-3/4 p-6">
        <h2 className="text-2xl font-bold text-pink-700">Settings</h2>

        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Profile Details</h3>
            <button onClick={toggleEditMode} className="text-pink-600 hover:text-pink-800">
              {isEditing ? "Cancel" : <FaEdit size={20} />}
            </button>
          </div>

          {isEditing ? (
            <>
              <div className="mt-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={userData.name || ""}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                  placeholder="Name"
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email || ""}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                  placeholder="Email"
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={userData.phone || ""}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                  placeholder="Phone"
                />
              </div>
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={handleUpdateProfile}
                  className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={toggleEditMode}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div className="mt-4 space-y-2">
              <p className="text-gray-700">
                <span className="font-semibold">Name:</span> {userData.name || "Not set"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Email:</span> {userData.email || "Not set"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Phone:</span> {userData.phone || "Not set"}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h3 className="text-lg font-semibold">Change Password</h3>
          {passwordError && <p className="text-red-600 mt-2">{passwordError}</p>}
          <div className="mt-4">
            <label className="block text-gray-700">Old Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="Enter old password"
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="Enter new password"
            />
          </div>
          <button
            onClick={handleChangePassword}
            className="mt-4 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
            disabled={!oldPassword || !newPassword}
          >
            Change Password
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mt-6 border border-red-500">
          <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
          <button
            onClick={handleDeleteAccount}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}