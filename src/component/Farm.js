import React from "react";
import { useGLTF } from "@react-three/drei";


const Farm = () => {
  const { scene } = useGLTF("../model3D/Farm.glb");
  return (
    <primitive
    rotation={[Math.PI / 2, 0, 0]} 
      object={scene}
      position={[400,900,0]}
      scale={1}
    />
  );
};
export default Farm;