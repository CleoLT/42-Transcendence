import {Sixtyfour} from "./typography.jsx"
import {useAuth} from "../services/authProvider"

export default function Header({screen, setScreen}){
    const {log, logout} = useAuth()

    return(
        <header className="w-full pr-[5%] text-right">
            {log ? (
                <button
                    onClick={async () => {
                        await logout()
                        setScreen("playNC")
                    }}
                    className="bg-transparent p-0 m-0 cursor-pointer">
                    <Sixtyfour
                        className="lg:text-xl sm:text-lg text-xs text-right hover:text-darkRed">
                            Log out
                    </Sixtyfour>
                </button>
            ) : (
                <button
                    onClick={() => setScreen("signIn")}
                    className="bg-transparent p-0 m-0 cursor-pointer">
                    <Sixtyfour
                        className="lg:text-xl sm:text-lg text-xs text-right hover:text-darkRed">
                            Sign in
                    </Sixtyfour>
                </button>
            )}
        </header>
    )
}
