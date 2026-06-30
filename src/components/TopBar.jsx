import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function TopBar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [stats, setStats] = useState(null);

  const activeClass =
    "text-secondary font-bold border-b border-secondary font-label-mono text-xs px-xs transition-colors duration-150 ease-in-out";
  const inactiveClass =
    "text-on-surface-variant font-medium font-label-mono text-xs px-xs hover:bg-surface-bright hover:text-on-surface transition-colors duration-150 ease-in-out";

  const toggleMenu = () => setIsMobileOpen((prev) => !prev);
  const closeMenu = () => setIsMobileOpen(false);

  useEffect(() => {
    fetch("/homelab-stats.json")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => setStats(data))
      .catch(() => setStats(null));
  }, []);

  return (
    <>
      <header className="bg-surface-container border-b border-outline-variant flex items-center justify-between w-full px-margin-desktop py-sm sticky top-0 z-50">
        <div className="flex items-center gap-md">
          <div className="font-label-mono text-headline-md font-bold text-accent-blue uppercase tracking-tighter">
            EDMR.DEV
          </div>
          <div className="hidden md:block h-4 w-px bg-outline-variant"></div>
          <div className="hidden md:block font-label-mono text-sm text-on-surface-variant tracking-widest">
            HOMELAB MONITOR
          </div>
        </div>

        <nav className="hidden lg:flex gap-lg items-center">
          <NavLink
            to="/"
            end
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? activeClass : inactiveClass
            }
          >
            DASHBOARD
          </NavLink>
          <NavLink
            to="/services"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? activeClass : inactiveClass
            }
          >
            SERVICIOS
          </NavLink>
        </nav>

        <div className="flex items-center gap-md">
          <span className="font-label-mono text-xs text-on-surface-variant inline">
            SYNCED:{" "}
            {stats?.timestamp
              ? new Date(stats.timestamp).toLocaleTimeString("es-CO", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })
              : "--:--:--"}
          </span>
          <div className="flex items-center gap-xs bg-surface-container-high px-sm py-0.5 border border-outline-variant">
            <span className="w-1.5 h-1.5 bg-secondary indicator-pulse"></span>
            <span className="font-label-mono text-xs font-bold text-secondary">
              ONLINE
            </span>
          </div>
          <button
            type="button"
            onClick={toggleMenu}
            className="lg:hidden inline-flex items-center justify-center rounded border border-outline-variant bg-surface-container px-3 py-2 text-on-surface hover:bg-surface-bright transition-colors duration-150"
            aria-expanded={isMobileOpen}
            aria-label="Abrir navegación"
          >
            <span className="sr-only">Abrir navegación</span>
            <div className="space-y-1">
              <span className="block h-0.5 w-5 bg-on-surface"></span>
              <span className="block h-0.5 w-5 bg-on-surface"></span>
              <span className="block h-0.5 w-5 bg-on-surface"></span>
            </div>
          </button>
        </div>
      </header>

      {isMobileOpen && (
        <div className="lg:hidden bg-surface-container border-b border-outline-variant px-margin-desktop py-4">
          <nav className="flex flex-col gap-2">
            <NavLink
              to="/"
              end
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive
                  ? "text-secondary font-bold border-b border-secondary font-label-mono text-xs px-xs"
                  : "text-on-surface-variant font-medium font-label-mono text-xs px-xs hover:bg-surface-bright hover:text-on-surface transition-colors duration-150"
              }
            >
              DASHBOARD
            </NavLink>
            <NavLink
              to="/services"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive
                  ? "text-secondary font-bold border-b border-secondary font-label-mono text-xs px-xs"
                  : "text-on-surface-variant font-medium font-label-mono text-xs px-xs hover:bg-surface-bright hover:text-on-surface transition-colors duration-150"
              }
            >
              SERVICIOS
            </NavLink>
          </nav>
        </div>
      )}
    </>
  );
}
