import { SmallCircle } from "./circleUtils.jsx"
import {Sixtyfour} from "./typography.jsx"

export function Footer({screen, setScreen}){

    return(
        <footer className="flex justify-between w-[92%] mt-1 sm:mt-2">
            <FooterButton text="Terms of Service" onClick={() => setScreen("terms")}/>
            <FooterButton text="Contacts" onClick={() => setScreen("homePlay")}/>
            <FooterButton text="Privacy Policy" onClick={() => setScreen("privacy")}/>
        </footer>
    )
}

export function FooterButton({text, onClick}){
    return(
        <button
            className="flex items-center"
            onClick={onClick}
        >
        <SmallCircle />
        <Sixtyfour
            className="
                ml-[-0.6rem] md:ml-[-0.9rem] lg:ml-[-1rem]
                text-[0.40rem] sm:text-[0.55rem] lg:text-sm
                text-black hover:text-red-900"
        >
            {text}
        </Sixtyfour>
        </button>
    )
}
