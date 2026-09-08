import type { Profile } from "@/lib/types";

const SIZE_CLASSES: Record<"sm" | "md" | "lg", string> = {
  sm: "w-8 h-8 text-base",
  md: "w-9 h-9 text-lg",
  lg: "w-20 h-20 text-3xl",
};

export default function Avatar({
  profile,
  size = "md",
  className = "",
}: {
  profile: Pick<Profile, "avatar_url" | "avatar_emoji" | "full_name"> | undefined | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const base = `shrink-0 rounded-xl overflow-hidden flex items-center justify-center bg-slate-50 ${SIZE_CLASSES[size]} ${className}`;

  if (profile?.avatar_url) {
    return (
      <div className={base}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.avatar_url}
          alt={profile.full_name}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return <div className={base}>{profile?.avatar_emoji || "⚽"}</div>;
}
