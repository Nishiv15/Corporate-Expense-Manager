import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "../../app/authStore";
import api from "../../api/axios";
import { Mail, Lock, Building2, User, Briefcase, LogIn, UserPlus } from "lucide-react";
import Input  from "../../components/common/Input";

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [mode, setMode] = useState("login"); // login | register
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    managerName: "",
    email: "",
    password: "",
    managerRoleTitle: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "register") {
      const { companyName, managerName, email, password, managerRoleTitle } =
        formData;

      if (
        !companyName ||
        !managerName ||
        !email ||
        !password ||
        !managerRoleTitle
      ) {
        toast.error("All fields are required");
        setLoading(false);
        return;
      }

      try {
        // REGISTER COMPANY + MANAGER
        const res = await api.post("/companies/register", {
          companyName,
          managerName,
          managerEmail: email,
          managerPassword: password,
          managerRoleTitle,
        });

        const { user, token } = res.data;
        login(user, token);

        toast.success("Company registered successfully");
        navigate("/app/dashboard");
      } catch (error) {
        toast.error(error.response?.data?.message || "Registration failed");
      } finally {
        setLoading(false);
      }
    } else {
      const { email, password } = formData;

      if (!email || !password) {
        toast.error("Email and password are required");
        setLoading(false);
        return;
      }

      try {
        // LOGIN
        const res = await api.post("/user/login", {
          email,
          password,
        });

        const { user, token } = res.data;
        login(user, token);

        toast.success("Login successful");
        navigate("/app/dashboard");
      } catch (error) {
        toast.error(error.response?.data?.message || "Enter Valid Credentials");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EEF3FF] px-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

      {/* Logo */}
      <div className="flex justify-center mb-4">
        <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Building2 className="text-white" size={24} />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-semibold text-center">
        Corporate Expense Manager
      </h1>
      <p className="text-sm text-gray-500 text-center mt-1 mb-6">
        {mode === "login"
          ? "Sign in to your account"
          : "Create your company account"}
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* REGISTER FIELDS */}
        {mode === "register" && (
          <>
            <Input
              icon={Building2}
              placeholder="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />

            <Input
              icon={User}
              placeholder="Username"
              name="managerName"
              value={formData.managerName}
              onChange={handleChange}
            />
          </>
        )}

        {/* EMAIL */}
        <Input
          icon={Mail}
          type="email"
          placeholder="Email Address"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        {/* PASSWORD */}
        <Input
          icon={Lock}
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        {/* ROLE */}
        {mode === "register" && (
          <Input
            icon={Briefcase}
            placeholder="Role Title (Manager, CFO, etc.)"
            name="managerRoleTitle"
            value={formData.managerRoleTitle}
            onChange={handleChange}
          />
        )}

        {/* Forgot password */}
        {mode === "login" && (
          <div className="text-right text-sm text-indigo-600 hover:underline cursor-pointer" onClick={() => navigate("/forgot-password")}>
            Forgot password?
          </div>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {mode === "login" ? <LogIn size={18} /> : <UserPlus size={18} />}
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "Sign In"
            : "Create Account"}
        </button>
      </form>

      {/* Toggle */}
      <p className="text-sm text-center text-gray-500 mt-6">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <span
              onClick={() => setMode("register")}
              className="text-indigo-600 cursor-pointer hover:underline"
            >
              Create a company account
            </span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span
              onClick={() => setMode("login")}
              className="text-indigo-600 cursor-pointer hover:underline"
            >
              Sign in
            </span>
          </>
        )}
      </p>
    </div>
  </div>
  );
};

export default Auth;
