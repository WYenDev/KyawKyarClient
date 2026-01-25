import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";

const AdminLayout = () => {
    return (
        <div className="flex h-screen bg-[#F8F9FB] overflow-hidden">
            <AdminSidebar />
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
