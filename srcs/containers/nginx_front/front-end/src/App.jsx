import Content from "./components/content.jsx"
import Header from "./components/header.jsx"
import {Sixtyfour, CorbenBold, CorbenRegular} from "./components/typography.jsx"
import {useState} from "react"

export default function App() {
  const background = "/images_png/ground_00.png"
  const flowerGround = "/images_png/flower_ground.png"
  const [screen, setScreen] = useState("playNC")

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
        {/* <Footer /> */}
      </div>
    </div>
  )
}


