// --> center in middle of the page

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

import {Circle} from "./circleUtils.jsx"
import StartScreen from "./startScreen"
import GameContainer from "./gameContainer"
import {IconsList} from "./icon.jsx"
import { useState, useEffect } from "react"
import {PlayConnected, PlayNotConnected, SignInClick, AccountClick} from "./circlePages.jsx"

export default function Content({screen, setScreen}){
    const [game, setGame] = useState(null);
    // const [screen, setScreen] = useState("playNC")
    // // Debug: log when game state changes
    // useEffect(() => {
    //   console.log('📦 Content: game state changed', {
    //     game: game ? 'exists' : 'null',
    //     gameState: game?.state
    //   });
    // }, [game]);
    return (
        <div className="flex flex-row h-[85%] w-[95%] sm:border-4 border-2 border-black" >
            <IconsList />
            <div className="flex-1 flex justify-center items-center">
                {screen === "homePlay" && (<PlayConnected PlayClick={() => console.log("Play clicked")} /> )}
                {screen === "playNC" && (<PlayNotConnected setScreen={setScreen}/> )}
                {screen === "signIn" && (<SignInClick setScreen={setScreen} /> )}
                {screen === "createAccount" && (<AccountClick setScreen={setScreen} /> )}
            </div>
            {/* <div className="flex-1 flex justify-center items-center">
                <AccountClick PlayClick={() => console.log("Account clicked")} />
            </div> */}
            {/* <div className="flex-1 relative overflow-hidden w-full h-auto" >
                <GameContainer onGameReady={setGame} />
                <StartScreen game={game} /> 
            </div> */}
        </div>
    )
}
