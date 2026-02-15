import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

// Public layout components
import Header from "./components/Header";
import Footer from "./components/Footer";
import FooterBanner from "./components/FooterBanner";

// Public pages
import Home from "./pages/Home";
import BuyCars from "./pages/BuyCars";
import SellCars from "./pages/SellCars";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";
import CarDetails from "./pages/CarDetails";
import Payments from "./pages/Payments";
import RigorousQualityInspection from "./pages/RigorousQualityInspection";
import SwiftProcessing from "./pages/SwiftProcessing";
import CleanHistory from "./pages/CleanHistory";
import ShowroomInstallmentDetail from "./pages/ShowroomInstallmentDetail";
import PromoLandingPage from "./pages/PromoLandingPage";

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Cars from "./pages/admin/Cars";
import Brands from "./pages/admin/Brands";
import BuildType from "./pages/admin/BuildType";
import Showroom from "./pages/admin/Showroom";
import ShowroomEdit from "./pages/admin/ShowroomEdit";
import AdminLogin from "./pages/admin/Login";
import PasswordChange from "./pages/admin/PasswordChange";
import CarCreatePage from "./pages/admin/CarCreatePage";
import CarEditPage from "./pages/admin/CarEditPage";
import AboutPage from "./pages/admin/AboutPage";

import SuperAdminGuard from "./components/SuperAdminGuard";
import SellCarRequests from "./pages/admin/SellCarRequests";
import SellCarRequestDetails from "./pages/admin/SellCarRequestDetails";

// auth guard
import RequireAdmin from "./components/RequireAdmin";
import UserManagement from "./pages/admin/UserManagement";
import RecoverCodesPage from "./pages/admin/RecoverCodes";
import ForgotPassword from "./pages/admin/ForgotPassword";
import ResetPassword from "./pages/admin/ResetPassword";
import HomePage from "./pages/admin/HomePage";
import AdminPayments from "./pages/admin/Payments";
import VehicleSpecs from "./pages/admin/VehicleSpecs";
import Banners from "./pages/admin/FooterBanners";
import PromoBanners from "./pages/admin/PromoBanners";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* ================= ADMIN ROUTES ================= */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/password-change" element={<PasswordChange />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="cars" element={<Cars />} />
          <Route path="cars/create" element={<CarCreatePage />} />
          <Route path="cars/:id/edit" element={<CarEditPage />} />
          <Route path="brands" element={<Brands />} />
          <Route path="build-types" element={<BuildType />} />
          <Route path="vehicle-specs" element={<VehicleSpecs />} />
          <Route path="showrooms" element={<Showroom />} />
          <Route path="showrooms/:id/edit" element={<ShowroomEdit />} />
          <Route path="home" element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="banners" element={<Banners />} />
          <Route path="promo-banners" element={<PromoBanners />} />
          <Route path="recover-codes-setup" element={<RecoverCodesPage />} />

          <Route
            path="user-management"
            element={
              <SuperAdminGuard>
                <UserManagement />
              </SuperAdminGuard>
            }
          />
          <Route path="sell-requests" element={<SellCarRequests />} />
          <Route path="sell-requests/:id" element={<SellCarRequestDetails />} />
        </Route>


        {/* ================= PUBLIC ROUTES ================= */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-white flex flex-col">
              <Header />

              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/buyCars" element={<BuyCars />} />
                  <Route path="/cars/:id" element={<CarDetails />} />
                  <Route path="/sellCars" element={<SellCars />} />
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/reviews" element={<Reviews />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route
                    path="/why-kyawkyar/rigorous-quality-inspection"
                    element={<RigorousQualityInspection />}
                  />
                  <Route path="/why-kyawkyar/swift-processing" element={<SwiftProcessing />}  />
                  <Route path="/why-kyawkyar/clean-history" element={<CleanHistory />} />
                  <Route path="/showroom-installment" element={<ShowroomInstallmentDetail />} />
                  <Route path="/promo/:slug" element={<PromoLandingPage />} />
                </Routes>
              </main>

              <Footer />
              <FooterBanner />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
