import {useState} from "react"
import {Circle, CenterText, LogInInput} from "./circleUtils.jsx"
import {Sixtyfour, CorbenBold, CorbenRegular} from "./typography.jsx"
import { Login, Register, Logout } from "../services/authService"
import {AlertMessage} from "../services/alertMessage"
import {useAuth} from "../services/authProvider"


export function PlayConnected({setScreen}){
  return(
    <div className="flex justify-center items-center h-full w-full">
      <Circle>
        <button className="flex justify-center items-center">
          <CenterText
            text ="PLAY"
            onClick={() =>setScreen("game")}
            interactive={true}
            className="
              text-5xl
              md:text-7xl
              xl:text-8xl"
          />
        </button>
      </Circle>
    </div>
  )
}

export function GameConfig({ game }) {
  const [configVisible, setConfigVisible] = useState(false)
  const [player1Name, setPlayer1Name] = useState("")
  const [player2Name, setPlayer2Name] = useState("")
  const [vsAI, setVsAI] = useState(true)
  const [difficulty, setDifficulty] = useState("easy")
  const [hasStarted, setHasStarted] = useState(false)

  const _p1 = Boolean(player1Name.trim())
  const _p2 = vsAI || Boolean(player2Name.trim())
  const canPlay = _p1 && _p2 && !!game

  const handlePlayClick = () => {

    if (!canPlay) return

    const p1 = player1Name.trim()
    const p2 = vsAI ? "AI" : player2Name.trim()

    game.setAIMode(vsAI, difficulty)
    game.startGame(p1, p2)
    setHasStarted(true)
  }

  if (hasStarted) return null

  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <Circle>
        {!game ? (
          <Sixtyfour className="text-shell text-center text-xl md:text-3xl">
            Loading...
          </Sixtyfour>
        ) : (
          <>
            <button className="flex justify-center items-center">
              <CenterText
                text="PLAY"
                onClick={handlePlayClick}
                interactive={true}
                className={`
                  text-5xl md:text-7xl xl:text-8xl
                  ${configVisible && !canPlay ? "opacity-40" : ""}
                `}
              />
            </button>
            {(
              <>
                <LogInInput
                  placeholder="Player 1 name"
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value.slice(0, 10))}
                  className="top-1/4"
                />

                {vsAI ? (
                  <div className="absolute bottom-[28%] flex items-center justify-center gap-2 text-[10px] md:text-xs">
                    <span className="font-corben text-shell">
                      Difficulty
                    </span>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="rounded-2xl bg-greyish text-red-900 px-2 py-1 border border-red-600/40"
                    >
                      <option value="easy">Easy</option>
                      <option value="normal">Normal</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                ) : (
                  <LogInInput
                    placeholder="Player 2 name"
                    value={player2Name}
                    onChange={(e) => setPlayer2Name(e.target.value.slice(0, 10))}
                    className="bottom-1/4"
                  />
                )}
                <div className="absolute bottom-[10%] flex flex-col items-center gap-1 text-[10px] md:text-xs">
                  <span className="font-corben text-shell mb-1">
                    Mode
                  </span>

                  <div className="flex gap-2">
                    <Sixtyfour
                      onClick={() => {
                        setVsAI(false)
                        game?.setAIMode(false)
                      }}
                      className={`
                        cursor-pointer
                        ${!vsAI ? "text-red-600" : "text-shell hover:text-red-900"}
                      `}
                    >
                      VS Human
                    </Sixtyfour>

                    <Sixtyfour
                      onClick={() => {
                        setVsAI(true)
                        game?.setAIMode(true, difficulty)
                      }}
                      className={`
                        cursor-pointer
                        ${vsAI ? "text-red-600" : "text-shell hover:text-red-900"}
                      `}
                    >
                      VS AI
                    </Sixtyfour>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </Circle>
    </div>
  )
}


export function PlayNotConnected({setScreen}){
  return(
    <div className="flex flex-col justify-center items-center h-full w-full">
      <Circle>
        <Sixtyfour
          onClick={() =>setScreen("game")}
            className="
            absolute top-1/4 cursor-pointer
            text-l md:text-2xl xl:text-4xl
            text-shell
            hover:text-red-900"
          >
            Guest
        </Sixtyfour>
        <CenterText
          text ="PLAY"
          // onClick={null}
          // interactive={false}
          className="
            text-5xl
            md:text-7xl
            xl:text-8xl"
        />
        <Sixtyfour
          onClick={() => setScreen("signIn")}
          className="
            absolute bottom-1/4 cursor-pointer
            text-l md:text-2xl xl:text-4xl
           text-shell
           hover:text-red-900"
        >
            Sign in
        </Sixtyfour>
      </Circle>
    </div>
  )
}


//--> connexion page
export function SignIn({setScreen}){
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const {login} = useAuth()
  // const {userID} = useAuth()

  const handleLogin = async () => {
    if (!username || !password) {
      throw new Error("All fields are required")}
    await login(username, password)
    setScreen("homePlay");
    // console.log("UserID: ", userID)
  }

  return(
    <form 
      onSubmit={async (e) => {
        e.preventDefault()
      try {
        await handleLogin()
        AlertMessage.fire({
          icon: "success",
          text: "Connected! Welcome back 🌸!",
        }) }
        catch(err) {
          AlertMessage.fire({
            icon: "error",
            text: err.message,
          })
        }
      }}
      className="
        relative flex
        justify-center
        items-center
        h-full w-full"
    >
    <Circle>
      <LogInInput
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="top-1/4"
      />
      <LogInInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="bottom-1/4"
      />
      <CorbenRegular
        onClick={() => setScreen("createAccount")}
        className="
          absolute bottom-[8%]
          text-[10px] md:text-base
          text-shell
          hover:text-red-900
          cursor-pointer"
      >
        Create an account
      </CorbenRegular>
      <button type="submit" className="flex items-center justify-center">
        <CenterText
            text ="CONNECT"
            className="text-4xl md:text-6xl xl:text-7xl"
        />
      </button>
    </Circle>
  </form>
  )
}


export function CreateAccount({setScreen}){
  const[username, setUsername] = useState("")
  const[email, setEmail] = useState("")
  const[password, setPassword] = useState("")
  const[repeatPassword, setRepeatPassword] = useState("")
  const {register} = useAuth()

   const handleRegister = async () => {
    if (!username || !email || !password || !repeatPassword) {
      throw new Error("All fields are required")
    }
    if (password !== repeatPassword) {
      throw new Error("Passwords do not match")
    }

    const regexName = /^[a-zA-Z][a-zA-Z0-9_-]*$/
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    const regexPw = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/
    
    if (username.length < 2 || username.length > 10)
      throw new Error("Username must contain between 2 and 10 characters")
    if (!regexName.test(username))
      throw new Error("Invalid username. Only letters, numbers, and '_' are allowed, and the first character must be a letter")
    if (email.length > 30)
      throw new Error("Email too long")
    if (!regexEmail.test(email))
      throw new Error("Invalid email syntaxis")
    if (password.length < 6 || password.length > 20)
      throw new Error("Password must contain between 6 and 20 characters")
    if (!regexPw.test(repeatPassword))
      throw new Error("Password must contain uppercase, lowercase, number, and at least one special character @$!%*#?&")

    await register(username, password, email)
    setScreen("homePlay");
  }

  return(
    <form noValidate
      onSubmit={async (e) => {
        e.preventDefault()
        try {
          await handleRegister()
          AlertMessage.fire({
            icon: "success",
            text: "Account created! Welcome to the Blossom Clash family 🌸!",
          }) }
        catch(err) {
          AlertMessage.fire({
            icon: "error",
            text: err.message,
          })
        }
      }}
      className="
        relative flex
        justify-center
        items-center
        h-full w-full"
    >
    <Circle >
      <LogInInput
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="top-[16%]  md:top-[14%]"
      />
      <LogInInput
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="top-1/4"
      />
      <LogInInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="bottom-1/4"
      />
      <LogInInput
        type="password"
        placeholder="Repeat password"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
        className=" bottom-[16%] md:bottom-[14%]"
      />
      <button type="submit" className="flex justify-center items-center">
        <CenterText
          text ="CREATE"
          className="text-4xl md:text-6xl xl:text-7xl"
        />
      </button>
    </Circle>
  </form>
  )
}

// i added     "start": "HOST=0.0.0.0 react-scripts start" on package json for hot reloaded with windows
// and in Dockerfile.dev too