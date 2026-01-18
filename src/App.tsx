import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Public layout components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Public pages
import Home from "./pages/Home";
import BuyCars from "./pages/BuyCars";
import SellCars from "./pages/SellCars";
import About from "./pages/About";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";
import CarDetails from "./pages/CarDetails";
import Payments from "./pages/Payments";

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Cars from "./pages/admin/Cars";
import Brands from "./pages/admin/Brands";
import Models from "./pages/admin/Model";
import BuildType from "./pages/admin/BuildType";
import Showroom from "./pages/admin/Showroom";
import AdminLogin from "./pages/admin/Login";
import PasswordChange from "./pages/admin/PasswordChange";
import CarCreatePage from "./pages/admin/CarCreatePage";
import CarEditPage from "./pages/admin/CarEditPage";
import Grades from "./pages/admin/Grade"; 


// auth guard
import RequireAdmin from "./components/RequireAdmin";

function App() {
  return (
    <Router>
      <Routes>
        {/* ================= ADMIN ROUTES ================= */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/password-change" element={<PasswordChange />} />
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
          <Route path="models" element={<Models />} />
          <Route path="build-types" element={<BuildType />} />
          <Route path="showrooms" element={<Showroom />} />
          <Route path="grades" element={<Grades />} />
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
                  <Route path="/about" element={<About />} />
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/reviews" element={<Reviews />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </main>

              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
