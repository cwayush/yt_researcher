import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { NavItem } from "@/components/layout/NavItem";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { APP_NAME } from "@/lib/constants";
import { NAV_ITEMS, ROUTES } from "@/routes/paths";

interface NavbarProps {
  videoTitle?: string;
  onBack?: () => void;
}

export function Navbar({ videoTitle }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }
    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setMobileOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [mobileOpen]);

  return (
    <div
      ref={containerRef}
      className="sticky top-0 z-50 flex w-full justify-center bg-transparent px-4 pt-4 pb-2"
    >
      <nav className="rounded-panel border-border bg-surface flex min-h-13 w-full max-w-page items-center justify-between gap-4 border px-5 py-2.5">
        <div className="flex min-w-0 shrink-0 items-center gap-1">
          <Link
            to={ROUTES.home}
            aria-label={`${APP_NAME}, home`}
            className="rounded-control focus-visible:outline-primary-accent flex items-center focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <Logo />
          </Link>
        </div>

        {videoTitle && (
          <p
            className="text-foreground-muted hidden max-w-64 truncate px-2 text-xs font-medium md:block"
            title={videoTitle}
          >
            {videoTitle}
          </p>
        )}

        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} to={item.to} end={item.end}>
              {item.label}
            </NavItem>
          ))}
          <ThemeToggle className="ml-1" />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="text-foreground-muted hover:text-foreground rounded-control focus-visible:outline-primary-accent cursor-pointer p-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="animate-fade-rise rounded-panel border-border bg-surface absolute inset-x-4 top-full z-40 flex flex-col gap-1 border p-3 md:hidden">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              end={item.end}
              block
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </NavItem>
          ))}
        </div>
      )}
    </div>
  );
}
