"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Lock, User, ArrowRight, Github, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface FormData {
  name?: string;
  email: string;
  password: string;
}

const SignupPage: React.FC = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isSignup ? "/signup" : "/login";
    const url = `http://127.0.0.1:5000${endpoint}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server did not return JSON. Check Flask logs.");
      }

      const data = await response.json();

      if (response.ok) {
        if (isSignup) {
          toast.success("Signup successful!");
          setIsSignup(false);
        } else {
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          toast.success("Welcome back!");
          router.push("/dashboard");
        }
      } else {
        toast.error(data.error || "Action failed");
      }
    } catch (error: any) {
      console.error("Fetch Error:", error);
      toast.error(error.message || "Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/homepage_background.png')" }}>

      {/* Toast Provider */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="px-4 md:px-10 lg:px-16 py-10 flex flex-col gap-4">
        <div className="p-4 sm:px-16 sm:py-4 lg:grid lg:grid-cols-[60%_40%]">
          <div className="hidden lg:flex flex-col justify-center bg-[#F8FAFC] border-y border-l border-[#789DA9]/60 px-16 py-12">
            <div className="space-y-6 max-w-md">
              <span className="inline-block text-sm font-semibold tracking-wide text-[#225061] uppercase">
                Revolutionize AI
              </span>
              <h2 className="text-4xl xl:text-5xl font-bold leading-tight text-[#1E293B]">
                {isSignup ? "Revolutionize the way intelligence works." : "Welcome back to the future of AI."}
              </h2>
              <p className="text-lg text-[#475569] leading-relaxed">
                {isSignup
                  ? "Create your account to unlock AI-powered insights, automation, and smarter decisions — all in one intelligent platform."
                  : "Sign in to access your dashboard, monitor your AI agents, and continue your journey with Revolutionize AI."}
              </p>
            </div>
          </div>

          <div className="px-6 py-4 sm:px-16 sm:py-12 bg-linear-to-r from-[#225061] to-[#27304F] border border-[#789DA9] rounded-xl lg:rounded-none shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col gap-2 items-center justify-center">
                <img src="/images/revolutionize_logo.png" alt="logo" className="h-6 md:h-8 lg:h-10" />
                <h3 className="text-center text-3xl text-white font-semibold">
                  {isSignup ? "Sign up" : "Login"}
                </h3>
              </div>

              {isSignup && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                    <input
                      type="text"
                      required
                      className="w-full text-white placeholder:text-slate-500 bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                      placeholder="Alex Rivera"
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                  <input
                    type="email"
                    required
                    className="w-full text-white placeholder:text-slate-500 bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                    placeholder="name@company.com"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                  <input
                    type="password"
                    required
                    className="w-full text-white placeholder:text-slate-500 bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                    placeholder="••••••••"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <>{isSignup ? "Get Started" : "Sign In"} <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <p className="text-slate-400 text-sm">
                {isSignup ? "Already have an account?" : "Don't have an account?"}
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="ml-2 text-orange-500 font-semibold hover:text-orange-400 transition-colors"
                >
                  {isSignup ? "Log in here" : "Create one"}
                </button>
              </p>
            </div>

            {/* Social Logins */}
            <div className="mt-6 flex gap-3">
              <button className="flex-1 bg-slate-800 border border-slate-700 py-2 rounded-lg flex items-center justify-center gap-2 text-white text-xs hover:bg-slate-700 transition-all">
                <Github className="w-4 h-4" /> GitHub
              </button>
              <button className="flex-1 bg-slate-800 border border-slate-700 py-2 rounded-lg flex items-center justify-center gap-2 text-white text-xs hover:bg-slate-700 transition-all">
                <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-3 h-3" alt="Google" /> Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage;