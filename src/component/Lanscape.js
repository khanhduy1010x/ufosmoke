import React from 'react';
import { useGLTF } from '@react-three/drei';

const Lanscape = () => {
  const { scene: rice } = useGLTF('../model3D/Rice.glb');
  const { scene: haystack } = useGLTF('../model3D/Haystack.glb');
  const { scene: crops } = useGLTF('../model3D/Crops.glb');
  const { scene: house } = useGLTF('../model3D/House.glb');

  const models = [
    { model: rice.clone(), position: [250, 900, 0], scale: [0.1, 0.1, 0.1], rotation: [Math.PI / 2, 0, 0] },
    { model: haystack.clone(), position: [-550, -800, 0], scale: [10, 10, 10], rotation: [Math.PI / 2, 0, 0]},
    { model: crops.clone(), position: [-400, -900, 0], scale: [80, 80, 80], rotation: [Math.PI / 2, 0, 0] },
    { model: house.clone(), position: [-700, -800, 0], scale: [20, 20, 20], rotation: [Math.PI / 2, 0, 0] },

  ];

  return (
    <group>
      {models.map((item, index) => (
        <primitive
          key={index}
          object={item.model}
          position={item.position}
          scale={item.scale}
          rotation={item.rotation}
        />
      ))}
    </group>
  );
};

export default Lanscape;
