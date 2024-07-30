import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Grass from './Grass';
import Cow from './Cow';
import UFO from './UFO';
import Circle from './Circle';
import Farm from './Farm';
import Tractor from './Tractor';
import Bird from './Bird';
import Lanscape from './Lanscape';

const Ground = () => {
  const meshRef = useRef();
  const lightConeRef = useRef(null);

  useFrame(() => {
    if (meshRef.current) {
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[8000, 8000]} />
      <meshBasicMaterial color="lightgreen" side={THREE.FrontSide} />
      <Grass />
      <Circle/>
      <Tractor/>
      <Lanscape/>
      <Farm/>
      <Bird/>
      <Cow lightConeRef={lightConeRef} />
      <UFO lightConeRef={lightConeRef} />
    </mesh>
  );
};

export default Ground;
