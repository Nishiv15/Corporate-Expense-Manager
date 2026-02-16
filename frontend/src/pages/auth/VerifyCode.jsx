import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";

const VerifyCode = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!code) {
      toast.error("Enter verification code");
      return;
    }

    try {
      await api.post("/auth/verify-otp", {
        email,
        code,
      });

      toast.success("Code verified");
      navigate("/reset-password", { state: { email, code } });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid or expired code"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow">
        <h1 className="text-xl font-semibold mb-6 text-center">
          Enter Verification Code
        </h1>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            placeholder="6-digit code"
            className="w-full border px-3 py-2 rounded-lg text-center tracking-widest"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyCode;
