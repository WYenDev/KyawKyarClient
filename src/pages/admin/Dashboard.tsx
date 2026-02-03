import { useNavigate } from "react-router-dom";
import { useGetApiDashboardSummary } from "../../services/api";

const Dashboard = () => {
    const navigate = useNavigate();
    const { data, isLoading, isError } = useGetApiDashboardSummary();

    if (isLoading) {
        return (
            <div className="bg-[#F8F9FB] p-8 overflow-x-hidden">
                <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
                <div>Loading...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-[#F8F9FB] p-8 overflow-x-hidden">
                <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
                <div className="text-red-600">Failed to load dashboard data.</div>
            </div>
        );
    }

    const cards: { title: string; value: number | string; path?: string }[] = [
        { title: "Total Cars", value: data?.totalCars ?? 0, path: "/admin/cars" },
        { title: "Sold Cars", value: data?.soldCars ?? 0, path: "/admin/cars" },
        { title: "Deleted Cars", value: data?.deletedCars ?? 0, path: "/admin/cars" },
        { title: "Total Brands", value: data?.totalBrands ?? 0, path: "/admin/brands" },
        { title: "Total Models", value: data?.totalModels ?? 0, path: "/admin/brands" },
        { title: "Build Types", value: data?.totalBuildTypes ?? 0, path: "/admin/build-types" },
        { title: "Showrooms", value: data?.totalShowrooms ?? 0, path: "/admin/showrooms" },
        { title: "Colors", value: data?.totalColors ?? 0, path: "/admin/vehicle-specs" },
        { title: "Sell Requests", value: data?.totalSellRequests ?? 0, path: "/admin/sell-requests" },
        { title: "Banners", value: data?.totalBanners ?? 0, path: "/admin/banners" },
    ];

    if (data?.totalAdmins !== undefined && data?.totalAdmins !== null) {
        cards.push({ title: "Admins", value: data.totalAdmins, path: "/admin/user-management" });
    }

    return (
        <div className="bg-[#F8F9FB] p-8 overflow-x-hidden">
            <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {cards.map((c) => (
                    <StatCard
                        key={c.title}
                        title={c.title}
                        value={c.value}
                        onClick={c.path ? () => navigate(c.path as string) : undefined}
                    />
                ))}
            </div>

            {Array.isArray(data?.brands) && data?.brands?.length ? (
                <div className="bg-white rounded-2xl p-6 shadow-sm mt-6">
                    <h2 className="text-lg font-semibold mb-4">Brands & Models</h2>
                    <ul className="divide-y">
                        {data.brands.slice(0, 12).map((b) => (
                            <li
                                key={b.id}
                                className="py-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 px-2 rounded"
                                onClick={() => navigate("/admin/brands")}
                            >
                                <span className="text-gray-800">{b.name}</span>
                                <span className="text-gray-500 text-sm">{(b.modelCount ?? 0).toLocaleString()} models</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}
        </div>
    );
};

type StatCardProps = {
    title: string;
    value: string | number;
    onClick?: () => void;
};

const StatCard = ({ title, value, onClick }: StatCardProps) => (
    <div
        className={`bg-white rounded-2xl p-6 shadow-sm ${onClick ? "cursor-pointer hover:shadow-md transition" : ""}`}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : -1}
        onKeyDown={(e) => {
            if (!onClick) return;
            if (e.key === "Enter" || e.key === " ") onClick();
        }}
    >
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl font-bold mt-2">{typeof value === 'number' ? value.toLocaleString() : value}</h2>
    </div>
);

export default Dashboard;
