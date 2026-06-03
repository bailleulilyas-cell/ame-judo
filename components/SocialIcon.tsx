import { SOCIAL_PLATFORMS, type SocialPlatform } from "@/lib/socials";

export default function SocialIcon({
  platform,
  size = 20,
}: {
  platform: SocialPlatform;
  size?: number;
}) {
  const p = SOCIAL_PLATFORMS[platform];
  if (!p) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      aria-label={p.label}
    >
      <path d={p.path} />
    </svg>
  );
}
