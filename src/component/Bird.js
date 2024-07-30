import React, { useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const generateRandomPosition = (range) => {
  return [
    Math.random() * range - range / 2,
    Math.random() * range - range / 2,
    400,
  ];
};

const generateRandomScale = () => {
  const scale = Math.random() * 20 + 20;
  return [scale, scale, scale];
};

const generateRandomDirection = () => {
  const direction = new THREE.Vector3(
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
    Math.random() * 2 - 1
  );
  direction.normalize();
  return direction;
};

const Bird = () => {
  const group = useRef();
  const { scene } = useGLTF('../model3D/Bird.glb');

  const [birdInstances] = useState(() =>
    Array.from({ length: 50 }, () => ({
      position: generateRandomPosition(4000),
      scale: generateRandomScale(),
      rotation: [Math.PI / 2, 0, 0],
      direction: generateRandomDirection(),
    }))
  );

  useFrame(() => {
    birdInstances.forEach((bird, index) => {
      const instance = group.current.children[index];
      if (instance) {
        bird.position[0] += bird.direction.x * 1; 
        bird.position[1] += bird.direction.y * 1;
        bird.position[2] += bird.direction.z * 1;

        if (Math.abs(bird.position[0]) > 1000) {
          bird.direction.x *= -1;
        }
        if (Math.abs(bird.position[1]) > 1000) {
          bird.direction.y *= -1; 
        }
        if (bird.position[2] < 400 || bird.position[2] > 500) {
          bird.direction.z *= -1; 
        }

        instance.position.set(bird.position[0], bird.position[1], bird.position[2]);
      }
    });
  });

  return (
    <group ref={group} dispose={null}>
      {birdInstances.map((props, index) => {
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

export default Bird;
