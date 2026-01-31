import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getExpenses } from "../../api/expense.api";
import useAuthStore from "../../app/authStore";

const filters = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Submitted", value: "submitted" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const ExpenseList = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [status, setStatus] = useState("all");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);

        const res =
          status === "all" ? await getExpenses() : await getExpenses(status);

        setExpenses(res.data.expenses);
      } catch (error) {
        console.error("Expenses fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [status]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Expenses</h1>

        {user?.userType === "employee" && (
          <button
            onClick={() => navigate("/app/expenses/new")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
          >
            + New Expense
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatus(f.value)}
            className={`px-3 py-1.5 rounded-full text-sm border ${
              status === f.value
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-x-auto">
        {loading ? (
          <div className="p-4 text-sm text-gray-500">Loading expenses...</div>
        ) : expenses.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No expenses found</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Department</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Created At</th>
                {user?.userType === "manager" && (
                  <th className="px-4 py-3 text-left">Created By</th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y">
              {expenses.map((expense) => (
                <tr
                  key={expense._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/app/expenses/${expense._id}`)}
                >
                  <td className="px-4 py-3 font-medium text-gray-700">
                    {expense.title}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {expense.department || "-"}
                  </td>

                  <td className="px-4 py-3">₹{expense.totalAmount}</td>

                  <td className="px-4 py-3">
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
                  </td>

                  <td className="px-4 py-3 text-gray-500">
                    {new Date(expense.createdAt).toLocaleDateString()}
                  </td>

                  {user?.userType === "manager" && (
                    <td className="px-4 py-3 text-gray-600">
                      {expense.createdBy?.name}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
