import { CorbenBold , CorbenRegular, Sixtyfour } from "./typography"
import {IconText, IconsOverlayFrame, ProfilePicture, ChopstickButton, OverlayPage, DisplayDate, LargeButton, DisplayIcon} from "./iconUtils"
import {useRef, useState, useEffect} from "react"
import {Circle, PlaceholderInput, CirclePlaceholder} from "./circleUtils"
import {useAuth} from "../services/authProvider"
import {getUserInfo, uploadAvatarFile, uploadAvatar, patchChangeUsername, patchChangePassword, patchChangeInfo, loginUser, checkActiveCookie} from "../services/authService"
import { AlertMessage, OptionAlert } from "../services/alertMessage"


export function ChangeName({setData, setScreenProfile}){
    const [userName, setUserName] = useState("")
    const [repeatUsername, setRepeatUsername] = useState("")
    const {userId, username, setUsername} = useAuth()

    const handleChangeLogin = async () => {
        if (!userName || !repeatUsername)
        throw new Error("All fields are required")
        if (userName != repeatUsername)
            throw new Error("Usernames don't match!")
        if (userName === username)
            throw new Error("You submitted the same username!")
        
        const regexName = /^[a-zA-Z][a-zA-Z0-9_-]*$/

        if (userName.length < 2 || userName.length > 10)
            throw new Error("Username must contain between 2 and 10 characters")
        if (!regexName.test(userName))
            throw new Error("Invalid username. Only letters, numbers, and '_' are allowed, and the first character must be a letter")

        await patchChangeUsername(userId, userName)
    }

    return(
        <div className="flex flex-col relative w-full h-full justify-center items-center">
            <Circle className="bg-shell border-2 border-greyish px-10">
                <div className="flex flex-col pt-4 md:pt-0 lg:pt-6 xl:gap-2 justify-center items-center">
                    <form
                        onSubmit={async (e) => {
                        e.preventDefault()
                        try {
                            await handleChangeLogin()
                            AlertMessage.fire({
                                icon: "success",
                                text: "Username changed!",
                            })
                        setData(prev => ({
                            ...prev,
                            username: userName})
                        )
                        setUsername(userName)
                        
                        await fetch(`/api/auth/update/${userName}`, {
                            method: 'POST',
                            credentials: 'include'
                        })
 
                        setScreenProfile("profile")
                        }
                        catch(err) {
                            AlertMessage.fire({
                            icon: "error",
                            text: err.message,
                            })
                        }
                        }}
                        className="
                            relative flex flex-col
                            justify-center
                            items-center
                            h-full w-full
                            gap-2 md:gap-4"
                    >
                        <PlaceholderInput
                            placeholder="New Username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            autoComplete="off"
                            className="!static"
                        />
                        <PlaceholderInput
                            placeholder="New Username confirmation"
                            value={repeatUsername}
                            onChange={(e) => setRepeatUsername(e.target.value)}
                            autoComplete="off"
                            className="!static"
                        />
                        <button type="submit" className="pt-4 md:pt-10">
                            <IconText text="Confirm change" className="opacity-100 cursor-pointer" />
                        </button>
                    </form>
                </div>
            </Circle>
        </div>
    )
}


export function ChangePassword({setScreenProfile}){
    const [actualPassword, setActualPassword] = useState("")
    const [password, setPassword] = useState("")
    const [repeatPassword, setRepeatPassword] = useState("")
    const {userId, username} = useAuth()

    const handleChangePassword = async () => {
        if (!actualPassword || !password || !repeatPassword)
            throw new Error("All fields are required")
        if (password != repeatPassword)
            throw new Error("New passwords don't match!")
        if (password === actualPassword)
            throw new Error("You submitted the same password!")

        const regexPw = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/

        if (password.length < 6 || password.length > 20)
            throw new Error("Password must contain between 6 and 20 characters")
          if (!regexPw.test(repeatPassword))
            throw new Error("Password must contain uppercase, lowercase, number, and at least one special character @$!%*#?&")
        
        const res = await loginUser(username, actualPassword)
        if (!res)
            throw new Error("Actual password is not correct!")
  
        await patchChangePassword(userId, password)
    }

    return(
        <div className="flex flex-col relative w-full h-full justify-center items-center">
            <Circle className="bg-shell border-2 border-greyish px-10">
                <div className="flex flex-col pt-4 md:pt-0 lg:pt-6 xl:gap-2 justify-center items-center">
                    <form
                        onSubmit={async (e) => {
                        e.preventDefault()
                        try {
                            await handleChangePassword()
                            AlertMessage.fire({
                                icon: "success",
                                text: "Password changed!",
                            })
                        setScreenProfile("profile")
                        }
                        catch(err) {
                            AlertMessage.fire({
                            icon: "error",
                            text: err.message,
                            })
                        }
                        }}
                        className="
                            relative flex flex-col
                            justify-center
                            items-center
                            h-full w-full
                            gap-2 md:gap-4"
                    >
                        <PlaceholderInput
                            type="password" 
                            placeholder="Actual Password"
                            value={actualPassword}
                            onChange={(e) => setActualPassword(e.target.value)}
                            autoComplete="current-password"
                            className="!static"
                        />
                        <PlaceholderInput
                            type="password" 
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="off"
                            className="!static"
                        />
                        <PlaceholderInput
                            type="password"
                            placeholder="New Password confirmation"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            autoComplete="off"
                            className="!static"
                        />
                        <button type="submit" className="pt-4 md:pt-10">
                            <IconText text="Confirm change" className="opacity-100 cursor-pointer" />
                        </button>
                    </form>
                </div>
            </Circle>
        </div>
    )
}


export function ChangeAvatar({setData, setScreenProfile}){
    const [avatar, setAvatar] = useState(null)
    const [avatarFile, setAvatarFile] = useState(null)
    const inputRef = useRef(null)
    const [buttonClick, setButtonClick] = useState(false)
    const {userId} = useAuth()

    const handleFileChange = (e) => {
        const file = e.target.files[0]

        if (!file.type.startsWith("image/")) {
            AlertMessage.fire({
                icon: "error",
                text: "Only images are authorized",
            })
            e.target.value = null;
            return;
        }

        if (file){
            const imageUrl = URL.createObjectURL(file);
            setAvatar(imageUrl)
            setAvatarFile(file)
            e.target.value = null
        }
    }

    const handleConfirm = async () => {
        if (!avatar) return;
    
        try {
            setButtonClick(true)

            if (avatarFile){
                const formData = new FormData();
                formData.append("avatar", avatarFile);

                await uploadAvatarFile(userId, formData)
            
            } else {
                await uploadAvatar(userId, avatar)

                console.log("AVATAR:", avatar)
            }
                
            AlertMessage.fire({
                icon: "success",
                text: "Avatar uploaded!"
        })
        setData(prev => ({
            ...prev,
            avatar: avatar})
        )
        setScreenProfile("profile")
    
        } catch (error) {
            AlertMessage.fire({
                icon: "error",
                text: "Upload failed"
        })

        } finally {
            setButtonClick(false)
            setAvatar(null)
            setAvatarFile(null)
        }
    }

    return(
        <div className="flex flex-col relative w-full h-full justify-center items-center">
            <Circle className="bg-shell border-2 border-greyish px-10">
                <div className="flex flex-col pt-4 md:pt-0 lg:pt-6 xl:gap-2 justify-center items-center">
                    <div className="flex gap-1 md:gap-2">
                        <DisplayIcon children="/avatars/cat.png" avatar={avatar} setAvatar={setAvatar} setAvatarFile={setAvatarFile}/>
                        <DisplayIcon children="/avatars/bird_04.jpg" avatar={avatar} setAvatar={setAvatar} setAvatarFile={setAvatarFile}/>
                        <DisplayIcon children="/avatars/butterfly.png" avatar={avatar} setAvatar={setAvatar} setAvatarFile={setAvatarFile}/>
                        <DisplayIcon children="/avatars/dragonfly.png" avatar={avatar} setAvatar={setAvatar} setAvatarFile={setAvatarFile}/>
                    </div>
                    <div className="flex gap-1 md:gap-2 md:pb-4 lg:pb-1 xl:pb-4">
                        <DisplayIcon children="/avatars/jellyfish_00.png" avatar={avatar} setAvatar={setAvatar} setAvatarFile={setAvatarFile}/>
                        <DisplayIcon children="/avatars/carp_koi_01.png" avatar={avatar} setAvatar={setAvatar} setAvatarFile={setAvatarFile}/>
                        <DisplayIcon children="/avatars/moonfish.png" avatar={avatar} setAvatar={setAvatar} setAvatarFile={setAvatarFile}/>
                        <DisplayIcon children="/avatars/sushi.png" avatar={avatar} setAvatar={setAvatar} setAvatarFile={setAvatarFile}/>
                        <DisplayIcon children="/avatars/swan.png" avatar={avatar} setAvatar={setAvatar} setAvatarFile={setAvatarFile}/>
                    </div>
                    <CorbenRegular children="or" className="text-greyish text-xs md:text-base pb-1 md:pb-4 lg:pb-1 xl:pb-4" />
                    <LargeButton children="Upload your Avatar" onClick={() => inputRef.current.click()} />
                    <input
                        type="file"
                        accept="image/*"
                        ref={inputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    {avatar && (
                        <img
                            src={avatar}
                            alt="Preview Avatar"
                            className="mt-2 w-10 h-10 md:mt-3 md:w-24 md:h-24 lg:w-15 lg:h-15 rounded-full object-cover border-2 border-greyish"
                        />
                    )}
                    <button onClick={handleConfirm} className=" pt-1 md:pt-2">
                        <IconText text="Confirm change" className="opacity-100 cursor-pointer" />
                    </button>
                </div>
            </Circle>
        </div>
    )
}


export function UserData({data, setScreenProfile, setScreen}){
    const {setUserId, userId, setUsername, deleteUser} = useAuth()

    if (!userId) return

    // if(!data)
    //     return <div>Loading...</div>

    const handleDeleteAccount = async () => {
        try {
            const result = await OptionAlert.fire({
                icon: "question",
                text: "Are you sure you want to delete your account?",
                showCancelButton: true, 
                confirmButtonText: "Yes",
                cancelButtonText: "No",
            })

            if (result.isConfirmed) {
                await deleteUser()
                setScreen("playNC")

            } else if (result.isDismissed) {
                await AlertMessage.fire({
                    icon: "info",
                    text: "Request cancelled!"})
            }
        
        } catch(err) {
            await AlertMessage.fire({
                icon: "error",
                text: err.message})
        }
    }

    const date = DisplayDate(data.created_at)

    return(
        <div className="
            flex flex-col border rounded-xl border-greyish
            px-5 py-3 sm:px-10 justify-between items-center
            gap-x-2 text-[0.5rem] sm:text-[0.6rem]" >
            <div className="flex gap-x-2 items-center pb-3">
                <Sixtyfour children={data.username} onClick={null} />
                <ChopstickButton text="Change name" onClick={() =>setScreenProfile("name")}/>
            </div>
            <div className="flex gap-x-2 items-center">
                <Sixtyfour children={data.email} onClick={null} />
            </div>
            <Sixtyfour children={`Player since ${date}`} onClick={null} />
            <button className="pt-3" >
                <Sixtyfour children="Change password" onClick={() =>setScreenProfile("password")} className="hover:text-darkRed" />
            </button>
            <button >
                <Sixtyfour children="Delete account" onClick={handleDeleteAccount} className="hover:text-darkRed" />
            </button>
        </div>
    )
} 


export function ChangeInfo({setData, setScreenProfile}){
    const [info, setInfo] = useState("")
    const {userId} = useAuth()

    const handleChangeInfo = async () => {
        if (!info)
            throw new Error("All fields are required")
        
        if (info.length < 3 || info.length > 300)
            throw new Error("Your bio must contain between 3 and 300 characters")
        
        await patchChangeInfo(userId, info)
    }

    return(
        <div className="flex flex-col relative w-full h-full justify-center items-center">
            <Circle className="bg-shell border-2 border-greyish">
                <form
                    onSubmit={async (e) => {
                    e.preventDefault()
                    try {
                        await handleChangeInfo()
                        AlertMessage.fire({
                            icon: "success",
                            text: "Info changed!",
                        })
                    setData(prev => ({
                        ...prev,
                        bio: info})
                    )
                    setScreenProfile("profile")
                    }
                    catch(err) {
                        AlertMessage.fire({
                        icon: "error",
                        text: err.message,
                        })
                    }
                    }}
                    className="
                        relative flex flex-col
                        justify-center
                        items-center
                        h-full w-full"
                >
                    <CirclePlaceholder
                        placeholder="Please express yourself here.."
                        value={info}
                        onChange={(e) => setInfo(e.target.value.slice(0,300))}
                        className="!static"
                    />
                    <button type="submit" className="absolute bottom-[12%] z-20">
                        <IconText text="Confirm change" className="opacity-100 cursor-pointer" />
                    </button>
                </form>
            </Circle>
        </div>
    )
}


export function Profile({setScreen}){
    const [screenProfile, setScreenProfile] = useState("profile");
    const {userId, disconnectCookie} = useAuth()
    const [data, setData] = useState(null)

    useEffect(() => {
        (async () => {
            const res = await disconnectCookie()
            if (res)
                return

            if (!userId)
                return
            
            const response = await getUserInfo(userId)
            setData(response)
        }) ()
    }, [userId])

    if (!data) return <div>Loading...</div>
    
    return(
        <div className="flex flex-col relative w-full h-full justify-center items-center">       
            <div className="absolute inset-0">
                <IconsOverlayFrame />
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-x-16">
                <button className="group relative" onClick={() =>setScreenProfile("avatar")} >
                    <ProfilePicture
                        src={data.avatar}
                        className="w-24 h-24 sm:w-40 sm:h-40" />
                    <div className="absolute top-1/4 left-3/4">
                        <IconText text={"Change Avatar"} />
                    </div>
                </button>
                <UserData data={data} setScreen={setScreen} setScreenProfile={setScreenProfile} />
            </div>
            <div className="relative z-10 flex justify-center items-center mt-3 sm:mt-10">
                <div className="flex border rounded-xl border-greyish px-5 py-3 sm:p-5 items-start mx-16" >
                    <Sixtyfour children={data.bio}  onClick={null}
                        className="flex-1 min-w-0 text-[0.5rem] sm:text-[0.6rem] whitespace-pre-wrap break-word [word-break:break-word]" />
                    <ChopstickButton text="Change bio" onClick={() =>setScreenProfile("info")}/>
                </div>
            </div>
            {screenProfile === "avatar" && (
                <OverlayPage onClose={() => setScreenProfile("profile")}> 
                    <ChangeAvatar setData={setData} setScreenProfile={setScreenProfile}/>
                </OverlayPage>    
            )}
            {screenProfile === "name" && (
                <OverlayPage onClose={() => setScreenProfile("profile")}> 
                    <ChangeName setData={setData} setScreenProfile={setScreenProfile}/>
                </OverlayPage>    
            )}
            {screenProfile === "password" && (
                <OverlayPage onClose={() => setScreenProfile("profile")}> 
                    <ChangePassword setScreenProfile={setScreenProfile}/>
                </OverlayPage>    
            )}
            {screenProfile === "info" && (
                <OverlayPage onClose={() => setScreenProfile("profile")}> 
                    <ChangeInfo setData={setData} setScreenProfile={setScreenProfile}/>
                </OverlayPage>    
            )}
        </div>
    )
}


//useRef -->
//hook react who keep a reference to a DOM element
//or
//  save a persistant value without re-render
//<input type="file" /> --> to access to this element (here an input)
//const inputRef=useRef(null) --> to create the variable to receive the reference to the element HTML
//JS will automatically do the reference between the HTML element to inputRef.current
//the input is hidden we need to simulate a click to open it
//and to open the files explorer --> inputRef.current.click()

//const handleFileChange = (e) =>{} --> e is the event triggered by the input
//const file = e.target.files[0] --> e.target= input
//.files[0] --> list of files, important to put 0 because an input can accept more than one file
// ref={inputRef} --> react will create a reference to this HTML element inside inputRef.current

{/* <input
type="file"
accept="image/*"
ref={inputRef}
onChange={handleFileChange}
className="hidden"
/> */}


//to re-render when I change juste one info (changeName for exemple)
// setData(prev => ({
//     ...prev,
//     username: username
// }))
// prev --> value of the state before the re-render
// ... prev --> copy all the state before to make the change
// username: username --> will chnage only the username part and the rest still the same
// if prev is not use all the object will be delete and we will keep just the modification (username)