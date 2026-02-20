import {createContext, useContext, useEffect, useState} from "react"
import {Login, Register, Logout} from "./authService"
import { AlertMessage } from "./alertMessage"

const baseUrl = import.meta.env.VITE_BASE_URL


const AuthContext = createContext()

export function AuthProvider({children}){
    const [log, setLog] = useState(false)
    const [username, setUsername] = useState(null)
    // const [userID, setUserID] = useState(null)

    // --> checking in the API if a cookie token is saved
    async function checkCookie(username, setLog) {
        try {
            const res = await fetch(`${baseUrl}/api/auth/validate`,{
                method:"POST",
                credentials: "include",
            })
            // console.log('REQUEST DONE')
            if (!res.ok)
                throw new Error("Not authenticated")

            // const data = await res.json()
            setLog(true)
            // setUsername(data.username)
            setUsername(username)
            // console.log("LOG TRUE: ", log, "USername: ", username)
        }
        catch (error)
        {
            if (log !== false) {
                setLog(false)
                setUsername(null)
            }
        }
    }

    //launch at startup cookie's check function
    useEffect(() => {
        checkCookie(username, setLog)
    }, [])

    // --> if login    
    const login = async (username, password) => {
        await Login(username, password)
        await checkCookie(username, setLog)
    }

    // --> if register    
    const register = async (username, password, email) => {
        await Register(username, password, email)
        // const user = await Register(username, password, email)
        // console.log(Register)
        // setUserID(user.id)
        await checkCookie(username,setLog)
    }

    // --> if logout (erase cookie)
    const logout = async (setScreen) => {
        await Logout(username)
        await checkCookie(username, setLog)
        AlertMessage.fire({
            icon: "success",
            text: "Disconnected! See you soon 🌸!",
          })
    }

    // give the access to all child to this values
    return(
        <AuthContext.Provider
            value={{
                log,
                username,
                // userID,
                login,
                register,
                logout
            }} >
            {children}
        </AuthContext.Provider>
    )
}

// function helper to call easily Authprovider function with less import in other pages
export function useAuth() {
    return useContext(AuthContext)
}


// credentials: "include" = send cookie's token

// loading --> wait few mm secondes still we don't know if the
// player is log in or out to avoid ugly fast visual change

// finally --> to go out from the loading state, we said to do
// something in everycase to avoid white screen