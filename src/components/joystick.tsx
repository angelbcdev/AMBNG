// import { useEffect, useState } from "react";

// // const Joystick = ({ game }: { game: Game }) => {

//   function pressButton(key: string) {

//     if (game.gameIsPaused && game.gameUI.chipSelected.position.x > 0) {
//       game.gameUI.chipSelected.addEvent(key);
//       return
//     }

//     if (!game.gameIsPaused && game.gameUI.chipSelected.position.x < -300) {
//       game.players.forEach((player: any) => {
//         player.currentState.acctionKeyDown(key);
//       });
//     }

//   }
//   const releaseButton = (key: string) => {

//     game.players.forEach((player: any) => {
//       player.currentState.acctionKeyUp(key);
//     });
//   }

//   return (
//     <section className="flex flex-row  justify-between items-center">
//       <Cruz {...{ pressButton, releaseButton }} />

//       <ActionsButtons  {...{ game, pressButton, releaseButton }} />
//     </section>
//   )
// };

// export default Joystick;

// const ActionsButtons = ({ pressButton, releaseButton }) => {
//   // Usamos el estado para realizar un seguimiento de la presión
//   const [isPressed, setIsPressed] = useState(false);
//   const [actionCurrent, setAction] = useState("nada");

//   const handleMouseDown = (e, action) => {
//     e.preventDefault();
//     setIsPressed(true);  // Establece el estado cuando el botón es presionado
//     pressButton(action); // Ejecuta la acción correspondiente
//     setAction(action)

//   };

//   const handleMouseUp = () => {
//     releaseButton(actionCurrent);
//     // setAction("nada")

//     setIsPressed(false);  // Cambia el estado cuando se suelta el botón
//   };

//   useEffect(() => {
//     let interval = null;

//     if (isPressed) {
//       interval = setInterval(() => {

//         pressButton(actionCurrent);
//       }, 0); // Ejecuta cada 0ms mientras el botón esté presionado
//     } else {
//       releaseButton(actionCurrent);
//       clearInterval(interval); // Detenemos el intervalo cuando se deja de presionar
//     }

//     return () => clearInterval(interval);
//   }, [isPressed]);

//   return (
//     <div className="flex flex-row gap-6 justify-between  h-[60px] mr-2">
//       <button
//         onMouseDown={(e) => handleMouseDown(e, "g")}
//         onTouchStart={(e) => handleMouseDown(e, "g")}
//         onTouchEnd={handleMouseUp}
//         onMouseUp={handleMouseUp}
//         onClick={() => pressButton("g")}
//         className={"button button-acion relative mt-5"}
//       >
//         a
//       </button>

//       <button
//         onMouseDown={(e) => handleMouseDown(e, "f")}
//         onTouchStart={(e) => handleMouseDown(e, "f")}
//         onTouchEnd={handleMouseUp}
//         onMouseUp={handleMouseUp}
//         onClick={() => pressButton("f")}
//         className="button button-acion"
//       >
//         b
//       </button>
//     </div>
//   );
// }

// const Cruz = ({ pressButton, releaseButton }) => {

//   return (
//     <section className=" relative h-[300px] mt-6">
//       <div className="joystick !my-14 ">
//         <div
//           onMouseUp={() => releaseButton("ArrowUp")}
//           onClick={() => pressButton("ArrowUp")} className="direction up">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="currentColor"
//             className="icon icon-tabler icons-tabler-filled icon-tabler-arrow-badge-up"
//           >
//             <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//             <path
//               d="M11.375 6.22l-5 4a1 1 0 0 0 -.375 .78v6l.006 .112a1 1 0 0 0 1.619 .669l4.375 -3.501l4.375 3.5a1 1 0 0 0 1.625 -.78v-6a1 1 0 0 0 -.375 -.78l-5 -4a1 1 0 0 0 -1.25 0z"
//             />
//           </svg>
//         </div>
//         <div className="flex gap-3 my-5">
//           <div
//             onMouseUp={() => releaseButton("ArrowLeft")}
//             onClick={() => pressButton("ArrowLeft")} className="direction left">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="currentColor"
//               className="icon icon-tabler icons-tabler-filled icon-tabler-arrow-badge-left"
//             >
//               <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//               <path
//                 d="M17 6h-6a1 1 0 0 0 -.78 .375l-4 5a1 1 0 0 0 0 1.25l4 5a1 1 0 0 0 .78 .375h6l.112 -.006a1 1 0 0 0 .669 -1.619l-3.501 -4.375l3.5 -4.375a1 1 0 0 0 -.78 -1.625z"
//               />
//             </svg>
//           </div>
//           <div
//             onMouseUp={() => releaseButton("ArrowRight")}
//             onClick={() => pressButton("ArrowRight")} className="direction right">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="currentColor"
//               className="icon icon-tabler icons-tabler-filled icon-tabler-arrow-badge-right"
//             >
//               <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//               <path
//                 d="M7 6l-.112 .006a1 1 0 0 0 -.669 1.619l3.501 4.375l-3.5 4.375a1 1 0 0 0 .78 1.625h6a1 1 0 0 0 .78 -.375l4 -5a1 1 0 0 0 0 -1.25l-4 -5a1 1 0 0 0 -.78 -.375h-6z"
//               />
//             </svg>
//           </div>

//         </div>
//         <div
//           onMouseUp={() => releaseButton("ArrowDown")}
//           onClick={() => pressButton("ArrowDown")} className="direction down">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="currentColor"
//             className="icon icon-tabler icons-tabler-filled icon-tabler-arrow-badge-down"
//           >
//             <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//             <path
//               d="M16.375 6.22l-4.375 3.498l-4.375 -3.5a1 1 0 0 0 -1.625 .782v6a1 1 0 0 0 .375 .78l5 4a1 1 0 0 0 1.25 0l5 -4a1 1 0 0 0 .375 -.78v-6a1 1 0 0 0 -1.625 -.78z"
//             />
//           </svg>
//         </div>

//       </div>
//     </section>

//   )
// }
