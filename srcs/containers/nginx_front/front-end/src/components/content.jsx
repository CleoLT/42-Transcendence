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


// // --> center in middle of the space between icons and border
// import {IconsList} from "./icon.jsx"
// import Circle from "./circle.jsx"

// export default function Content(){
//     return (
//         <div className="flex flex-row h-[85%] w-[95%] sm:border-4 border-2 border-black" >
//             <div className="flex items-center">
//                 <IconsList />
//             </div>
//             <div className="flex-1 flex justify-center items-center">
//                 <Circle/>
//             </div>
//         </div>
//     )
// }


import {IconsList} from "./icon.jsx"
import Circle from "./circle.jsx"
import { useState, useEffect } from "react";
import GameContainer from "./gameContainer";
import StartScreen from "./startScreen";

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
            {/* <div className="flex-1 flex justify-center items-center">
                <Circle/>
            </div> */}
            <div className="flex-1 relative overflow-hidden w-full h-auto" >
                <GameContainer onGameReady={setGame} />
                <StartScreen game={game} />
            </div>
        </div>
    )
}
