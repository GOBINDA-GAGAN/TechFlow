import { useState } from "react";
import { Createpost } from "../services/api";
import { useNavigate } from "react-router-dom";
import {
    ImagePlus,
    X,
    AlertCircle,
    Sparkles,
    ArrowLeft,
    Send,
    LoaderCircle,
    Hash,
    FileText,
    Check,
    PenLine,
} from "lucide-react";

import RichTextEditor from "../components/RichTextEditor";
import AIAssistMenu from "../components/AIAssistMenu";
import BackButton from "../components/BackButton";

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [img, setImg] = useState(null);
    const [preview, setPreview] = useState(null);
    const [tags, setTags] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [aiContent, setAiContent] = useState(null);

    const navigate = useNavigate();

    const handleImage = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImg(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImg(null);
        setPreview(null);
    };

    const handleAiApply = (html) => {
        setAiContent(html);
        setError("");
    };

    const handleAiApplied = () => {
        setAiContent(null);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setError("");

        if (!title.trim()) {
            setError("Title is required.");
            return;
        }

        const plainText = content.replace(/<[^>]+>/g, "").trim();

        if (!plainText) {
            setError(
                "Content is required. Please write something or use AI Assist to generate content."
            );
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();

            formData.append("title", title);
            formData.append("content", content);

            if (img) {
                formData.append("img", img);
            }

            formData.append("tags", tags);

            const data = await Createpost(formData);

            if (data.success) {
                navigate("/profile");
            } else {
                setError(data.message || "Failed to create post.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const tagList = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 5);

    return (
        <main className="min-h-screen bg-[var(--color-bg)]">

            {/* ─────────────────────────────────────
                TOP BAR
            ───────────────────────────────────── */}

            <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">

                    <div className="flex items-center gap-4">
                        <BackButton />

                        <div className="hidden h-5 w-px bg-[var(--color-border)] sm:block" />

                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                                <FileText size={16} />
                            </div>

                            <div>
                                <p className="text-sm font-semibold">
                                    Create Post
                                </p>

                                <p className="hidden text-[10px] text-[var(--color-text-muted)] sm:block">
                                    Share something worth reading
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={submitHandler}
                        disabled={loading}
                        className="btn-primary rounded-xl px-4 py-2.5 text-xs sm:px-5 sm:text-sm"
                    >
                        {loading ? (
                            <>
                                <LoaderCircle
                                    size={15}
                                    className="animate-spin"
                                />
                                Publishing...
                            </>
                        ) : (
                            <>
                                <Send size={15} />
                                Publish
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* ─────────────────────────────────────
                BACKGROUND ATMOSPHERE
            ───────────────────────────────────── */}

            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute left-[35%] top-[-250px] h-[500px] w-[600px] rounded-full bg-blue-500/[0.035] blur-[130px]" />

                <div className="absolute right-[-150px] top-[35%] h-[400px] w-[400px] rounded-full bg-violet-500/[0.025] blur-[120px]" />
            </div>

            {/* ─────────────────────────────────────
                MAIN WORKSPACE
            ───────────────────────────────────── */}

            <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">

                <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">

                    {/* ═══════════════════════════════
                        EDITOR
                    ═══════════════════════════════ */}

                    <section className="min-w-0">

                        {/* Cover */}
                        <div className="group relative mb-8 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">

                            {preview ? (
                                <div className="relative aspect-[2.2/1] overflow-hidden">
                                    <img
                                        src={preview}
                                        alt="Cover"
                                        className="h-full w-full object-cover"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
                                    >
                                        <X size={16} />
                                    </button>

                                    <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur">
                                        <ImagePlus size={13} />
                                        Cover image
                                    </div>
                                </div>
                            ) : (
                                <label className="flex min-h-[210px] cursor-pointer flex-col items-center justify-center px-5 text-center transition hover:bg-[var(--color-bg-hover)] sm:min-h-[260px]">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-light)] text-[var(--color-primary)] transition group-hover:scale-105">
                                        <ImagePlus size={25} />
                                    </div>

                                    <p className="mt-4 text-sm font-semibold">
                                        Add a cover image
                                    </p>

                                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                                        Make your article visually stand out
                                    </p>

                                    <span className="mt-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-[11px] font-medium text-[var(--color-text-secondary)]">
                                        Optional · Max 2MB
                                    </span>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={handleImage}
                                    />
                                </label>
                            )}
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-6 flex items-start gap-3 rounded-xl border border-[var(--color-error)]/20 bg-[var(--color-error)]/[0.06] px-4 py-3.5 text-sm text-[var(--color-error)]">
                                <AlertCircle
                                    size={18}
                                    className="mt-0.5 shrink-0"
                                />

                                <span>{error}</span>
                            </div>
                        )}

                        {/* Title + Editor */}
                        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">

                            <div className="p-5 sm:p-8 lg:p-10">

                                {/* Title */}
                                <div className="border-b border-[var(--color-border)] pb-6">

                                    <input
                                        type="text"
                                        placeholder="Give your story a title..."
                                        value={title}
                                        maxLength={100}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        className="w-full border-none bg-transparent text-3xl font-bold tracking-[-0.045em] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] sm:text-4xl lg:text-5xl"
                                    />

                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-[11px] text-[var(--color-text-muted)]">
                                            A clear title helps readers know
                                            what to expect.
                                        </span>

                                        <span className="shrink-0 text-[10px] text-[var(--color-text-muted)]">
                                            {title.length}/100
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="pt-6">

                                    <div className="mb-3 flex items-center justify-between">

                                        <div className="flex items-center gap-2">
                                            <PenLine
                                                size={15}
                                                className="text-[var(--color-text-muted)]"
                                            />

                                            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                                                Story
                                            </span>
                                        </div>

                                        <AIAssistMenu
                                            title={title}
                                            content={content}
                                            onApply={handleAiApply}
                                        />
                                    </div>

                                    <RichTextEditor
                                        content={content}
                                        onChange={setContent}
                                        placeholder="Start writing your story..."
                                        externalContent={aiContent}
                                        onExternalApplied={handleAiApplied}
                                    />
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="border-t border-[var(--color-border)] px-5 py-5 sm:px-8 lg:px-10">

                                <div className="flex items-center gap-2">
                                    <Hash
                                        size={15}
                                        className="text-[var(--color-text-muted)]"
                                    />

                                    <label className="text-xs font-semibold">
                                        Tags
                                    </label>

                                    <span className="text-[10px] text-[var(--color-text-muted)]">
                                        Optional
                                    </span>
                                </div>

                                <input
                                    type="text"
                                    placeholder="react, javascript, webdev"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    className="input-field mt-3"
                                />

                                <div className="mt-2 flex items-center justify-between">
                                    <p className="text-[10px] text-[var(--color-text-muted)]">
                                        Add up to 5 comma-separated tags.
                                    </p>

                                    <span className="text-[10px] text-[var(--color-text-muted)]">
                                        {tagList.length}/5
                                    </span>
                                </div>

                                {tagList.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {tagList.map((tag, index) => (
                                            <span
                                                key={`${tag}-${index}`}
                                                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary-light)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-primary)]"
                                            >
                                                #{tag}
                                                <Check size={11} />
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* ═══════════════════════════════
                        SIDE PANEL
                    ═══════════════════════════════ */}

                    <aside className="hidden lg:block lg:sticky lg:top-24">

                        <div className="space-y-4">

                            {/* Publishing */}
                            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">

                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                                        <Send size={14} />
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold">
                                            Publishing
                                        </p>

                                        <p className="text-[10px] text-[var(--color-text-muted)]">
                                            Ready when you are
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-3">

                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-[var(--color-text-muted)]">
                                            Title
                                        </span>

                                        <span
                                            className={
                                                title.trim()
                                                    ? "font-medium text-[var(--color-success)]"
                                                    : "text-[var(--color-text-muted)]"
                                            }
                                        >
                                            {title.trim() ? "Ready" : "Missing"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-[var(--color-text-muted)]">
                                            Content
                                        </span>

                                        <span
                                            className={
                                                content
                                                    .replace(/<[^>]+>/g, "")
                                                    .trim()
                                                    ? "font-medium text-[var(--color-success)]"
                                                    : "text-[var(--color-text-muted)]"
                                            }
                                        >
                                            {content
                                                .replace(/<[^>]+>/g, "")
                                                .trim()
                                                ? "Ready"
                                                : "Missing"}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-[var(--color-text-muted)]">
                                            Cover
                                        </span>

                                        <span className="font-medium text-[var(--color-text-secondary)]">
                                            {preview ? "Added" : "Optional"}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={submitHandler}
                                    disabled={loading}
                                    className="btn-primary mt-6 w-full rounded-xl py-3 text-sm"
                                >
                                    {loading ? (
                                        <>
                                            <LoaderCircle
                                                size={15}
                                                className="animate-spin"
                                            />
                                            Publishing...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={15} />
                                            Publish Post
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* AI */}
                            <div className="relative overflow-hidden rounded-2xl border border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.07] to-violet-500/[0.04] p-5">

                                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-500/10 blur-2xl" />

                                <div className="relative">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-white">
                                        <Sparkles size={15} />
                                    </div>

                                    <p className="mt-4 text-xs font-bold">
                                        Need a little help?
                                    </p>

                                    <p className="mt-1.5 text-[11px] leading-5 text-[var(--color-text-secondary)]">
                                        Use AI Assist to generate, rewrite or
                                        improve your story.
                                    </p>

                                    <div className="mt-4 flex items-center gap-1.5 text-[10px] font-medium text-indigo-600">
                                        <Sparkles size={11} />
                                        AI powered writing
                                    </div>
                                </div>
                            </div>

                            {/* Tip */}
                            <div className="px-2 py-2">
                                <p className="text-[10px] leading-5 text-[var(--color-text-muted)]">
                                    <span className="font-semibold text-[var(--color-text-secondary)]">
                                        Tip:
                                    </span>{" "}
                                    A strong title, useful cover image and a
                                    few relevant tags can make your story easier
                                    to discover.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Mobile publishing button */}
                <div className="mt-6 lg:hidden">
                    <button
                        onClick={submitHandler}
                        disabled={loading}
                        className="btn-primary w-full rounded-xl py-3.5 text-sm"
                    >
                        {loading ? (
                            <>
                                <LoaderCircle
                                    size={16}
                                    className="animate-spin"
                                />
                                Publishing...
                            </>
                        ) : (
                            <>
                                <Send size={16} />
                                Publish Post
                            </>
                        )}
                    </button>
                </div>
            </div>
        </main>
    );
};

export default CreatePost;