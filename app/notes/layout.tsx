import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <main className="flex flex-col min-h-screen">
        <Navbar />
        {children}
        <Footer />
      </main>
    </div>
  );
}
