import {Sixtyfour, CorbenBold, CorbenRegular} from "./typography.jsx"


export function Circle({children, className=""}){
  return(
      <div className={`
        flex items-center justify-center relative
        w-[60vmin] max-w-[270px] md:max-w-[400px]
        lg:min-w-[350px] xl:max-w-[80vmin]
        aspect-square rounded-full
        bg-red-600
        ${className}`}>
        {children}
      </div>
  )
}


export function SmallCircle(){
  return(
      <div className="
        w-[4vmin] max-w-[20px] md:max-w-[30px]
        lg:min-w-[30px] xl:max-w-[6vmin]
        aspect-square rounded-full
        bg-red-600">
      </div>
  )
}


export function CenterText({text, onClick, className = "", interactive = true}){
  return(
      <div
        onClick={() => onClick?.()} //call onClick only if onClick exist (no null)
        className={"absolute flex items-center justify-center " + (interactive ? "cursor-pointer" : "cursor-default")}>
        <Sixtyfour className={"text-center text-shell " + (interactive ? "hover:text-red-900 " : "") + className}>
          {text}
        </Sixtyfour>
      </div>
  )
}


export function LogInInput({placeholder, className = "", value, onChange, type}){
  return(
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`
        absolute cursor-text
        font-Corben
        text-red-900
        text-center
        text-[10px] md:text-base
        placeholder:font-Corben
        placeholder:text-shell
        placeholder:text-center
        placeholder:text-[10px] md:placeholder:text-base
        bg-greyish
        rounded-3xl 
        w-[150px] h-[17px] md:w-[250px] md:h-[35px] xl:w-[300px] xl:h-[40px]
        ${className}`} />
  )
}
