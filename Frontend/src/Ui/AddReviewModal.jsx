import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Send } from "lucide-react";
import { toast } from "react-toastify";

const AddReviewModal = ({ open, onClose, property }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        if (!review.trim()) {
            toast.error("Please write your review");
            return;
        }

        const newReview = {
            id: Date.now(),
            propertyId: property?.id,
            name: "You",
            rating,
            date: "Just now",
            comment: review.trim(),
        };

        console.log("New Review:", newReview);

        toast.success("Review added successfully!");

        setRating(0);
        setHoverRating(0);
        setReview("");

        onClose();
    };

    const handleClose = () => {
        setRating(0);
        setHoverRating(0);
        setReview("");
        onClose();
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{
                            duration: 0.25,
                            ease: "easeOut",
                        }}
                        className="fixed left-1/2 top-1/2 z-[110] w-[92%] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-white shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-7">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Write a Review
                                </h2>

                                <p className="mt-1 text-xs text-gray-500">
                                    Share your experience with this property
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Property */}
                        <div className="mx-5 mt-5 flex items-center gap-3 rounded-2xl bg-gray-50 p-3 sm:mx-7">
                            <img
                                src={property?.images?.[0]}
                                alt={property?.title}
                                className="h-14 w-14 rounded-xl object-cover"
                            />

                            <div className="min-w-0">
                                <h3 className="truncate text-sm font-semibold text-gray-800">
                                    {property?.title}
                                </h3>

                                <p className="mt-1 truncate text-xs text-gray-500">
                                    {property?.location}
                                </p>
                            </div>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="px-5 pb-6 pt-5 sm:px-7"
                        >
                            {/* Rating */}
                            <div>
                                <label className="text-sm font-semibold text-gray-800">
                                    Your Rating
                                </label>

                                <div className="mt-3 flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onMouseEnter={() =>
                                                setHoverRating(star)
                                            }
                                            onMouseLeave={() =>
                                                setHoverRating(0)
                                            }
                                            onClick={() =>
                                                setRating(star)
                                            }
                                            className="transition-transform duration-200 hover:scale-110"
                                        >
                                            <Star
                                                size={30}
                                                className={
                                                    star <=
                                                    (hoverRating || rating)
                                                        ? "fill-amber-400 text-amber-400"
                                                        : "text-gray-300"
                                                }
                                            />
                                        </button>
                                    ))}

                                    {rating > 0 && (
                                        <span className="ml-2 text-sm font-semibold text-gray-600">
                                            {rating}/5
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Review */}
                            <div className="mt-5">
                                <label
                                    htmlFor="review"
                                    className="text-sm font-semibold text-gray-800"
                                >
                                    Your Review
                                </label>

                                <textarea
                                    id="review"
                                    value={review}
                                    onChange={(e) =>
                                        setReview(e.target.value)
                                    }
                                    placeholder="Tell others about your experience..."
                                    rows={5}
                                    maxLength={500}
                                    className="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100"
                                />

                                <div className="mt-1 flex justify-end">
                                    <span className="text-[11px] text-gray-400">
                                        {review.length}/500
                                    </span>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="mt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 rounded-2xl border border-gray-200 py-3 font-semibold text-gray-600 transition hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary-600 py-3 font-semibold text-white shadow-lg shadow-primary-600/20 transition hover:bg-primary-700"
                                >
                                    <Send size={17} />
                                    Submit Review
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AddReviewModal;