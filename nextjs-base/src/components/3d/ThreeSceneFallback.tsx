interface ThreeSceneFallbackProps {
  title?: string;
  description?: string;
}

const ThreeSceneFallback = ({
  title = "3D experience loading",
  description = "Preparing interactive scene.",
}: ThreeSceneFallbackProps) => {
  return (
    <div className="flex min-h-[420px] w-full items-center justify-center rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_55%),linear-gradient(160deg,_#0d1726,_#18263d)] p-8 text-center text-white">
      <div className="max-w-md space-y-3">
        <div className="mx-auto h-16 w-16 animate-pulse rounded-full border border-white/20 bg-white/10" />
        <h3 className="h5">{title}</h3>
        <p className="small text-white/70">{description}</p>
      </div>
    </div>
  );
};

export default ThreeSceneFallback;
