import {Sixtyfour} from "./typography.jsx"

export default function Header({screen, setScreen}){
    return(
        <header className="w-full">
            <button className="w-full pr-[5%] pb-[1%]">
                <Sixtyfour onClick={() => setScreen("signIn")} className="lg:text-2xl sm:text-lg text-xs text-right hover:text-red-900">
                    Sign in
                </Sixtyfour>
            </button>
            {/* logout */}
        </header>
    )
}
