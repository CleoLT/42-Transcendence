import {IconsList} from "./iconUtils"
import { useState } from "react"
import GameContainer from "./gameContainer"
import {PlayConnected, PlayNotConnected, SignIn, CreateAccount, GameConfig, GameReset} from "./circlePages.jsx"
import {Project} from "./projectPage.jsx"
import {Profile} from "./profilePages"
import {Friends} from "./friends.jsx"
import {Privacy} from "./policyPrivacity.jsx"
import { TermsOfServices } from "./termsOfService.jsx"
import { Rules } from "./rulesPage.jsx"


export default function Content({screen, setScreen}){
    const [game, setGame] = useState(null);
    const [hasStarted, setHasStarted] = useState(false);

    const onGameReady = (gameInstance) => {
        setGame(gameInstance);
        gameInstance?.setOnBackToMenu?.(() => setHasStarted(false));
        gameInstance?.setOnGameEnd?.(() => setScreen("gameReset"));
    };

    const handlePlayAgain = () => {
        game?.resetGame?.();
        setHasStarted(false);
        setScreen("game");
    };

    return (
        <div className="flex flex-row h-[85%] w-[95%] sm:border-4 border-2 border-black">
            <IconsList setScreen={setScreen} />
            <div className="flex-1 flex justify-center items-center relative overflow-validate">
                {screen === "homePlay" && (<PlayConnected setScreen={setScreen} />)}
                {(screen === "game" || screen === "gameReset") && (
                    <>
                        <GameContainer onGameReady={onGameReady} />
                        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                            <div className="pointer-events-none w-full h-full flex justify-center items-center">
                                {screen === "game" && (
                                    <GameConfig game={game} hasStarted={hasStarted} setHasStarted={setHasStarted} />
                                )}
                                {screen === "gameReset" && (
                                    <GameReset game={game} setScreen={setScreen} onPlayAgain={handlePlayAgain} />
                                )}
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
                {screen === "project" && (<Project />)}
                {screen === "privacy" && (<Privacy />)}
                {screen === "terms" && (<TermsOfServices />)}
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
