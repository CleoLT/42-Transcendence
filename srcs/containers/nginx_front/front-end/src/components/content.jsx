import {IconsList} from "./icon.jsx"
import { useState } from "react"
import GameContainer from "./gameContainer"
import {PlayConnected, PlayNotConnected, SignIn, CreateAccount, GameConfig} from "./circlePages.jsx"

export default function Content({screen, setScreen}){
    const [game, setGame] = useState(null);
    const [hasStarted, setHasStarted] = useState(false);

    const onGameReady = (gameInstance) => {
        setGame(gameInstance);
        gameInstance?.setOnBackToMenu?.(() => setHasStarted(false));
    };

    return (
        <div className="flex flex-row h-[85%] w-[95%] sm:border-4 border-2 border-black">
            <IconsList setScreen={setScreen} />
            <div className="flex-1 flex justify-center items-center relative overflow-hidden">
                {screen === "homePlay" && (
                    <>
                        <GameContainer onGameReady={onGameReady} />
                        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                        <div className="pointer-events-none w-full h-full flex justify-center items-center">
                            <GameConfig game={game} hasStarted={hasStarted} setHasStarted={setHasStarted} />
                        </div>
                        </div>
                    </>
                )}
                {screen === "playNC" && (<PlayNotConnected setScreen={setScreen} />)}
                {screen === "signIn" && (<SignIn setScreen={setScreen} />)}
                {screen === "createAccount" && (<CreateAccount setScreen={setScreen} />)}

               
            </div>
        </div>
    )
}


// backdrop-blur-xs
