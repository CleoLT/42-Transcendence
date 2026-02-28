const baseUrl = import.meta.env.VITE_BASE_URL

export async function Login(username, password) {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include"
  })

  const respond = await res.json()

  if (!res.ok) {
    throw new Error(respond.message)
  }
  return respond
}

export async function Register(username, password, email) {
  const res = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email }),
    credentials: "include"
  })

  //DEBUG
  // console.log("BASE URL =", baseUrl)
  // console.log("FETCH TYPE:", typeof fetch)

  const respond = await res.json()

  // console.log(respond)

  if (!res.ok) {
    throw new Error(respond.message)
  }
  return respond
}


export async function Logout(username) {
  const res = await fetch(`${baseUrl}/api/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
    credentials: "include"
  })

  const respond = await res.json()

  if (!res.ok) {
    throw new Error(respond.message)
  }
  return respond
}

export async function Login2FA(username, code) {
  const res = await fetch(`${baseUrl}/api/auth/login/2fa`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, code }),
    credentials: "include"
  })

  const respond = await res.json()

  if (!res.ok) {
    throw new Error(respond.message)
  }
  return respond
}

export async function Register2FA(username, code) {
  const res = await fetch(`${baseUrl}/api/auth/register/2fa`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, code }),
    credentials: "include"
  })

  const respond = await res.json()

  if (!res.ok) {
    throw new Error(respond.message)
  }
  return respond
}

export async function getFriends(id) {
  const res = await fetch(`${baseUrl}/api/users/${id}/friendships`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  })
  const respond = await res.json()
  if (!res.ok) {
    throw new Error(respond.message)
  }
  return respond
}

export async function getFriendsPending(id) {
  const res = await fetch(`${baseUrl}/api/users/${id}/friendships/pending`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  })
  const respond = await res.json()
  if (!res.ok) {
    throw new Error(respond.message)
  }
  return respond
}

export async function getFriendsToRespond(id) {
  const res = await fetch(`${baseUrl}/api/users/${id}/friendships/requests`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  })
  const respond = await res.json()
  if (!res.ok) {
    throw new Error(respond.message)
  }
  return respond
}

export async function getUserInfo(id) {
  const res = await fetch(`${baseUrl}/api/users/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  })
  const respond = await res.json()
  if (!res.ok) {
    throw new Error(respond.message)
  }
  return respond
}
