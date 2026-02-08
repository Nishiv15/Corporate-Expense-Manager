import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserById } from "../../api/user.api";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH USER =================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserById(id);
        setUser(res.data.user);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load user"
        );
        navigate("/app/users");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  // ================= UI =================

  if (loading) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  if (!user) return null;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          User Details
        </h1>
      </div>

      <div className="bg-white border rounded-xl p-6 space-y-6">
        {/* BASIC INFO */}
        <Section title="Basic Information">
          <Info label="Name" value={user.name} />
          <Info label="Email" value={user.email} />
          <Info label="User Type" value={capitalize(user.userType)} />
        </Section>

        {/* ROLE INFO */}
        <Section title="Role & Permissions">
          <Info label="Role" value={user.role?.title || "-"} />
          <Info
            label="Approval Limit"
            value={
              user.role?.approvalLimit !== undefined
                ? `₹${user.role.approvalLimit}`
                : "-"
            }
          />
        </Section>

        {/* META */}
        <Section title="Account Info">
          <Info
            label="Status"
            value={user.isActive ? "Active" : "Inactive"}
          />
          {user.createdAt && (
            <Info
              label="Created At"
              value={new Date(user.createdAt).toLocaleString()}
            />
          )}
        </Section>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate("/app/users")}
          className="px-6 py-2 rounded-lg border text-sm"
        >
          Back
        </button>

        <button
          onClick={() => navigate(`/app/users/${id}/edit`)}
          className="px-6 py-2 rounded-lg bg-indigo-600 text-white text-sm"
        >
          Edit User
        </button>
      </div>
    </div>
  );
};

export default UserDetails;

// ================= HELPERS =================

const Section = ({ title, children }) => (
  <div>
    <h2 className="text-sm font-semibold text-gray-700 mb-3">
      {title}
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
);

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium text-gray-800">
      {value || "-"}
    </p>
  </div>
);

const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
