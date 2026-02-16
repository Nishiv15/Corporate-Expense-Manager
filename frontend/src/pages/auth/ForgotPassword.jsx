import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });

      toast.success("Verification code sent");
      navigate("/verify-code", { state: { email } });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send code"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow">
        <h1 className="text-xl font-semibold mb-6 text-center">
          Forgot Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border px-3 py-2 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg"
          >
            {loading ? "Sending..." : "Send Code"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
