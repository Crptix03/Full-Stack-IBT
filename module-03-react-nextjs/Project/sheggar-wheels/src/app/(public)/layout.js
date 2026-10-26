import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

export default function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNav />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}