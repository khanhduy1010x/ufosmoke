import React, { Suspense, useMemo, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stage, Sky, Preload } from "@react-three/drei";
import Ground from "./component/Ground.js";

// Component bảng hướng dẫn
const InstructionPanel = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Ẩn bảng hướng dẫn sau 10 giây
    const timer = setTimeout(() => {
      setShow(false);
    }, 10000);

    // Hiển thị lại khi nhấn H
    const handleKeyDown = (e) => {
      if (e.key === "h" || e.key === "H") {
        setShow((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!show)
    return <div className="help-hint">Nhấn phím H để hiển thị hướng dẫn</div>;

  return (
    <div className="instruction-panel">
      <h3>HƯỚNG DẪN ĐIỀU KHIỂN</h3>
      <table>
        <tbody>
          <tr>
            <td>↑ ↓ ← →</td>
            <td>Di chuyển UFO</td>
          </tr>
          <tr>
            <td>SPACE</td>
            <td>Bật/tắt tia hút</td>
          </tr>
          <tr>
            <td>Z / X</td>
            <td>Xoay UFO quanh trục X</td>
          </tr>
          <tr>
            <td>C / V</td>
            <td>Xoay UFO quanh trục Z</td>
          </tr>
          <tr>
            <td>H</td>
            <td>Ẩn/hiện bảng hướng dẫn</td>
          </tr>
        </tbody>
      </table>
      <div className="note">Bắt đàn bò đưa về UFO!</div>
    </div>
  );
};

function App() {
  // Sử dụng useMemo để tránh tạo lại các props trong mỗi render
  const canvasProps = useMemo(
    () => ({
      style: { width: "100%", height: "100%", position: "absolute" },
      gl: {
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        preserveDrawingBuffer: true, // Giúp bảo tồn màu sắc
      },
      camera: {
        fov: 60,
        near: 0.1,
        far: 10000,
        position: [0, 0, 800],
      },
      // Giới hạn devicePixelRatio để tối ưu hiệu suất
      dpr: Math.min(window.devicePixelRatio, 2),
    }),
    []
  );

  // Cấu hình stage phù hợp để giữ màu sắc vật thể
  const stageProps = useMemo(
    () => ({
      preset: "rembrandt", // Sử dụng preset có màu sắc tốt hơn
      shadows: false,
      environment: false,
      intensity: 0.8, // Tăng cường độ ánh sáng
      ambience: 0.5, // Thêm ánh sáng môi trường
    }),
    []
  );

  // Memoize các props cho Sky với màu sắc tốt hơn
  const skyProps = useMemo(
    () => ({
      distance: 5000,
      sunPosition: [100, 10, -1000],
      inclination: 0,
      azimuth: 0.25,
      rayleigh: 0.5,
      turbidity: 8, // Tăng độ đục để có ánh sáng tán xạ tốt hơn
      mieCoefficient: 0.005,
      mieDirectionalG: 0.8,
    }),
    []
  );

  return (
    <>
      <style>
        {`
          .instruction-panel {
            position: absolute;
            top: 20px;
            left: 20px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 15px;
            border-radius: 10px;
            z-index: 1000;
            font-family: 'Arial', sans-serif;
            max-width: 300px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
            border: 2px solid #5f5;
          }
          
          .instruction-panel h3 {
            text-align: center;
            margin-top: 0;
            color: #5f5;
            text-shadow: 0 0 5px #5f5;
          }
          
          .instruction-panel table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .instruction-panel td {
            padding: 8px;
            border-bottom: 1px solid #444;
          }
          
          .instruction-panel td:first-child {
            color: #ff5;
            font-weight: bold;
            text-align: right;
            width: 40%;
          }
          
          .instruction-panel .note {
            text-align: center;
            margin-top: 10px;
            font-style: italic;
            color: #f99;
          }
          
          .help-hint {
            position: absolute;
            bottom: 20px;
            left: 20px;
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            padding: 8px 12px;
            border-radius: 5px;
            z-index: 1000;
            font-family: 'Arial', sans-serif;
          }
        `}
      </style>
      <InstructionPanel />
      <Suspense
        fallback={
          <div
            style={{ background: "lightblue", width: "100%", height: "100%" }}
          ></div>
        }
      >
        <Canvas {...canvasProps}>
          <fog attach="fog" args={["#f0f0f0", 5, 10000]} />{" "}
          {/* Thêm fog để tăng chiều sâu */}
          <Stage {...stageProps}>
            <Sky {...skyProps} />
            <Ground />
          </Stage>
          <Preload all />
        </Canvas>
      </Suspense>
    </>
  );
}

export default React.memo(App);
