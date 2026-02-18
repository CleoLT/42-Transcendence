import { CorbenBold , CorbenRegular, Sixtyfour } from "./typography"
import {IconText, IconsOverlayFrame, ProfilePicture} from "./iconUtils"


export function Profile({setScreen}){
    return(
        <div className="relative w-full h-screen">
            <div className="absolute inset-0">
                <IconsOverlayFrame />
            </div>
            <div className="relative z-10 flex justify-center items-center h-full">
                <ProfilePicture
                    src="/avatars/cat.jpg"
                    className="w-40 h-40" />
            </div>
        </div>
    )
}


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
