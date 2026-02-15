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
    Info, 
    Megaphone,
    Sparkles
} from "lucide-react";

import { useAuth } from "../contexts/AuthContext";
import { usePostApiAuthLogout } from "../services/api";
import logo from "../assets/logo.png";
import { X as CloseIcon } from "lucide-react";

const AdminSidebar = ({
    mobileOpen,
    onMobileClose,
}: {
    mobileOpen?: boolean;
    onMobileClose?: () => void;
}) => {
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
        <>
            {/* Desktop sidebar */}
            <aside
                className={`
                    hidden md:flex h-screen flex-col bg-white border-r
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
                    label="Brands & Models"
                    collapsed={collapsed}
                />
                <MenuItem
                    to="/admin/showrooms"
                    icon={Building}
                    label="Showrooms"
                    collapsed={collapsed}
                />                 <MenuItem
                    to="/admin/banners"
                    icon={Megaphone}
                    label="FooterBanners"
                    collapsed={collapsed}
                />
                <MenuItem
                    to="/admin/promo-banners"
                    icon={Sparkles}
                    label="Promo Banners"
                    collapsed={collapsed}
                />
                <MenuItem
                    to="/admin/build-types"
                    icon={Home}
                    label="Build Types"
                    collapsed={collapsed}
                />
                <MenuItem
                    to="/admin/vehicle-specs"
                    icon={Settings}
                    label="Vehicle Specs"
                    collapsed={collapsed}
                />
                <MenuItem
                    to="/admin/home"
                    icon={LayoutDashboard}
                    label="Home page"
                    collapsed={collapsed}
                    end
                />
                <MenuItem
                    to="/admin/about"
                    icon={Info}
                    label="About Page"
                    collapsed={collapsed}
                />
               <MenuItem
                    to="/admin/payments"
                    icon={LayoutDashboard}
                    label="Payments"
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

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => onMobileClose && onMobileClose()}
                    />

                    <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r shadow-lg z-50 flex flex-col">
                        <div className="h-14 flex items-center justify-between px-4 border-b">
                            <Link to="/" className="flex items-center gap-2">
                                <img src={logo} alt="ကျော်ကြား car showroom" className="h-9 object-contain" />
                                <span className="text-sm font-semibold text-slate-700">Admin</span>
                            </Link>

                            <button
                                onClick={() => onMobileClose && onMobileClose()}
                                className="p-1.5 rounded-md hover:bg-gray-100"
                            >
                                <CloseIcon size={16} />
                            </button>
                        </div>

                        <nav className="flex-1 px-3 py-4 space-y-1">
                            <MenuItem to="/admin" icon={LayoutDashboard} label="Dashboard" collapsed={false} end />
                            <MenuItem to="/admin/cars" icon={Car} label="Cars" collapsed={false} />
                            <MenuItem to="/admin/brands" icon={Tag} label="Brands & Models" collapsed={false} />
                            <MenuItem to="/admin/showrooms" icon={Building} label="Showrooms" collapsed={false} />
                            <MenuItem to="/admin/banners" icon={Megaphone} label="Banners" collapsed={false} />
                            <MenuItem to="/admin/promo-banners" icon={Sparkles} label="Promo Banners" collapsed={false} />
                            <MenuItem to="/admin/build-types" icon={Home} label="Build Types" collapsed={false} />
                            <MenuItem to="/admin/vehicle-specs" icon={Settings} label="Vehicle Specs" collapsed={false} />
                            <MenuItem to="/admin/home" icon={LayoutDashboard} label="Home page" collapsed={false} end />
                            <MenuItem to="/admin/about" icon={Info} label="About Page" collapsed={false} />
                            <MenuItem to="/admin/payments" icon={LayoutDashboard} label="Payments" collapsed={false} />
                            <MenuItem to="/admin/sell-requests" icon={Tag} label="Sell Requests" collapsed={false} />
                            {user?.role === "SUPER_ADMIN" && (
                                <MenuItem to="/admin/user-management" icon={Layers} label="User Management" collapsed={false} />
                            )}
                        </nav>

                        <div className="px-3 py-3 border-t space-y-1">
                            <button
                                onClick={handleLogout}
                                className={`
                                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                                    text-sm text-slate-600 hover:bg-red-50 hover:text-red-600
                                    transition
                                `}
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </aside>
                </div>
            )}
        </>
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
