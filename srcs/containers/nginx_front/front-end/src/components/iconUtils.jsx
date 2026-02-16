import { CorbenBold , CorbenRegular, Sixtyfour } from "./typography"

export function IconsList({setScreen}){
    return(
        <div className= "flex flex-col h-full justify-evenly items-center sm:border-r-4 border-r-2 border-black">
            <Icon image={homeIcon} onClick={() =>setScreen("homePlay")} text="Home" />
            <Icon image={profileIcon} onClick={() =>setScreen("homePlay")} text="Profile" />
            <Icon image={friendsIcon} text="Friends" />
            <Icon image={statsIcon} text="Stats" />
            <Icon image={rulesIcon} text="Rules" />
        </div>
    )
}

export function IconsOverlayFrame({setScreen}){
    return(
        <div className="h-full w-full background-shell">
        </div>
    )
}
