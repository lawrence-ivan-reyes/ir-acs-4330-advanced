import { useState } from 'react'
import { useApolloClient, useMutation, useQuery } from '@apollo/client/react'
import { LOGIN, REGISTER, ME } from './queries'

export default function Auth() {
  const client = useApolloClient()
  const { data } = useQuery(ME)
  const [login, loginResult] = useMutation(LOGIN)
  const [register, registerResult] = useMutation(REGISTER)
  const [mode, setMode] = useState('login')
  const error = loginResult.error || registerResult.error

  async function handleSubmit(e) {
    e.preventDefault()
    const { email, password } = Object.fromEntries(new FormData(e.target))
    const mutate = mode === 'login' ? login : register
    const key = mode === 'login' ? 'login' : 'register'
    try {
      const { data } = await mutate({ variables: { email, password } })
      localStorage.setItem('token', data[key].token)
      await client.resetStore()
    } catch {
      // error below
    }
  }

  async function handleLogout() {
    localStorage.removeItem('token')
    await client.resetStore()
  }

  if (data?.me) {
    return (
      <p className="muted">
        {data.me.email}
        <button type="button" onClick={handleLogout}>
          Log out
        </button>
      </p>
    )
  }

  return (
    <form className="auth" onSubmit={handleSubmit}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required minLength={8} />
      <button className="go">{mode === 'login' ? 'Log in' : 'Register'}</button>
      <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        {mode === 'login' ? 'Need an account?' : 'Have an account?'}
      </button>
      {error && <p className="error">{error.message}</p>}
    </form>
  )
}
