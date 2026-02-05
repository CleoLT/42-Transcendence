import {useState} from "react"
import {Circle, CenterText, LogInInput} from "./circleUtils.jsx"
import {Sixtyfour, CorbenBold, CorbenRegular} from "./typography.jsx"
import { Login, Register, Logout } from "../services/authService"


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

//connexion page

//--> connexion page
export function SignInClick({setScreen}){
  const[username, setUsername] = useState(null)
  const[password, setPassword] = useState(null)

  const handleRegister = async () => {
    try {
      await Register(username, password)
      setScreen("homePlay");
    }
    catch (error){
      alert(error.message)
    }
  }

  return(
    <form className="relative flex justify-center items-center h-full w-full">
      <Circle>
        <LogInInput
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="top-1/4"
        />
        <CenterText
          text ="CONNECT"
          onClick={handleRegister}
          className="text-4xl md:text-6xl xl:text-7xl"
        />
       {/* onClick={PlayConnected} + checker si c'est ok le login, faire parsing?*/}
        <LogInInput
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
      </Circle>
    </form>
  )
}


export function AccountClick({setScreen}){
  const[username, setUsername] = useState(null)
  const[email, setEmail] = useState(null)
  const[password, setPassword] = useState(null)

  const handleRegister = async () => {
    try {
      await Register(username, email, password)
      setScreen("homePlay");
    }
    catch (error){
      alert(error.message)
    }
  }

  return(
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleRegister();
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
        className="top-[16%]  md:top-[14%]"
      />
      <LogInInput
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="top-1/4"
      />
      <CenterText
        text ="CREATE"
        onClick={handleRegister}
        className="text-4xl md:text-6xl xl:text-7xl"
      />
     {/* onClick={PlayConnected} + checker si c'est ok le login, faire parsing?*/}
      <LogInInput
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="bottom-1/4"
      />
      <LogInInput
        placeholder="Repeat password"
        className=" bottom-[16%] md:bottom-[14%]"
      />
    </Circle>
  </form>
  )
}


//SignInClick --> aller sur la page Sign In (via Sign In on top et rond rouge)

//GuestClick --> aller sur la page PlayClick

//PlayClick --> ouvrir le jeu

//AccountClick --> ouvrir la page pour creer un compte

//idem all icons..


