import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminHostels() {
  const [hostels, setHostels] = useState([]);

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/hostels"
      );

      setHostels(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteHostel = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this hostel?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/hostels/${id}`
      );

      fetchHostels();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-bold mb-8">
        Hostels Management
      </h1>

      <table className="w-full border border-gray-700">
        <thead>
          <tr className="bg-slate-800">
            <th className="p-3">ID</th>
            <th className="p-3">Hostel</th>
            <th className="p-3">Location</th>
            <th className="p-3">Owner</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {hostels.map((hostel) => (
            <tr
              key={hostel.hostel_id}
              className="border-t border-gray-700"
            >
              <td className="p-3">
                {hostel.hostel_id}
              </td>

              <td className="p-3">
                {hostel.hostel_name}
              </td>

              <td className="p-3">
                {hostel.city}, {hostel.area}
              </td>

              <td className="p-3">
                {hostel.owner_id}
              </td>

              <td className="p-3">
                <button
                  onClick={() =>
                    deleteHostel(hostel.hostel_id)
                  }
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}