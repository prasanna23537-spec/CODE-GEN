import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Code2, Moon, Sun, Menu, X, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive(path) ? "text-primary" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo-new.png"
            alt="CodeGenie Logo"
            width={36}
            height={36}
            style={{ objectFit: 'cover', borderRadius: '8px' }}
          />
          <span className="text-lg font-bold">CodeGenie</span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">AI</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {!isAuthenticated ? (
            <>
              <Link to="/#features" className={navLinkClass("/#features")}>Features</Link>
              <Link to="/pricing" className={navLinkClass("/pricing")}>Pricing</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                <span className="flex items-center gap-1"><LayoutDashboard className="h-4 w-4" /> Dashboard</span>
              </Link>
              <Link to="/generate" className={navLinkClass("/generate")}>Generate</Link>
              <Link to="/history" className={navLinkClass("/history")}>History</Link>
              {user?.role === "admin" && (
                <Link to="/admin" className={navLinkClass("/admin")}>
                  <span className="flex items-center gap-1"><Shield className="h-4 w-4" /> Admin</span>
                </Link>
              )}
            </>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {!isAuthenticated ? (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
              <Link to="/register"><Button variant="hero" size="sm">Sign up free</Button></Link>
            </>
          ) : (
            <>
              <Link to="/profile">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border/50 bg-card px-4 py-4 md:hidden animate-slide-up">
          <div className="flex flex-col gap-3">
            {!isAuthenticated ? (
              <>
                <Link to="/pricing" className="text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>Pricing</Link>
                <Link to="/login" onClick={() => setMobileOpen(false)}><Button variant="ghost" className="w-full">Log in</Button></Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}><Button variant="hero" className="w-full">Sign up free</Button></Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="text-sm" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <Link to="/generate" className="text-sm" onClick={() => setMobileOpen(false)}>Generate</Link>
                <Link to="/history" className="text-sm" onClick={() => setMobileOpen(false)}>History</Link>
                <Link to="/profile" className="text-sm" onClick={() => setMobileOpen(false)}>Profile</Link>
                {user?.role === "admin" && (
                  <Link to="/admin" className="text-sm" onClick={() => setMobileOpen(false)}>Admin</Link>
                )}
                <Button variant="ghost" onClick={() => { handleLogout(); setMobileOpen(false); }}>Log out</Button>
              </>
            )}
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="justify-start">
              {theme === "dark" ? <><Sun className="mr-2 h-4 w-4" /> Light mode</> : <><Moon className="mr-2 h-4 w-4" /> Dark mode</>}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
