import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import {
  MdLightMode,
  MdDarkMode,
  MdMenu,
  MdClose,
  MdSearch,
  MdLogout,
} from "react-icons/md";
import { searchUsers } from "../services/api";
import Logo from "../components/Logo";

const SearchBar = ({
  mobile = false,
  searchRef,
  searchMode,
  q,
  setQ,
  handleSearch,
  handleModeChange,
  peopleResults,
  showDropdown,
  searchLoading,
  setShowDropdown,
}) => (
  <div
    ref={mobile ? null : searchRef}
    className={`relative ${mobile ? "w-full" : "w-full max-w-[420px]"}`}
  >
    <div className="flex h-10 items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] p-1 shadow-sm transition-all focus-within:border-[var(--color-text-primary)] focus-within:bg-[var(--color-bg-card)]">
      <div className="flex h-full w-[118px] shrink-0 items-center rounded-md bg-[var(--color-bg-hover)] p-0.5">
        {["posts", "people"].map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => handleModeChange(mode)}
            className={`flex h-full flex-1 items-center justify-center rounded-[5px] px-2 text-[11px] font-semibold tracking-[-0.01em] transition-all duration-200 ${
              searchMode === mode
                ? "bg-[var(--color-bg-card)] text-[var(--color-text-primary)] shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {mode === "posts" ? "Posts" : "People"}
          </button>
        ))}
      </div>

      <div className="relative flex min-w-0 flex-1 items-center">
        <MdSearch
          size={16}
          className="pointer-events-none absolute left-3 text-[var(--color-text-muted)]"
        />

        <input
          type="text"
          placeholder={
            searchMode === "people" ? "Search people..." : "Search articles..."
          }
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={handleSearch}
          onFocus={() => {
            if (searchMode === "people" && peopleResults.length > 0) {
              setShowDropdown(true);
            }
          }}
          className="h-8 w-full bg-transparent pl-9 pr-3 text-[13px] font-medium text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
        />
      </div>

      <div className="hidden shrink-0 pr-2 sm:block">
        <kbd className="grid h-6 min-w-6 place-items-center rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] px-1.5 text-[10px] font-medium text-[var(--color-text-muted)] shadow-sm">
          /
        </kbd>
      </div>
    </div>

    {searchMode === "people" && showDropdown && (
      <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[100] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] shadow-[var(--shadow-dropdown)]">
        {searchLoading ? (
          <div className="px-4 py-4 text-xs text-[var(--color-text-muted)]">
            Searching...
          </div>
        ) : peopleResults.length === 0 ? (
          <div className="px-4 py-4 text-xs text-[var(--color-text-muted)]">
            No users found
          </div>
        ) : (
          peopleResults.slice(0, 6).map((u) => (
            <Link
              key={u._id}
              to={`/user/${u.username}`}
              onClick={() => {
                setShowDropdown(false);
                setQ("");
              }}
              className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3 last:border-0 hover:bg-[var(--color-bg-hover)]"
            >
              <img
                src={u.profile_img}
                alt={u.username}
                className="h-8 w-8 shrink-0 rounded-full object-cover"
              />

              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-[var(--color-text-primary)]">
                  {u.name}
                </p>
                <p className="truncate text-[11px] text-[var(--color-text-muted)]">
                  @{u.username}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    )}
  </div>
);

const Navbar = () => {
  const { isLoggedIn, Logout, user } = useAuth();
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [searchMode, setSearchMode] = useState("posts");
  const [peopleResults, setPeopleResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef(null);

  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  const toggleDark = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    setDark(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (searchMode !== "people" || !q.trim()) {
      setPeopleResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);

      try {
        const data = await searchUsers(q.trim());
        setPeopleResults(data.users || []);
        setShowDropdown(true);
      } catch {
        setPeopleResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [q, searchMode]);

  const handleSearch = (e) => {
    if (e.key !== "Enter" || !q.trim()) return;

    e.preventDefault();

    if (searchMode === "posts") {
      navigate(`/home?q=${q}`);
      setShowDropdown(false);
    }
  };

  const handleModeChange = (mode) => {
    setSearchMode(mode);
    setQ("");
    setPeopleResults([]);
    setShowDropdown(false);
  };

  const searchBarProps = {
    searchRef,
    searchMode,
    q,
    setQ,
    handleSearch,
    handleModeChange,
    peopleResults,
    showDropdown,
    searchLoading,
    setShowDropdown,
  };

  const navClass = ({ isActive }) =>
    `relative px-2 py-1 text-[13px] font-medium tracking-[-0.01em] transition-colors ${
      isActive
        ? "text-[var(--color-text-primary)]"
        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--color-nav-border)] bg-[var(--color-nav-bg)]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[62px] max-w-[1280px] items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden flex-1 justify-center md:flex">
          <SearchBar {...searchBarProps} />
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <div className="flex items-center gap-1">
            <NavLink to="/home" className={navClass}>
              Home
            </NavLink>


            {isLoggedIn && user && (
              <>
                <NavLink to="/create-post" className={navClass}>
                  Create
                </NavLink>

                <NavLink to="/profile" className={navClass}>
                  Profile
                </NavLink>
              </>
            )}
          </div>

          <div className="h-4 w-px bg-[var(--color-nav-border)]" />

          <button
            type="button"
            onClick={toggleDark}
            className="grid h-8 w-8 place-items-center rounded-md text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
            aria-label="Toggle theme"
          >
            {dark ? <MdLightMode size={17} /> : <MdDarkMode size={17} />}
          </button>

          {isLoggedIn && user ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  Logout();
                  navigate("/login");
                }}
                className="text-[13px] font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
              >
                Logout
              </button>

              <NavLink
                to="/profile"
                className="group relative flex h-8 w-8 overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-avatar-bg)] transition-colors hover:border-[var(--color-text-primary)]"
              >
                <img
                  src={user.profile_img}
                  alt={user.name || "Profile"}
                  className="h-full w-full object-cover"
                />
              </NavLink>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <NavLink
                to="/login"
                className="text-[13px] font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="rounded-md bg-[var(--color-primary)] px-3.5 py-2 text-[12px] font-semibold text-[var(--color-text-inverse)] transition-opacity hover:opacity-85"
              >
                Get started
              </NavLink>
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1 md:hidden">
          <button
            type="button"
            onClick={toggleDark}
            className="grid h-9 w-9 place-items-center rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
          >
            {dark ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
          </button>

          {isLoggedIn && user && (
            <NavLink
              to="/profile"
              className="ml-1 h-8 w-8 overflow-hidden rounded-full border border-[var(--color-border)]"
            >
              <img
                src={user.profile_img}
                alt={user.name || "Profile"}
                className="h-full w-full object-cover"
              />
            </NavLink>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="ml-1 grid h-9 w-9 place-items-center rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
          >
            {menuOpen ? <MdClose size={21} /> : <MdMenu size={21} />}
          </button>
        </div>
      </div>

      <div className="border-t border-[var(--color-nav-border)] bg-[var(--color-nav-bg)] px-4 py-3 md:hidden">
        <SearchBar {...searchBarProps} mobile />
      </div>

      {menuOpen && (
        <div className="border-t border-[var(--color-nav-border)] bg-[var(--color-nav-bg)] md:hidden">
          <div className="mx-auto max-w-[1280px] px-5 py-2">
            <NavLink
              to="/home"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between border-b border-[var(--color-nav-border)] py-4 text-[14px] font-medium ${
                  isActive
                    ? "text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-secondary)]"
                }`
              }
            >
              Home
              <span className="text-[var(--color-text-muted)]">→</span>
            </NavLink>

        

            {isLoggedIn && user ? (
              <>
                <NavLink
                  to="/create-post"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between border-b border-[var(--color-nav-border)] py-4 text-[14px] font-medium ${
                      isActive
                        ? "text-[var(--color-text-primary)]"
                        : "text-[var(--color-text-secondary)]"
                    }`
                  }
                >
                  Create
                  <span className="text-[var(--color-text-muted)]">→</span>
                </NavLink>

                <NavLink
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between border-b border-[var(--color-nav-border)] py-4 text-[14px] font-medium ${
                      isActive
                        ? "text-[var(--color-text-primary)]"
                        : "text-[var(--color-text-secondary)]"
                    }`
                  }
                >
                  Profile
                  <span className="text-[var(--color-text-muted)]">→</span>
                </NavLink>

                <button
                  type="button"
                  onClick={() => {
                    Logout();
                    setMenuOpen(false);
                    navigate("/login");
                  }}
                  className="flex w-full items-center justify-between py-4 text-left text-[14px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  Logout
                  <MdLogout size={17} />
                </button>
              </>
            ) : (
              <div className="flex gap-3 py-4">
                <NavLink
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-md border border-[var(--color-border)] px-4 py-2.5 text-center text-[13px] font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-md bg-[var(--color-primary)] px-4 py-2.5 text-center text-[13px] font-semibold text-[var(--color-text-inverse)] hover:opacity-85"
                >
                  Get started
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
