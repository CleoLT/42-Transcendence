import { IconsOverlayFrame } from "./iconUtils"
import { Sixtyfour, P, H2, H3, LI, UL } from "./typography"


function Card({name, email, role, socialMedia}) {
    return (
        <div className="
            flex flex-col border rounded-xl border-greyish
            px-5 py-3 sm:px-10 justify-between items-center
            gap-x-2 text-[0.5rem] sm:text-[0.6rem]" >
            <div className="flex gap-x-2 items-center pb-3">
                <Sixtyfour>{name}</Sixtyfour>

            </div>
            <div className="flex gap-x-2 items-center">
                <Sixtyfour>{role}</Sixtyfour>
            </div>
            <button className="pt-3" >
                <Sixtyfour>{email}</Sixtyfour>
                <Sixtyfour>{socialMedia}</Sixtyfour>
            </button>
        </div>
    )
}



export function Project() {
    return (
         <div className="flex flex-col relative w-full h-full justify-center items-center">
            <div className="absolute inset-0">
                <IconsOverlayFrame />
            </div>
            <div className="relative w-full max-w-3xl rounded-2xl p-8 max-h-[80vh] overflow-y-auto">
                <Sixtyfour className="text-2xl">Project</Sixtyfour>
                <Card name="Cléo" email="cle-tron@student.42barcelona.com" role="backend developer" socialMedia="https://github.com/CleoLT"></Card>
            </div>
            

        </div>
    )
}