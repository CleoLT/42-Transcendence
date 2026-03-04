import {Sixtyfour, CorbenBold, CorbenRegular} from "./typography.jsx"


export function Circle({children, className=""}){
  return(
      <div className={`
        flex items-center justify-center relative
        w-[60vmin] max-w-[270px] md:max-w-[400px]
        lg:min-w-[350px] xl:max-w-[80vmin]
        aspect-square rounded-full
        bg-brightRed
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
        bg-brightRed">
      </div>
  )
}


export function CenterText({text, onClick, className = "", interactive = true}){
  return(
      <div
        onClick={() => onClick?.()} //call onClick only if onClick exist (no null)
        className={"absolute flex items-center justify-center " + (interactive ? "cursor-pointer" : "cursor-default")}>
        <Sixtyfour className={"text-center text-shell " + (interactive ? "hover:text-darkRed " : "") + className}>
          {text}
        </Sixtyfour>
      </div>
  )
}


export function PlaceholderInput({placeholder, className = "", value, onChange, type, autoComplete}){
  return(
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      className={`
        absolute cursor-text
        font-Corben
        text-darkRed
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


export function CirclePlaceholder({ placeholder, className = "", value, onChange, type }) {
 
  return (
    <div
      className="relative w-[190px] h-[190px] md:w-[350px] md:h-[350px] lg:w-[320px] lg:h-[320px] xl:w-[450px] xl:h-[450px] rounded-full bg-greyish flex items-center justify-center overflow-hidden">
      <textarea
        type={type}
        placeholder={placeholder}
        value={value}
        autoComplete="off"
        onChange={(e) => {
          if (e.target.value.length <= 300) onChange(e);
        }}
        maxLength={300}
        className={`
          w-[90%] h-[40%]
          text-center
          font-Corben
          text-darkRed
          placeholder:text-shell 
          text-[10px] md:text-base
          resize-none overflow-auto
          bg-transparent border-none outline-none
          ${className}
        `}
        style={{
          lineHeight: "1.2em",
          display: "block",
        }}
      />
    </div>
  );
}
