import {createContext, useContext, useEffect, useState} from "react"
import {Login, Login2FA, Logout, Register, Register2FA } from "./authService"
import { AlertMessage } from "./alertMessage"

const baseUrl = import.meta.env.VITE_BASE_URL


const AuthContext = createContext()

export function AuthProvider({children}){
    const [log, setLog] = useState(false)
    const [username, setUsername] = useState(null)
    const [userId, setUserId] = useState(null)

    // --> checking in the API if a cookie token is saved
    async function checkCookie() {
            try {
              const lastUserId = localStorage.getItem("lastUserId");
          
              const res = await fetch(`${baseUrl}/api/auth/validate`, {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({ lastUserId })
              });
          
              const data = await res.json();
          
              setLog(data.valid);
              setUsername(data.username ?? null);
              setUserId(data.userId ?? null);
          
              //console.log("/validate:", data);
              if (!data.valid)
                localStorage.removeItem("lastUserId");
            } catch {
              setLog(false);
              setUsername(null);
              setUserId(null);
              localStorage.removeItem("lastUserId");
            }
    }

    useEffect(() => {
        if (userId) {
            localStorage.setItem("lastUserId", userId)
        }
    }, [userId])

    useEffect(() => {
        checkCookie();

        const interval = setInterval(() => {
            checkCookie();
        }, 1500);

        return () => clearInterval(interval);
    }, [])

    // --> if login    
    const login = async (username, password) => {
        const { email } = await Login(username, password)
        const maskedEmail = email.replace(/^(.).+(@.+)$/, '$1***$2')
        const { value: code } = await AlertMessage.fire({
            title: `Introduce the code we sent to ${maskedEmail}:`,
            input: "text",
            inputPlaceholder: "Your 2FA Code",
            showCancelButton: false,
            confirmButtonText: "Verify",
            allowOutsideClick: false,
            allowEscapeKey: true,
            timer: null
        })
        if (!code) throw new Error("A code is required")
    
        await Login2FA(username, code)
        await checkCookie(username, setLog)
    }

    // --> if register    
    const register = async (username, password, email) => {
        const { email: returnedEmail } = await Register(username, password, email)
        const maskedEmail = returnedEmail.replace(/^(.).+(@.+)$/, '$1***$2')
        const { value: code } = await AlertMessage.fire({
            title: `Introduce the code we sent to ${maskedEmail}:`,
            input: "text",
            inputPlaceholder: "Your 2FA Code",
            showCancelButton: false,
            confirmButtonText: "Verify",
            allowOutsideClick: false,
            allowEscapeKey: true,
            timer: null
        })
        if (!code) throw new Error("A code is required")
    
        await Register2FA(username, code)
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
                userId,
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
