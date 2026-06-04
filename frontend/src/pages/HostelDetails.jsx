import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import { FiMapPin, FiPhone, FiInfo, FiLayers, FiMessageSquare, FiStar, FiTrash2, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import ErrorState from '../components/ErrorState';
import SkeletonLoader from '../components/SkeletonLoader';
import placeholder from '../assets/placeholder.jpg';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

export default function HostelDetails() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  
  const [hostel, setHostel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Review Form States
  const [reviewName, setReviewName] = useState(user?.name || '');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [hostelRes, roomsRes, imagesRes, reviewsRes] = await Promise.all([
        axiosInstance.get(`/hostels/${id}`),
        axiosInstance.get(`/hostels/${id}/rooms`),
        axiosInstance.get(`/hostels/${id}/images`),
        axiosInstance.get(`/hostels/${id}/reviews`),
      ]);
      setHostel(hostelRes.data);
      setRooms(roomsRes.data);
      setImages(imagesRes.data);
      setReviews(reviewsRes.data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) {
      toast.error('Name and comment are required.');
      return;
    }
    setSubmittingReview(true);
    try {
      await axiosInstance.post('/reviews/', {
        hostel_id: parseInt(id),
        user_name: reviewName,
        rating: reviewRating,
        comment: reviewComment,
      });
      toast.success('Review added successfully!');
      setReviewComment('');
      // Refresh reviews list
      const reviewsRes = await axiosInstance.get(`/hostels/${id}/reviews`);
      setReviews(reviewsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleReviewDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await axiosInstance.delete(`/reviews/${reviewId}`);
      toast.success('Review deleted');
      setReviews(reviews.filter((r) => r.review_id !== reviewId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <SkeletonLoader type="detail" />
      </div>
    );
  }

  if (error || !hostel) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <ErrorState onRetry={fetchData} title="Failed to load property details" />
      </div>
    );
  }

  const startingRent = rooms.length > 0 ? Math.min(...rooms.map((r) => r.rent)) : null;
  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="space-y-12 pb-24">
      {/* Top Banner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gallery Slider */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl overflow-hidden shadow bg-slate-100 dark:bg-slate-800">
            {images.length > 0 ? (
              <Swiper
                spaceBetween={10}
                navigation={true}
                pagination={{ clickable: true }}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Navigation, Pagination, Thumbs]}
                className="h-96 w-full"
              >
                {images.map((img) => (
                  <SwiperSlide key={img.image_id}>
                    <img src={img.image_url} alt={hostel.hostel_name} className="h-full w-full object-cover" />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="flex h-96 w-full items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-400 font-semibold font-display">
                <img src={placeholder} alt="Placeholder" className="h-full w-full object-cover" />
              </div>
            )}
          </div>

          {/* Thumbnail Swiper */}
          {images.length > 1 && (
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={4}
              watchSlidesProgress={true}
              modules={[Navigation, Thumbs]}
              className="h-20 w-full cursor-pointer"
            >
              {images.map((img) => (
                <SwiperSlide key={img.image_id} className="rounded-xl overflow-hidden border-2 border-transparent swiper-slide-thumb-active:border-primary-500">
                  <img src={img.image_url} alt="thumbnail" className="h-full w-full object-cover" />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* Pricing / Booking Card */}
        <div className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-lg h-fit space-y-6 glass">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Starting From</span>
            <div className="flex items-baseline text-slate-900 dark:text-white mt-1">
              <span className="text-3xl font-extrabold font-display">₹{startingRent ? startingRent.toLocaleString() : 'N/A'}</span>
              {startingRent && <span className="text-sm text-slate-500 dark:text-slate-400 font-medium ml-1">/ month</span>}
            </div>
            {avgRating && (
              <div className="flex items-center space-x-1 mt-2 text-sm text-slate-650 dark:text-slate-350">
                <FiStar className="text-amber-500 fill-amber-500" />
                <span className="font-bold text-slate-900 dark:text-white">{avgRating}</span>
                <span className="text-slate-400">({reviews.length} reviews)</span>
              </div>
            )}
          </div>

          <hr className="border-slate-100 dark:border-slate-800/80" />

          <div className="space-y-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center font-display">
              <FiInfo className="mr-2 text-primary-500" /> Host Info & Contact
            </h4>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-start">
                <FiMapPin className="mr-2 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-slate-600 dark:text-slate-300">
                  {hostel.address}, {hostel.area}, {hostel.city}
                </span>
              </div>
              {hostel.contact_phone && (
                <div className="flex items-center">
                  <FiPhone className="mr-2 text-slate-400 shrink-0" />
                  <a href={`tel:${hostel.contact_phone}`} className="text-primary-600 hover:underline">
                    {hostel.contact_phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          <a
            href={`https://wa.me/${hostel.contact_phone?.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-bold py-3.5 px-4 rounded-xl hover:from-primary-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition duration-200"
          >
            Contact Owner
          </a>
        </div>
      </div>

      {/* About & Rooms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-12">
          {/* About hostel */}
          <section className="space-y-4 bg-white dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/50 p-6 sm:p-8 rounded-3xl">
            <h2 className="text-xl sm:text-2xl font-bold font-display flex items-center gap-2">
              <FiInfo className="text-primary-500" /> About {hostel.hostel_name}
            </h2>
            <p className="text-slate-600 dark:text-slate-350 leading-relaxed whitespace-pre-line">
              {hostel.description || 'No description has been added for this property.'}
            </p>
          </section>

          {/* Rooms List */}
          <section className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold font-display flex items-center gap-2">
              <FiLayers className="text-primary-500" /> Available Room Options
            </h2>
            {rooms.length === 0 ? (
              <div className="bg-slate-50 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-800 p-8 rounded-2xl text-center text-slate-400">
                No room configurations have been registered yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rooms.map((room) => (
                  <div
                    key={room.room_id}
                    className="p-5 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 text-xs font-semibold uppercase tracking-wide">
                        {room.room_type} sharing
                      </span>
                      <div className="flex items-baseline text-slate-900 dark:text-white mt-2">
                        <span className="text-2xl font-extrabold font-display">₹{room.rent.toLocaleString()}</span>
                        <span className="text-xs text-slate-550 ml-1">/mo</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-450 pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-2">
                      <span>Capacity: {room.capacity} beds</span>
                      {room.available_beds > 0 ? (
                        <span className="text-emerald-500 font-semibold">{room.available_beds} beds left</span>
                      ) : (
                        <span className="text-rose-500 font-semibold">Full</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Reviews list & Form */}
          <section className="space-y-8">
            <h2 className="text-xl sm:text-2xl font-bold font-display flex items-center gap-2">
              <FiMessageSquare className="text-primary-500" /> Reviews & Ratings ({reviews.length})
            </h2>

            {/* Review Input Form */}
            <form onSubmit={handleReviewSubmit} className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl space-y-4 shadow-sm glass">
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">Leave a Review</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Kumar"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Rating</label>
                  <div className="flex items-center space-x-1.5 h-10">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="text-amber-500 focus:outline-none"
                      >
                        <FiStar className={`w-6 h-6 ${reviewRating >= star ? 'fill-amber-500' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Review Comment</label>
                <textarea
                  rows={3}
                  placeholder="Share your stay experience..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition duration-200"
              >
                {submittingReview ? <Spinner size="sm" color="white" /> : <span>Submit Review</span>}
              </button>
            </form>

            {/* Reviews display list */}
            {reviews.length === 0 ? (
              <div className="text-slate-400 text-center py-6">Be the first to review this property!</div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => {
                  const isHostelOwner = isAuthenticated && user?.role === 'owner' && hostel.owner_id === user?.user_id;
                  
                  return (
                    <div
                      key={rev.review_id}
                      className="p-5 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm flex items-start space-x-4"
                    >
                      <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <FiUser />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{rev.user_name || 'Anonymous Student'}</h4>
                            <div className="flex items-center space-x-1 mt-1">
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <FiStar
                                  key={idx}
                                  className={`w-3.5 h-3.5 ${
                                    rev.rating > idx ? 'text-amber-500 fill-amber-500' : 'text-slate-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Delete button if user is the owner of this hostel */}
                          {isHostelOwner && (
                            <button
                              onClick={() => handleReviewDelete(rev.review_id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850"
                              title="Delete Review"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-350 mt-3 whitespace-pre-line">
                          {rev.comment}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
