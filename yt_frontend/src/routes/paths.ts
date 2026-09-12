export const ROUTES = {
  home: "/",
  processing: "/processing",
  workspace: "/workspace/:videoId",
  history: "/history",
  howItWorks: "/how-it-works",
} as const;

export function workspacePath(videoId: string): string {
  return `/workspace/${encodeURIComponent(videoId)}`;
}

export interface ProcessingLocationState {
  url: string;
}

export interface NavItemDescriptor {
  label: string;
  to: string;
  end: boolean;
}

export const NAV_ITEMS: NavItemDescriptor[] = [
  { label: "Home", to: ROUTES.home, end: true },
  { label: "History", to: ROUTES.history, end: false },
];
