import Link from "next/link";

export default function HomePage() {
  return (
    <div className="home-page">
      <h1>Home</h1>
      <Link href="/">← Back to main</Link>
    </div>
  );
}