// import { useState } from "react";
// import GameCanvas from "./GameCanvas.jsx";
// import HUD from "./HUD.jsx";
// import StartScreen from "./StartScreen.jsx";

// export default function App() {
//   const [game, setGame] = useState(null);

//   return (
//     <div id="game-container">
//       <GameCanvas onGameRef={setGame} />
//       {game && <HUD game={game} />}
//       {!game?.started && <StartScreen game={game} />}
//     </div>
//   );
// }

import Content from "./Content.jsx"
import Header from "./header.jsx"
import {Sixtyfour, CorbenBold, CorbenRegular} from "./typography.jsx"

export default function App() {
  const background = "/images_png/ground_00.png"
  const flowerGround = "/images_png/flower_ground.png"

  return (
    <div
    className="relative flex flex-col h-screen items-center justify-center">
    <div className="absolute inset-0 bg-cover"
      style={{backgroundImage: "url("+ background + ")"}}>
    </div>
    <img src={flowerGround} alt="flower"
         className="absolute bottom-0 right-0 opacity-50 w-[100vw] md:w-[75vw] lg:w-[50vw]" />
    <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <Header />
        <Content />
        {/* <Footer /> */}
      </div>
    </div>
  )
}
