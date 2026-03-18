import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import FooterBanner from "./FooterBanner";
import LanguageSync from "./LangSync";

const PublicLayout = () => (
  <div className="min-h-screen bg-white flex flex-col">
  <LanguageSync />

    <Header />
    <main className="flex-1">
      {/* Child routes render here */}
      <Outlet />
    </main>
    <Footer />
    <FooterBanner />
  </div>
);

export default PublicLayout;
