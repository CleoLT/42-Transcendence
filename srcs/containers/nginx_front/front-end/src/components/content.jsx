import {IconsList} from "./icon.jsx"
import { useState } from "react"
import GameContainer from "./gameContainer"
import {PlayConnected, PlayNotConnected, SignIn, CreateAccount, GameConfig} from "./circlePages.jsx"
import { Friends } from "./Friends.jsx"

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
        <div className="flex flex-row h-[85%] w-[95%] sm:border-4 border-2 border-black">
            <IconsList setScreen={setScreen} />
            <div className="flex-1 flex justify-center items-center relative overflow-hidden">
                {screen === "homePlay" && (
                    <>
                        <GameContainer onGameReady={setGame} />
                        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                        <div className="pointer-events-auto w-full h-full flex justify-center items-center">
                            <GameConfig game={game} />
                        </div>
                        </div>
                    </>
                )}
                {screen === "playNC" && (<PlayNotConnected setScreen={setScreen} />)}
                {screen === "signIn" && (<SignIn setScreen={setScreen} />)}
                {screen === "createAccount" && (<CreateAccount setScreen={setScreen} />)}
                {screen === "friends" && (<Friends setScreen={setScreen}/>)}

               
            </div>
        </div>
    )
}


// backdrop-blur-xs
