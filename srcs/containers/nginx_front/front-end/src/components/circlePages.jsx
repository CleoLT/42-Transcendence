import {useState, useEffect} from "react"
import {Circle, CenterText, LogInInput} from "./circleUtils.jsx"
import {Sixtyfour, CorbenBold, CorbenRegular} from "./typography.jsx"
import { Login, Register, Logout, getUserInfo } from "../services/authService"
// import { useAuth } from "../services/authProvider"
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

function ConfigSection({ title, children }) {
  return (
    <div className="flex flex-col items-center gap-1 lg:gap-2 xl:gap-3">
      <span className="font-corben text-shell text-[10px] md:text-[13px] xl:text-[18px]">{title}</span>
      <div className="flex gap-2 flex-wrap justify-center ">
        {children}
      </div>
    </div>
  )
}

function ToggleOption({ active, onClick, label }) {
  return (
    <Sixtyfour
      onClick={onClick}
      className={`
        cursor-pointer px-1 py-1 rounded-full border transition-colors
        text-[0.3rem] md:text-sm lg:text-[0.6rem] xl:text-sm
        ${
          active
            ? "bg-red-700 text-shell border-red-700"
            : "bg-transparent text-shell border-shell/40 hover:bg-red-900 hover:border-red-900"
        }
      `}
    >
      {label}
    </Sixtyfour>
  )
}

export function GameConfig({ game, hasStarted, setHasStarted }) {
  const [advancedConfigOpen, setAdvancedConfigOpen] = useState(false)
  const { username } = useAuth()
  const [player1Name, setPlayer1Name] = useState("")
  
  useEffect(() => {
    if (username) {
      setPlayer1Name(username)
    }
  }, [username])
  const [player2Name, setPlayer2Name] = useState("")
  const [vsAI, setVsAI] = useState(true)
  const [difficulty, setDifficulty] = useState("easy")

  const [roundTime, setRoundTime] = useState(45)
  const [totalRounds, setTotalRounds] = useState(3)
  const [abilitiesEnabled, setAbilitiesEnabled] = useState(false)
  const [player1Color, setPlayer1Color] = useState("#e8b0a3")
  const [player2Color, setPlayer2Color] = useState("#fdd28b")
  const [theme, setTheme] = useState("classic")

  const _p1 = Boolean(player1Name.trim())
  const _p2 = vsAI || Boolean(player2Name.trim())
  const canPlay = _p1 && _p2 && !!game

  const handlePlayClick = async () => {
    if (!canPlay) return

    const p1 = player1Name.trim()
    const p2 = vsAI ? "MadelAIne" : player2Name.trim()

    game.setRoundTime?.(roundTime)
    game.setTotalRounds?.(totalRounds)
    game.setAbilitiesEnabled?.(abilitiesEnabled)
    game.setPlayerColors?.(player1Color, player2Color)
    if (typeof game.setTheme === 'function') {
      await game.setTheme(theme)
    }
    game.setAIMode(vsAI, difficulty)
    game.startGame(p1, p2)
    setHasStarted?.(true)
  }

  if (hasStarted) return null

  return (
    <div className="pointer-events-auto flex flex-col justify-center items-center h-full w-full">
      <Circle>
  
        {game && (
          <button
            type="button"
            onClick={() => setAdvancedConfigOpen((open) => !open)}
            className="
              absolute top-[5%]
              text-shell text-2xl md:text-4xl
              hover:text-red-900 transition-colors
            "
          >
            ⚙
          </button>
        )}
  
        {!game ? (
          <Sixtyfour className="text-shell text-center text-xl md:text-3xl">
            Loading...
          </Sixtyfour>
        ) : (
          <div className="flex flex-col gap-2 items-center w-full" >
            {/* ================= NORMAL CONFIG ================= */}
            {!advancedConfigOpen && (
              <>
                <LogInInput
                  placeholder="Player 1 name"
                  value={username ? username : player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value.slice(0, 10))}
                  className="flex justify-center items-center top-[23%]"
                />
                <button className="flex justify-center items-center">
                  <CenterText
                    text="PLAY"
                    onClick={handlePlayClick}
                    
                    interactive={canPlay}
                    
                    className={`
                      text-5xl md:text-7xl xl:text-8xl
                      ${canPlay ? "" : "text-shell/50 cursor-not-allowed"}
                    `}
                  />
                </button>
 
                {/* Mode selector */}
                <div className="absolute flex flex-col items-center gap-1 text-[10px] md:text-xs bottom-[8%]">
                  <span className="font-corben text-shell">Mode</span>
  
                  <div className="flex gap-2">
                    {[
                      { id: "human", label: "VS Human" },
                      { id: "ai", label: "VS AI" }
                    ].map((mode) => {
                      const active = (mode.id === "ai" && vsAI) || (mode.id === "human" && !vsAI)
  
                      return (
                        <Sixtyfour
                          key={mode.id}
                          onClick={() => {
                            const ai = mode.id === "ai"
                            setVsAI(ai)
                            game?.setAIMode(ai, difficulty)
                          }}
                          className={`
                            cursor-pointer px-2 py-1 rounded-full border
                            transition-colors text-[0.3rem] md:text-xs
                            ${
                              active
                                ? "bg-red-700 text-shell border-red-700"
                                : "bg-transparent text-shell border-shell/40 hover:bg-red-900 hover:border-red-900"
                            }
                          `}
                        >
                          {mode.label}
                        </Sixtyfour>
                      )
                    })}
                  </div>
                </div>
  
                {/* Difficulty */}
                {vsAI && (
                  <div className="absolute bottom-[25%] flex flex-col gap-1 items-center text-[10px] md:text-xs">
                    <span className="font-corben text-shell">Difficulty</span>
  
                    <div className="flex gap-2">
                      {["easy", "normal", "hard"].map((lvl) => (
                        <Sixtyfour
                          key={lvl}
                          onClick={() => setDifficulty(lvl)}
                          className={`
                            cursor-pointer px-2 py-1 rounded-full border text-[0.3rem] md:text-xs
                            transition-colors
                            ${
                              difficulty === lvl
                                ? "bg-red-700 text-shell border-red-700"
                                : "bg-transparent text-shell border-shell/40 hover:bg-red-900 hover:border-red-900"
                            }
                          `}
                        >
                          {lvl}
                        </Sixtyfour>
                      ))}
                    </div>
                  </div>
                )}
  
                {!vsAI && (
                  <LogInInput
                    placeholder="Player 2 name"
                    value={player2Name}
                    onChange={(e) => setPlayer2Name(e.target.value.slice(0, 10))}
                    className="bottom-[25%] truncate"
                  />
                )}
              </>
            )}
  
            {/* ================= ADVANCED CONFIG ================= */}
            {/* <div className="flex flex-col gap-2 items-center w-full" > */}
                {advancedConfigOpen && (
                <div className="absolute flex flex-col items-center justify-center px-6 gap-1 md:gap-5 lg:gap-3 xl:gap-8 text-[10px] md:text-xs top-[18%]">
                  <Sixtyfour className="text-shell text-xl md:text-3xl xl:text-4xl">
                    SETTINGS
                  </Sixtyfour>

                  <div className="flex items-center justify-center gap-5 md:gap-9 xl:gap-12">
                    <div className="flex flex-col gap-2 md:gap-5 lg:gap-3 xl:gap-7" >
                      {/* Total rounds */}
                      <ConfigSection title="Total rounds">
                        {[2, 3].map((r) => (
                          <ToggleOption
                            key={r}
                            active={totalRounds === r}
                            onClick={() => setTotalRounds(r)}
                            label={r}
                          />
                        ))}
                      </ConfigSection>

                               {/* Round time */}
                      <ConfigSection title="Round time">
                        {[20, 45, 60].map((time) => (
                          <ToggleOption
                            key={time}
                            active={roundTime === time}
                            onClick={() => setRoundTime(time)}
                            label={`${time}s`}
                          />
                        ))}
                      </ConfigSection>
                    </div>

                    <div className="flex flex-col gap-2 md:gap-5 lg:gap-3 xl:gap-7">
                      {/* Abilities */}
                      <ConfigSection title="Abilities">
                        <ToggleOption
                          active={abilitiesEnabled}
                          onClick={() => setAbilitiesEnabled(true)}
                          label="ON"
                        />
                        <ToggleOption
                          active={!abilitiesEnabled}
                          onClick={() => setAbilitiesEnabled(false)}
                          label="OFF"
                        />
                      </ConfigSection>
                   
                      {/* Player colors */}
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="font-corben text-shell text-[10px] md:text-[13px] xl:text-[18px]">Player colors</span>

                        <div className="flex gap-1 items-center">
                            <span className="font-corben text-shell text-[8px] md:text-[15px]">P1</span>
                          <div className="flex flex-col items-center gap-1">
                            <input
                              type="color"
                              value={player1Color}
                              onChange={(e) => setPlayer1Color(e.target.value)}
                              className="w-5 h-5 md:w-8 md:h-8 cursor-pointer bg-transparent"
                            />
                          </div>
      
                            <span className="font-corben text-shell text-[8px]  md:text-[15px]">P2</span>
                          <div className="flex flex-col items-center gap-1">
                            <input
                              type="color"
                              value={player2Color}
                              onChange={(e) => setPlayer2Color(e.target.value)}
                              className="w-5 h-5 md:w-8 md:h-8 cursor-pointer bg-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>  
    
                  {/* Theme */}
                  <ConfigSection title="Theme">
                    {["classic", "sakura", "dark", "neon"].map((t) => (
                      <ToggleOption
                        key={t}
                        active={theme === t}
                        onClick={() => setTheme(t)}
                        label={t}
                      />
                    ))}
                  </ConfigSection>
                <div className="pt-0">
                  <ToggleOption
                    active={true}
                    onClick={() => setAdvancedConfigOpen(false)}
                    label="SAVE & BACK"
                  />
                </div>
                </div>
              )}
            </div>  
          // </div>
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


export function GameReset({ game, onPlayAgain }) {
  if (!game?.roundSystem) {
    return (
      <div className="pointer-events-auto flex justify-center items-center h-full w-full">
        <Circle>
          <Sixtyfour className="text-shell text-center text-xl md:text-3xl">
            Loading...
          </Sixtyfour>
        </Circle>
      </div>
    )
  }

  const winner = game.roundSystem.getWinner()
  const winnerText =
    winner === 0
      ? "It's a draw!"
      : `${game.players[winner - 1]?.name ?? "Player " + winner} wins!`

  return (
    <div className="pointer-events-auto flex flex-col justify-center items-center h-full w-full">
      <Circle>
        <Sixtyfour
          className="
            absolute bottom-1/4
            text-shell
            text-xl md:text-3xl
          "
        >
          THE END
        </Sixtyfour>

        <CorbenBold
          className="
            absolute top-[22%]
            text-red-900
            text-lg md:text-2xl
          "
        >
          {winnerText}
        </CorbenBold>

        <button className="flex justify-center items-center">
          <CenterText
            text="RESET"
            onClick={onPlayAgain}
            interactive={true}
            className="
              text-5xl
              md:text-7xl
              xl:text-8xl
            "
          />
        </button>
      </Circle>
    </div>
  )
}
// i added     "start": "HOST=0.0.0.0 react-scripts start" on package json for hot reloaded with windows
// and in Dockerfile.dev too

