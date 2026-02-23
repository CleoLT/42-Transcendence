import { CorbenBold , CorbenRegular, Sixtyfour } from "./typography"
import {IconText, IconsOverlayFrame, ProfilePicture, ChopstickButton, OverlayPage, DisplayDate, LargeButton, DisplayIcon} from "./iconUtils"
import {useState, useEffect} from "react"
import { Circle } from "./circleUtils"
import {useAuth} from "../services/authProvider"
import {getUserInfo} from "../services/authService"


export function ChangeAvatar({setScreenProfile}){
    const [avatar, setAvatar] = useState(null)

    return(
        <div className="flex flex-col relative w-full h-full justify-center items-center">
            <Circle className="bg-shell border-2 border-greyish p-10">
                <div className="flex flex-col gap-2 justify-center items-center">
                    <div className="flex gap-2">
                        <DisplayIcon children="/avatars/cat.jpg" avatar={avatar} setAvatar={setAvatar}/>
                        <DisplayIcon children="/avatars/bird_04.jpg" avatar={avatar} setAvatar={setAvatar}/>
                        <DisplayIcon children="/avatars/butterfly_02.png" avatar={avatar} setAvatar={setAvatar}/>
                        <DisplayIcon children="/avatars/dragonfly.jpg" avatar={avatar} setAvatar={setAvatar}/>
                    </div>
                    <div className="flex gap-2 pb-4">
                        <DisplayIcon children="/avatars/jellyfish_01.jpg" avatar={avatar} setAvatar={setAvatar}/>
                        <DisplayIcon children="/avatars/koi_carp_03.jpg" avatar={avatar} setAvatar={setAvatar}/>
                        <DisplayIcon children="/avatars/moonfish.jpg" avatar={avatar} setAvatar={setAvatar}/>
                        <DisplayIcon children="/avatars/sushi.jpg" avatar={avatar} setAvatar={setAvatar}/>
                        <DisplayIcon children="/avatars/swan.jpg" avatar={avatar} setAvatar={setAvatar}/>
                    </div>
                    <CorbenRegular children="or" className="text-greyish pb-4" />
                    <LargeButton children="Upload your Avatar" />
                </div>
            </Circle>
        </div>
    )
}

//<button disabled={!selectedAvatar} ...>Confirmer</button>


export function UserData({data, setScreenProfile}){
    if(!data)
        return <div>Loading...</div>

    const date = DisplayDate(data.created_at)

    return(
        <div className="
            flex flex-col border rounded-xl border-greyish
            px-5 py-3 sm:px-10 justify-between items-center
            gap-x-2 text-[0.5rem] sm:text-[0.6rem]" >
            <div className="flex gap-x-2 items-center pb-3">
                <Sixtyfour children={data.username} onClick={null} />
                <ChopstickButton text="Change name" onClick={() =>setScreenProfile("name")}/>
            </div>
            <div className="flex gap-x-2 items-center">
                <Sixtyfour children={data.email} onClick={null} />
                {/* <ChopstickButton text="Change email" onClick={() =>setScreenProfile("email")}/> */}
            </div>
            <Sixtyfour children={`Player since ${date}`} onClick={null} />
            <button className="pt-3" >
                <Sixtyfour children="Change password" onClick={() =>setScreenProfile("password")} className="hover:text-red-900" />
                <Sixtyfour children="Delete account" onClick={() =>setScreenProfile("delete")} className="hover:text-red-900" />
            </button>
        </div>
    )
}


export function Profile(){
    const [screenProfile, setScreenProfile] = useState("profile");
    const {userId} = useAuth()
    const [data, setData] = useState(null)

    useEffect(() => {
        if (!userId) return
      
        (async () => {
            const response = await getUserInfo(userId)
            setData(response)
        }) ()
    }, [userId])

    if (!data) return <div>Loading...</div>
    // console.log("LOG TRUE: ", log, "Username: ", username, "userId: ", userId)
    
    return(
        <div className="flex flex-col relative w-full h-full justify-center items-center">       
            <div className="absolute inset-0">
                <IconsOverlayFrame />
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-x-16">
                <button className="group relative" onClick={() =>setScreenProfile("avatar")} >
                    <ProfilePicture
                        src="/avatars/cat.jpg"
                        // src={data.avatar}
                        className="w-24 h-24 sm:w-40 sm:h-40" />
                    <div className="absolute top-1/4 left-3/4">
                        <IconText text={"Change Avatar"} />
                    </div>
                </button>
                <UserData data={data} setScreenProfile={setScreenProfile}/>
            </div>
            <div className="relative z-10 flex justify-center items-center mt-3 sm:mt-10">
                <div className="flex border rounded-xl border-greyish px-5 py-3 sm:p-5 items-start mx-16" >
                    <Sixtyfour children={data.bio}  onClick={null}
                        className="flex-1 text-[0.5rem] sm:text-[0.6rem]" />
                    <ChopstickButton text="Change bio" onClick={() =>setScreenProfile("infos")}/>
                </div>
            </div>
            {screenProfile === "avatar" && (
                <OverlayPage onClose={() => setScreenProfile("profile")}> 
                    <ChangeAvatar setScreenProfile={setScreenProfile}/>
                </OverlayPage>    
            )}
        </div>
    )
}

{/*test max char de username/email/infos*/}

//faire en sorte que la bio ne soit jamais vide
