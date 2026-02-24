import { useState, useEffect } from "react"
import { useAuth } from "../services/authProvider.jsx"
import { getFriends, getUserInfo, getFriendsPending, getFriendsToRespond, cancelFriendship, acceptFriendship } from "../services/authService.js"
import { ProfilePicture, IconText } from "./iconUtils.jsx"
import { AlertMessage, OptionAlert } from "../services/alertMessage"



 function Button({text, onClick, src}){
    return(
        <button className="group relative flex items-center" onClick={onClick}>
            <img src={src} alt="chopstick button icon" className="w-4 h-auto" />
            <div className="absolute z-20 left-2/3 top-1/2 transform -translate-y-1/2 ml-2">
                <IconText text={text} />
            </div>
        </button>
    )
}



function Card({ friends, buttonText, onDelete, onAccept, children }) {

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 text-center">
    
      <p className="text-gray-600">{children}</p>
      {friends && friends.map((friendship) => {
        return (
          <div key={friendship.id} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <ProfilePicture
                src={friendship.avatar}
                className="w-8 h-8"
              />
              <p>{friendship.username}</p>
            </div>
           {(children === "Request confirmation") ? <Button
              text="Accept invitation"
              onClick={() => onAccept(friendship.id)}
              src="/validation_icons/V_bold_cut.svg"
            /> : <div/>}
            
            <Button
              text={buttonText}
              onClick={() => onDelete(friendship.id)}
              src="/validation_icons/X_bold_cut.svg"
            />
        </div>
        )
      })}
    </div>
  );
}

export function Friends({setScreen}) {
  const { userId } = useAuth()
  //console.log("userId ", userId)
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
    
      const data = await cancelFriendship(userId, friendId)
     
      
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
        text: err.message,
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

  return (
    <div className="flex flex-col relative w-full h-full justify-center items-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <Card friends={ friends } buttonText="Delete friendship" onDelete={deleteFriendship}>Friends list</Card>
        <Card friends={ pending } buttonText="Cancel invitation" onDelete={deleteFriendship}>Pending</Card>
        <Card friends={ requests } buttonText="Decline invitation" onDelete={deleteFriendship} onAccept={acceptFriend}>Request confirmation</Card>
      </div>
    </div>
  )
}