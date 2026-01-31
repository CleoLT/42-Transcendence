import {useState} from "react"
import {Circle, CutText, LogInButton} from "./circleUtils.jsx"
import {Sixtyfour, CorbenBold, CorbenRegular} from "./typography.jsx"

export function PlayConnected({PlayClick}){
  return(
    <div className="relative flex justify-center items-center h-full w-full">
      <Circle/>
      <CutText text ="PLAY" onClick={PlayClick} />
    </div>
  )
}

export function PlayNotConnected(){
  return(
    <div className="relative flex flex-col justify-center items-center h-full w-full">
      <Circle/>
      <Sixtyfour className="absolute text-l top-[37%] md:text-2xl md:top-[38%] lg:top-[32%] xl:top-[30%] xl:text-4xl text-shell cursor-pointer hover:text-red-900">Guest</Sixtyfour>
      {/* onClick={GuestClick} */}
      <CutText text ="PLAY" onClick={null} />
      <Sixtyfour className="absolute text-l bottom-[37%] md:text-2xl md:bottom-[38%] lg:bottom-[32%] xl:bottom-[30%] xl:text-4xl text-shell cursor-pointer  hover:text-red-900">Sign in</Sixtyfour>
      {/* onClick={SignInClick} */}
    </div>
  )
}

//connexion page

export function SignInClick (){
  return(
    <div className="relative flex flex-col justify-center items-center h-full w-full">
      <Circle/>
      <LogInButton text="Username" />
      <CutText text ="CONNECT" />
      {/* onClick={PlayConnected} */}
      <LogInButton text="Password" />
      <CorbenRegular className="absolute flex text-shell justify-center items-center text-xs" children="Create an account" />
    </div>
  )
}
//reduire "connect" a  text-4xl xl:text-8xl md:text-6xl


//GuestClick --> aller sur la page PlayClick

//PlayClick --> ouvrir le jeu

//AccountClick --> ouvrir la page pour creer un compte

//idem all icons..


