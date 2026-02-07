import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  createUser,
  getUserById,
  updateUser,
} from "../../api/user.api";

const CreateUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",            
    roleTitleNew: "",   
    amountLimit: "",
    userType: "employee",
  });

  useEffect(() => {
    if (!isEditMode) return;

    const fetchUser = async () => {
      try {
        setPageLoading(true);
        const res = await getUserById(id);
        const user = res.data.user;

        setForm({
          name: user.name || "",
          email: user.email || "",
          password: "",
          role: user.role?.title || "",
          roleTitleNew: "",
          amountLimit: user.role?.approvalLimit ?? "",
          userType: user.userType || "employee",
        });
      } catch {
        toast.error("Failed to load user");
        navigate("/app/users");
      } finally {
        setPageLoading(false);
      }
    };

    fetchUser();
  }, [id, isEditMode, navigate]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      email,
      password,
      role,
      roleTitleNew,
      amountLimit,
      userType,
    } = form;

    if (!isEditMode) {
      if (!name || !email || !password || !role || amountLimit === "") {
        toast.error("All fields are required");
        return;
      }

      try {
        setLoading(true);

        await createUser({
          name,
          email,
          password,
          role,
          amountLimit: Number(amountLimit),
          userType,
        });

        toast.success("User created successfully");
        navigate("/app/users");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to create user"
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    if (amountLimit === "") {
      toast.error("Approval limit is required");
      return;
    }

    const payload = {
      role, 
      approvalLimit: Number(amountLimit),
      userType,
    };

    if (roleTitleNew.trim()) {
      payload.roleTitleNew = roleTitleNew.trim();
    }

    try {
      setLoading(true);
      await updateUser(id, payload);
      toast.success("User updated successfully");
      navigate("/app/users");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update user"
      );
    } finally {
      setLoading(false);
    }
  };


  if (pageLoading) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        {isEditMode ? "Edit User" : "Create User"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl p-6 space-y-6"
      >
        {/* NAME & EMAIL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Name *"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={isEditMode}
          />

          <Input
            label="Email *"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={isEditMode}
          />
        </div>

        {/* PASSWORD (CREATE ONLY) */}
        {!isEditMode && (
          <Input
            label="Password *"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Temporary password"
          />
        )}

        {/* ROLE SECTION */}
        {!isEditMode && (
          <Input
            label="Role *"
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Junior Developer"
          />
        )}

        {isEditMode && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Current Role"
              value={form.role}
              disabled
            />

            <Input
              label="New Role"
              name="roleTitleNew"
              value={form.roleTitleNew}
              onChange={handleChange}
              placeholder="Senior Developer"
            />
          </div>
        )}

        {/* APPROVAL LIMIT & USER TYPE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Approval Amount Limit *"
            type="number"
            name="amountLimit"
            min={0}
            value={form.amountLimit}
            onChange={handleChange}
          />

          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              User Type *
            </label>
            <select
              name="userType"
              value={form.userType}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 text-sm w-full focus:ring-2 focus:ring-indigo-500"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white text-sm disabled:opacity-60"
          >
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update User"
              : "Create User"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/app/users")}
            className="px-6 py-2 rounded-lg border text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;

const Input = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm text-gray-600 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
    />
  </div>
);
