import { CorbenBold , CorbenRegular, Sixtyfour } from "./typography"
import {IconText, IconsOverlayFrame, ProfilePicture, ChopstickButton} from "./iconUtils"


export function UserData({data}){
    return(
        <div className="flex flex-col border rounded-xl border-greyish px-10 py-3 justify-between items-center gap-x-2" >
            <div className="flex items-center">
                <Sixtyfour children="Emilie" onClick="null" className="text-[0.6rem]" />
                {/* <Sixtyfour children={data.username} onClick="null" className="text-base" /> */}
                <ChopstickButton text="Change name"/>
            </div>
            <br />
            <Sixtyfour children="Email: emilie@gmail.com" onClick="null" className="text-[0.6rem]" />
            {/* <Sixtyfour children={data.email} onClick="null" className="text-base" /> */}
            <ChopstickButton text="Change email"/>
            <br />

        </div>
    )
}


export function Profile({setScreen}){
    return(
        <div className="relative w-full h-screen">
            <div className="absolute inset-0">
                <IconsOverlayFrame />
            </div>
            <div className="relative z-10 flex justify-center items-center h-full gap-x-10 gap-y-5">
                <button className="group relative" >
                    <ProfilePicture
                        src="/avatars/cat.jpg"
                        className="w-40 h-40" />
                    <div className="absolute top-1/4 left-3/4">
                        <IconText text={"Change Avatar"} />
                    </div>
                </button>
                <UserData />
            </div>
        </div>
    )
}

//request for Avatar and not Hardcoded


export function Friends({setScreen}){
    return(
        <>
            <IconsOverlayFrame />
        </>
    )
}


export function Rules(){
    return(
        <>
            <IconsOverlayFrame />
        </>
    )
}


export function Project(){
    return(
        <>
            <IconsOverlayFrame />
        </>
    )
}
