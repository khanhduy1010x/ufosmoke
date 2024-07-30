import React from "react";
import { useGLTF } from "@react-three/drei";

const Tractor = () => {
  const { scene } = useGLTF("../model3D/Tractor.glb");
  return (
    <primitive
    rotation={[Math.PI / 2, 0, 0]} 
      object={scene}
      position={[100,900,0]}
      scale={5}
    />
  );
};
export default Tractor;