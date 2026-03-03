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


export function PlaceholderInput({placeholder, className = "", value, onChange, type}){
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


// export function CirclePlaceholder({placeholder, className = "", value, onChange, type}){
//   return(
//     <textarea
//       type={type}
//       placeholder={placeholder}
//       value={value}
//       onChange={onChange}
//       className={`
//         absolute
//         cursor-text
//         font-Corben
//         text-red-900
//         text-center
//         text-[10px] md:text-base
//         placeholder:font-Corben
//         placeholder:text-shell
//         placeholder:text-center
//         placeholder:text-[10px] md:placeholder:text-base
//         bg-greyish
//         rounded-full
//         w-[330px] h-[330px]
//         resize-none
//         p-6
//         maxLength={300} 
//         overflow-y-auto
//         box-border
//         ${className}`}
//         style={{
//           paddingTop: "30%",
//           lineHeight: "1.2em",
//           paddingBottom: "60%",

//       }}
//     />
//   )
// }


export function CirclePlaceholder({ placeholder, className = "", value, onChange, type }) {
 
  return (
    <div
      className="relative w-[330px] h-[330px] rounded-full bg-greyish flex items-center justify-center overflow-hidden">
      <textarea
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          if (e.target.value.length <= 300) onChange(e);
        }}
        maxLength={300}
        className={`
          w-[90%] h-[40%]
          text-center
          font-Corben
          text-red-900
          placeholder:text-shell 
          text-[10px] md:text-base
          resize-none overflow-auto
          bg-transparent border-none outline-none
        `}
        style={{
          lineHeight: "1.2em",
          display: "block",
        }}
      />
    </div>
  );
}

