const baseUrl = import.meta.env.VITE_BASE_URL



export async function Login(username, password) {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })

  const respond = await res.json()

  if (!res.ok) {
    throw new Error(respond.message)
  }
  return respond
}


export async function Register(username, password, email) {
  const res = await fetch(`${baseUrl}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email })
  })
  //DEBUG
  // console.log("BASE URL =", baseUrl)
  // console.log("FETCH TYPE:", typeof fetch)

  const respond = await res.json()
  // console.log(respond)

  if (!res.ok) {
    // throw new Error(respond.error || "Registration failed")
    throw new Error(respond.message)
  }
  return respond
}


export async function Logout(username) {
  const res = await fetch(`${baseUrl}/api/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  })

  const respond = await res.json()

  if (!res.ok) {
    throw new Error(respond.message)
  }
  return respond
}
