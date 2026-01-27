export default function Circle({className = ""}){
  return(
      <div className={
        "h-1/2 max-h-[270px] md:max-h-[400px] lg:min-h-[350px] xl:min-h-[500px] " +
        "aspect-square rounded-full bg-red-600 " + className} />
  )
}
