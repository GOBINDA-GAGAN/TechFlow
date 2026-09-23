import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    ArrowUpRight,
    Sparkles,
} from "lucide-react";
import Logo from "../components/Logo";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { Login, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    // Redirect logged-in users
    if (isLoggedIn) {
        return <Navigate to="/profile" replace />;
    }

    // Login handler
    const submitHandler = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            toast.error("Please enter your email and password.");
            return;
        }

        setLoading(true);

        try {
            const data = await Login(email, password);

            if (data?.token) {
                toast.success("Welcome back!");
                navigate("/profile");
            } else {
                toast.error(
                    "Login failed. Please check your credentials."
                );
            }
        } catch (err) {
            if (err?.status === 429) {
                toast.error(
                    "Too many attempts. Please try again later."
                );
            } else {
                const message =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Invalid email or password.";

                toast.error(message);
            }
        } finally {
            setLoading(false);
        }
    };

    // Google login placeholder
    const googleLoginHandler = () => {
        toast.info("Google login is coming soon.", {
            description:
                "We're working on bringing Google authentication to TechFlow.",
        });
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg)] px-5 py-8 sm:px-6">

            <div className="relative z-10 w-full max-w-[420px]">

                {/* ───────────── Logo ───────────── */}

                <div className="mb-8 flex justify-center sm:mb-9">
                    <Link
                        to="/"
                        aria-label="Go to homepage"
                        className="group"
                    >
                        <div className="transition-transform duration-300 group-hover:scale-[1.03]">
                            <Logo />
                        </div>
                    </Link>
                </div>

                {/* ───────────── Heading ───────────── */}

                <div className="text-center">

                    <div className="mb-3 flex items-center justify-center gap-2">
                        <Sparkles
                            size={13}
                            strokeWidth={1.8}
                            className="text-[var(--color-accent)]"
                        />

                        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
                            Welcome back
                        </span>
                    </div>

                    <h1 className="text-[30px] font-semibold tracking-[-0.045em] text-[var(--color-text-primary)] sm:text-[34px]">
                        Sign in to your account
                    </h1>

                    <p className="mx-auto mt-2.5 max-w-[340px] text-[13px] leading-6 text-[var(--color-text-secondary)]">
                        Continue writing, discovering, and sharing ideas.
                    </p>
                </div>

                {/* ═══════════════════════════════════════
                    LOGIN FORM
                ═══════════════════════════════════════ */}

                <form
                    onSubmit={submitHandler}
                    className="mt-8 space-y-4"
                >

                    {/* ───────────── Email ───────────── */}

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]"
                        >
                            Email address
                        </label>

                        <div className="group relative">

                            <Mail
                                size={16}
                                strokeWidth={1.7}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]"
                            />

                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                autoComplete="email"
                                required
                                className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-transparent pl-11 pr-4 text-sm text-[var(--color-text-primary)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/[0.06]"
                            />
                        </div>
                    </div>

                    {/* ───────────── Password ───────────── */}

                    <div>

                        <div className="mb-2 flex items-center justify-between">

                            <label
                                htmlFor="password"
                                className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]"
                            >
                                Password
                            </label>

                            <button
                                type="button"
                                disabled
                                className="cursor-not-allowed text-[10px] font-medium text-[var(--color-text-muted)] opacity-50"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <div className="group relative">

                            <Lock
                                size={16}
                                strokeWidth={1.7}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]"
                            />

                            <input
                                id="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                autoComplete="current-password"
                                required
                                className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-transparent pl-11 pr-12 text-sm text-[var(--color-text-primary)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/[0.06]"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        (prev) => !prev
                                    )
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
                            >
                                {showPassword ? (
                                    <EyeOff size={17} />
                                ) : (
                                    <Eye size={17} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* ───────────── Sign In ───────────── */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="group mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 text-sm font-semibold text-white shadow-lg shadow-[var(--color-primary)]/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[var(--color-primary)]/15 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                        {loading ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign in

                                <ArrowRight
                                    size={16}
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </>
                        )}
                    </button>
                </form>

                {/* ═══════════════════════════════════════
                    DIVIDER
                ═══════════════════════════════════════ */}

                <div className="my-6 flex items-center gap-4">

                    <div className="h-px flex-1 bg-[var(--color-border)]" />

                    <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                        or
                    </span>

                    <div className="h-px flex-1 bg-[var(--color-border)]" />
                </div>

                {/* ═══════════════════════════════════════
                    GOOGLE LOGIN
                ═══════════════════════════════════════ */}

                <button
                    type="button"
                    onClick={googleLoginHandler}
                    className="group flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[var(--color-border)] bg-transparent text-sm font-medium text-[var(--color-text-secondary)] transition-all duration-300 hover:border-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
                >
                    {/* Google Logo */}

                    <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            fill="#4285F4"
                            d="M21.35 12.27c0-.73-.07-1.43-.2-2.1H12v3.98h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.27Z"
                        />

                        <path
                            fill="#34A853"
                            d="M12 21.7c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.7-1.72-5.47-4.03H3.29v2.53A9.75 9.75 0 0 0 12 21.7Z"
                        />

                        <path
                            fill="#FBBC05"
                            d="M6.53 13.79a5.86 5.86 0 0 1 0-3.58V7.68H3.29a9.75 9.75 0 0 0 0 8.64l3.24-2.53Z"
                        />

                        <path
                            fill="#EA4335"
                            d="M12 6.18c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.27 14.63 2.3 12 2.3a9.75 9.75 0 0 0-8.71 5.38l3.24 2.53C7.3 7.9 9.46 6.18 12 6.18Z"
                        />
                    </svg>

                    Continue with Google

                    <ArrowUpRight
                        size={14}
                        className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                </button>


                <p className="mt-7 text-center text-sm text-[var(--color-text-secondary)]">
                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        className="group inline-flex items-center gap-1 font-semibold text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-primary)]"
                    >
                        Create one

                        <ArrowUpRight
                            size={13}
                            className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                    </Link>
                </p>

            </div>
        </main>
    );
};

export default Login;