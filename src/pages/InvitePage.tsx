import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Loader2, Users, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";
import API from "@/context/axios";

const InvitePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [status, setStatus] = useState<"checking" | "unauthenticated" | "accepting" | "success" | "error">("checking");
  const [errorMsg, setErrorMsg] = useState("");
  const [joinedTeamId, setJoinedTeamId] = useState("");

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setErrorMsg("No invitation token provided. Please check your invitation link.");
      setStatus("error");
      return;
    }

    if (!isAuthenticated) {
      setStatus("unauthenticated");
    } else {
      acceptInvite();
    }
  }, [token, isAuthenticated]);

  const acceptInvite = async () => {
    if (!token) return;
    setStatus("accepting");

    try {
      // Call NestJS backend invite accept API
      const res = await API.post("/team/accept-invite", { token });
      setStatus("success");
      toast.success("Joined team successfully!");
      
      const teamId = res.data?.teamId;
      if (teamId) {
        setJoinedTeamId(teamId);
        // Delay redirect slightly for user to enjoy success state
        setTimeout(() => {
          navigate(`/dashboard/teams/${teamId}`);
        }, 2000);
      } else {
        setTimeout(() => {
          navigate("/dashboard/teams");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Accept invitation error:", error);
      const serverError = error.response?.data?.message || error.message || "Failed to accept team invitation.";
      setErrorMsg(serverError);
      setStatus("error");
      toast.error(serverError);
    }
  };

  const handleRedirectToLogin = () => {
    if (token) {
      sessionStorage.setItem("pendingInviteToken", token);
    }
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Decorative Blueprint Background Grids */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #3b82f6 1px, transparent 1px),
            linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Soft Ambient Light Rays */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 scale-95 sm:scale-100 transition-all duration-300">
        
        {/* Brand Header */}
        <div className="text-center mb-8 space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 font-sans uppercase">
            EstimaPro
          </h1>
          <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-medium">
            Quantity Estimation Suite
          </p>
        </div>

        {/* Dynamic State Layout Panel */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/50 p-8 flex flex-col items-center text-center">
          
          {/* CHECKING STATE */}
          {status === "checking" && (
            <div className="space-y-6 py-6">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
              <div>
                <h3 className="text-lg font-bold text-slate-950">Verifying Invitation</h3>
                <p className="text-sm text-slate-500 mt-1">Please wait while we check your token parameters...</p>
              </div>
            </div>
          )}

          {/* UNAUTHENTICATED STATE */}
          {status === "unauthenticated" && (
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100/50 flex items-center justify-center text-blue-600 shadow-sm">
                <Users className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-950">Team Invitation</h3>
                <p className="text-sm text-slate-500">
                  You have been invited to join a collaborative estimating team on EstimaPro.
                </p>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-4 text-xs text-slate-600 text-left space-y-1.5">
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Accepting this invite allows you to:
                  </p>
                  <ul className="list-disc pl-5 space-y-0.5 text-slate-500">
                    <li>Participate in collaborative project take-offs</li>
                    <li>Coordinate BOQ measurements and rate analyses</li>
                    <li>Co-author dynamic drawing dimension sheets</li>
                  </ul>
                </div>
              </div>
              <button
                onClick={handleRedirectToLogin}
                className="w-full bg-gradient-to-br from-slate-900 to-black hover:from-black hover:to-slate-900 text-white shadow-md hover:shadow-lg h-12 rounded-xl font-bold text-sm tracking-wide transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                Sign In to Join Team
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ACCEPTING STATE */}
          {status === "accepting" && (
            <div className="space-y-6 py-6">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Joining Team</h3>
                <p className="text-sm text-slate-500">Welcome {user?.firstName}! We are adding you to the team...</p>
              </div>
            </div>
          )}

          {/* SUCCESS STATE */}
          {status === "success" && (
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm animate-bounce" style={{ animationDuration: '2s' }}>
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-slate-900">Welcome to the Team!</h3>
                <p className="text-sm text-slate-500 px-4">
                  Invitation accepted. You are now a participating member of this estimating team.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 pt-2">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                  Redirecting to your workspace...
                </span>
              </div>
            </div>
          )}

          {/* ERROR STATE */}
          {status === "error" && (
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 shadow-sm animate-pulse">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-950">Invalid Invitation</h3>
                <p className="text-sm text-slate-500 px-2 leading-relaxed">
                  {errorMsg}
                </p>
              </div>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 h-12 rounded-xl font-bold text-sm tracking-wide transition-all active:scale-95 cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default InvitePage;
