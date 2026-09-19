// src/ui/RatingModal.jsx
import { useState, useEffect } from "react";
import Modal from "./Modal";
import StarRating from "./StarRating";
import { useReviewStore } from "../stores/useReviewStore";

export default function RatingModal({ dish, username, onClose }) {
  const rateDish = useReviewStore((s) => s.rateDish);
  const getUserRating = useReviewStore((s) => s.getUserRating);

  const existing = getUserRating(dish.id, username);

  const [stars, setStars] = useState(existing?.stars || 0);
  const [comment, setComment] = useState(existing?.comment || "");

  // Reset internal state if the modal opens for a different dish
  useEffect(() => {
    setStars(existing?.stars || 0);
    setComment(existing?.comment || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dish.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (stars === 0) return;
    rateDish({ dishId: dish.id, username, stars, comment: comment.trim() });
    onClose();
  };

  return (
    <Modal onClose={onClose} labelledBy="rating-modal-title">
      <div className="rating-modal">
        <button
          className="dish-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="rating-modal-header">
          <img
            src={
              typeof dish.img === "string" && dish.img.startsWith("/")
                ? dish.img
                : `/${dish.img.replace(/^(Imgaes|Images|images)\//, "images/")}`
            }
            alt={dish.name}
            className="rating-modal-thumb"
          />
          <div>
            <span className="rating-modal-eyebrow">Rate this dish</span>
            <h2 className="serif" id="rating-modal-title">{dish.name}</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="rating-modal-stars">
            <StarRating
              value={stars}
              onChange={setStars}
              size={36}
              precision={1}
            />
          </div>

          <div className="field">
            <label>Comment (optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was it? Any notes for next time?"
              rows={3}
              maxLength={200}
            />
            <span className="field-hint">{comment.length}/200</span>
          </div>

          <div className="rating-modal-actions">
            <button
              type="button"
              className="btn-outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cart-place-order"
              disabled={stars === 0}
            >
              {existing ? "Update Rating" : "Submit Rating"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}