import {Circle} from "./circleUtils.jsx"
import StartScreen from "./startScreen"
import GameContainer from "./gameContainer"
import {IconsList} from "./icon.jsx"
import { useState, useEffect } from "react"
import {PlayConnected, PlayNotConnected, SignIn, CreateAccount} from "./circlePages.jsx"

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
                {screen === "homePlay" && (<PlayConnected setScreen={setScreen} /> )}
                {screen === "playNC" && (<PlayNotConnected setScreen={setScreen} /> )}
                {screen === "signIn" && (<SignIn setScreen={setScreen} /> )}
                {screen === "createAccount" && (<CreateAccount setScreen={setScreen} /> )}
                {screen === "game" && (<StartScreen setScreen={setScreen} game={game} /> )}
            </div>
            {/* <div className="flex-1 relative overflow-hidden w-full h-auto" >
                <GameContainer onGameReady={setGame} />
                <StartScreen game={game} /> 
            </div> */}
        </div>
    )
}


// backdrop-blur-xs