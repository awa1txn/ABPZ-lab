'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {

  const nav = useRouter()

  const [userList, setUserList] = useState([])
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [signTriesCounter, setSignTriesCounter] = useState(0)
  function listAllUserData() {
      const responce = fetch('http://localhost:3001/users')   
      .then((response) => { 
        response.json().then((data) => {
          setUserList(data);
            return data;
        }).catch((err) => {
            console.log(err);
        })
    });
  }
  function sign(login, password) {
    const user = userList.find(user => user.login === login && user.password === password);
    try{
      if(user.banned){
        throw new Error('banned')
      }

      if (user) {
          window.localStorage.setItem('authData', JSON.stringify(user))
          nav.push('/profile')
          return 1; //success sign in
      } else {
        setSignTriesCounter(signTriesCounter+1)
        setLogin('')
        setPassword('')
          setErr('Failed: wrong login or password')
          return 0; //failed sign in
      }
    }
    catch(err) {
      if(err.message === 'banned') { setErr('You were banned') }
    }
  }
  useEffect(()=>{
    listAllUserData()
  }, [])
  return (
    <>
    <header
    style={{width:'100%',display:'flex', justifyContent:'space-between'}}
    >
      <div>
        <Link
        href={'/about'}
        >
        <h1>
          
        </h1>
        </Link>
      </div>
    </header>
    <section>
      <div 
      style={{display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center', width: '100%', height:'100svh'}}>
      <label>Please. Sign</label>
      <input
      placeholder='Login'
      style={{width: 200, margin: 5}}
      value={login}
      onChange={(e)=>{setLogin(e.target.value); setErr('')}}
      disabled={signTriesCounter > 2}
      />
      <input
      placeholder='Password'
      type='password'
      style={{width: 200, margin: 5}}
      value={password}
      onChange={(e)=>{setPassword(e.target.value); setErr('')}}
      disabled={signTriesCounter > 2}
      />
      <p>{err}</p>
      {signTriesCounter > 2 && <>
        <p
        style={{width: 200, textAlign:'center', margin:'10px 0'}}>
          <p>You've lost your 3 tries to log in.</p>
          Reload this page if you want sign in again.
        </p>
      </>}
      <button
      style={{width: 200, margin: 5}}
      onMouseUp={()=>{console.log(sign(login, password))}}
      disabled={signTriesCounter > 2}
      >
        SIGN IN
      </button>
      </div>
    </section>
    </>
  )
}
