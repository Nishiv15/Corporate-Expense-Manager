import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const code = location.state?.code;

  const handleReset = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error("Enter new password");
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        email,
        code,
        password,
      });

      toast.success("Password reset successful");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Reset failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow">
        <h1 className="text-xl font-semibold mb-6 text-center">
          Reset Password
        </h1>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            className="w-full border px-3 py-2 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
