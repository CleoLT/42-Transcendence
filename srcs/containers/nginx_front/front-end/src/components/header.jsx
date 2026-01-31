import {Sixtyfour} from "./typography.jsx"

export default function Header(){
    return(
        <button  className="w-full pr-[5%] pb-[1%]">
            <Sixtyfour className="lg:text-2xl sm:text-lg text-xs text-right hover:text-red-900">
                {/* onClick={SignInClick} */}
            Sign in
            </Sixtyfour>
        </button>
    )
}

//will be a text-button , to change