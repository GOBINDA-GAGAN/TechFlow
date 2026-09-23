import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
    getAllPosts,
    getFollowingPosts,
    ToggleLike,
    ToggleBookmark,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
    TrendingUp,
    Users,
    Plus,
    Inbox,
    X,
    Sparkles,
    Compass,
    Search,
    ArrowRight,
    Bookmark,
    PenLine,
} from "lucide-react";
import PostCard from "../components/PostCard";
import RateLimitModal from "../components/RateLimitModal";

const TABS = {
    FOR_YOU: "for_you",
    FOLLOWING: "following",
};

const GREETINGS = [
    "What will you discover today?",
    "Find something worth reading.",
    "Good stories, all in one place.",
    "Stories worth your attention.",
    "Your daily dose of great writing.",
];

const Home = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    const [activeTab, setActiveTab] = useState(TABS.FOR_YOU);
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [searchParams] = useSearchParams();
    const q = searchParams.get("q") || "";
    const tag = searchParams.get("tag") || "";

    const [greeting] = useState(
        () => GREETINGS[Math.floor(Math.random() * GREETINGS.length)]
    );

    const [rateLimitMsg, setRateLimitMsg] = useState("");

    const loadPosts = async (pageNumber = 1, tab = activeTab) => {
        try {
            setLoading(true);

            let data;

            if (tab === TABS.FOLLOWING) {
                data = await getFollowingPosts(pageNumber, 12);
            } else {
                data = await getAllPosts(pageNumber, 12, q, tag);
            }

            if (data) {
                setPosts((prev) =>
                    pageNumber === 1
                        ? data.posts
                        : [...prev, ...data.posts]
                );

                setTotalPages(data.totalPages);
                setPage(pageNumber);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPosts([]);
        setPage(1);
        loadPosts(1, activeTab);
    }, [q, tag, activeTab]);

    const handleTabChange = (tab) => {
        if (tab === activeTab) return;
        setActiveTab(tab);
    };

    const toggleLike = async (id) => {
        setPosts((prev) =>
            prev.map((post) => {
                if (post._id === id) {
                    const hasLiked = post.likes.includes(user?._id);

                    return {
                        ...post,
                        likes: hasLiked
                            ? post.likes.filter(
                                  (uid) => uid !== user?._id
                              )
                            : [...post.likes, user?._id],
                    };
                }

                return post;
            })
        );

        try {
            await ToggleLike(id);
        } catch (error) {
            setPosts((prev) =>
                prev.map((post) => {
                    if (post._id === id) {
                        const hasLiked = post.likes.includes(user?._id);

                        return {
                            ...post,
                            likes: hasLiked
                                ? post.likes.filter(
                                      (uid) => uid !== user?._id
                                  )
                                : [...post.likes, user?._id],
                        };
                    }

                    return post;
                })
            );

            if (error.status === 429) {
                setRateLimitMsg("Too many likes! Slow down a bit.");
            }
        }
    };

    const toggleSave = async (id) => {
        try {
            const res = await ToggleBookmark(id);

            if (res.success) {
                setUser({
                    ...user,
                    bookmarks: res.bookmarks,
                });
            }
        } catch (error) {
            /* silently handle */
        }
    };

    const trendingTags = [
        ...new Set(posts.flatMap((p) => p.tags || [])),
    ].slice(0, 12);

    /* ─────────────────────────────────────────
       SKELETON
    ───────────────────────────────────────── */

    const Skeleton = () => (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)]"
                >
                    <div className="h-48 animate-pulse bg-[var(--color-bg-input)]" />

                    <div className="space-y-4 p-5">
                        <div className="h-3 w-24 animate-pulse rounded-full bg-[var(--color-bg-input)]" />

                        <div className="h-5 w-4/5 animate-pulse rounded bg-[var(--color-bg-input)]" />

                        <div className="h-3 w-full animate-pulse rounded bg-[var(--color-bg-input)]" />

                        <div className="h-3 w-2/3 animate-pulse rounded bg-[var(--color-bg-input)]" />

                        <div className="flex gap-2 pt-2">
                            <div className="h-7 w-7 animate-pulse rounded-full bg-[var(--color-bg-input)]" />
                            <div className="h-7 w-24 animate-pulse rounded bg-[var(--color-bg-input)]" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <main className="relative min-h-screen overflow-hidden bg-[var(--color-bg)]">

            {/* ─────────────────────────────────────
                AMBIENT BACKGROUND
            ───────────────────────────────────── */}

            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] overflow-hidden">
                <div className="absolute left-1/2 top-[-250px] h-[520px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/[0.07] blur-[120px]" />

                <div className="absolute right-[-100px] top-[100px] h-[280px] w-[280px] rounded-full bg-violet-500/[0.045] blur-[100px]" />
            </div>

            {/* ─────────────────────────────────────
                RATE LIMIT
            ───────────────────────────────────── */}

            <RateLimitModal
                isOpen={!!rateLimitMsg}
                onClose={() => setRateLimitMsg("")}
                message={rateLimitMsg}
            />

            {/* ─────────────────────────────────────
                TOP DISCOVERY HEADER
            ───────────────────────────────────── */}

            <section className="border-b border-[var(--color-border)]">
                <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">

                    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

                        <div className="max-w-2xl">

                            {/* Context */}
                            <div className="mb-4 flex items-center gap-2">
                                {q ? (
                                    <>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                                            <Search size={15} />
                                        </div>

                                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">
                                            Search results
                                        </span>
                                    </>
                                ) : tag ? (
                                    <>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600">
                                            <TrendingUp size={15} />
                                        </div>

                                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-violet-600">
                                            Topic
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                                            <Sparkles size={15} />
                                        </div>

                                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">
                                            {user
                                                ? `Welcome back, ${
                                                      user.name?.split(" ")[0]
                                                  }`
                                                : "Discover"}
                                        </span>
                                    </>
                                )}
                            </div>

                            <h1 className="text-3xl font-bold tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                                {q ? (
                                    <>
                                        Results for{" "}
                                        <span className="text-[var(--color-text-secondary)]">
                                            "{q}"
                                        </span>
                                    </>
                                ) : tag ? (
                                    <>
                                        Explore{" "}
                                        <span className="text-[var(--color-text-secondary)]">
                                            #{tag}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        {greeting}
                                    </>
                                )}
                            </h1>

                            <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--color-text-secondary)]">
                                {q || tag
                                    ? "Explore stories matching your interests."
                                    : "Discover thoughtful articles, fresh ideas and writers worth following."}
                            </p>
                        </div>

                        <Link
                            to={user ? "/create-post" : "/register"}
                            className="btn-primary group shrink-0 rounded-xl px-5 py-3 text-sm"
                        >
                            <Plus size={17} />
                            Write a Post
                            <ArrowRight
                                size={14}
                                className="transition-transform group-hover:translate-x-0.5"
                            />
                        </Link>
                    </div>

                    {/* ─────────────────────────────
                        TRENDING
                    ───────────────────────────── */}

                    {trendingTags.length > 0 && (
                        <div className="mt-9 flex items-center gap-3 overflow-x-auto scrollbar-hide">
                            <div className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)]">
                                <TrendingUp size={14} />
                                Trending
                            </div>

                            <div className="h-4 w-px shrink-0 bg-[var(--color-border)]" />

                            {tag && (
                                <button
                                    onClick={() => navigate("/home")}
                                    className="flex shrink-0 items-center gap-1 rounded-full bg-[var(--color-primary)] px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
                                >
                                    #{tag}
                                    <X size={12} />
                                </button>
                            )}

                            {trendingTags
                                .filter((t) => t !== tag)
                                .map((t) => (
                                    <button
                                        key={t}
                                        onClick={() =>
                                            navigate(`/home?tag=${t}`)
                                        }
                                        className="tag shrink-0 rounded-full px-3 py-1.5"
                                    >
                                        #{t}
                                    </button>
                                ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ─────────────────────────────────────
                FEED
            ───────────────────────────────────── */}

            <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

                {/* Tabs */}
                <div className="mb-8 flex items-center justify-between gap-4 border-b border-[var(--color-border)]">

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() =>
                                handleTabChange(TABS.FOR_YOU)
                            }
                            className={`relative flex items-center gap-2 px-4 py-3 text-sm font-semibold transition ${
                                activeTab === TABS.FOR_YOU
                                    ? "text-[var(--color-primary)]"
                                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                            }`}
                        >
                            <TrendingUp size={16} />

                            For You

                            {activeTab === TABS.FOR_YOU && (
                                <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-[var(--color-primary)]" />
                            )}
                        </button>

                        {user && (
                            <button
                                onClick={() =>
                                    handleTabChange(TABS.FOLLOWING)
                                }
                                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-semibold transition ${
                                    activeTab === TABS.FOLLOWING
                                        ? "text-[var(--color-primary)]"
                                        : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                                }`}
                            >
                                <Users size={16} />

                                Following

                                {activeTab === TABS.FOLLOWING && (
                                    <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-[var(--color-primary)]" />
                                )}
                            </button>
                        )}
                    </div>

                    {(q || tag) && (
                        <button
                            onClick={() => navigate("/home")}
                            className="mb-1 flex items-center gap-1.5 text-xs font-medium text-[var(--color-primary)] hover:underline"
                        >
                            Clear filter
                            <X size={13} />
                        </button>
                    )}
                </div>

                {/* Loading */}
                {loading && posts.length === 0 && <Skeleton />}

                {/* Posts */}
                {posts.length > 0 && (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {posts.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                                currentUserId={user?._id}
                                bookmarks={user?.bookmarks}
                                onLike={user ? toggleLike : undefined}
                                onBookmark={user ? toggleSave : undefined}
                                showActions={false}
                            />
                        ))}
                    </div>
                )}

                {/* ─────────────────────────────
                    EMPTY STATE
                ───────────────────────────── */}

                {posts.length === 0 && !loading && (
                    <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-6 py-20 text-center">

                        <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-72 -translate-x-1/2 rounded-full bg-blue-500/[0.06] blur-[80px]" />

                        <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                            {activeTab === TABS.FOLLOWING ? (
                                <Users size={23} />
                            ) : q || tag ? (
                                <Search size={23} />
                            ) : (
                                <Inbox size={23} />
                            )}
                        </div>

                        <h3 className="relative mt-5 text-base font-bold">
                            {activeTab === TABS.FOLLOWING
                                ? "Your following feed is empty"
                                : q
                                ? `Nothing matched "${q}"`
                                : tag
                                ? `No stories tagged #${tag} yet`
                                : "No stories to show yet"}
                        </h3>

                        <p className="relative mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--color-text-muted)]">
                            {activeTab === TABS.FOLLOWING
                                ? "Follow writers you enjoy to fill your feed with their stories."
                                : q || tag
                                ? "Try another search or browse all stories."
                                : "Be the first to share something with the community."}
                        </p>

                        {activeTab === TABS.FOLLOWING ? (
                            <button
                                onClick={() =>
                                    handleTabChange(TABS.FOR_YOU)
                                }
                                className="relative mt-6 text-sm font-semibold text-[var(--color-primary)] hover:underline"
                            >
                                Explore all stories
                            </button>
                        ) : q || tag ? (
                            <button
                                onClick={() => navigate("/home")}
                                className="relative mt-6 text-sm font-semibold text-[var(--color-primary)] hover:underline"
                            >
                                Clear filter
                            </button>
                        ) : user ? (
                            <Link
                                to="/create-post"
                                className="btn-primary relative mt-6 inline-flex rounded-xl px-5 py-2.5 text-sm"
                            >
                                <PenLine size={15} />
                                Write the first story
                            </Link>
                        ) : null}
                    </div>
                )}

                {/* ─────────────────────────────
                    LOAD MORE
                ───────────────────────────── */}

                {page < totalPages && (
                    <div className="flex justify-center pt-10">
                        <button
                            onClick={() => loadPosts(page + 1)}
                            disabled={loading}
                            className="btn-ghost rounded-xl px-6 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Loading..." : "Load more"}
                            {!loading && <ArrowRight size={14} />}
                        </button>
                    </div>
                )}

                {/* Bottom discovery hint */}
                {posts.length > 0 && page >= totalPages && (
                    <div className="mt-14 flex items-center justify-center gap-2 text-xs text-[var(--color-text-muted)]">
                        <Sparkles size={13} />
                        You've reached the end of your feed
                    </div>
                )}
            </section>
        </main>
    );
};

export default Home;