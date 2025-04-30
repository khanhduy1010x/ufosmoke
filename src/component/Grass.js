import React, { useRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";

// Tạo vị trí ngẫu nhiên cho cỏ
const generateRandomPosition = (range) => {
  return [
    Math.random() * range - range / 2,
    Math.random() * range - range / 2,
    0,
  ];
};

// Tạo kích thước ngẫu nhiên cho cỏ
const generateRandomScale = () => {
  const scale = Math.random() * 20 + 20;
  return [scale, scale, scale];
};

// Hằng số thay vì tạo lại mỗi lần render
const ROTATION = [Math.PI / 2, 0, 0];

const Grass = () => {
  const group = useRef();
  const { scene } = useGLTF("../model3D/grass.glb");

  // Tối ưu bằng cách chỉ tạo grassInstances một lần
  const grassInstances = useMemo(() => {
    return Array.from({ length: 30 }, () => ({
      position: generateRandomPosition(4000),
      scale: generateRandomScale(),
    }));
  }, []);

  // Tối ưu bằng cách clone một lần duy nhất
  const grassModel = useMemo(() => scene.clone(true), [scene]);

  return (
    <group ref={group} dispose={null}>
      {grassInstances.map((props, index) => {
        // Clone một lần duy nhất ở trên và chia sẻ tham chiếu
        return (
          <primitive
            key={index}
            object={grassModel.clone()}
            scale={props.scale}
            rotation={ROTATION}
            position={props.position}
          />
        );
      })}
    </group>
  );
};

// Tránh re-render không cần thiết
export default React.memo(Grass);
