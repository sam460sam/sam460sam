import "./index.css";
import { Composition, Still } from "remotion";
import { Cover } from "./Cover";
import { Reel, reelSchema } from "./Reel";
import { A, B_TOTAL, FPS } from "./timing";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="TwinbyteA" component={Reel} schema={reelSchema} durationInFrames={A.total} fps={FPS} width={1080} height={1920}
      defaultProps={{ variant: "A" as const, showSafeZones: false, showCaptions: true, previewAudio: true }} />
    <Composition id="TwinbyteB" component={Reel} schema={reelSchema} durationInFrames={B_TOTAL} fps={FPS} width={1080} height={1920}
      defaultProps={{ variant: "B" as const, showSafeZones: false, showCaptions: true, previewAudio: true }} />
    <Still id="Cover" component={Cover} width={1080} height={1920} defaultProps={{ showSafeZones: false }} />
  </>
);
