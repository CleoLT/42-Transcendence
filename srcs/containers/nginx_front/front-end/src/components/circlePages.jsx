import {useState} from "react"
import CutText from "./circleUtils.jsx"


// export function PlayNotConnected(){
//   return(
//     <div>
//       <Sixtyfour className="text-4xl text-shell cursor-pointer" onClick={GuestClick}>Guest</Sixtyfour>
//       <CutText text ="PLAY" onClick={null} />
//       <Sixtyfour className="text-4xl text-shell cursor-pointer" onClick={SignInClick}>Sign in</Sixtyfour>
//     </div>
//   )
// }
// //faire responsive et placer les textes


export default function PlayConnected({PlayClick}){
  return(
    <CutText text ="PLAY" onClick={PlayClick} />
  )
}
//faire responsive et placer les textes


//SignInClick --> ouvrir la page de connexion

//GuestClick --> aller sur la page PlayClick

//PlayClick --> ouvrir le jeu

//AccountClick --> ouvrir la page pour creer un compte

//idem all icons..


