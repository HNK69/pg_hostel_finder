import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiInfo, FiLayers, FiMessageSquare, FiStar, FiTrash2, FiUser, FiThermometer, FiUsers, FiCheck, FiArrowRight } from 'react-icons/fi';
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
      toast.error('Failed to submit review');
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
      toast.error('Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8">
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
  const totalAvailableBeds = rooms.reduce((sum, r) => sum + (r.available_beds || 0), 0);

  return (
    <div className="space-y-16 pb-24">
      {/* Hero Gallery Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gallery Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 space-y-4"
        >
          <div className="rounded-2xl overflow-hidden shadow-xl bg-slate-100 dark:bg-slate-800">
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
              spaceBetween={8}
              slidesPerView={4}
              watchSlidesProgress={true}
              modules={[Navigation, Thumbs]}
              className="h-24 w-full cursor-pointer"
            >
              {images.map((img) => (
                <SwiperSlide key={img.image_id} className="rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-primary-500 transition-all swiper-slide-thumb-active:border-primary-500">
                  <img src={img.image_url} alt="thumbnail" className="h-full w-full object-cover" />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </motion.div>

        {/* Sticky Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:sticky lg:top-24 h-fit"
        >
          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900/80 dark:to-slate-900/60 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-8 shadow-xl backdrop-blur-xl space-y-6">
            {/* Price Section */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Starting Price</p>
              <div className="flex items-baseline">
                <span className="text-5xl font-black font-display text-slate-900 dark:text-white">
                  ₹{startingRent ? startingRent.toLocaleString() : 'N/A'}
                </span>
                {startingRent && <span className="text-sm text-slate-600 dark:text-slate-400 font-medium ml-2">/month</span>}
              </div>

              {/* Rating */}
              {avgRating && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center space-x-2 pt-3"
                >
                  <div className="flex items-center space-x-1 bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 rounded-lg">
                    <FiStar size={16} className="text-amber-500 fill-amber-500" />
                    <span className="font-bold text-amber-700 dark:text-amber-300">{avgRating}</span>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">({reviews.length} reviews)</span>
                </motion.div>
              )}
            </div>

            <div className="h-px bg-gradient-to-r from-slate-200 via-slate-200 to-transparent dark:from-slate-700 dark:via-slate-700" />

            {/* Availability */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Availability</p>
              <div className="flex items-center space-x-2">
                {totalAvailableBeds > 0 ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{totalAvailableBeds} beds available</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="font-semibold text-rose-600 dark:text-rose-400">Currently full</span>
                  </>
                )}
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-slate-200 via-slate-200 to-transparent dark:from-slate-700 dark:via-slate-700" />

            {/* Contact Info */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Contact Info</p>
              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <FiMapPin className="text-primary-500 shrink-0 mt-0.5" size={18} />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {hostel.address}, {hostel.area}, {hostel.city}
                  </span>
                </div>
                {hostel.contact_phone && (
                  <div className="flex items-center space-x-3">
                    <FiPhone className="text-primary-500 shrink-0" size={18} />
                    <a href={`tel:${hostel.contact_phone}`} className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                      {hostel.contact_phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-4">
              {hostel.contact_phone && (
                <a
                  href={`https://wa.me/${hostel.contact_phone?.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-3.055 2.017-5.044 5.558-5.044 9.289 0 1.438.248 2.829.734 4.144l.175.45-.702 2.585 2.656-.855.451.175c1.254.487 2.59.756 3.98.756 5.079 0 9.687-4.064 10.064-9.06.02-.264.02-.528.02-.793 0-2.231-.557-4.335-1.644-6.139-.496-.849-1.203-1.612-2.087-2.201a9.756 9.756 0 00-4.744-1.288"/>
                  </svg>
                  <span>Message on WhatsApp</span>
                </a>
              )}
              <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-bold py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95">
                <span>Request a Tour</span>
                <FiArrowRight size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}

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
