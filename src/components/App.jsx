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

import { useState } from "react"
import Header from "./header.jsx"
import Content from "./Content.jsx"
import GameCanvas from "./GameCanvas.jsx"
import HUD from "./HUD.jsx"
import StartScreen from "./StartScreen.jsx"

export default function App() {
  const [game, setGame] = useState(null)
  const background = "/sprites/ground_00.png"

  return (
    <div
      className="flex flex-col h-screen bg-cover items-center justify-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <Header />
      <Content>
        <GameCanvas onGameRef={setGame} />
        {game && <HUD game={game} />}
        {!game?.started && <StartScreen game={game} />}
      </Content>
    </div>
  )
}


// import Content from "./Content.jsx"
// import Header from "./header.jsx"
// import {Sixtyfour, CorbenBold, CorbenRegular} from "./typography.jsx"

// export default function App() {
//   const background = "../sprites/ground_00.png"

//   return (
//     <div
//       className="flex flex-col h-screen bg-cover items-center justify-center"
//       style={{backgroundImage: "url("+ background + ")"}}>
//       <Header/>
//       <Content/>
//       {/* <Footer /> */}
//     </div>
//   )
// }
