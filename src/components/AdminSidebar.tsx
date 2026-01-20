import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
    LayoutDashboard,
    Car,
    Tag,
    Layers,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Building,
    Home,
    Star, 
} from "lucide-react";

import { useAuth } from "../contexts/AuthContext";
import { usePostApiAuthLogout } from "../services/api";
import logo from "../assets/logo-with-text.png";

const AdminSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useAuth();

    const { mutate } = usePostApiAuthLogout();

    const handleLogout = () => {
        mutate(undefined, {
            onSuccess: () => {
                logout();
            },
            onError: () => {
                logout();
            },
        });
    };

    return (
        <aside
            className={`
                h-screen flex flex-col bg-white border-r
                transition-all duration-300
                ${collapsed ? "w-[84px]" : "w-64"}
            `}
        >
            {/* ================= HEADER ================= */}
            <div className="h-14 flex items-center justify-between px-4 border-b">
                <Link
                    to="/"
                    className={`flex items-center gap-2 ${collapsed ? "justify-center w-full" : ""}`}
                >
                    <img
                        src={logo}
                        alt="ကျော်ကြား car showroom"
                        className={`${collapsed ? "h-7" : "h-9"} object-contain`}
                    />
                    {!collapsed && (
                        <span className="text-sm font-semibold text-slate-700">
                            Admin
                        </span>
                    )}
                </Link>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-md hover:bg-gray-100"
                >
                    {collapsed ? (
                        <ChevronRight size={16} />
                    ) : (
                        <ChevronLeft size={16} />
                    )}
                </button>
            </div>

            {/* ================= MENU ================= */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                <MenuItem
                    to="/admin"
                    icon={LayoutDashboard}
                    label="Dashboard"
                    collapsed={collapsed}
                    end
                />
                <MenuItem
                    to="/admin/cars"
                    icon={Car}
                    label="Cars"
                    collapsed={collapsed}
                />
                <MenuItem
                    to="/admin/brands"
                    icon={Tag}
                    label="Brands"
                    collapsed={collapsed}
                />
                <MenuItem
                    to="/admin/models"
                    icon={Layers}
                    label="Models"
                    collapsed={collapsed}
                />
                <MenuItem
                    to="/admin/grades"
                    icon={Star}
                    label="Grades"
                    collapsed={collapsed}
                />
                <MenuItem
                    to="/admin/showrooms"
                    icon={Building}
                    label="Showrooms"
                    collapsed={collapsed}
                />
                <MenuItem
                    to="/admin/build-types"
                    icon={Home}
                    label="Build Types"
                    collapsed={collapsed}
                />
                {/* 🔹 NEW ITEMS */}
 
                 <MenuItem to="/admin/sell-requests" icon={Tag} label="Sell Requests" collapsed={collapsed} />
                 {
                     user?.role === "SUPER_ADMIN" && (
                         <MenuItem to="/admin/user-management" icon={Layers} label="User Management" collapsed={collapsed} />
                     )
                 }
            </nav>

            {/* ================= FOOTER ================= */}
            <div className="px-3 py-3 border-t space-y-1">
                <MenuItem
                    to="/admin/settings"
                    icon={Settings}
                    label="Settings"
                    collapsed={collapsed}
                />

                <button
                    onClick={handleLogout}
                    className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                        text-sm text-slate-600 hover:bg-red-50 hover:text-red-600
                        transition
                        ${collapsed && "justify-center"}
                    `}
                >
                    <LogOut size={18} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

/* ================= MENU ITEM ================= */
const MenuItem = ({
    to,
    icon: Icon,
    label,
    collapsed,
    end = false,
}: {
    to: string;
    icon: any;
    label: string;
    collapsed: boolean;
    end?: boolean;
}) => (
    <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
            `
                group flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-sm font-medium transition-all
                ${isActive
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-gray-100"
            }
                ${collapsed && "justify-center"}
            `
        }
    >
        <Icon size={18} className="group-hover:scale-105 transition-transform" />
        {!collapsed && <span>{label}</span>}
    </NavLink>
);

export default AdminSidebar;
