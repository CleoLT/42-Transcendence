import Content from "./components/content.jsx"
import Header from "./components/header.jsx"
import {Footer} from "./components/footer.jsx"
import {Sixtyfour, CorbenBold, CorbenRegular} from "./components/typography.jsx"
import {useState, useEffect} from "react"
import {useAuth} from "./services/authProvider"

export default function App() {
  const background = "/images_png/ground_00.png"
  const flowerGround = "/images_png/flower_ground.png"
  const {log} = useAuth()
  const [screen, setScreen] = useState("playNC")
  // const [initialized, setInitialized] = useState(false)

  useEffect(() =>
  {
    if (log)
      {setScreen("homePlay")}
    else 
      {setScreen("playNC")}
  }, [log])

  // useEffect(() => {
  //   if (!initialized) {
  //     setScreen(log ? "homePlay" : "playNC")
  //     setInitialized(true)
  //   }
  // }, [log, initialized])
  
  return (
    <div
      className="relative flex flex-col h-screen items-center justify-center">
      <div className="absolute inset-0 bg-cover"
        style={{backgroundImage: "url("+ background + ")"}}>
      </div>
      <img src={flowerGround} alt="flower"
           className="absolute bottom-0 right-0 opacity-50 w-[100vw] md:w-[75vw] lg:w-[50vw]" />
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <Header screen={screen} setScreen={setScreen} />
        <Content screen={screen} setScreen={setScreen} />
        <Footer screen={screen} setScreen={setScreen}/>
      </div>
    </div>
  )
}
