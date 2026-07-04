import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Shield,
  Briefcase,
  CreditCard,
  Building,
  Key,
  Lock
} from "lucide-react";
import useAuthStore from "../../app/authStore";
import { getUserById, updateUser } from "../../api/user.api";
import { getCompanyById } from "../../api/company.api";

const Profile = () => {
  const { user: authUser } = useAuthStore();

  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        //Fetch user info
        const userRes = await getUserById(authUser._id);
        const fetchedUser = userRes.data.user;
        setUser(fetchedUser);

        //Fetch company info
        if (fetchedUser.company) {
          const companyRes = await getCompanyById(fetchedUser.company);
          setCompany(companyRes.data.company);
        }
      } catch (error) {
        toast.error("Failed to load profile information");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser._id]);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error("Password is required");
      return;
    }

    if (!confirmPassword) {
      toast.error("Please confirm your password");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setSaving(true);
      await updateUser(authUser._id, { password });
      toast.success("Password updated successfully");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Password update failed");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "US";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="max-w-4xl space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-32 bg-slate-200 rounded-lg"></div>
          <div className="h-4 w-64 bg-slate-200 rounded-lg"></div>
        </div>
        {/* Card Skeletons */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-6">
          <div className="h-5 w-40 bg-slate-200 rounded-lg"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="h-3 w-16 bg-slate-100 rounded"></div>
              <div className="h-4 w-32 bg-slate-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-16 bg-slate-100 rounded"></div>
              <div className="h-4 w-48 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">My Profile</h1>
        <p className="text-slate-400 text-sm">
          Manage your personal details, company settings, and security credentials.
        </p>
      </div>

      {/* User Hero Info Header */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm shadow-slate-100/50 flex flex-col sm:flex-row items-center gap-5 transition-all duration-300 hover:shadow-md hover:shadow-slate-100/60">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-600 text-white font-bold text-2xl flex items-center justify-center shadow-lg shadow-indigo-100 shrink-0">
          {getInitials(user.name)}
        </div>
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
            <h2 className="text-xl font-bold text-slate-800 truncate">{user.name}</h2>
            <span className="inline-flex items-center self-center sm:self-auto gap-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-100/50 capitalize w-fit">
              {user.userType}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">{user.email}</p>
        </div>
      </div>

      {/* USER INFO */}
      <Card title="User Information" icon={User}>
        <Info label="Name" value={user.name} icon={User} />
        <Info label="Email" value={user.email} icon={Mail} />
        <Info label="User Type" value={capitalize(user.userType)} icon={Shield} />
        <Info label="Role" value={user.role?.title || "-"} icon={Briefcase} />
        <Info
          label="Approval Limit"
          value={`₹${user.role?.approvalLimit ?? 0}`}
          icon={CreditCard}
        />
      </Card>

      {/* COMPANY INFO */}
      {company && (
        <Card title="Company Information" icon={Building}>
          <Info label="Company Name" value={company.name} icon={Building} />
          <Info label="Company ID" value={company._id} icon={Key} />
          <Info
            label="Status"
            value={company.isActive ? "Active" : "Inactive"}
            icon={Shield}
          />
        </Card>
      )}

      {/* PASSWORD CHANGE */}
      <Card title="Change Password" icon={Lock} noGrid={true}>
        <form onSubmit={handlePasswordUpdate} className="space-y-5">
          <div className="max-w-md space-y-4">
            <Input
              label="New Password"
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Retype password to verify"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={Lock}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-100 disabled:opacity-60 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border-none"
          >
            {saving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </Card>
    </div>
  );
};

export default Profile;

const Card = ({ title, icon: Icon, children, noGrid = false }) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm shadow-slate-100/50 space-y-6 transition-all duration-300 hover:shadow-md hover:shadow-slate-100/60">
    <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
      {Icon && <Icon className="text-indigo-600 shrink-0" size={18} />}
      <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
    </div>
    <div className={noGrid ? "space-y-4" : "grid grid-cols-1 sm:grid-cols-2 gap-6"}>
      {children}
    </div>
  </div>
);

const Info = ({ label, value, icon: Icon }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-50 hover:bg-slate-50 transition-colors">
    {Icon && (
      <div className="p-2 rounded-lg bg-white border border-slate-100 text-slate-400 shrink-0 shadow-sm">
        <Icon size={16} className="text-slate-500" />
      </div>
    )}
    <div className="min-w-0">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-slate-700 truncate mt-0.5">{value || "-"}</p>
    </div>
  </div>
);

const Input = ({ label, icon: Icon, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
    <div className="relative flex items-center">
      {Icon && (
        <div className="absolute left-3.5 text-slate-400 pointer-events-none">
          <Icon size={16} />
        </div>
      )}
      <input
        {...props}
        className={`w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 text-sm outline-none transition-all duration-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 placeholder-slate-400
          ${Icon ? "pl-10 pr-4" : "px-4"}`}
      />
    </div>
  </div>
);

const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";