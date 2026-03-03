import { IconsOverlayFrame, ProfilePicture } from "./iconUtils"
import { Sixtyfour, P, H2, H3, LI, UL } from "./typography"


function Card({ name, avatar, email, role, socialMedia }) {
    return (
        <div className="
            flex items-center gap-2 md:gap-6
            border rounded-xl border-greyish
            px-5 py-3 sm:px-10
            text-[0.35rem] md:text-[0.6rem]
        ">
            <ProfilePicture 
                src={avatar} 
                className="w-14 h-14 md:w-24 md:h-24 shrink-0 object-cover border-none"
            />

            <div className="flex flex-col justify-center">

                <div className="pb-2">
                    <Sixtyfour>{name}</Sixtyfour>
                </div>

                <div className="pb-2">
                    <Sixtyfour>{role}</Sixtyfour>
                </div>

                <div className="flex flex-col">
                    <a href={`mailto:${email}`}>
                        <Sixtyfour>{email}</Sixtyfour>
                    </a>

                    <a 
                        href={socialMedia} 
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        <Sixtyfour>{socialMedia}</Sixtyfour>
                    </a>
                </div>
            </div>
        </div>
    )
}



export function Project() {
    return (
         <div className="flex flex-col relative w-full h-full pt-8 items-center">
            <div className="absolute inset-0">
                <IconsOverlayFrame />
            </div>
            <div className="relative w-full max-w-3xl px-2 md:px-10 max-h-[80vh] overflow-y-auto">
                {/* <Sixtyfour className="text-2xl text-center pb-5">PROJECT</Sixtyfour> */}
                <a href="https://github.com/CleoLT/42-Transcendence" target="_blank" rel="noopener noreferrer">
                    <Sixtyfour className="hover:text-red-900 pb-2 text-right text-[0.5rem] md:text-sm">Github Transcendence</Sixtyfour>
                </a>
                <a href="https://www.figma.com/site/eAmGTsUXKVOWK3iayg7CO8/Transcendance?node-id=0-1&t=J4EEjSWtxps4yZBf-1" target="_blank" rel="noopener noreferrer">
                    <Sixtyfour className="hover:text-red-900 pb-2 text-right text-[0.5rem] md:text-sm">Figma models</Sixtyfour>
                </a>
                <div className="flex flex-col gap-2">
                    <Card name="Emilie Sellier" avatar="/avatars/jellyfish_transparent.png" email="esellier@student.42barcelona.com" role="Product Owner - Frontend Developer" socialMedia="https://github.com/EmilieInData"></Card>
                    <Card name="Marta López Caballer" avatar="/avatars/bird_transparent.png" email="martalop@student.42barcelona.com" role="Product Manager - DevOps" socialMedia="https://github.com/martucs"></Card>
                    <Card name="Manuel Gimon Caballero" avatar="/avatars/butterfly_transparent.png" email="mgimon-c@student.42barcelona.com" role="Technical Lead - Backend Developer" socialMedia="https://github.com/mgimon"></Card>
                    <Card name="Cristina Manzanares Urrutia" avatar="/avatars/carp_koi_transparent.png" email="crmanzan@student.42barcelona.com" role="Game Developer" socialMedia="https://github.com/Crima1712"></Card>
                    <Card name="Cléo Le Tron" avatar="/avatars/whale_transparent.png" email="cle-tron@student.42barcelona.com" role="Backend Developer" socialMedia="https://github.com/CleoLT"></Card>
                </div>
            </div>
            

        </div>
    )
}

