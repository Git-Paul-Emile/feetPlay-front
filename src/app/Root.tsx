import { Outlet } from "react-router";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

export function Root() {
  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}