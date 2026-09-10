import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItemProps {
  to: string;
  end?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  block?: boolean;
}

export function NavItem({ to, end, children, onClick, block }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "rounded-control px-3 py-1.5 text-sm font-medium transition-colors duration-150",
          "focus-visible:outline-primary-accent focus-visible:outline-2 focus-visible:outline-offset-2",
          block ? "block w-full text-left" : "inline-flex items-center",
          isActive
            ? "bg-surface-muted text-foreground"
            : "text-foreground-soft hover:bg-surface-muted/60 hover:text-foreground"
        )
      }
    >
      {children}
    </NavLink>
  );
}
