// --> center in middle of the page

// import {IconsList} from "./icon.jsx"
// import Circle from "./circle.jsx"


// export default function Content(){
//     return (
//         <div className="flex flex-row h-[85%] w-[95%] sm:border-4 border-2 border-black relative" >
//             <div className="flex items-center">
//                 <IconsList />
//             </div>
//             <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
//                 <Circle/>
//             </div>
//         </div>
//     )
// }

import Circle from "./circleUtils.jsx"
import StartScreen from "./startScreen"
import GameContainer from "./gameContainer"
import {IconsList} from "./icon.jsx"
import { useState, useEffect } from "react"
// import {PlayConnected} from "./circlePages.jsx"

export default function Content(){
    const [game, setGame] = useState(null);

    // // Debug: log when game state changes
    // useEffect(() => {
    //   console.log('📦 Content: game state changed', {
    //     game: game ? 'exists' : 'null',
    //     gameState: game?.state
    //   });
    // }, [game]);
    return (
        <div className="flex flex-row h-[85%] w-[95%] sm:border-4 border-2 border-black" >
            <div className="flex items-center">
                <IconsList />
            </div>
            <div className="flex-1 flex justify-center items-center">
                <Circle/>
            </div>
            {/* <div className="flex-1 flex justify-center items-center">
                <PlayConnected onPlayClick={() => console.log("Play clicked")} />
            </div> */}
            {/* <div className="flex-1 relative overflow-hidden w-full h-auto" >
                <GameContainer onGameReady={setGame} />
                <StartScreen game={game} />
            </div> */}
        </div>
    )
}
