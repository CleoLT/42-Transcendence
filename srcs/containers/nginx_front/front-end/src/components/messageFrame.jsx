import { CorbenRegular} from "./typography.jsx"

export function MessageFrame({text}){
    return(
        <div className="
            // flex justify-center items-center
            xl:w-[200px]
            xl:h-[100px]
            bg-greyish
            rounded-xl
            
            ">
          <CorbenRegular className="text-center">
            {text}
          </CorbenRegular>
        </div>
    )
}
// className={`
//   absolute cursor-text
//   font-Corben
//   text-red-900
//   text-center
//   text-[10px] md:text-base
//   bg-greyish
//   rounded-3xl 
//   w-[150px] h-[17px] md:w-[250px] md:h-[35px] xl:w-[300px] xl:h-[40px]
//   ${className}`} />

