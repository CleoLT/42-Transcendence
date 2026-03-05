import { useState, useEffect } from "react"
import { useAuth } from "../services/authProvider.jsx"
import { getFriends, getUsers, getUserInfo, getFriendsPending, getFriendsToRespond, cancelFriendship, acceptFriendship, newFriendship, getUserByUsername } from "../services/authService.js"
import { ProfilePicture, IconText, IconsOverlayFrame, OverlayPage, DisplayIcon, LargeButton} from "./iconUtils.jsx"
import { Circle, PlaceholderInput } from './circleUtils.jsx'
import { AlertMessage, OptionAlert } from "../services/alertMessage"
import { Sixtyfour, P, H2, H3, LI, UL, CorbenRegular } from "./typography"


function Button({text, onClick, src}){
    return(
        <button className="group relative flex flex-col items-center gap-1 " onClick={onClick}>
            <img src={src} alt="button icon" className="w-4 h-auto" />
              <IconText text={text}/>
        </button>
    )
}


function RequestCard({request, onDelete, children, onAccept}) {
  return (
      <div className="p-6 text-center h-1/2 border rounded-xl border-greyish relative mobile-landscape:pt-2">
       
        <div className="flex items-center relative w-full justify-center">
            <Sixtyfour className="text-[0.6rem] md:text-base">{children}</Sixtyfour>
        </div>

      {(request.length === 0) && 
        <div className="flex h-full justify-center items-center">
          <P>No request to confirm</P>
        </div>
      }
      
      {request && request.length > 0 && (
        <div className="h-full overflow-y-auto">
          {request.map((friendship) => {
            return (
              <div key={friendship.id} className="flex items-center justify-between lg:py-2">
                <div className="flex items-center pb-5 gap-1 lg:gap-3">
                  <ProfilePicture
                    src={friendship.avatar}
                    className="w-8 h-8"
                  />
                  <P className="">{friendship.username}</P>
                </div>
                <div className="flex w-20 lg:w-56 items-center justify-end">
                  <Button
                    text="accept invitation"
                    onClick={() => onAccept(friendship.id)}
                    src="/validation_icons/V_bold_plain.svg"
                  />
                  <Button
                    text="decline invitation"
                    onClick={() => onDelete(friendship.id)}
                    src="/validation_icons/X_bold_plain.svg"
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function PendingCard({pending, onDelete, children}) {
  return (
    <div className="p-6 text-center h-1/2 border rounded-xl border-greyish relative mobile-landscape:pt-2">
        <div className="flex items-center relative w-full justify-center">
            <Sixtyfour className="text-[0.6rem] md:text-base">{children}</Sixtyfour>
        </div>

      {(pending.length === 0) &&
        <div className="flex h-full justify-center items-center">
          <P>No pending confirmation</P>
        </div>
      }

      {pending && pending.length > 0 && (
        <div className="h-full overflow-y-auto">
          {pending.map((friendship) => {
            return (
              <div key={friendship.id} className="flex items-center justify-between lg:py-2">
                <div className="flex items-center pb-5 gap-1 lg:gap-3">
                  {(children === "Friends list") && (<span
                    className={`w-2 h-2 rounded-full ${
                    friendship.online_status ? 'bg-greenish' : 'bg-brightRed'
                  }`}
                  ></span>)}
                  <ProfilePicture
                    src={friendship.avatar}
                    className="w-8 h-8"
                  />
                  <P className="">{friendship.username}</P>
                </div>
                <Button
                  text="cancel invitation"
                  onClick={() => onDelete(friendship.id)}
                  src="/validation_icons/X_bold_plain.svg"
                />
            </div>
            )
          })}
      </div>
    )}
    </div>
  )
}

function FriendsCard({ friends, onDelete, children, setScreenProfile }) {

  return (
    <div className="p-6 text-center h-full border rounded-xl overflow-hidden border-greyish relative  mobile-landscape:pt-2">
        <div className="flex justify-center w-full">
            <Sixtyfour className="text-[0.6rem] md:text-base">{children}</Sixtyfour>
            <Button
                  text="Add friend"
                  onClick={() =>setScreenProfile("addFriend")}
                  src="/validation_icons/+_bold_plain_yellow.svg"
            />
        </div>
      {(friends.length === 0) &&
        <div className="flex h-full justify-center items-center">
          <P>No friends to display, add your first one..!</P>
        </div>
      }

      {friends && friends.length > 0 && (
        <div className="h-full overflow-y-auto">
          {friends && friends.map((friendship) => {
            return (
              <div key={friendship.id} className="flex items-center justify-between lg:py-2">
                <div className="flex items-center pb-5 gap-1 lg:gap-3">
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
                  text="delete friendship"
                  onClick={() => onDelete(friendship.id)}
                  src="/validation_icons/X_bold_cut.svg"
                />
            </div>
            )
          })}
        </div>
      )}
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
                  autoComplete="username"
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


  export function Friends({setScreen}) {
  const { userId, disconnectCookie } = useAuth()
  const [friends, setFriends] = useState([])
  const [pending, setPending] = useState([])
  const [requests, setRequests] = useState([])

  useEffect(() => {
    if (!userId)
      return
    (async () => {
        const res = await disconnectCookie()
        if (res)
            return
    }) ()
  }, [userId])

  useEffect(() => {
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
    <div className="flex flex-col relative w-full h-full justify-center items-center">
      <div className="absolute inset-0">
          <IconsOverlayFrame />
      </div>

      <div className="flex flex-col lg:flex-row gap-2 lg:gap-6 h-full w-full px-3 py-5 lg:px-8 lg:py-12 mobile-landscape:py-2">
        <div className="flex flex-col h-1/2 lg:h-full gap-2 lg:pb-2 flex-1">
          <RequestCard request={ requests } onDelete={deleteFriendship} onAccept={acceptFriend}>Request confirmation</RequestCard>
          <PendingCard pending={ pending } onDelete={deleteFriendship}>Pending</PendingCard>
        </div>
        <div className="flex-1 h-1/2 lg:h-full pt-2 lg:pt-0">
          <FriendsCard friends={ friends } onDelete={deleteFriendship} setScreenProfile={setScreenProfile}>Friends list</FriendsCard>
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
