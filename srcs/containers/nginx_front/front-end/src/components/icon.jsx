import homeIcon from "../assets/icons_svg/icon_home.svg"
import profileIcon from "../assets/icons_svg/icon_profile.svg"
import friendsIcon from "../assets/icons_svg/icon_friends.svg"
import statsIcon from "../assets/icons_svg/icon_stats.svg"
import rulesIcon from "../assets/icons_svg/icon_rules.svg"
import { CorbenBold } from "./typography"
import { useAuth } from "../services/authProvider"

export function Icon(props){
    return(
        <div className="flex flex-col items-center m-0.5 md:m-1 group" onClick={props.onClick} >
            <img
                className="w-10 sm:w-12 lg:w-14 h-auto cursor-pointer"
                src={props.image}
                alt={props.text + "icon"}
            />
            <span className="
                bg-red-900 rounded-lg
                my-1 px-2 py-0.5
                cursor-default
                opacity-0
                group-hover:opacity-100
                transition-opacity duration-500">
                    <CorbenBold className="text-[8px] md:text-[10px] text-shell">
                        {props.text}
                    </CorbenBold>   
            </span>
        </div>
    )
}

export function IconsList({setScreen}){
    const {log} = useAuth()
    return(
        <div className= "flex flex-col h-full justify-evenly items-center sm:border-r-4 border-r-2 border-black">
            <Icon 
                image={homeIcon} 
                onClick={() =>setScreen(log ? "homePlay" : "playNC")}
                text="Home"
            />
            <Icon
                image={profileIcon}
                onClick={() =>setScreen(log ? "homePlay" : "playNC")}
                text="Profile"
            />
            <Icon
                image={friendsIcon}
                onClick={() =>setScreen(log ? "homePlay" : "playNC")}
                text="Friends"
            />
            <Icon
                image={statsIcon}
                onClick={() =>setScreen("homePlay")}
                text="Stats"
            />
            <Icon
                image={rulesIcon}
                onClick={() =>setScreen("homePlay")}
                text="Rules"
            />
        </div>
    )
}
