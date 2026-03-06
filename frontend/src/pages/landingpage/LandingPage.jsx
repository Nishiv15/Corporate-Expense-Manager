import { useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  ArrowRight, 
  ArrowDown,
  CheckCircle, 
  Clock, 
  BarChart3, 
  Lock 
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                <FileText className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight truncate max-w-[150px] sm:max-w-none">
                SpendSync
              </span>
            </div>
            <div className="flex items-center gap-3 sm:gap-6">
              <button 
                onClick={() => navigate("/login")}
                className="bg-indigo-600 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap"
              >
                Log in/Sign up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6 sm:mb-8">
          Streamline Your Company's <br className="hidden sm:block" />
          <span className="text-indigo-600">Expense Workflows</span>
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-slate-600 mb-10 sm:mb-12 px-2">
          Ditch the spreadsheets, lost receipts, and email chains. Centralize your expense management, enforce transparent approval pipelines, and gain real-time budget control.
        </p>
        
        {/* Buttons stack on mobile, side-by-side on sm+ */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full max-w-md mx-auto sm:max-w-none">
          <button 
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto justify-center bg-indigo-600 text-white px-8 py-3.5 sm:py-4 rounded-xl font-medium text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => document.getElementById("features").scrollIntoView({ behavior: "smooth" })}
            className="w-full sm:w-auto justify-center bg-white text-slate-700 border-2 border-slate-200 px-8 py-3.5 sm:py-4 rounded-xl font-medium text-lg hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            How it works
          </button>
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section className="py-16 sm:py-24 bg-white border-y border-slate-200" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">A Modern Solution to an Old Problem</h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Manual expense handling creates bottlenecks, lacks transparency, and frustrates both employees and finance teams. We built a better way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {[
              {
                icon: Clock,
                color: "text-red-600",
                bg: "bg-red-100",
                title: "No More Delays",
                desc: "Replace slow email threads with instant submissions and single-click approvals. Keep the pipeline moving smoothly."
              },
              {
                icon: BarChart3,
                color: "text-indigo-600",
                bg: "bg-indigo-100",
                title: "Clear Audit Trails",
                desc: "Every action is tracked. Say goodbye to untraceable approvals and hello to complete financial transparency."
              },
              {
                icon: Lock,
                color: "text-emerald-600",
                bg: "bg-emerald-100",
                title: "Secure & Isolated",
                desc: "Company-level data isolation, role-based access control, and strict self-approval prevention policies."
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 ${feature.bg} ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-12 sm:mb-20">Designed for Everyone on the Team</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Manager Card */}
            <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-indigo-50 rounded-bl-full -z-10"></div>
              <div className="flex items-center gap-4 mb-6 sm:mb-8">
                <div className="p-3 sm:p-4 bg-indigo-100 text-indigo-700 rounded-xl">
                  <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">For Managers</h3>
              </div>
              <ul className="space-y-4 sm:space-y-5">
                {[
                  'Create and manage company accounts', 
                  'Onboard employees and assign roles', 
                  'Review, approve, or reject expenses in one click', 
                  'Access comprehensive dashboard analytics', 
                  'Manage user lifecycle securely'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 text-sm sm:text-base">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Employee Card */}
            <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-emerald-50 rounded-bl-full -z-10"></div>
              <div className="flex items-center gap-4 mb-6 sm:mb-8">
                <div className="p-3 sm:p-4 bg-emerald-100 text-emerald-700 rounded-xl">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">For Employees</h3>
              </div>
              <ul className="space-y-4 sm:space-y-5">
                {[
                  'Effortless expense request creation', 
                  'Save as Draft to edit and finalize later', 
                  'Track the real-time status of submissions', 
                  'Attach receipt URLs easily', 
                  'Secure profile management and password recovery'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 text-sm sm:text-base">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 sm:py-24 bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 sm:mb-16">The Expense Lifecycle</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-indigo-800/50 p-6 sm:p-8 rounded-xl border border-indigo-700/50 w-full md:w-72 shadow-xl shadow-indigo-950/20">
              <h4 className="text-xl font-bold mb-3">1. Draft</h4>
              <p className="text-indigo-200 text-sm sm:text-base leading-relaxed">Editable, deletable, and visible only to the creator until ready.</p>
            </div>
            
            {/* Arrow changes direction based on screen size */}
            <ArrowDown className="text-indigo-400 md:hidden w-8 h-8 my-2" />
            <ArrowRight className="text-indigo-400 hidden md:block w-8 h-8 lg:w-10 lg:h-10 shrink-0" />
            
            <div className="bg-indigo-800/50 p-6 sm:p-8 rounded-xl border border-indigo-700/50 w-full md:w-72 shadow-xl shadow-indigo-950/20">
              <h4 className="text-xl font-bold mb-3">2. Submitted</h4>
              <p className="text-indigo-200 text-sm sm:text-base leading-relaxed">Locked from edits. Sent instantly to the manager for review.</p>
            </div>
            
            {/* Arrow changes direction based on screen size */}
            <ArrowDown className="text-indigo-400 md:hidden w-8 h-8 my-2" />
            <ArrowRight className="text-indigo-400 hidden md:block w-8 h-8 lg:w-10 lg:h-10 shrink-0" />
            
            <div className="bg-indigo-800/50 p-6 sm:p-8 rounded-xl border border-indigo-700/50 w-full md:w-72 shadow-xl shadow-indigo-950/20">
              <h4 className="text-xl font-bold mb-3">3. Resolved</h4>
              <p className="text-indigo-200 text-sm sm:text-base leading-relaxed">Approved or Rejected. Permanently stored for clear auditing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 sm:py-16 text-center border-t border-slate-800 px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500 shrink-0" />
          <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            SpendSync
          </span>
        </div>
        <p className="text-sm sm:text-base">© {new Date().getFullYear()} All rights reserved. Built for modern teams.</p>
      </footer>
    </div>
  );
};

export default LandingPage;