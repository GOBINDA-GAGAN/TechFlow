import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import {
    Sparkles,
    Users,
    PenLine,
    ArrowRight,
    Bookmark,
    Heart,
    Rocket,
    ShieldCheck,
    CloudUpload,
    Database,
    ChevronDown,
    MessageCircle,
    Search,
    WandSparkles,
    CheckCircle2,
} from "lucide-react";
import { FaReact, FaNodeJs } from "react-icons/fa6";

import AiEditorScreenshot from "../assets/editor_ai.png";
import editorScreenshot from "../assets/editor.png";
import postDetailsScreenshot from "../assets/post_details.png";
import dashboardFeedScreenshot from "../assets/feed.png";



const features = [
    {
        icon: Sparkles,
        title: "AI Writing Assistant",
        description:
            "Enter a topic and get a complete draft in seconds. Tweak it, add your voice, and publish.",
        gradient: "from-indigo-500 to-violet-500",
    },
    {
        icon: Users,
        title: "Follow Writers",
        description:
            "Follow writers you enjoy and create a personalized feed filled with ideas worth reading.",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        icon: PenLine,
        title: "Rich Text Editor",
        description:
            "Create polished articles with headings, lists, links, code blocks, and rich media.",
        gradient: "from-emerald-500 to-teal-500",
    },
    {
        icon: Bookmark,
        title: "Save for Later",
        description:
            "Bookmark useful posts and keep your favorite ideas available whenever you need them.",
        gradient: "from-orange-500 to-amber-500",
    },
    {
        icon: CloudUpload,
        title: "Cover Images",
        description:
            "Add beautiful cover images to your articles and give every post a strong visual identity.",
        gradient: "from-cyan-500 to-blue-500",
    },
    {
        icon: ShieldCheck,
        title: "Safe & Private",
        description:
            "Your account, content, and personal information are protected with secure infrastructure.",
        gradient: "from-purple-500 to-fuchsia-500",
    },
];

const steps = [
    {
        step: "01",
        icon: Users,
        title: "Create an Account",
        desc: "Set up your profile and discover topics and writers you care about.",
    },
    {
        step: "02",
        icon: PenLine,
        title: "Write a Post",
        desc: "Create your article using a clean editor built around your writing.",
    },
    {
        step: "03",
        icon: Heart,
        title: "Share & Connect",
        desc: "Publish your ideas and connect with readers through meaningful interactions.",
    },
];

const techStack = [
    {
        icon: FaReact,
        name: "React 19",
        desc: "Frontend",
        color: "#61DAFB",
    },
    {
        icon: FaNodeJs,
        name: "Node.js",
        desc: "Backend",
        color: "#68A063",
    },
    {
        icon: Database,
        name: "MongoDB",
        desc: "Database",
        color: "#4DB33D",
    },
    {
        icon: PenLine,
        name: "TipTap",
        desc: "Editor",
        color: "#6366F1",
    },
    {
        icon: CloudUpload,
        name: "Cloudinary",
        desc: "Media",
        color: "#3448C5",
    },
];


const useInView = (threshold = 0.05) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setInView(true);
            },
            { threshold }
        );

        if (ref.current) observer.observe(ref.current);

        return () => observer.disconnect();
    }, [threshold]);

    return [ref, inView];
};


const Landing = () => {
    const { isLoggedIn } = useAuth();

    const [heroRef, heroInView] = useInView();
    const [showcase1Ref, showcase1InView] = useInView();
    const [showcase2Ref, showcase2InView] = useInView();
    const [featRef, featInView] = useInView();
    const [stepsRef, stepsInView] = useInView();
    const [techRef, techInView] = useInView();
    const [ctaRef, ctaInView] = useInView();

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-[var(--color-bg)] text-[var(--color-text-primary)]">



            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden">
                <div className="mx-auto h-[650px] max-w-[1100px] rounded-full bg-[radial-gradient(circle_at_50%_20%,rgba(0,112,243,0.09),transparent_62%)] blur-3xl" />
            </div>
            <section
                ref={heroRef}
                className={`relative mx-auto max-w-[1180px] px-5 pb-16 pt-16 text-center transition-all duration-700 sm:px-8 sm:pb-20 sm:pt-24 lg:px-10 lg:pt-28 ${
                    heroInView
                        ? "translate-y-0 opacity-100"
                        : "translate-y-5 opacity-0"
                }`}
            >
                <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3.5 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] shadow-sm">
                    <Sparkles size={13} className="text-[var(--color-accent)]" />
                    AI-powered publishing platform
                    <ArrowRight size={12} />
                </div>

                <h1 className="mx-auto max-w-[850px] text-[clamp(2.8rem,7vw,5.8rem)] font-bold leading-[0.98] tracking-[-0.065em]">
                    Where great ideas
                    <br />
                    <span className="text-[var(--color-text-secondary)]">
                        become great stories.
                    </span>
                </h1>

                <p className="mx-auto mt-6 max-w-[650px] text-[15px] leading-7 text-[var(--color-text-secondary)] sm:text-base sm:leading-8">
                    Create, publish and discover thoughtful content with a modern
                    blogging platform built for writers and readers.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Link
                        to={isLoggedIn ? "/create-post" : "/register"}
                        className="btn-primary px-6 py-3"
                    >
                        {isLoggedIn ? "Start Writing" : "Get Started"}
                        <ArrowRight size={16} />
                    </Link>

                    <Link
                        to="/home"
                        className="btn-ghost px-6 py-3"
                    >
                        Explore Feed
                    </Link>
                </div>

                {/* Product screenshot */}
                

                <div className="mt-12 flex justify-center text-[var(--color-text-muted)]">
                    <ChevronDown
                        size={19}
                        className="animate-[landing-bounce_2s_ease-in-out_infinite]"
                    />
                </div>
            </section>


        </div>
    );
};

export default Landing;