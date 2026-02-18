import {IconsList} from "./iconUtils"
import { useState } from "react"
import GameContainer from "./gameContainer"
import {PlayConnected, PlayNotConnected, SignIn, CreateAccount, GameConfig} from "./circlePages.jsx"
import {Profile, Friends, Rules, Project} from "./iconPages"


export default function Content({screen, setScreen}){
    const [game, setGame] = useState(null);

    return (
        <div className="flex flex-row h-[85%] w-[95%] sm:border-4 border-2 border-black">
            <IconsList setScreen={setScreen} />
            <div className="flex-1 flex justify-center items-center relative overflow-hidden">
                {screen === "homePlay" && (<PlayConnected setScreen={setScreen} />)}
                {screen === "game" && (
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
                {screen === "profile" && (<Profile setScreen={setScreen} />)}
                {screen === "friends" && (<Friends setScreen={setScreen} />)}
                {screen === "rules" && (<Rules setScreen={setScreen} />)}
                {screen === "project" && (<Project setScreen={setScreen} />)}
            </div>
        </div>
    )
}


{/* <GameContainer onGameReady={setGame} /> --> need to be call inside Game config at the end to not have the white screen */}

    // const [screen, setScreen] = useState("playNC")
    // // Debug: log when game state changes
    // useEffect(() => {
    //   console.log('📦 Content: game state changed', {
    //     game: game ? 'exists' : 'null',
    //     gameState: game?.state
    //   });
    // }, [game]);

// backdrop-blur-xs
