import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu as MenuIcon } from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";

const AdminLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#F8F9FB] overflow-hidden">
            <AdminSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

            <main className="flex-1 overflow-auto">
                {/* Mobile menu button */}
                <div className="md:hidden p-2">
                    <button
                        aria-label="Open menu"
                        onClick={() => setMobileOpen(true)}
                        className="p-2 rounded-md hover:bg-gray-100"
                    >
                        <MenuIcon size={20} />
                    </button>
                </div>

                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
