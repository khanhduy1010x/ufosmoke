import React, { useRef } from "react";
import {} from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

const generateRandomPosition = (range) => {
  return [
    Math.random() * range - range / 2,
    Math.random() * range - range / 2,
    0,
  ];
};

const Cow = ({ lightConeRef }) => {
  const group = useRef();
  const models = [
    { path: "../model3D/Cow.glb", scale: [6, 6, 6], type: "cow", z: 0 },
    { path: "../model3D/Tractor.glb", scale: [6, 6, 6], type: "tractor", z: 0 },
    { path: "../model3D/Hen.glb", scale: [0.5, 0.5, 0.5], type: "hen", z: 30 },
    { path: "../model3D/GOAT.glb", scale: [2, 2, 2], type: "GOAT", z: 0 },
    { path: "../model3D/Pig.glb", scale: [10, 10, 10], type: "GOAT", z: 0 },
    { path: "../model3D/Duck.glb", scale: [10, 10, 10], type: "hen", z: 30 },
    { path: "../model3D/Worker.glb", scale: [10, 10, 10], type: "GOAT", z: 0 }


  ];

  const gltfModels = useLoader(
    GLTFLoader,
    models.map((model) => model.path)
  );

  const getRandomModel = () => {
    const randomIndex = Math.floor(Math.random() * gltfModels.length);
    const modelData = models[randomIndex];
    const model = gltfModels[randomIndex].scene.clone();
    return {
      model,
      scale: modelData.scale,
      type: modelData.type,
      z: modelData.z,
    };
  };

  const cowInstances = Array.from({ length: 25 }, () => {
    const { model, scale, type, z } = getRandomModel();
    const position = generateRandomPosition(4000);
    position[2] = z;
    return {
      model,
      position,
      scale,
      rotation: [Math.PI / 2, 0, 0],
      isBeingLifted: false,
      type,
      offset: new THREE.Vector3(),
    };
  });
  const time = useRef(0);
  useFrame(() => {
    time.current += 0.05;

    cowInstances.forEach((cow, index) => {
      const instance = group.current.children[index];
      if (instance) {
        if (lightConeRef.current) {
          const lightConePosition = lightConeRef.current.clone();
          const temp = lightConePosition.y;
          lightConePosition.y = lightConePosition.z;
          lightConePosition.z = temp;
          lightConePosition.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);

          const cowPosition = new THREE.Vector3().setFromMatrixPosition(
            instance.matrixWorld
          );

          const distanceX = Math.abs(cowPosition.x - lightConePosition.x);
          lightConePosition.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
          const distanceY = Math.abs(cowPosition.z + lightConePosition.y);

          console.log(
            `Cow Position: ${cowPosition.x},${cowPosition.z}, ${cowPosition.y}`
          );
          console.log(
            `Light Cone Position: ${lightConePosition.x}, ${lightConePosition.y}, ${lightConePosition.z}`
          );
          console.log(`Distance X: ${distanceX}, Distance Y: ${distanceY}`);
          lightConePosition.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);

          if (distanceX < 50 && distanceY < 50) {
            cow.isBeingLifted = true;
            if (instance.position.z < 140) {
              if (instance.position.z - 120 > 0) {
                instance.position.z += 0;
                instance.position.x = lightConePosition.x;
                instance.position.y = lightConePosition.y;
              } else {
                instance.position.z += 4;
              }
            } else {
              cow.isBeingLifted = false;
            }
          } else {
            cow.isBeingLifted = false;
          }

        
        } else {
          cow.isBeingLifted = false;
        }
        if (!cow.isBeingLifted && instance.position.z > 0) {
          if (cow.type === "hen" && instance.position.z > 30) {
            instance.position.z -= 4;
          } else if (cow.type !== "hen" && instance.position.z > 0) {
            instance.position.z -= 4;
          }
          const firtsTemp = cow.type === "hen" ? 32 : 15;
          const tempDistance = cow.type === "hen" ? 35 : 30;
          if (instance.position.z > firtsTemp && instance.position.z < tempDistance) {
            instance.position.x += (Math.random() - 0.5) * 50;
            instance.position.y += (Math.random() - 0.5) * 50;
          }
        }
        instance.rotation.z = Math.cos(time.current) * 0.2;
      }
    });
  });

  return (
    <>
      <group ref={group} dispose={null}>
        {cowInstances.map((props, index) => {
          return (
            <primitive
              key={index}
              object={props.model}
              scale={props.scale}
              rotation={props.rotation}
              position={props.position}
            />
          );
        })}
      </group>
    </>
  );
};

export default Cow;
