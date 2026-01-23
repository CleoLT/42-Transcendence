import Content from "./components/content.jsx"
import Header from "./components/header.jsx"
import {Sixtyfour, CorbenBold, CorbenRegular} from "./components/typography.jsx"

export default function App() {
  const background = "/images_png/ground_00.png"
  const flowerGround = "/images_png/flower_ground.png"

  return (
    <div
      className="relative flex flex-col h-screen items-center justify-center">
      <div className="absolute inset-0 bg-cover"
        style={{backgroundImage: "url("+ background + ")"}}>
      </div>
      <div className="absolute inset-0 bg-no-repeat opacity-50"
          style={{
            backgroundImage: "url("+ flowerGround + ")",
            backgroundSize: "50%",
            backgroundPosition: "right bottom"}}>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <Header />
        <Content />
        {/* <Footer /> */}
      </div>
    </div>
  )
}
