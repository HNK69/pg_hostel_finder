import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    hostels: 0,
    rooms: 0,
    reviews: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/stats"
      );

      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl shadow">
          <h3 className="text-gray-400 mb-2">
            Total Users
          </h3>
          <p className="text-4xl font-bold">
            {stats.users}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl shadow">
          <h3 className="text-gray-400 mb-2">
            Total Hostels
          </h3>
          <p className="text-4xl font-bold">
            {stats.hostels}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl shadow">
          <h3 className="text-gray-400 mb-2">
            Total Rooms
          </h3>
          <p className="text-4xl font-bold">
            {stats.rooms}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl shadow">
          <h3 className="text-gray-400 mb-2">
            Total Reviews
          </h3>
          <p className="text-4xl font-bold">
            {stats.reviews}
          </p>
        </div>
      </div>
    </div>
  );
}