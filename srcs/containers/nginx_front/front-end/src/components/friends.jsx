import { useState, useEffect } from "react"
import { useAuth } from "../services/authProvider.jsx"
import { getFriends, getUsers, getUserInfo, getFriendsPending, getFriendsToRespond, cancelFriendship, acceptFriendship, newFriendship, getUserByUsername } from "../services/authService.js"
import { ProfilePicture, IconText, IconsOverlayFrame, OverlayPage, DisplayIcon, LargeButton} from "./iconUtils.jsx"
import { Circle, PlaceholderInput } from './circleUtils.jsx'
import { AlertMessage, OptionAlert } from "../services/alertMessage"
import { Sixtyfour, P, H2, H3, LI, UL, CorbenRegular } from "./typography"

 function Button({text, onClick, src}){
    return(
        <button className="group relative flex items-center " onClick={onClick}>
            <img src={src} alt="button icon" className="w-4 h-auto" />
            <div className="absolute z-20 left-2/3 top-1/2 transform -translate-y-1/2 ml-2">
                <IconText text={text} />
            </div>
        </button>
    )
}

function RequestCard({request, buttonText, onDelete, children, onAccept}) {
  return (
      <div className="p-6 text-center border rounded-xl border-greyish relative ">
       
        <div className="flex items-center relative w-full justify-center ">
            <Sixtyfour>{children}</Sixtyfour>
        </div>

      {request && request.map((friendship) => {
        return (
          <div key={friendship.id} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <ProfilePicture
                src={friendship.avatar}
                className="w-8 h-8"
              />
              <P className="">{friendship.username}</P>
            </div>
             <Button
              text="Accept invitation"
              onClick={() => onAccept(friendship.id)}
              src="/validation_icons/V_bold_cut.svg"
             />
            <Button
              text={buttonText}
              onClick={() => onDelete(friendship.id)}
              src="/validation_icons/X_bold_cut.svg"
            />
        </div>
        )
      })}
    </div>
  )
}

function PendingCard({pending, buttonText, onDelete, children}) {
  return (
    <div className="p-6 text-center border rounded-xl border-greyish relative ">
        <div className="flex items-center relative w-full justify-center ">
            <Sixtyfour>{children}</Sixtyfour>
        </div>

      {pending && pending.map((friendship) => {
        return (
          <div key={friendship.id} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              {(children === "Friends list") && (<span
                className={`w-2 h-2 rounded-full ${
                friendship.online_status ? 'bg-green-700' : 'bg-red-600'
               }`}
              ></span>)}
              <ProfilePicture
                src={friendship.avatar}
                className="w-8 h-8"
              />
              <P className="">{friendship.username}</P>
            </div>
            <Button
              text={buttonText}
              onClick={() => onDelete(friendship.id)}
              src="/validation_icons/X_bold_cut.svg"
            />
        </div>
        )
      })}
    </div>
  )
}

function FriendsCard({ friends, buttonText, onDelete, children, setScreenProfile }) {

  return (
    <div className="p-6 text-center border rounded-xl border-greyish relative ">
        <div className="flex items-center relative w-full justify-center ">
            <Sixtyfour>{children}</Sixtyfour>
        </div>
          <div className="relativ overflow-visible z-50">
              <Button
                  text="Add friend"
                  onClick={() =>setScreenProfile("addFriend")}
                  src="/validation_icons/+_bold_plain_yellow.svg"
              />
          </div>
        
      {friends && friends.map((friendship) => {
        return (
          <div key={friendship.id} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <span
                className={`w-2 h-2 rounded-full ${
                friendship.online_status ? 'bg-green-700' : 'bg-red-600'
               }`}
              ></span>
              <ProfilePicture
                src={friendship.avatar}
                className="w-8 h-8"
              />
              <P className="">{friendship.username}</P>
            </div>
            
            <Button
              text={buttonText}
              onClick={() => onDelete(friendship.id)}
              src="/validation_icons/X_bold_cut.svg"
            />
        </div>
        )
      })}
    </div>
  )
}

function AddFriend({setScreenProfile, setPending}) {
    const { userId } = useAuth()

  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
  try {
    e.preventDefault()
    if (username.trim() !== "") {
      const user = await getUserByUsername(username.trim())

      const data = await newFriendship(userId, user.id)

      setPending(prev => [...prev, user])  

      AlertMessage.fire({
        icon: "success",
        text: "You send a new friend request!",
      })
    }
    setScreenProfile("friends")
  } catch (error) {
    AlertMessage.fire({
        icon: "error",
        text: error.message,
      })
  }
}

  return(
    <div className="flex flex-col relative w-full h-full justify-center items-center">
      <Circle className="bg-shell border-2 border-greyish px-10">
        <div className="flex flex-col pt-4 md:pt-0 lg:pt-6 xl:gap-2 justify-center items-center">
            <form
              onSubmit={handleSubmit}
              className="
                  relative flex flex-col
                  justify-center
                  items-center
                  h-full w-full
                  gap-2 md:gap-4"
            >
            <PlaceholderInput
                  type="text" 
                  placeholder="Type your friend's username"
                  
                  onChange={(e) => setUsername(e.target.value)}
                  className="!static"
            />
            <button type="submit" className="pt-4 md:pt-10">
                <IconText text="Send invitation" className="opacity-100 cursor-pointer" />
            </button>
          </form>
          </div>
        </Circle>
      </div>
      )
}

export function Friends() {
  const { userId } = useAuth()

  const [friends, setFriends] = useState([])
  const [pending, setPending] = useState([])
  const [requests, setRequests] = useState([])

  useEffect(() => {
    if (!userId) return;

    async function fetchFriendships(fetchFct, setState) {
      try {
        const data = await fetchFct(userId)
        const friendsInfo = await Promise.all(data.map(async (friendship) => {
          const friendId = (friendship.user1_id === userId) ?  friendship.user2_id : friendship.user1_id
          return await getUserInfo(friendId)
        }))
        setState(friendsInfo)
      } catch (error) {
        console.error(error);
      }
    }

    fetchFriendships(getFriends, setFriends)
    fetchFriendships(getFriendsPending, setPending)
    fetchFriendships(getFriendsToRespond, setRequests)
  }, [userId])

  async function deleteFriendship(friendId) {
    try {
      const result = await OptionAlert.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      })
      
      if (!result.isConfirmed) return
    
      await cancelFriendship(userId, friendId)
     
      setFriends(prev => prev.filter(friend => friend.id !== friendId))
      setPending(prev => prev.filter(friend => friend.id !== friendId))
      setRequests(prev => prev.filter(friend => friend.id !== friendId))   
      
      await AlertMessage.fire({
      title: "Deleted!",
      text: "Friendship removed successfully.",
      icon: "success"
    })
      
    } catch (error) {
      AlertMessage.fire({
        icon: "error",
        text: error.message,
      })
    }
  }

  async function acceptFriend(friendId) {
    try {
      const data = await acceptFriendship(userId, friendId)
      const acceptedUser = requests.find(friend => friend.id === friendId)
      if (acceptedUser) setFriends(prev => [...prev, acceptedUser])
      setRequests(prev => prev.filter(friend => friend.id !== friendId))
      
      AlertMessage.fire({
        icon: "success",
        text: "You have a new friend!",
      })
    } catch (error) {
      AlertMessage.fire({
        icon: "error",
        text: error.message,
      })
    }
  }

  const [screenProfile, setScreenProfile] = useState("friends");

  return (
    <div className="flex flex-col relative w-full h-full justify-center items-center min-h-0 ">
      <div className="absolute inset-0">
          <IconsOverlayFrame />
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2">
        <div className="">
          <RequestCard request={ requests } buttonText="Decline invitation" onDelete={deleteFriendship} onAccept={acceptFriend}>Request confirmation</RequestCard>
          <PendingCard pending={ pending } buttonText="Cancel invitation" onDelete={deleteFriendship}>Pending</PendingCard>
        </div>
        <div className="">
          <FriendsCard friends={ friends } buttonText="Delete friendship" onDelete={deleteFriendship} setScreenProfile={setScreenProfile}>Friends list</FriendsCard>
        </div>
        {screenProfile === "addFriend" && (
          <OverlayPage onClose={() => setScreenProfile("profile")}> 
            <AddFriend setScreenProfile={setScreenProfile} setPending={setPending} />
          </OverlayPage>    
        )}
      </div>
    </div>
  )
}