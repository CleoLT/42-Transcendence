import {Sixtyfour} from "./typography.jsx"
import {useAuth} from "../services/authProvider"

export default function Header({screen, setScreen}){
    const {log, logout} = useAuth()

    return(
        <header className="w-full">
            <button className="w-full pr-[5%] pb-[1%]">
                {log ? (
                    <Sixtyfour
                        onClick={async () => {
                            await logout()
                            setScreen("playNC")}}
                        className="lg:text-2xl sm:text-lg text-xs text-right hover:text-red-900">
                        Log out
                    </Sixtyfour>
                ) : (
                    <Sixtyfour onClick={() => setScreen("signIn")} className="lg:text-2xl sm:text-lg text-xs text-right hover:text-red-900">
                         Sign in
                    </Sixtyfour>
                )}
            </button>
        </header>
    )
}
