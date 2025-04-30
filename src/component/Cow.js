import "./Cow.css";
import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Html, useAspect } from "@react-three/drei";
import * as THREE from "three";
import { Object3D } from "three";

const generateRandomPosition = (range) => {
  return [
    Math.random() * range - range / 2,
    Math.random() * range - range / 2,
    0,
  ];
};

// Các câu nói hài hước khi bị UFO bắt
const captureMessages = [
  "Huhu! Người ngoài hành tinh bắt tôi rồi!",
  "Cứu tôi! Tôi sắp bị mổ bụng!",
  "Tui không muốn lên đĩa bay!",
  "Bò không phải trâu, đừng bắt tôi!",
  "Mẹ ơi! Con bị bắt cóc nè!",
  "Đừng bắt tôi làm hamburger vũ trụ!",
  "Người ngoài hành tinh, ăn gì cũng được, đừng ăn tôi!",
  "Còn nhiều thứ tôi chưa làm, đừng bắt tôi!",
  "Tôi còn nợ ngân hàng chưa trả, đừng bắt tôi!",
  "Tôi sẽ tặng bạn cỏ nếu thả tôi ra!",
];

// Các câu nói hài hước khi UFO lại gần
const scaredMessages = [
  "Chạy nhanh lên! UFO tới kìa!",
  "Báo động! Người ngoài hành tinh!",
  "Chạy mau kẻo bị bắt!",
  "SOS! SOS! Đĩa bay tấn công!",
  "Anh em ơi, chạy đi!",
  "Trời ơi! Đĩa bay kìa!",
  "Tôi còn trẻ, tôi chưa muốn lên vũ trụ!",
  "Mỗi con một hướng, chạy mau!",
  "Đừng bắt tôi! Tôi còn vợ con!",
  "Mẹ ơi! Sợ quá!",
];

// Các câu UFO nói khi bắt được con vật
const ufoMessages = [
  "Hahaha! Ta bắt được ngươi rồi!",
  "Lên đĩa bay với ta, sinh vật Trái Đất!",
  "Mẫu vật hoàn hảo cho bộ sưu tập của ta!",
  "Ngươi sẽ là bữa tối của ta!",
  "Bò nướng vũ trụ sắp có rồi!",
  "Thu thập mẫu vật thành công!",
  "Đây là con thứ 100 ta bắt được!",
  "Giờ ta có thú cưng mới rồi!",
  "Lên đây thám hiểm vũ trụ nào!",
  "Không cần chống cự, không đau đâu!",
];

const Cow = ({ lightConeRef }) => {
  const group = useRef();
  const time = useRef(0);
  // Tham chiếu đến các animation mixers
  const mixers = useRef([]);

  // Lấy camera từ three.js
  const { camera } = useThree();

  // Vector tạm thời để tái sử dụng
  const tempVector = useMemo(() => new THREE.Vector3(), []);
  const xAxis = useMemo(() => new THREE.Vector3(1, 0, 0), []);
  const yAxis = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  const models = useMemo(
    () => [
      {
        path: "../model3D/Cow.glb",
        scale: [20, 20, 20],
        type: "cow",
        z: 0,
        moveSpeed: 0.3,
        hasAnimation: true,
        jumpProbability: 0.03, // Tăng xác suất thực hiện động tác nhảy
      },
      {
        path: "../model3D/Tractor.glb",
        scale: [6, 6, 6],
        type: "tractor",
        z: 0,
        moveSpeed: 0.8,
        hasAnimation: false,
      },
      {
        path: "../model3D/Hen.glb",
        scale: [0.5, 0.5, 0.5],
        type: "hen",
        z: 10,
        moveSpeed: 0.5,
        hasAnimation: false,
      },
      {
        path: "../model3D/GOAT.glb",
        scale: [2, 2, 2],
        type: "GOAT",
        z: 0,
        moveSpeed: 0.6,
        hasAnimation: false,
      },
      {
        path: "../model3D/Pig.glb",
        scale: [10, 10, 10],
        type: "Pig",
        z: 0,
        moveSpeed: 0.2,
        hasAnimation: false,
      },
      {
        path: "../model3D/Duck.glb",
        scale: [10, 10, 10],
        type: "hen",
        z: 10,
        moveSpeed: 0.4,
        hasAnimation: false,
      },
      {
        path: "../model3D/Worker.glb",
        scale: [10, 10, 10],
        type: "GOAT",
        z: 0,
        moveSpeed: 0.7,
        hasAnimation: false,
      },
    ],
    []
  );

  const gltfModels = useLoader(
    GLTFLoader,
    models.map((model) => model.path)
  );

  const getRandomModel = () => {
    const randomIndex = Math.floor(Math.random() * gltfModels.length);
    const modelData = models[randomIndex];
    const gltfModel = gltfModels[randomIndex];

    // Log thông tin chi tiết về animations nếu là Cow.glb
    if (modelData.type === "cow") {
      console.log("Cow animations:", gltfModel.animations);
      gltfModel.animations.forEach((anim, i) => {
        console.log(
          `Animation ${i}: name=${anim.name}, duration=${anim.duration}`
        );
      });
    }

    const model = gltfModel.scene.clone();

    // Tạo mixer cho model nếu có animation
    let mixer = null;
    let actions = null;

    if (
      modelData.hasAnimation &&
      gltfModel.animations &&
      gltfModel.animations.length > 0
    ) {
      mixer = new THREE.AnimationMixer(model);
      actions = {};

      // Tạo các actions từ các animations
      gltfModel.animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        actions[clip.name] = action;
      });
    }

    return {
      model,
      scale: modelData.scale,
      type: modelData.type,
      z: modelData.z,
      moveSpeed: modelData.moveSpeed,
      hasAnimation: modelData.hasAnimation,
      jumpProbability: modelData.jumpProbability || 0,
      mixer,
      actions,
    };
  };

  // Tạo các instances một lần duy nhất khi component được mount
  const cowInstances = useMemo(() => {
    // Tạo mảng con vật với phân bố đều hơn
    const modelCounts = {
      cow: 20, // Giảm số lượng bò để tránh quá tải
      tractor: 3,
      hen: 5,
      GOAT: 5,
      Pig: 5,
      Duck: 3,
      Worker: 3,
    };

    let instances = [];

    // Tạo số lượng cụ thể cho mỗi loại vật
    Object.keys(modelCounts).forEach((type) => {
      for (let i = 0; i < modelCounts[type]; i++) {
        // Tìm model tương ứng với loại này
        const modelIndex = models.findIndex((m) => m.type === type);
        if (modelIndex !== -1) {
          const modelData = models[modelIndex];
          const gltfModel = gltfModels[modelIndex];
          const model = gltfModel.scene.clone();

          // Tạo mixer nếu có animation
          let mixer = null;
          let actions = null;

          if (
            modelData.hasAnimation &&
            gltfModel.animations &&
            gltfModel.animations.length > 0
          ) {
            mixer = new THREE.AnimationMixer(model);
            actions = {};

            // Tạo các actions từ animations
            gltfModel.animations.forEach((clip) => {
              const action = mixer.clipAction(clip);
              actions[clip.name] = action;
            });

            // Thêm mixer vào danh sách
            if (mixer) {
              mixers.current.push(mixer);
            }
          }

          // Tạo vị trí ngẫu nhiên
          const position = generateRandomPosition(4000);
          position[2] = modelData.z;

          instances.push({
            model,
            position,
            scale: modelData.scale,
            rotation: [Math.PI / 2, 0, 0],
            isBeingLifted: false,
            type: modelData.type,
            offset: new THREE.Vector3(),
            // Thêm các tham số chuyển động
            movementDirection: Math.random() > 0.5 ? 1 : -1,
            moveSpeed: modelData.moveSpeed * (0.8 + Math.random() * 0.4),
            distanceTraveled: 0,
            maxDistance: 100 + Math.random() * 200,
            turnTimer: 0,
            rotationTarget: 0,
            // Thêm thông tin animation
            hasAnimation: modelData.hasAnimation,
            jumpProbability: modelData.jumpProbability || 0,
            mixer,
            actions,
            isJumping: false,
            jumpTimer: 0,
            // Thêm thông tin cho các thông báo
            showMessage: false,
            message: "",
            messageType: "",
            messageTimer: 0,
            nearUFO: false,
            runningFromUFO: false,
            runAwayTimer: 0,
            ufoMessage: "",
            showUfoMessage: false,
          });
        }
      }
    });

    return instances;
  }, [gltfModels, models]);

  useFrame((state, delta) => {
    time.current += 0.05;
    const elapsedTime = state.clock.getElapsedTime();

    if (!group.current) return;

    // Cập nhật tất cả mixers
    mixers.current.forEach((mixer) => {
      if (mixer) mixer.update(delta);
    });

    // Lưu vị trí UFO nếu có
    let ufoPosition = null;
    if (lightConeRef.current) {
      ufoPosition = lightConeRef.current.clone();
      const temp = ufoPosition.y;
      ufoPosition.y = ufoPosition.z;
      ufoPosition.z = temp;
      ufoPosition.applyAxisAngle(xAxis, Math.PI);
    }

    cowInstances.forEach((cow, index) => {
      const instance = group.current.children[index];
      if (!instance) return;

      // Cập nhật thời gian hiển thị thông báo
      if (cow.showMessage) {
        cow.messageTimer += delta;
        if (cow.messageTimer > 5) {
          // Kéo dài thời gian hiển thị lên 5 giây
          cow.showMessage = false;
          cow.messageTimer = 0;
        }
      }

      // Cập nhật thời gian hiển thị thông báo của UFO
      if (cow.showUfoMessage) {
        cow.messageTimer += delta;
        if (cow.messageTimer > 5) {
          // Kéo dài thời gian hiển thị lên 5 giây
          cow.showUfoMessage = false;
          cow.messageTimer = 0;
        }
      }

      // Xử lý nếu bị hút bởi đĩa bay
      if (lightConeRef.current) {
        // Sử dụng vector đã có sẵn thay vì tạo mới
        const lightConePosition = ufoPosition.clone();

        // Lấy vị trí cow hiện tại
        const cowPosition = tempVector.setFromMatrixPosition(
          instance.matrixWorld
        );

        const distanceX = Math.abs(cowPosition.x - lightConePosition.x);
        lightConePosition.applyAxisAngle(yAxis, Math.PI);
        const distanceY = Math.abs(cowPosition.z + lightConePosition.y);

        lightConePosition.applyAxisAngle(yAxis, Math.PI);

        // Nếu gần UFO nhưng chưa bị hút
        const isCloseToUFO = distanceX < 300 && distanceY < 300;

        if (isCloseToUFO && !cow.nearUFO && !cow.isBeingLifted) {
          cow.nearUFO = true;
          cow.runningFromUFO = true;
          cow.runAwayTimer = 0;

          // Hiển thị thông báo sợ hãi
          const message =
            scaredMessages[Math.floor(Math.random() * scaredMessages.length)];
          cow.showMessage = true;
          cow.message = message;
          cow.messageType = "default";
          cow.messageTimer = 0;

          // Đổi hướng di chuyển để chạy xa khỏi UFO
          const directionToUFO = new THREE.Vector2(
            lightConePosition.x - cowPosition.x,
            lightConePosition.y - cowPosition.z
          ).normalize();

          // Đi theo hướng ngược lại UFO
          cow.movementDirection = directionToUFO.x > 0 ? -1 : 1;
          cow.moveSpeed *= 3; // Tăng tốc độ khi sợ hãi
        } else if (!isCloseToUFO) {
          cow.nearUFO = false;
        }

        // Cập nhật thời gian chạy trốn
        if (cow.runningFromUFO) {
          cow.runAwayTimer += delta;

          // Hiển thị thông báo "sợ hãi" liên tục khi chạy trốn
          if (!cow.showMessage || cow.messageTimer > 2.5) {
            cow.showMessage = true;
            cow.messageTimer = 0;
            // Hiển thị thông báo sợ hãi bằng thuộc tính trực tiếp của cow
            const message =
              scaredMessages[Math.floor(Math.random() * scaredMessages.length)];
            cow.message = message;
            cow.messageType = "default";
          }

          if (cow.runAwayTimer > 5) {
            // Chạy trốn trong 5 giây
            cow.runningFromUFO = false;
            cow.moveSpeed /= 3; // Trở lại tốc độ bình thường
          }
        }

        if (distanceX < 50 && distanceY < 50) {
          // Kích hoạt hiển thị thông báo khi con vật bắt đầu bị hút
          if (!cow.isBeingLifted) {
            // Hiển thị thông báo khi bị bắt trực tiếp trên cow
            const captureMessage =
              captureMessages[
                Math.floor(Math.random() * captureMessages.length)
              ];
            cow.showMessage = true;
            cow.message = captureMessage;
            cow.messageType = "captured";
            cow.messageTimer = 0;

            // Hiển thị thông báo của UFO
            const ufoMessageIndex = Math.floor(
              Math.random() * ufoMessages.length
            );
            const ufoMessage = ufoMessages[ufoMessageIndex];

            // Cố gắng tìm một con vật gần UFO để hiển thị thông báo UFO
            const ufoIndex = cowInstances.findIndex((c) => c.type === "ufo");
            if (ufoIndex !== -1 && group.current?.children[ufoIndex]) {
              const ufoCow = cowInstances[ufoIndex];
              ufoCow.showUfoMessage = true;
              ufoCow.ufoMessage = ufoMessage;
              ufoCow.messageTimer = 0;
            } else {
              // Nếu không tìm thấy UFO, hiển thị trên con vật bị bắt
              cow.showUfoMessage = true;
              cow.ufoMessage = ufoMessage;
            }
          }

          cow.isBeingLifted = true;

          // Hiển thị liên tục thông báo khi bị hút lên
          if (!cow.showMessage && cow.messageTimer <= 0) {
            cow.showMessage = true;
            cow.messageTimer = 5;
            // Hiển thị thông báo khi bị bắt bằng thuộc tính trực tiếp của cow
            const captureMessage =
              captureMessages[
                Math.floor(Math.random() * captureMessages.length)
              ];
            cow.message = captureMessage;
            cow.messageType = "captured";
          }

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
        cow.nearUFO = false;
      }

      // Di chuyển bình thường nếu không bị hút
      if (!cow.isBeingLifted) {
        // Di chuyển xuống nếu đang ở trên không
        if (instance.position.z > 0) {
          if (cow.type === "hen" && instance.position.z > 10) {
            instance.position.z -= 4;
          } else if (cow.type !== "hen" && instance.position.z > 0) {
            instance.position.z -= 4;
          }

          const firtsTemp = cow.type === "hen" ? 12 : 5;
          const tempDistance = cow.type === "hen" ? 15 : 10;

          if (
            instance.position.z > firtsTemp &&
            instance.position.z < tempDistance
          ) {
            instance.position.x += (Math.random() - 0.5) * 50;
            instance.position.y += (Math.random() - 0.5) * 50;
          }
        }
        // Chuyển động qua lại khi ở mặt đất
        else {
          // Cập nhật hướng chuyển động
          cow.turnTimer += delta;

          // Đổi hướng nếu đi đủ xa hoặc hết thời gian và không đang chạy trốn
          if (!cow.runningFromUFO) {
            cow.distanceTraveled += cow.moveSpeed;
            if (
              cow.distanceTraveled > cow.maxDistance ||
              cow.turnTimer > 10 + Math.random() * 5
            ) {
              cow.movementDirection *= -1;
              cow.distanceTraveled = 0;
              cow.turnTimer = 0;

              // Đặt hướng quay mới
              cow.rotationTarget = cow.movementDirection > 0 ? Math.PI : 0;
            }
          }

          // Di chuyển theo hướng hiện tại
          const movementX = Math.cos(elapsedTime * 0.5) * 0.2; // Thêm chút dao động
          const moveSpeed = cow.runningFromUFO
            ? cow.moveSpeed * 2
            : cow.moveSpeed;
          instance.position.x += cow.movementDirection * moveSpeed + movementX;

          // Thêm hiệu ứng chạy trốn đặc biệt (nhảy lên xuống và lắc)
          if (cow.runningFromUFO) {
            // Hiệu ứng nhảy nhanh lên xuống khi chạy trốn
            instance.position.z += Math.sin(elapsedTime * 15) * 0.2;

            // Hiệu ứng lắc khi hoảng sợ
            instance.rotation.z += Math.sin(elapsedTime * 10) * 0.03;
          }

          // Giới hạn phạm vi di chuyển
          instance.position.x = Math.max(
            Math.min(instance.position.x, 2000),
            -2000
          );

          // Xoay hướng theo hướng di chuyển
          instance.rotation.y +=
            (cow.rotationTarget - instance.rotation.y) * 0.05;

          // Xử lý động tác nhảy cho các con vật có animation
          if (
            cow.hasAnimation &&
            cow.actions &&
            cow.type === "cow" &&
            !cow.runningFromUFO
          ) {
            // Cập nhật trạng thái nhảy
            if (cow.isJumping) {
              cow.jumpTimer += delta;

              // Thêm di chuyển lên cao khi nhảy
              const jumpHeight =
                Math.sin(Math.min(Math.PI, cow.jumpTimer * 3)) * 2;
              instance.position.z += jumpHeight * delta * 10;

              // Kết thúc nhảy sau 1.5 giây
              if (cow.jumpTimer > 1.5) {
                // Stop animation
                const actionKeys = Object.keys(cow.actions);
                if (actionKeys.length > 0) {
                  // Dừng animation đang chạy
                  const animationKey = actionKeys[0]; // Sử dụng animation đầu tiên
                  cow.actions[animationKey].stop();
                  cow.isJumping = false;
                  cow.jumpTimer = 0;
                }
              }
            } else {
              // Xác suất thực hiện nhảy
              if (Math.random() < cow.jumpProbability * delta * 10) {
                const actionKeys = Object.keys(cow.actions);
                if (actionKeys.length > 0) {
                  // Phát animation đầu tiên tìm thấy
                  const animationKey = actionKeys[0]; // Sử dụng animation đầu tiên
                  cow.actions[animationKey].reset().play();
                  cow.isJumping = true;
                  cow.jumpTimer = 0;
                }
              }
            }
          }
        }
      }

      // Caching cos để tránh tính toán lại
      const cosValue = Math.cos(time.current * cow.moveSpeed) * 0.1;

      // Thêm chuyển động lên xuống nhẹ nếu không đang nhảy
      if (cow.type !== "tractor" && !cow.isJumping) {
        instance.position.z += Math.sin(time.current * 2) * 0.05;

        // Điều chỉnh chuyển động dựa vào loại đối tượng
        if (["cow", "GOAT", "hen"].includes(cow.type)) {
          instance.rotation.z = cosValue;
        }
      }
    });
  });

  return (
    <group ref={group} dispose={null}>
      {cowInstances.map((props, index) => (
        <primitive
          key={index}
          object={props.model}
          scale={props.scale}
          rotation={props.rotation}
          position={props.position}
        >
          {props.showMessage && (
            <Html
              position={[0, 0, 50]}
              center
              distanceFactor={10}
              sprite
              zIndexRange={[100, 0]}
              className={`html-wrapper`}
            >
              <div
                className={`speech-bubble ${
                  props.messageType === "captured"
                    ? "captured"
                    : props.messageType === "ufo"
                    ? "ufo"
                    : "default"
                }`}
              >
                {props.message}
              </div>
            </Html>
          )}
          {props.showUfoMessage && (
            <Html
              position={[0, 0, 50]}
              center
              distanceFactor={10}
              sprite
              zIndexRange={[100, 0]}
              className={`html-wrapper`}
            >
              <div className={`speech-bubble ufo`}>{props.ufoMessage}</div>
            </Html>
          )}
        </primitive>
      ))}
    </group>
  );
};

export default Cow;
