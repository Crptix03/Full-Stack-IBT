// src/admin/ReviewManager.jsx
import { useState, useMemo } from "react";
import { useReviewStore } from "../stores/useReviewStore";
import { useMenuStore } from "../stores/useMenuStore";
import StarRating from "../ui/StarRating";

export default function ReviewManager() {
  const ratings = useReviewStore((s) => s.ratings);
  const dishes = useMenuStore((s) => s.dishes);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating"); // "rating" | "count" | "name"

  // ── Per-dish stats ─────────────────────────────────────
  const dishStats = useMemo(() => {
    const map = {};

    dishes.forEach((d) => {
      map[d.id] = {
        id: d.id,
        name: d.name,
        img: d.img,
        category: d.category,
        ratings: [],
      };
    });

    ratings.forEach((r) => {
      if (map[r.dishId]) {
        map[r.dishId].ratings.push(r);
      } else {
        // Rating for a dish that no longer exists (deleted from menu)
        map[r.dishId] = {
          id: r.dishId,
          name: "(removed dish)",
          img: null,
          category: "—",
          ratings: [r],
        };
      }
    });

    return Object.values(map)
      .map((d) => {
        const count = d.ratings.length;
        const avg =
          count > 0
            ? d.ratings.reduce((sum, r) => sum + r.stars, 0) / count
            : 0;
        return { ...d, count, average: avg };
      })
      .filter((d) => d.count > 0); // only dishes with ratings
  }, [dishes, ratings]);

  // ── Sorted + filtered dish list ────────────────────────
  const sortedDishes = useMemo(() => {
    let list = [...dishStats];
    if (sortBy === "rating") list.sort((a, b) => b.average - a.average);
    if (sortBy === "count") list.sort((a, b) => b.count - a.count);
    if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [dishStats, sortBy]);

  // ── Filtered ratings feed ──────────────────────────────
  const filteredRatings = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ratings;

    return ratings.filter((r) => {
      const dish = dishes.find((d) => d.id === r.dishId);
      const dishName = dish?.name?.toLowerCase() || "";
      return (
        r.username.toLowerCase().includes(q) ||
        dishName.includes(q) ||
        (r.comment || "").toLowerCase().includes(q)
      );
    });
  }, [ratings, dishes, search]);

  // Sort feed newest first
  const sortedFeed = useMemo(
    () =>
      [...filteredRatings].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),
    [filteredRatings]
  );

  // ── Overall stats ──────────────────────────────────────
  const totalRatings = ratings.length;
  const overallAverage =
    totalRatings > 0
      ? ratings.reduce((sum, r) => sum + r.stars, 0) / totalRatings
      : 0;

  return (
    <section>
      <header className="admin-page-head">
        <div>
          <h1 className="serif">Reviews & Ratings</h1>
          <p>
            {totalRatings} {totalRatings === 1 ? "rating" : "ratings"} across{" "}
            {dishStats.length} {dishStats.length === 1 ? "dish" : "dishes"}
          </p>
        </div>
        {totalRatings > 0 && (
          <div className="review-overall">
            <span className="review-overall-label">Overall</span>
            <div className="review-overall-score">
              <StarRating value={overallAverage} size={16} />
              <strong>{overallAverage.toFixed(1)}</strong>
            </div>
          </div>
        )}
      </header>

      {totalRatings === 0 ? (
        <p className="empty-text">
          No ratings yet. Once customers rate dishes, they'll appear here.
        </p>
      ) : (
        <>
          {/* ── Section 1: Dish Leaderboard ──────────────── */}
          <div className="admin-panel">
            <div className="review-section-head">
              <h2 className="serif">Dish Leaderboard</h2>
              <div className="review-sort">
                <label>Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="rating">Highest rating</option>
                  <option value="count">Most rated</option>
                  <option value="name">Name (A–Z)</option>
                </select>
              </div>
            </div>

            <div className="review-dish-list">
              {sortedDishes.map((d) => (
                <div className="review-dish-row" key={d.id}>
                  {d.img && (
                    <img
                      src={
                        d.img.startsWith("/")
                          ? d.img
                          : `/${d.img.replace(/^(Imgaes|Images|images)\//, "images/")}`
                      }
                      alt={d.name}
                      className="review-dish-thumb"
                    />
                  )}
                  <div className="review-dish-info">
                    <strong>{d.name}</strong>
                    <span className="review-dish-category">{d.category}</span>
                  </div>
                  <div className="review-dish-rating">
                    <StarRating value={d.average} size={14} />
                    <strong>{d.average.toFixed(1)}</strong>
                    <span className="review-dish-count">
                      {d.count} {d.count === 1 ? "rating" : "ratings"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Section 2: Recent Ratings Feed ───────────── */}
          <div className="admin-panel">
            <div className="review-section-head">
              <h2 className="serif">All Ratings</h2>
            </div>

            <input
              className="admin-search"
              placeholder="Search by customer, dish, or comment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="review-feed">
              {sortedFeed.length === 0 ? (
                <p className="empty-text">No ratings match your search.</p>
              ) : (
                sortedFeed.map((r) => {
                  const dish = dishes.find((d) => d.id === r.dishId);
                  return (
                    <div className="review-feed-row" key={r.id}>
                      <div className="review-feed-main">
                        <div className="review-feed-top">
                          <strong className="review-feed-user">
                            {r.username}
                          </strong>
                          <span className="review-feed-verb">rated</span>
                          <strong className="review-feed-dish">
                            {dish?.name || "(removed dish)"}
                          </strong>
                        </div>
                        <div className="review-feed-stars">
                          <StarRating value={r.stars} size={14} />
                          <span className="review-feed-date">
                            {new Date(r.createdAt).toLocaleString()}
                          </span>
                        </div>
                        {r.comment && (
                          <p className="review-feed-comment">
                            "{r.comment}"
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}