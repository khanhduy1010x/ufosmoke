import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
const generateRandomPosition = (range) => {
  return [
    Math.random() * range - range / 2, 
    Math.random() * range - range / 2,
    0

  ];
};

const generateRandomScale = () => {
  const scale = Math.random() * 20 + 20; 
  return [scale, scale, scale];
};

const Grass = () => {
  const group = useRef();
  const { scene } = useGLTF('../model3D/grass.glb');

  const grassInstances = Array.from({ length: 100 }, () => ({
    position: generateRandomPosition(4000),
    scale: generateRandomScale(),
    rotation: [Math.PI/2,0, 0] 
  }));

  return (
    <group ref={group} dispose={null}>
      {grassInstances.map((props, index) => {
        const clonedScene = scene.clone(true);
        return (
          <primitive
            key={index}
            object={clonedScene}
            scale={props.scale}
            rotation={props.rotation}
            position={props.position}
          />
        );
      })}
    </group>
  );
};

export default Grass;
