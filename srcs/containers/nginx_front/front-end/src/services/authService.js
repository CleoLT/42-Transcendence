const baseUrl = import.meta.env.VITE_BASE_URL


export async function Login(username, password) {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })

  const respond = await res.json()

  if (!res.ok) {
    throw new Error(respond.error || "Login failed")
  }
  return respond
}


export async function Register(username, email, password) {
  const res = await fetch(`${baseUrl}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  })

  const respond = await res.json()

  if (!res.ok) {
    throw new Error(respond.error || "Registration failed")
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
    throw new Error(respond.error || "Logout failed")
  }
  return respond
}
