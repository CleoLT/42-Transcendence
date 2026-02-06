import {useState} from "react"
import {Circle, CenterText, LogInInput} from "./circleUtils.jsx"
import {Sixtyfour, CorbenBold, CorbenRegular} from "./typography.jsx"
import { Login, Register, Logout } from "../services/authService"
import {MessageFrame} from "./messageFrame"

export function PlayConnected({setScreen}){
  return(
    <div className="flex justify-center items-center h-full w-full">
      <Circle>
        <CenterText
          text ="PLAY"
          onClick={() =>setScreen("game")}
          className="
            text-5xl
            md:text-7xl
            xl:text-9xl"
        />
      </Circle>
    </div>
  )
}


export function PlayNotConnected({setScreen}){
  return(
    <div className="flex flex-col justify-center items-center h-full w-full">
      <Circle>
        <Sixtyfour
          onClick={() =>setScreen("homePlay")}
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
          onClick={null}
          className="
            text-5xl
            md:text-7xl
            xl:text-9xl"
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
export function SignInClick({setScreen}){
  const[username, setUsername] = useState("")
  const[password, setPassword] = useState("")
  const[message, setMessage] = useState(null)

  const handleLogin = async () => {
    try {
      await Login(username, password)
      setMessage("Account created! Welcome to the Blossom Clash family !")
      setScreen("homePlay");
    }
    catch (err){
      setMessage(err.message)
      console.log(message)
    } 
    if (!username || !password) {
      setMessage("All fields are required")
      return
    }
  }

  return(
    <form 
      onSubmit={(e) => {
        e.preventDefault()
        handleLogin()
      }}
      className="relative flex justify-center items-center h-full w-full">
      
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
        {message && <MessageFrame text={message} />}
      </Circle>
    </form>
  )
}


export function AccountClick({setScreen}){
  const[username, setUsername] = useState("")
  const[email, setEmail] = useState("")
  const[password, setPassword] = useState("")
  const[repeatPassword, setRepeatPassword] = useState("")
  const[message, setMessage] = useState(null)

  const handleRegister = async () => {
    setMessage(null)
    
    // //debug
    // console.log("DEBUG:", {
    //   username: username,
    //   password: password,
    //   email: email})
  
    if (!username || !email || !password || !repeatPassword) {
      setMessage("All fields are required")
      return
    }
    if (password !== repeatPassword) {
      setMessage("Passwords do not match")
      return
    }

    try {
      await Register(username, password, email)
      setMessage("Account created! Welcome to the Blossom Clash family !")
      //faire une sweet alert
      setScreen("homePlay");
    }
    catch (err){
      setMessage(err.message)
      console.log(message)
    }
    // try {
    //   const data = await Register(username, password, email)
    //   setMessage(JSON.stringify(data, null, 2))
    //   if (data.ok) setScreen("homePlay") }
    // catch (err) {
    //   setMessage(JSON.stringify(err, null, 2)) }
  }

  return(
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleRegister()
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
      {message && <MessageFrame text={message} />}
    </Circle>
  </form>
  )
}


//SignInClick --> aller sur la page Sign In (via Sign In on top et rond rouge)

//GuestClick --> aller sur la page PlayClick

//PlayClick --> ouvrir le jeu

//AccountClick --> ouvrir la page pour creer un compte

//idem all icons..


