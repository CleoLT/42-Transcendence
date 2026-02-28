import { useState, useEffect } from "react"
import { useAuth } from "../services/authProvider.jsx"
import { getFriends, getUserInfo, getFriendsPending, getFriendsToRespond } from "../services/authService.js"

function Card({ title, friends, children }) {
  const { userId } = useAuth()
  //console.log("Friends in Card: ", friends)

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 text-center">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <p className="text-gray-600">{children}</p>
      {friends && friends.map((friendship) => {
        const myFriend = (friendship.user1_id === userId) ?  friendship.user2_id : friendship.user1_id
        return (
        <div key={friendship.id}>
         {friendship.online_status} {friendship.username} {friendship.avatar}
        </div>
        )
      })}
    </div>
  );
}

export function Friends({setScreen}) {
  const { userId } = useAuth()
  console.log("userId ", userId)
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
  }, [userId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <Card title="Friends" friends={ friends }>Content for the first section.</Card>
        <Card title="Pending" friends={ pending }>Content for the second section.</Card>
        <Card title="Requests to respond" friends={ requests }>Content for the third section.</Card>
      </div>
    </div>
  );

}