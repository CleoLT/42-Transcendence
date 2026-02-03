import {Sixtyfour, CorbenBold, CorbenRegular} from "./typography.jsx"

export function Circle(){
  return(
      <div className="h-1/2 relative max-h-[270px] md:max-h-[400px] lg:min-h-[350px] xl:min-h-[80%] aspect-square rounded-full bg-red-600" />
  )
}

export function CutText({text, onClick}){
  return(
      <button 
        onClick={() => onClick?.()} //only if onClick isn't null
        className={"absolute flex justify-center items-center " + (onClick ? "cursor-pointer" : "cursor-default")}>
        <Sixtyfour className="text-5xl xl:text-9xl md:text-7xl text-shell">{text}</Sixtyfour>
      </button>
  )
}

export function LogInButton({text}){
  return(
    <button className="absolute flex justify-center items-center bg-greyish rounded-xl text-xs px-11 py-0 md:px-25 lg:px-20 xl:px-40 xl:py-1 ">
      <CorbenRegular className="text-shell " >
        {text}
      </CorbenRegular>
    </button>
  )
}


//icons --> ajouter le hover avec le texte des icones

