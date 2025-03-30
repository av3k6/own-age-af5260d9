
import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Layout = () => {
  console.log("Rendering Layout component");
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
