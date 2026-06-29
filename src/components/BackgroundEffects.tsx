import wallpaperUrl from "../../assets/wallpaper.png";

export default function BackgroundEffects() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-void" aria-hidden="true">
      <img
        src={wallpaperUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-black/85" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_30%,transparent_40%,rgba(0,0,0,0.7)_100%)]" />
    </div>
  );
}
