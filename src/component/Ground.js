import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import Grass from "./Grass";
import Cow from "./Cow";
import UFO from "./UFO";
import Circle from "./Circle";
import Farm from "./Farm";
import Tractor from "./Tractor";
import Bird from "./Bird";
import Lanscape from "./Lanscape";

// Hằng số cho tham chiếu
const ROTATION = [-Math.PI / 2, 0, 0];

const Ground = () => {
  const meshRef = useRef();
  const lightConeRef = useRef(null);

  // Định nghĩa và sử dụng lại geometry và material
  const planeGeometry = useMemo(() => new THREE.PlaneGeometry(8000, 8000), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#4eaf5d", // Sử dụng màu xanh lá cây hơi đậm hơn
        roughness: 0.8,
        metalness: 0.1,
        side: THREE.FrontSide,
      }),
    []
  );

  return (
    <>
      <ambientLight intensity={0.5} /> {/* Thêm ánh sáng môi trường */}
      <directionalLight position={[10, 10, 5]} intensity={0.7} castShadow />
      <mesh ref={meshRef} rotation={ROTATION} receiveShadow>
        <primitive object={planeGeometry} />
        <primitive object={material} />
        <Grass />
        <Circle />
        <Tractor />
        <Lanscape />
        <Farm />
        <Bird />
        <Cow lightConeRef={lightConeRef} />
        <UFO lightConeRef={lightConeRef} />
      </mesh>
    </>
  );
};

export default Ground;
