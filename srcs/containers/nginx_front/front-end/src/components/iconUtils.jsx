import { CorbenBold , CorbenRegular, Sixtyfour } from "./typography"


export function IconText({text}){
    return(
        <span className="
            bg-red-900 rounded-lg
            my-1 px-2 py-0.5
            cursor-default
            opacity-0
            group-hover:opacity-100
            transition-opacity duration-500">
                <CorbenBold className="text-[8px] md:text-[10px] text-shell">
                    {text}
                </CorbenBold>   
        </span>
    )
}


export function IconsOverlayFrame(){
    return(
        <div className="h-full w-full bg-shell opacity-75">
        </div>
    )
}


export function ProfilePicture(){

}