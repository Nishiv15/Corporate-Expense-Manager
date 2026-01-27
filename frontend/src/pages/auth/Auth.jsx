import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "../../app/authStore";
import api from "../../api/axios";

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [mode, setMode] = useState("login"); // login | register
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    userName: "",
    email: "",
    password: "",
    role: ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (mode === "register") {
        const { companyName, userName, email, password, role } = formData;

        if (!companyName || !userName || !email || !password || !role) {
          toast.error("All fields are required");
          return;
        }

        // REGISTER COMPANY + MANAGER
        const res = await api.post("/companies/register", {
          companyName,
          name: userName,
          email,
          password,
          role
        });

        const { user, token } = res.data;
        login(user, token);

        toast.success("Company registered successfully");
        navigate("/app/dashboard");
      } else {
        const { email, password } = formData;

        if (!email || !password) {
          toast.error("Email and password are required");
          return;
        }

        // LOGIN
        const res = await api.post("/user/login", {
          email,
          password
        });

        const { user, token } = res.data;
        login(user, token);

        toast.success("Login successful");
        navigate("/app/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Corporate Expense Manager
        </h1>

        {/* Toggle */}
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 ${
              mode === "login"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 ${
              mode === "register"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
              />

              <input
                type="text"
                name="userName"
                placeholder="Manager Name"
                value={formData.userName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
              />

              <input
                type="text"
                name="role"
                placeholder="Manager Role (e.g. Project Manager)"
                value={formData.role}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Create Company"}
          </button>
        </form>

        <p className="text-xs text-center text-gray-500 mt-4">
          {mode === "login"
            ? "Login using credentials provided by your manager"
            : "Register your company and get started"}
        </p>
      </div>
    </div>
  );
};

export default Auth;
