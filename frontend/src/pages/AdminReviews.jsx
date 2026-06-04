import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/reviews"
      );

      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-bold mb-8">
        Reviews Management
      </h1>

      <table className="w-full border border-gray-700">
        <thead>
          <tr className="bg-slate-800">
            <th className="p-3">ID</th>
            <th className="p-3">Rating</th>
            <th className="p-3">Comment</th>
          </tr>
        </thead>

        <tbody>
          {reviews.map((review) => (
            <tr
              key={review.review_id}
              className="border-t border-gray-700"
            >
              <td className="p-3">{review.review_id}</td>
              <td className="p-3">{review.rating}</td>
              <td className="p-3">{review.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}