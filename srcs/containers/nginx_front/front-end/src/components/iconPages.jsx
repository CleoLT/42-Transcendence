import { CorbenBold , CorbenRegular, Sixtyfour } from "./typography"
import {IconText, IconsOverlayFrame, ProfilePicture, ChopstickButton} from "./iconUtils"


export function UserData({data}){
    return(
        <div className="
            flex flex-col border rounded-xl border-greyish
            px-5 py-3 sm:px-10 justify-between items-center
            gap-x-2 text-[0.5rem] sm:text-[0.6rem]" >
            <div className="flex gap-x-2 items-center pb-3">
                <Sixtyfour children="Emilie" onClick="null" />
                {/* <Sixtyfour children={data.username} onClick="null" className="text-base" /> */}
                <ChopstickButton text="Change name"/>
            </div>
            <div className="flex gap-x-2 items-center">
                <Sixtyfour children="Email: emilie@gmail.com" onClick="null" />
                {/* <Sixtyfour children={data.email} onClick="null" className="text-base" /> */}
                <ChopstickButton text="Change email"/>
            </div>
            <Sixtyfour children="Player since 01/01/2025" onClick="null" />
            {/* <Sixtyfour children={data.date} onClick="null" className="text-base" /> */}
            <button className="pt-3" >
                <Sixtyfour children="Change password" onClick="null" className="hover:text-red-900" />
                <Sixtyfour children="Delete account" onClick="null" className="hover:text-red-900" />
            </button>
        </div>
    )
}


export function Profile({setScreen}){
    return(
        <div className="flex flex-col relative w-full min-h-screen justify-center items-center">
            <div className="absolute inset-0">
                <IconsOverlayFrame />
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-x-16">
                <button className="group relative" >
                    <ProfilePicture
                        src="/avatars/cat.jpg"
                        className="w-24 h-24 sm:w-40 sm:h-40" />
                    <div className="absolute top-1/4 left-3/4">
                        <IconText text={"Change Avatar"} />
                    </div>
                </button>
                <UserData />
            </div>
            <div className="relative z-10 flex justify-center items-center mt-3 sm:mt-10">
                <div className="flex border rounded-xl border-greyish px-5 py-3 sm:p-5 items-start mx-16" >
                    <Sixtyfour 
                        children={
                            <>
                                Some words about you.. Are you a flower addict?... <br />
                                Are you a cat or a dog person ? <br />
                                Do you hate MAGA as such as the team? <br />
                                4 x space or tab user? <br />
                                Are you in Epstein files ? Do you personally know anyone mentioned in it? <br />
                                ...<br />
                                ...
                            </> }
                        onClick="null"
                        className="flex-1 text-[0.5rem] sm:text-[0.6rem]" />
                    {/* <Sixtyfour children={data.info} onClick="null" className="text-base" /> */}
                    <ChopstickButton text="Change infos"/>
                </div>
            </div>
        </div>
    )
}

//request for Avatar Hardcoded
//test max char de username/email/infos


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
