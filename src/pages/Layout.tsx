
import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
