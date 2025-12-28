import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Car,
    Tag,
    Layers,
    Image,
    Activity,
    Settings,
    LogOut,
    ChevronLeft,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { usePostApiAuthLogout } from '../services/api';




const AdminSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { logout } = useAuth()

    const { mutate } = usePostApiAuthLogout({
        mutation: {
            onSuccess: () => {
                logout();
            },
        }
    });

    const handleLogout = () => {
        mutate();
    }

    return (
        <aside
            className={`h-screen bg-[#FDECEC] flex flex-col
            transition-all duration-300
            ${collapsed ? "w-[72px]" : "w-64"}`}
        >
            {/* HEADER */}
            <div
                onClick={() => setCollapsed(!collapsed)}
                className="h-16 flex items-center justify-between px-4 cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow">
                        <span className="font-bold">A</span>
                    </div>
                    {!collapsed && (
                        <span className="font-semibold">Admin Panel</span>
                    )}
                </div>
                {!collapsed && <ChevronLeft size={18} />}
            </div>

            {/* MENU */}
            <nav className="flex flex-col gap-2 mt-6 px-3 flex-1">
                <SideItem
                    to="/admin"
                    icon={<LayoutDashboard size={20} />}
                    label="Dashboard"
                    collapsed={collapsed}
                    end
                />

                <SideItem
                    to="/admin/cars"
                    icon={<Car size={20} />}
                    label="Cars"
                    collapsed={collapsed}
                />

                <SideItem
                    to="/admin/brands"
                    icon={<Tag size={20} />}
                    label="Brands"
                    collapsed={collapsed}
                />

                <SideItem
                    to="/admin/models"
                    icon={<Layers size={20} />}
                    label="Models"
                    collapsed={collapsed}
                />

                <SideItem
                    to="/admin/car-images"
                    icon={<Image size={20} />}
                    label="Car Images"
                    collapsed={collapsed}
                />

                <SideItem
                    to="/admin/health"
                    icon={<Activity size={20} />}
                    label="System Health"
                    collapsed={collapsed}
                />
            </nav>

            {/* BOTTOM */}
            <div className="px-3 pb-4 flex flex-col gap-2">
                <SideItem
                    to="/admin/settings"
                    icon={<Settings size={20} />}
                    label="Settings"
                    collapsed={collapsed}
                />

                <button
                    className={`flex items-center gap-3 p-3 rounded-xl
                    text-gray-600 hover:bg-white transition-all
                    ${collapsed && "justify-center"}`}
                    onClick={handleLogout}
                >
                    <LogOut size={20} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

/* ================= SIDE ITEM ================= */
const SideItem = ({
    to,
    icon,
    label,
    collapsed,
    end = false,
}: {
    to: string;
    icon: React.ReactNode;
    label: string;
    collapsed: boolean;
    end?: boolean;
}) => (
    <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl
            transition-all duration-200
            ${isActive
                ? "bg-white shadow text-black"
                : "text-gray-600 hover:bg-white"
            }
            ${collapsed && "justify-center"}`
        }
    >
        {icon}
        {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </NavLink>
);

export default AdminSidebar;
