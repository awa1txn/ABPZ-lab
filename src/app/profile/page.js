'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Home() {

  const nav = useRouter()

  const [userList, setUserList] = useState([])
  const [login, setLogin] = useState(null)
  const [isAdmin, setIsAdmin] = useState(null)

  function listAllUserData() {
    try{
      const responce = fetch('http://localhost:3001/users')   
      .then((response) => { 
        response.json().then((data) => {
          setUserList(data);
            return data;
        }).catch((err) => {
            console.log(err);
        })
    });
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(()=>{
    listAllUserData()
    if(typeof window !== 'undefined'){ //check if web page mounted
      if(JSON.parse(window.localStorage.getItem('authData')).login === 'admin') { //if user admin
        setIsAdmin(JSON.parse(window.localStorage.getItem('authData')).login)
      }
      setLogin(JSON.parse(window.localStorage.getItem('authData')).login)
    }
  }, [])
  async function pullLog() {
    let res = await axios.post('http://localhost:3001/logsystem', 
    {
      log:`user with name: ${login} - logged out.`,
      createdAt: new Date().toISOString()  
    }
    )
  }
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
          About
        </h1>
        </Link>
      </div>

      <div>
        {
          isAdmin &&
          <Link
          href={'/admintools'}>
            <h3>
              Admin tools
            </h3>
          </Link>
        }
        <Link
        href={'/changepass'}
        >
        <h3>
          Change password
        </h3>
        </Link>
        <Link
          onClick={()=>{
            pullLog();
            localStorage.clear()
          }}
          href={'/'}
        >
        <h3>
          Log out
        </h3>
        </Link>
      </div>
    </header>
    <section>
      <div 
      style={{display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center', width: '100%', height:'100svh'}}>
      <p
      placeholder='Login'
      style={{width: 200, margin: 5}}
      > Your username: {login} </p>
      </div>
    </section>
    </>
  )
}
