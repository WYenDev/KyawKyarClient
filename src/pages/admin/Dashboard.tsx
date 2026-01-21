const Dashboard = () => {
    return (
        <div className="bg-[#F8F9FB] p-8 overflow-x-hidden">
            <h1 className="text-2xl font-semibold mb-6">
                Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Cars" value="124" />
                <StatCard title="Total Brands" value="18" />
                <StatCard title="Total Sales" value="$320,000" />
            </div>
        </div>
    );
};

type StatCardProps = {
    title: string;
    value: string | number;
};

const StatCard = ({ title, value }: StatCardProps) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
);

export default Dashboard;
