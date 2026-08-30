import { Floor } from "./Floor";
import { Lights } from "./Lights";
import { CameraRig } from "./CameraRig";

export function Stage() {
  return (
    <>
      <CameraRig />
      <Lights />
      <Floor />
    </>
  );
}
export default Stage;
