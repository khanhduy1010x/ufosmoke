import React, { useRef, useState, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const UFO = ({ lightConeRef }) => {
  const group = useRef();
  const ufoRef = useRef();
  const lightConeMesh = useRef();
  const { scene } = useGLTF("../model3D/UFO.glb");
  const [targetRotation, setTargetRotation] = useState([Math.PI / 2, 0, 0]);
  const [position, setPosition] = useState([0, 0, 170]);
  const [lightOn, setLightOn] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const scale = [2, 2, 2];
  const maxTilt = 0.3;
  const { camera } = useThree();
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));
  const pressedKeys = useRef(new Set());

  useEffect(() => {
    const handleKeyDown = (event) => {
      pressedKeys.current.add(event.key);
      setIsMoving(true);
      setTargetRotation((prev) => {
        let newRotation = [...prev];
        if (
          pressedKeys.current.has("ArrowUp") &&
          pressedKeys.current.has("ArrowLeft")
        ) {
          newRotation[0] = Math.max(prev[0] - 0.1, Math.PI / 2 - maxTilt);
          newRotation[1] = prev[1] + 0.2;
        } else if (
          pressedKeys.current.has("ArrowUp") &&
          pressedKeys.current.has("ArrowRight")
        ) {
          newRotation[0] = Math.max(prev[0] - 0.1, Math.PI / 2 - maxTilt);
          newRotation[1] = prev[1] - 0.2;
        } else if (
          pressedKeys.current.has("ArrowDown") &&
          pressedKeys.current.has("ArrowLeft")
        ) {
          newRotation[0] = Math.min(prev[0] + 0.1, Math.PI / 2 + maxTilt);
          newRotation[1] = prev[1] + 0.2;
        } else if (
          pressedKeys.current.has("ArrowDown") &&
          pressedKeys.current.has("ArrowRight")
        ) {
          newRotation[0] = Math.min(prev[0] + 0.1, Math.PI / 2 + maxTilt);
          newRotation[1] = prev[1] - 0.2;
        } else if (pressedKeys.current.has("ArrowUp")) {
          newRotation[0] = Math.max(prev[0] - 0.1, Math.PI / 2 - maxTilt);
          newRotation[1] = prev[1] + 0.2;
        } else if (pressedKeys.current.has("ArrowDown")) {
          newRotation[0] = Math.min(prev[0] + 0.1, Math.PI / 2 + maxTilt);
          newRotation[1] = prev[1] + 0.2;
        } else if (pressedKeys.current.has("ArrowLeft")) {
          newRotation[1] = prev[1] + 0.2;
        } else if (pressedKeys.current.has("ArrowRight")) {
          newRotation[1] = prev[1] - 0.2;
        } else if (event.key === "z") {
          newRotation[0] = Math.min(prev[0] + 0.1);
        } else if (event.key === "x") {
          newRotation[0] = Math.min(prev[0] - 0.1);
        } else if (event.key === "c") {
          newRotation[2] = Math.min(prev[2] + 0.1);
        } else if (event.key === "v") {
          newRotation[2] = Math.min(prev[2] - 0.1);
        }
        return newRotation;
      });

      setPosition((prev) => {
        let newPos = [...prev];
        if (
          pressedKeys.current.has("ArrowUp") &&
          pressedKeys.current.has("ArrowLeft")
        ) {
          newPos[0] = Math.max(newPos[0] - 15, -2000);
          newPos[1] = Math.min(newPos[1] + 15, 2000);
        } else if (
          pressedKeys.current.has("ArrowUp") &&
          pressedKeys.current.has("ArrowRight")
        ) {
          newPos[0] = Math.min(newPos[0] + 15, 2000);
          newPos[1] = Math.min(newPos[1] + 15, 2000);
        } else if (
          pressedKeys.current.has("ArrowDown") &&
          pressedKeys.current.has("ArrowLeft")
        ) {
          newPos[0] = Math.max(newPos[0] - 15, -2000);
          newPos[1] = Math.max(newPos[1] - 15, -2000);
        } else if (
          pressedKeys.current.has("ArrowDown") &&
          pressedKeys.current.has("ArrowRight")
        ) {
          newPos[0] = Math.min(newPos[0] + 15, 2000);
          newPos[1] = Math.max(newPos[1] - 15, -2000);
        } else if (pressedKeys.current.has("ArrowUp")) {
          newPos[1] = Math.min(newPos[1] + 15, 2000);
        } else if (pressedKeys.current.has("ArrowDown")) {
          newPos[1] = Math.max(newPos[1] - 15, -2000);
        } else if (pressedKeys.current.has("ArrowLeft")) {
          newPos[0] = Math.max(newPos[0] - 15, -2000);
        } else if (pressedKeys.current.has("ArrowRight")) {
          newPos[0] = Math.min(newPos[0] + 15, 2000);
        } else if (event.key === " ") {
          setLightOn((prev) => !prev);
        }
        return newPos;
      });
    };

    const handleKeyUp = (event) => {
      setIsMoving(false);
      pressedKeys.current.delete(event.key);
      setTargetRotation((prev) => [Math.PI / 2, prev[1], 0]);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const updateCamera = (target) => {
    const newPosition = new THREE.Vector3(
      target.position.x,
      target.position.z + 70,
      -target.position.y + 500
    );
    camera.position.lerp(newPosition, 0.1);
    lookAtTarget.current.lerp(
      new THREE.Vector3(
        target.position.x,
        target.position.z,
        -target.position.y
      ),
      0.1
    );
    camera.lookAt(lookAtTarget.current);
  };

  useFrame(() => {
    if (ufoRef.current) {
      ufoRef.current.position.lerp(new THREE.Vector3(...position), 0.1);
      ufoRef.current.rotation.x +=
        (targetRotation[0] - ufoRef.current.rotation.x) * 0.1;
      ufoRef.current.rotation.y +=
        (targetRotation[1] - ufoRef.current.rotation.y) * 0.1;
      ufoRef.current.rotation.z +=
        (targetRotation[2] - ufoRef.current.rotation.z) * 0.1;
    }
    if (!isMoving) {
      ufoRef.current.rotation.x += Math.sin(Date.now() * 0.001) * 0.01;
      ufoRef.current.rotation.z += Math.cos(Date.now() * 0.001) * 0.01;
    }

    if (group.current) {
      group.current.position.lerp(new THREE.Vector3(...position), 0.1);
      group.current.rotation.x +=
        (targetRotation[0] - group.current.rotation.x) * 0.1;
      group.current.rotation.y +=
        (targetRotation[1] - group.current.rotation.y) * 0.1;
      group.current.rotation.z +=
        (targetRotation[2] - group.current.rotation.z) * 0.1;

      updateCamera(group.current);
    }
    
    if (lightConeMesh.current && lightOn) {
      lightConeMesh.current.updateMatrixWorld();
      const lightConePosition = lightConeMesh.current.getWorldPosition(
        new THREE.Vector3()
      );
      lightConeRef.current = lightConePosition;
    } else {
      lightConeRef.current = null;
    }
  });

  return (
    <>
      <primitive ref={ufoRef} object={scene} scale={scale} castShadow />
      <group ref={group} dispose={null}>
        {lightOn && (
          <mesh ref={lightConeMesh} position={[0, -70, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[50, 50, 200, 100]} />
            <meshBasicMaterial
              color="#00ccff"
              transparent={true}
              opacity={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>
    </>
  );
};

export default UFO;
