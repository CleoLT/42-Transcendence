export function Sixtyfour({children, className = "", onClick}){
    return(
        <h1 className={"font-sixtyfour " + className}
          onClick={onClick}
          style={{ letterSpacing: "-0.13em" }}>
          {children}
        </h1>
    )
}

export function CorbenBold({children, className = ""}){
  return(
      <h1 className={"font-corben font-bold " + className}
        style={{ letterSpacing: "-0.12em" }}>
        {children}
      </h1>
  )
}

export function CorbenRegular({children, className = "", onClick}){
  return(
      <h1 className={"font-corben font-regular " + className}
        onClick={onClick}
        style={{ letterSpacing: "-0.05em" }}>
        {children}
      </h1>                          
  )
}

export function P({children}) {
    return (
        <>
            <p className="font-corben font-regular text-[0.5rem] md:text-[0.7rem]" style={{ letterSpacing: "-0.05em" }}>{children}</p>
        </>
    )
}

export function H4({children}) {
    return (
        <>
            <h3 className="font-corben underline text-[0.5rem] md:text-[0.7rem]"
        style={{ letterSpacing: "-0.12em" }}>{children}</h3>
        </>
    )
}

export function H3({children}) {
    return (
        <>
            <h3 className="font-corben font-bold text-[0.5rem] md:text-[0.7rem]"
        style={{ letterSpacing: "-0.12em" }}>{children}</h3>
        </>
    )
}

export function H2({children}) {
    return (
      <>
        <h2 className="font-sixtyfour text-[0.5rem] md:text-[0.7rem] pt-2 md:pt-3"
        style={{ letterSpacing: "-0.13em" }}>{children}</h2>
      </>
    )
}

export function LI({children}) {
  return (
    <>
      <li className="font-corben font-regular text-[0.5rem] md:text-[0.7rem]" style={{ letterSpacing: "-0.05em" }}>{children}</li>
    </>
  )
}

export function UL({children}) {
  return (
    <>
      <ul className="list-disc pl-6 space-y-1 text-[0.5rem] md:text-[0.7rem]">{children}</ul>
    </>
  )
}