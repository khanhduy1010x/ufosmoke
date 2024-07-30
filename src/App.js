import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Stage, Sky } from "@react-three/drei";
import Ground from "./component/Ground.js";

function App() {
  return (
    <Suspense fallback={null}>
      <Canvas style={{ width: "100%", height: "100%", position: "absolute" }}>
        <Stage>
          <Sky
            distance={5000}
            sunPosition={[100, 10, -1000]}
            inclination={0}
            azimuth={0.25}
          />
          <Ground />
        </Stage>
      </Canvas>
    </Suspense>
  );
}

export default App;
