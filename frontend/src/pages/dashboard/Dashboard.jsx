import useAuthStore from "../../app/authStore";
import {
  Receipt,
  Clock,
  CheckCircle,
  XCircle,
  Users
} from "lucide-react";
import StatCard from "../../components/common/StatCard";

const Dashboard = () => {
  const { user } = useAuthStore();
  const isManager = user?.userType === "manager";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome, {user?.name}
        </h1>
        <p className="text-gray-500 text-sm">
          Here’s an overview of your expense activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Expenses"
          value="24"
          icon={Receipt}
          color="indigo"
        />

        <StatCard
          title="Drafts"
          value="6"
          icon={Clock}
          color="yellow"
        />

        <StatCard
          title="Approved"
          value="12"
          icon={CheckCircle}
          color="green"
        />

        <StatCard
          title="Rejected"
          value="3"
          icon={XCircle}
          color="red"
        />

        {isManager && (
          <StatCard
            title="Pending Approvals"
            value="5"
            icon={Users}
            color="purple"
          />
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-700">
            Recent Expenses
          </h2>
        </div>

        <div className="divide-y">
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="p-4 flex items-center justify-between text-sm"
            >
              <div>
                <p className="font-medium text-gray-700">
                  Office Supplies
                </p>
                <p className="text-gray-500">
                  ₹2,500 • Submitted
                </p>
              </div>
              <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">
                Submitted
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
