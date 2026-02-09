import {createContext, useContext, useEffect, useState} from "react"

const AuthContext = createContext()

export function AuthProvider({children}){
    const [log, setLog] = useState(false)
    const [userName, setUserName] = useState(null)
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
            setUserName(data.userId)
        }
        catch {
            setLog(false)
            setUserName(null)
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
        // setLog(true)
        // setUserName(username)
        await checkCookie()
    }

    // --> if logout (erase cookie)
    const logout = async () => {
        await fetch("${baseUrl}/api/auth/logout",
            {method: "POST", credentials: "include"})
        setLog(false)
        setUserName(null)
    }

    // --> if creating an account ?
//     await Register(...)
//     setLog(true)
//     setUserName(username)


    // all child component can access to this values
    return(
        <AuthContext.Provider
            value={{
                log,
                userName,
                login,
                logout
            }} >
            {children}
        </AuthContext.Provider>
    )
}

// function helper to call easily Authprovider function
//  with less import in other pages
export function useAuthProvider() {
    return useContext(AuthContext)
}
    

// credentials: "include" = send cookie's token

// loading --> wait few mm secondes still we don't know if the
// player is log in or out to avoid ugly fast visual change

// finally --> to go out from the loading state, we said to do
// something in everycase to avoid white screen