import { useEffect, useState } from "react";
import { Receipt, Clock, CheckCircle, XCircle, Users } from "lucide-react";

import useAuthStore from "../../app/authStore";
import StatCard from "../../components/common/StatCard";
import { getExpenses } from "../../api/expense.api";

const Dashboard = () => {
  const { user } = useAuthStore();
  const isManager = user?.userType === "manager";

  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    approved: 0,
    rejected: 0,
    submitted: 0,
  });

  const [recentExpenses, setRecentExpenses] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [
          totalRes,
          draftRes,
          approvedRes,
          rejectedRes,
          submittedRes,
          recentRes,
        ] = await Promise.all([
          getExpenses(), // all
          getExpenses("draft"),
          getExpenses("approved"),
          getExpenses("rejected"),
          getExpenses("submitted"),
          getExpenses("all"), // recent expenses
        ]);

        setStats({
          total: totalRes.data.count,
          draft: draftRes.data.count,
          approved: approvedRes.data.count,
          rejected: rejectedRes.data.count,
          submitted: submittedRes.data.count,
        });

        // ✅ Sort by createdAt DESC
        const sortedRecent = [...recentRes.data.expenses].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        //show only latest 5
        setRecentExpenses(sortedRecent.slice(0, 5));
      } catch (error) {
        console.error("Dashboard data error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome, {user?.name}
        </h1>
        <p className="text-gray-500 text-sm">
          Expense overview for your account
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Expenses"
          value={loading ? "—" : stats.total}
          icon={Receipt}
          color="indigo"
        />

        <StatCard
          title="Drafts"
          value={loading ? "—" : stats.draft}
          icon={Clock}
          color="yellow"
        />

        <StatCard
          title="Approved"
          value={loading ? "—" : stats.approved}
          icon={CheckCircle}
          color="green"
        />

        <StatCard
          title="Rejected"
          value={loading ? "—" : stats.rejected}
          icon={XCircle}
          color="red"
        />

        {isManager && (
          <StatCard
            title="Pending Approvals"
            value={loading ? "—" : stats.submitted}
            icon={Users}
            color="purple"
          />
        )}
      </div>
      {/* Recent Expenses */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-700">Recent Expenses</h2>
        </div>

        {loading ? (
          <div className="p-4 text-sm text-gray-500">
            Loading recent expenses...
          </div>
        ) : recentExpenses.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No expenses found</div>
        ) : (
          <div className="divide-y">
            {recentExpenses.map((expense) => (
              <div
                key={expense._id}
                className="p-4 flex items-center justify-between text-sm"
              >
                <div>
                  <p className="font-medium text-gray-700">{expense.title}</p>
                  <p className="text-gray-500">
                    ₹{expense.totalAmount} • {expense.status}
                  </p>
                </div>

                <span
                  className={`px-2 py-1 rounded-full text-xs capitalize ${
                    expense.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : expense.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : expense.status === "submitted"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {expense.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
