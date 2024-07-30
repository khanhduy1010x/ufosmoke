import React from "react";
import { useGLTF } from "@react-three/drei";


const Circle = () => {
  const { scene } = useGLTF("../model3D/Circle.glb");
  return (
    <primitive
      object={scene}
      position={[0,0,200]}
      scale={160}
    />
  );
};
export default Circle;