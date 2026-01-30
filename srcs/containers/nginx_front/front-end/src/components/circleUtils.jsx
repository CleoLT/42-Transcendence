export default function Circle(){
  return(
      <div className="h-1/2 relative max-h-[270px] md:max-h-[400px] lg:min-h-[350px] xl:min-h-[500px] aspect-square rounded-full bg-red-600" />
  )
}

export function CutText({text, onClick}){
  return(
      <button 
        onClick={() => onClick?.()} //only if onClick isn't null
        className="flex justify-center items-center group"> // inset-0 absolute
        <Sixtyfour className="text-8xl">{text}</Sixtyfour>
      </button>
  )
}

//component LoginButton --> username + Password + Repeat Password

//icons --> ajouter le hover avec le texte des icones

