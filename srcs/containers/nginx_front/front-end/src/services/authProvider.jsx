import {createContext, useContext, useEffect, useState} from "react"
import {Login, Logout} from "./authService"
import { AlertMessage } from "./alertMessage"

const AuthContext = createContext()

export function AuthProvider({children}){
    const [log, setLog] = useState(false)
    const [username, setUsername] = useState(null)
    // const [loading, setLoading] = useState(true)

    // --> checking in the API if a cookie token is saved
    const checkCookie = async () => {
        try {
            const res = await fetch("${baseUrl}/api/auth/validate",
                        {credentials: "include"})
            if (!res.ok) 
                throw new Error("Not authenticated")

            const data = await res.json()
            setLog(true)
            setUsername(data.username)
        }
        catch {
            setLog(false)
            setUsername(null)
        }
        // finally {
        //     setLoading(false)
        // }
    }

    //launch at startup cookie's check function
    useEffect(() => {
        checkCookie()
    }, [])

    // --> if login    
    const login = async (username, password) => {
        await Login(username, password)
        setLog(true)
        setUsername(username)
        // await checkCookie()
    }

    // --> if logout (erase cookie)
    const logout = async (setScreen) => {
        await Logout(username)
        setLog(false)
        setUsername(null)
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
                login,
                logout
            }} >
            {children}
        </AuthContext.Provider>
    )
}

// function helper to call easily Authprovider function
//  with less import in other pages
export function useAuth() {
    return useContext(AuthContext)
}


// --> if creating an account ?
//     await Register(...)
//     setLog(true)
//     setUserName(username)
    

// credentials: "include" = send cookie's token

// loading --> wait few mm secondes still we don't know if the
// player is log in or out to avoid ugly fast visual change

// finally --> to go out from the loading state, we said to do
// something in everycase to avoid white screen