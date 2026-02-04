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
