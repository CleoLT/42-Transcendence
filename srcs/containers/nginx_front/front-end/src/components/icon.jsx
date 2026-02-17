import homeIcon from "../assets/icons_svg/icon_home.svg"
import profileIcon from "../assets/icons_svg/icon_profile.svg"
import friendsIcon from "../assets/icons_svg/icon_friends.svg"
import projectIcon from "../assets/icons_svg/icon_project.svg"
import rulesIcon from "../assets/icons_svg/icon_rules.svg"
import {CorbenBold} from "./typography"
import {useAuth} from "../services/authProvider"
import {IconText} from "./iconUtils"


export function Icon(props){
    return(
        <div className="flex flex-col items-center mx-0.5 md:mx-1 group" onClick={props.onClick} >
            <img
                className="w-10 sm:w-12 lg:w-13 xl:w-14 h-auto cursor-pointer"
                src={props.image}
                alt={props.text + "icon"}
            />
            <IconText text={props.text}/>
        </div>
    )
}


export function IconsList({setScreen}){
    const {log} = useAuth()
    return(
        <div className= "flex flex-col h-full justify-between items-center py-1 sm:border-r-4 border-r-2 border-black">
            <Icon 
                image={homeIcon} 
                onClick={() =>setScreen(log ? "homePlay" : "playNC")}
                text="Home"
            />
            <Icon
                image={profileIcon}
                onClick={() =>setScreen(log ? "profile" : "playNC")}
                text="Profile"
            />
            <Icon
                image={friendsIcon}
                onClick={() =>setScreen(log ? "friends" : "playNC")}
                text="Friends"
            />
            <Icon
                image={rulesIcon}
                onClick={() =>setScreen("rules")}
                text="Rules"
            />
            <Icon
                image={projectIcon}
                onClick={() =>setScreen("project")}
                text="Project"
            />
        </div>
    )
}
