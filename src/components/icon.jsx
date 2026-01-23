import homeIcon from "../assets/icons_svg/icon_home.svg"
import profileIcon from "../assets/icons_svg/icon_profile.svg"
import friendsIcon from "../assets/icons_svg/icon_friends.svg"
import statsIcon from "../assets/icons_svg/icon_stats.svg"
import rulesIcon from "../assets/icons_svg/icon_rules.svg"

export function Icon(props){
    return(
        <img
            className="pl-[10%] h-[17%] w-auto"
            src={props.image}
            alt={props.text + "icon"}
        />
    )
}

export function IconsList(props){
    return(
        <div className= "flex flex-col h-full justify-evenly pr-[0.5%] lg:border-r-8 sm:border-r-4 border-r-2 border-black">
            <Icon image={homeIcon} text="Home" />
            <Icon image={profileIcon} text="Profile" />
            <Icon image={friendsIcon} text="Friends" />
            <Icon image={statsIcon} text="Stats" />
            <Icon image={rulesIcon} text="Rules" />
        </div>
    )
}