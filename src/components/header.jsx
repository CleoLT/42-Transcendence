import { Sixtyfour } from "./typography.jsx"
import LoginForm from "./LoginForm.jsx"

export default function Header(){
    return(
        <div className="w-full flex flex-col items-end gap-2 pr-[5%] pb-[1%]">
          <Sixtyfour className="lg:text-2xl sm:text-lg text-xs text-right">
            Sign in
          </Sixtyfour>
          {/* <LoginForm /> */}
        </div>
    )
}