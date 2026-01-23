export function Sixtyfour({children, className = ""}){
    return(
        <h1 className={"font-sixtyfour text-s " + className}
          style={{ letterSpacing: "-0.13em" }}>
          {children}
        </h1>
    )
}

export function CorbenBold({children, className = ""}){
  return(
      <h1 className={"font-corben font-bold text-s " + className}
        style={{ letterSpacing: "-0.12em" }}>
        {children}
      </h1>
  )
}

export function CorbenRegular({children, className = ""}){
  return(
      <h1 className={"font-corben font-regular text-s " + className}
        style={{ letterSpacing: "-0.05em" }}>
        {children}
      </h1>
  )
}
