import homeIcon from "../assets/icons_svg/icon_home.svg"
import profileIcon from "../assets/icons_svg/icon_profile.svg"
import friendsIcon from "../assets/icons_svg/icon_friends.svg"
import projectIcon from "../assets/icons_svg/icon_project.svg"
import rulesIcon from "../assets/icons_svg/icon_rules.svg"
import {useAuth} from "../services/authProvider"
import { CorbenBold , CorbenRegular, Sixtyfour } from "./typography"


export function IconText({text, className=""}){
    return(
        <span className={`
            flex
            bg-darkRed rounded-lg
            my-1 px-2 py-0.5
            cursor-pointer
            opacity-0
            group-hover:opacity-100
            transition-opacity duration-500
            whitespace-nowrap 
            ${className}`}
        >
                <CorbenBold className="text-[7px] md:text-[9px] text-shell mobile-landscape:text-[4px]">
                    {text}
                </CorbenBold>   
        </span>
    )
}


export function Icon(props){
    return(
        <div className="flex flex-col items-center justify-center flex-1 min-h-0 group" onClick={props.onClick} >
            <div className="max-h-16 mobile-landscape:max-h-8 flex items-center justify-center "></div>
            <img
                className="h-full w-auto cursor-pointer object-contain"
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
        <div className= "flex flex-col h-full justify-between items-center py-1 px-1 sm:border-r-4 border-r-2 border-black mobile-landscape:border">
            <Icon 
                image={homeIcon} 
                onClick={() =>setScreen(log ? "homePlay" : "playNC")}
                text="Home"
            />
            <Icon
                image={profileIcon}
                onClick={() =>setScreen(log ? "profile" : "signIn")}
                text="Profile"
            />
            <Icon
                image={friendsIcon}
                onClick={() =>setScreen(log ? "friends" : "signIn")}
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


export function IconsOverlayFrame(){
    return(
        <div className="h-full w-full bg-shell opacity-75">
        </div>
    )
}


export function ProfilePicture({src, className="", onClick}){
    return(
        <div
            className={`rounded-full border border-greyish overflow-hidden ${className}`}
            onClick={onClick}
            >
            <img
                src={src}
                alt="avatar image"
                className = "h-full w-full object-cover" />
        </div>
    )
}


export function ChopstickButton({text, onClick}){
    return(
        <button className="group relative flex items-center" onClick={onClick}>
            <img src="/validation_icons/chopsticks.svg" alt="chopstick button icon" className="w-4 h-auto mobile-landscape:w-3" />
            <div className="absolute z-20 left-2/3 top-1/2 transform -translate-y-1/2 ml-2">
                <IconText text={text} />
            </div>
        </button>
    )
}


export function OverlayPage({children, onClose}){
    return(
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black/40 backdrop-blur-sm">
            <div className="relative flex justify-center items-center">
                {children}
            </div>
            < div
                className="absolute inset-0 -z-10"
                onClick={onClose}
            />
        </div>
    )
}


export function DisplayDate(string){
    if (!string)
        return null

    const newString = string.slice(0,10)

    return(newString)
}


export function DisplayIcon({children, avatar, setAvatar, setAvatarFile}){
    return(
        <ProfilePicture
        src={children}
        className={`w-8 h-8 sm:w-12 sm:h-12 cursor-pointer
        ${avatar === children? "brightness-50" : "brightness-100"} filter`}
        onClick={() => {setAvatar(children); setAvatarFile(null)}} />
    )
}


export function LargeButton({children, onClick}){
    return(
        <button
            onClick={onClick}
            className="
                text-center
                bg-greyish
                rounded-3xl 
                w-[150px] h-[17px]
                md:w-[250px] md:h-[35px]
                xl:w-[300px] xl:h-[40px]"
        >
            <CorbenRegular className="text-shell text-[10px] md:text-base">
                {children}
            </CorbenRegular>
        </button>
    )
}
