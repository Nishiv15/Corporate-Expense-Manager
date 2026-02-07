import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createUser } from "../../api/user.api";

const CreateUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    amountLimit: "",
    userType: "employee",
  });


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
      amountLimit,
      userType,
    } = form;

    if (!name || !email || !password || !role || amountLimit === "") {
      toast.error("All fields are required");
      return;
    }

    if (Number(amountLimit) < 0) {
      toast.error("Amount limit cannot be negative");
      return;
    }

    const payload = {
      name,
      email,
      password,
      role,
      amountLimit: Number(amountLimit),
      userType,
    };

    try {
      setLoading(true);
      await createUser(payload);
      toast.success("User created successfully");
      navigate("/app/users");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Create User
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl p-6 space-y-6"
      >
        {/* BASIC INFO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Name *"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
          />

          <Input
            label="Email *"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
          />
        </div>

        {/* PASSWORD */}
        <Input
          label="Password *"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Temporary password"
        />

        {/* ROLE & LIMIT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Role *"
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Junior Developer"
          />

          <Input
            label="Approval Amount Limit *"
            type="number"
            name="amountLimit"
            min={0}
            value={form.amountLimit}
            onChange={handleChange}
            placeholder="50000"
          />
        </div>

        {/* USER TYPE */}
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

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white text-sm disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create User"}
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
      className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);
