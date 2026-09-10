import { BRAND } from "@/config/site";

export function YouTubeGlyph({ size = 20 }: { size?: number }) {
  return (
    <img
      src={BRAND.youtubeIcon}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className="shrink-0"
    />
  );
}
