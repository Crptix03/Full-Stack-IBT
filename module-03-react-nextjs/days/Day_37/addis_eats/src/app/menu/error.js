"use client";

export default function Error({ error, reset }) {
  return (
    <div className="error-state">
      <h2>Something went wrong loading the menu.</h2>
      <p>{error.message}</p>
      <button type="button" onClick={() => reset()}>Try again</button>
    </div>
  );
}