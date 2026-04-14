import ThreeOrbitShowcaseScene from "@/components/3d/ThreeOrbitShowcaseScene";
import ThreeSceneCanvas from "@/components/3d/ThreeSceneCanvas";
import ThreeSceneFallback from "@/components/3d/ThreeSceneFallback";
import ThreeSceneShell from "@/components/3d/ThreeSceneShell";

interface ThreeDShowcaseProps {
  title?: string;
  description?: string;
}

const ThreeDShowcase = ({
  title = "Interactive 3D showcase",
  description = "Reference block for future /3d-figma output. Replace the scene graph and overlays with frame-specific content.",
}: ThreeDShowcaseProps) => {
  return (
    <ThreeSceneShell
      className="mx-auto w-full max-w-[1400px]"
      overlay={
        <div className="flex h-full items-end p-6 md:p-10">
          <div className="max-w-xl space-y-3 rounded-[1.5rem] bg-black/30 p-5 backdrop-blur-md md:p-7">
            <p className="small uppercase tracking-[0.28em] text-white/60">
              3D Block Scaffold
            </p>
            <h2 className="h2 text-white">{title}</h2>
            <p className="p text-white/72">{description}</p>
          </div>
        </div>
      }
    >
      <ThreeSceneCanvas
        className="h-[420px] w-full md:h-[560px]"
        fallback={<ThreeSceneFallback />}
      >
        <ThreeOrbitShowcaseScene />
      </ThreeSceneCanvas>
    </ThreeSceneShell>
  );
};

export default ThreeDShowcase;
