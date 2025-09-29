// import { useRef, useEffect, useState, useCallback } from "react";

// export const CANVAS_KEYS: string[] = [];

// const CanvasJoystick = () => {
//   const canvasRef = useRef(null);
//   const [pressedButtons, setPressedButtons] = useState(new Set());
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const [isMouseDown, setIsMouseDown] = useState(false);

//   // Button definitions with positions and sizes

//   const drawButton = (ctx, button, name, isPressed) => {
//     const { x, y, width, height, type } = button;

//     // Button colors based on state and type
//     let fillColor, strokeColor, textColor;

//     if (isPressed) {
//       fillColor = "#374151"; // darker when pressed
//       strokeColor = "#6B7280";
//       textColor = "#D1D5DB";
//     } else {
//       switch (type) {
//         case "shoulder":
//           fillColor = "#4B5563";
//           strokeColor = "#6B7280";
//           textColor = "#F9FAFB";
//           break;
//         case "dpad":
//           fillColor = "#374151";
//           strokeColor = "#4B5563";
//           textColor = "#F9FAFB";
//           break;
//         case "action":
//           fillColor = "#4B5563";
//           strokeColor = "#6B7280";
//           textColor = "#F9FAFB";
//           break;
//         case "menu":
//           fillColor = "#374151";
//           strokeColor = "#4B5563";
//           textColor = "#D1D5DB";
//           break;
//       }
//     }

//     // Draw button background
//     ctx.fillStyle = fillColor;
//     ctx.strokeStyle = strokeColor;
//     ctx.lineWidth = 2;

//     if (type === "action") {
//       // Circular buttons for A and B
//       ctx.beginPath();
//       ctx.arc(x + width / 2, y + height / 2, width / 2, 0, Math.PI * 2);
//       ctx.fill();
//       ctx.stroke();
//     } else {
//       // Rectangular buttons with rounded corners
//       ctx.beginPath();
//       ctx.roundRect(x, y, width, height, 8);
//       ctx.fill();
//       ctx.stroke();
//     }

//     // Draw button text
//     ctx.fillStyle = textColor;
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle";

//     if (type === "shoulder" || type === "menu") {
//       ctx.font = "14px sans-serif";
//     } else if (type === "action") {
//       ctx.font = "bold 18px sans-serif";
//     } else {
//       ctx.font = "16px sans-serif";
//     }

//     let displayText = name;
//     if (name === "up") displayText = "▲";
//     if (name === "down") displayText = "▼";
//     if (name === "left") displayText = "◀";
//     if (name === "right") displayText = "▶";
//     if (name === "select") displayText = "Select";
//     if (name === "start") displayText = "Start";

//     ctx.fillText(displayText, x + width / 2, y + height / 2);
//   };

//   const drawDPadCenter = (ctx) => {
//     // Draw D-pad center circle
//     ctx.fillStyle = "#1F2937";
//     ctx.beginPath();
//     ctx.arc(150, 150, 18, 0, Math.PI * 2);
//     ctx.fill();
//   };

//   const drawDPadBase = (ctx) => {
//     // Vertical bar
//     ctx.fillStyle = "#374151";
//     ctx.strokeStyle = "#4B5563";
//     ctx.lineWidth = 3;
//     ctx.beginPath();
//     ctx.roundRect(125, 85, 50, 130, 8);
//     ctx.fill();
//     ctx.stroke();

//     // Horizontal bar
//     ctx.beginPath();
//     ctx.roundRect(85, 125, 130, 50, 8);
//     ctx.fill();
//     ctx.stroke();
//   };

//   const draw = useCallback(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Background
//     ctx.fillStyle = "#1E293B"; // slate-800
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//   }, [pressedButtons]);

//   const getButtonAt = (x, y) => {
//     for (const [name, button] of Object.entries(buttons)) {
//       if (button.type === "action") {
//         // Circular collision for action buttons
//         const centerX = button.x + button.width / 2;
//         const centerY = button.y + button.height / 2;
//         const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
//         if (distance <= button.width / 2) {
//           return name;
//         }
//       } else {
//         // Rectangular collision for other buttons
//         if (
//           x >= button.x &&
//           x <= button.x + button.width &&
//           y >= button.y &&
//           y <= button.y + button.height
//         ) {
//           return name;
//         }
//       }
//     }
//     return null;
//   };

//   const handleMouseDown = (e: MouseEvent) => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     const button = getButtonAt(x, y);
//     if (button) {
//       if (!CANVAS_KEYS.includes(button)) {
//         CANVAS_KEYS.push(button);
//         setIsMouseDown(true);
//         setPressedButtons((prev) => new Set([...prev, button]));
//         console.log(`Button pressed: ${button} `);
//         console.log(CANVAS_KEYS);
//       }
//     }
//   };

//   const handleMouseUp = (e: MouseEvent) => {
//     if (isMouseDown) {
//       setPressedButtons(new Set());
//       setIsMouseDown(false);
//       console.log("All buttons released");
//     }
//   };

//   const handleMouseMove = (e) => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     setMousePos({ x, y });
//   };

//   // Keyboard support
//   useEffect(() => {
//     const keyMap = {
//       KeyL: "L",
//       KeyR: "R",
//       ArrowUp: "up",
//       ArrowDown: "down",
//       ArrowLeft: "left",
//       ArrowRight: "right",
//       KeyA: "A",
//       KeyB: "B",
//       KeyS: "select",
//       Enter: "start",
//     };

//     const handleKeyDown = (e) => {
//       const button = keyMap[e.code];
//       if (button) {
//         e.preventDefault();
//         setPressedButtons((prev) => new Set([...prev, button]));
//         console.log(`Key pressed: ${button}`);
//       }
//     };

//     const handleKeyUp = (e) => {
//       const button = keyMap[e.code];
//       if (button) {
//         e.preventDefault();
//         setPressedButtons((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete(button);
//           return newSet;
//         });
//         console.log(`Key released: ${button}`);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     window.addEventListener("keyup", handleKeyUp);

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       window.removeEventListener("keyup", handleKeyUp);
//     };
//   }, []);

//   useEffect(() => {
//     draw();
//   }, [draw]);

//   return (
//     <div className="flex flex-col items-center justify-center bg-blue-900 p-4">
//       <canvas
//         ref={canvasRef}
//         width={500}
//         height={280}
//         className="border-2 border-gray-600 rounded-lg cursor-pointer"
//         onMouseDown={handleMouseDown}
//         onMouseUp={handleMouseUp}
//         onMouseMove={handleMouseMove}
//         onMouseLeave={handleMouseUp}
//       />

//       <div className="mt-4 text-white text-sm">
//         <p>Active buttons: {Array.from(pressedButtons).join(", ") || "None"}</p>
//         <p>
//           Mouse: ({mousePos.x}, {mousePos.y})
//         </p>
//       </div>
//     </div>
//   );
// };

// export default CanvasJoystick;
