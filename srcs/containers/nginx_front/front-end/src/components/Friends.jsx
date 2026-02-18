import { useState, useEffect } from "react"
//import {Circle, CenterText, LogInInput} from "./circleUtils.jsx"
//import {Sixtyfour, CorbenBold, CorbenRegular} from "./typography.jsx"
//import { Login, Register, Logout } from "../services/authService"
//import {AlertMessage} from "../services/alertMessage"
import { useAuth } from "../services/authProvider"

import { getFriends, getUserInfo } from "../services/authService.js"



function Card({ title, friends, children }) {
  const { userId } = useAuth()
  console.log(friends)




  return (
    <div className="bg-white rounded-2xl shadow-md p-6 text-center">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <p className="text-gray-600">{children}</p>
      {friends && friends.map((friendship) => {
        const[userInfo, setUserInfo] = useState(null)
        const myFriend = (friendship.user1_id === userId) ?  friendship.user2_id : friendship.user1_id

        useEffect(() => {
          if (!userId) return;

          async function fetchUserInfo() {
            try {
              const data = await getUserInfo(myFriend);
              setUserInfo(data);
              console.log(data)
            } catch (error) {
              console.error(error);
            }
          }

          fetchUserInfo();
        }, [userId]);



        return (
        <div key={friendship.id}>
         {userInfo.username}
        
        </div>
        )
      })}
    </div>
  );
}

export function Friends({setScreen}) {
  const { userId } = useAuth()
  console.log("userId ", userId)
   const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (!userId) return;

    async function fetchFriends() {
      try {
        const data = await getFriends(userId);
        setFriends(data);
        //console.log(friends)
      } catch (error) {
        console.error(error);
      }
    }

    fetchFriends();
  }, [userId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <Card title="Friends" friends={ friends }>Content for the first section.</Card>
        <Card title="Pending">Content for the second section.</Card>
        <Card title="Sent invitation">Content for the third section.</Card>
      </div>
    </div>
  );

}