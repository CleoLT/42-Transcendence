import Main from "./components/main.jsx"

export default function App() {
  const background = "/images_png/ground_00.png"

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
    <h1 className="text-5xl text-red-600">Blossom Clash</h1>
    <header />
    <Main />
    <footer />
    </div>
  )
}
