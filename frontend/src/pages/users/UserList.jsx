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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Users</h1>

        <button
          onClick={() => navigate("/app/users/new")}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          + Create User
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {/* Render loading state *inside* the table so the input doesn't unmount */}
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
                <tr key={u._id}>
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.role?.title || "-"}</td>
                  <td className="px-4 py-2 capitalize">{u.userType}</td>
                  <td className="px-4 py-2 space-x-2">
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || loading}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || loading}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersList;