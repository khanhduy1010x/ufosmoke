import React, { useRef, useState, useEffect, useMemo } from "react";
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

  // Tạo vector tạm để tránh tạo nhiều vector mới trong mỗi frame
  const tempVector = useMemo(() => new THREE.Vector3(), []);
  const positionVector = useMemo(() => new THREE.Vector3(), []);

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

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const updateCamera = (target) => {
    tempVector.set(
      target.position.x,
      target.position.z + 70,
      -target.position.y + 500
    );
    camera.position.lerp(tempVector, 0.1);

    lookAtTarget.current.lerp(
      tempVector.set(target.position.x, target.position.z, -target.position.y),
      0.1
    );
    camera.lookAt(lookAtTarget.current);
  };

  // Tối ưu useFrame bằng cách giảm thiểu việc tạo đối tượng mới
  useFrame(() => {
    if (ufoRef.current) {
      positionVector.set(...position);
      ufoRef.current.position.lerp(positionVector, 0.1);
      ufoRef.current.rotation.x +=
        (targetRotation[0] - ufoRef.current.rotation.x) * 0.1;
      ufoRef.current.rotation.y +=
        (targetRotation[1] - ufoRef.current.rotation.y) * 0.1;
      ufoRef.current.rotation.z +=
        (targetRotation[2] - ufoRef.current.rotation.z) * 0.1;
    }

    if (!isMoving && ufoRef.current) {
      const time = Date.now() * 0.001;
      ufoRef.current.rotation.x += Math.sin(time) * 0.01;
      ufoRef.current.rotation.z += Math.cos(time) * 0.01;
    }

    if (group.current) {
      positionVector.set(...position);
      group.current.position.lerp(positionVector, 0.1);
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
      lightConeRef.current = lightConeMesh.current.getWorldPosition(tempVector);
    } else {
      lightConeRef.current = null;
    }
  });

  // Tăng cường màu sắc và hiệu ứng cho ánh sáng UFO
  useEffect(() => {
    // Áp dụng tông màu cho toàn bộ model UFO
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          // Đảm bảo vật liệu hiển thị đúng
          if (child.material) {
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        }
      });
    }
  }, [scene]);

  // Sử dụng useMemo để tránh tạo lại đối tượng cylinder geometry
  const cylinderGeometry = useMemo(
    () => new THREE.CylinderGeometry(50, 50, 200, 32),
    []
  );
  const coneMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: "#30d2ff",
      emissive: "#1a6aff",
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    return material;
  }, []);

  return (
    <>
      <primitive ref={ufoRef} object={scene} scale={scale} castShadow />
      <group ref={group} dispose={null}>
        {lightOn && (
          <>
            <pointLight
              position={[0, -50, 0]}
              color="#30d2ff"
              intensity={2}
              distance={300}
            />
            <mesh
              ref={lightConeMesh}
              position={[0, -70, 0]}
              rotation={[0, 0, 0]}
            >
              <primitive object={cylinderGeometry} />
              <primitive object={coneMaterial} />
            </mesh>
          </>
        )}
      </group>
    </>
  );
};

export default UFO;
