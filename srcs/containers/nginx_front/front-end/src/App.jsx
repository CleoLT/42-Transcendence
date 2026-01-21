import Content from "./components/content.jsx"
import Header from "./components/header.jsx"
import {Sixtyfour, CorbenBold, CorbenRegular} from "./components/typography.jsx"

export default function App() {
  const background = "/images_png/ground_00.png"

  return (
    <div
      className="flex flex-col h-screen bg-cover items-center justify-center"
      style={{backgroundImage: "url("+ background + ")"}}>
      <Header/>
      <Content/>
      {/* <Footer /> */}
    </div>
  )
}
