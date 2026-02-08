import {useState} from "react"
import {Circle, CenterText, LogInInput} from "./circleUtils.jsx"
import {Sixtyfour, CorbenBold, CorbenRegular} from "./typography.jsx"
import { Login, Register, Logout } from "../services/authService"
import {AlertMessage} from "../services/alertMessage"

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
export function SignIn({setScreen}){
  const[username, setUsername] = useState("")
  const[password, setPassword] = useState("")

  const handleLogin = async () => {
    if (!username || !password) {
      throw new Error("All fields are required")}
    await Login(username, password)
    setScreen("homePlay");
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
        {/* {message && <MessageFrame text={message} />} */}
      </Circle>
    </form>
  )
}


export function CreateAccount({setScreen}){
  const[username, setUsername] = useState("")
  const[email, setEmail] = useState("")
  const[password, setPassword] = useState("")
  const[repeatPassword, setRepeatPassword] = useState("")

  const handleRegister = async () => {
    if (!username || !email || !password || !repeatPassword) {
      throw new Error("All fields are required")
    }
    if (password !== repeatPassword) {
      throw new Error("Passwords do not match")
    }
    await Register(username, password, email)
    setScreen("homePlay");
  }

  return(
    <form
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



// export function CreateAccount({setScreen}){
//   const[username, setUsername] = useState("")
//   const[email, setEmail] = useState("")
//   const[password, setPassword] = useState("")
//   const[repeatPassword, setRepeatPassword] = useState("")
//   // const[message, setMessage] = useState(null)

//   const handleRegister = async () => {
//     // setMessage(null)
    
//     // //debug
//     // console.log("DEBUG:", {
//     //   username: username,
//     //   password: password,
//     //   email: email})
  
//     if (!username || !email || !password || !repeatPassword) {
//       // setMessage("All fields are required")
//       throw new Error("All fields are required")
//     }
//     if (password !== repeatPassword) {
//       // setMessage("Passwords do not match")
//       throw new Error("Passwords do not match")
//     }

//     // try {
//     await Register(username, password, email)
//     setScreen("homePlay");
//       // return ("Account created! Welcome to the Blossom Clash family !")
//       //faire une sweet alert
//     // }
//     // catch (err){
//     //   return(err.message)
//       // console.log(message)
//     // }
//     // try {
//     //   const data = await Register(username, password, email)
//     //   setMessage(JSON.stringify(data, null, 2))
//     //   if (data.ok) setScreen("homePlay") }
//     // catch (err) {
//     //   setMessage(JSON.stringify(err, null, 2)) }
//   }

//   return(
//     <form
//       onSubmit={async (e) => {
//         e.preventDefault()
//         // const message = handleRegister()
//           // if (message) {
//         //   AlertMessage.fire({text: message})
//         try {
//           await handleRegister()
//           AlertMessage.fire({
//             icon: "success",
//             text: "Account created! Welcome to the Blossom Clash family 🌸!",
//           }) }
//         catch(err) {
//           AlertMessage.fire({
//             icon: "error",
//             text: err.message,
//           })
//         }
//       }}
//       className="
//         relative flex
//         justify-center
//         items-center
//         h-full w-full"
//     >
//     <Circle >
//       <LogInInput
//         placeholder="Username"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//         className="top-[16%]  md:top-[14%]"
//       />
//       <LogInInput
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         className="top-1/4"
//       />
//       <LogInInput
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         className="bottom-1/4"
//       />
//       <LogInInput
//         type="password"
//         placeholder="Repeat password"
//         value={repeatPassword}
//         onChange={(e) => setRepeatPassword(e.target.value)}
//         className=" bottom-[16%] md:bottom-[14%]"
//       />
//       <button type="submit" className="flex justify-center items-center">
//         <CenterText
//           text ="CREATE"
//           className="text-4xl md:text-6xl xl:text-7xl"
//         />
//       </button>
//       {/* {message && <MessageFrame text={message} />} */}
//     </Circle>
//   </form>
//   )
// }
