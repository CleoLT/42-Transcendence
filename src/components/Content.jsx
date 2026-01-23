import {IconsList} from "./icon.jsx"
import GameContainer from "./GameContainer";

export default function Content(){
    return (
        <div 
            className="flex flex-row h-[85%] w-[95%] lg:border-8 sm:border-4 border-2 border-black" >
            <IconsList />
            <div className="flex-1 relative">
                <GameContainer />
            </div>
        </div>
    )
}