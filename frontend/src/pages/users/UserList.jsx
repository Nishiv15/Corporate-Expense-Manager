import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUsers, deleteUser } from "../../api/user.api";

const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const fetchUsers = async (page = 1, searchQuery = "") => {
    try {
      setLoading(true);
      const res = await getUsers(page, searchQuery);
      setUsers(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);

      // Sync local page state if the backend adjusts it
      if (res.data.currentPage && res.data.currentPage !== page) {
        setCurrentPage(res.data.currentPage);
      }
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Consolidate the search & pagination dependency into a single debounced useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(currentPage, search);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentPage, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await deleteUser(id, "Confirm");
      toast.success("User deleted");
      // Pass current page and search to maintain the exact view you were on
      fetchUsers(currentPage, search);
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold">Users</h1>

        <button
          onClick={() => navigate("/app/users/new")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg w-full sm:w-auto hover:bg-indigo-700"
        >
          + Create User
        </button>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white border rounded-xl overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-700">
                    {u.name}
                  </td>

                  <td className="px-4 py-3 text-gray-600">{u.email}</td>

                  <td className="px-4 py-3">{u.role?.title || "-"}</td>

                  <td className="px-4 py-3 capitalize">{u.userType}</td>

                  <td className="px-4 py-3 space-x-3">
                    <button
                      onClick={() => navigate(`/app/users/${u._id}`)}
                      className="text-indigo-600 hover:underline"
                    >
                      View
                    </button>

                    <button
                      onClick={() => navigate(`/app/users/${u._id}/edit`)}
                      className="text-green-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(u._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : users.length === 0 ? (
          <div className="text-center text-gray-500">No users found</div>
        ) : (
          users.map((u) => (
            <div
              key={u._id}
              className="bg-white border rounded-xl p-4 shadow-sm space-y-2"
            >
              <div className="font-medium text-gray-800">{u.name}</div>

              <div className="text-sm text-gray-600 break-all">{u.email}</div>

              <div className="text-sm text-gray-600">
                Role: {u.role?.title || "-"}
              </div>

              <div className="text-sm text-gray-600 capitalize">
                Type: {u.userType}
              </div>

              <div className="flex gap-4 pt-2 text-sm">
                <button
                  onClick={() => navigate(`/app/users/${u._id}`)}
                  className="text-indigo-600"
                >
                  View
                </button>

                <button
                  onClick={() => navigate(`/app/users/${u._id}/edit`)}
                  className="text-green-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(u._id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || loading}
          className="px-4 py-2 bg-gray-300 rounded-lg w-full sm:w-auto disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages || loading}
          className="px-4 py-2 bg-gray-300 rounded-lg w-full sm:w-auto disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersList;
