'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Home() {
  //variables that directly connected to web page.
  const nav = useRouter()
  const [userList, setUserList] = useState([])
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewpassword] = useState('')
  const [err, setErr] = useState('')

  function listAllUserData() {
    //api
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

  async function changepass(oldpass) {
    //changepass func
    console.log(userList)
    const user = userList.find(user => user.password === oldpass && user.login === JSON.parse(window.localStorage.getItem('authData')).login);
    const regex = /[^\s\p{IsCyrillic}A-Za-z,.-]+/; // regular expression for Cyrillic and Latin letters according to my variant num 8.
    try {

        if (user) {
          console.log(user)
          console.log(user.strictPass)
          if( user.strictPass){ // checking if user has strict password option true
            console.log(!regex.test(newPassword))
            if(!regex.test(newPassword)) { // checking if user new pass does not fit for regular expression on line 33
              throw new Error("Err"); // skip whole code straight to line 65
            }
          }

            const data = {
                login: user.login,
                password: newPassword
            }
            const responce = await axios.put(`http://localhost:3001/users/${user.id}`,{
                    ...user,
                    id: user.id,
                    login: user.login,
                    password: data.password
            })
            console.log(responce)
            window.localStorage.setItem('authData', JSON.stringify(data))
            setTimeout(()=>{
                nav.push('/')
            },500)
            return 1;
        }
        else {
            setErr('You used wrong old password.')
            return 0;
        }
    } catch(err) {
      console.log(err)
      setErr('Your new password does not have Cyrillic and Latin letters.')
    }
  }

  useEffect(()=>{
    //when page loads this func runs
    listAllUserData()
  }, [])

  return (
    <>
    <header
    style={{width:'100%',display:'flex', justifyContent:'space-between'}}>
      <div>
        <Link
        href={'/about'}
        >
        <h1>
          About
        </h1>
        </Link>
      </div>
    </header>
    <section>
      <div 
      style={{display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center', width: '100%', height:'100svh'}}>
      <label>Do you want to change password?</label>
      <input
      type='password'
      placeholder='Old password'
      style={{width: 200, margin: 5}}
      onChange={(e)=>{setOldPassword(e.target.value); setErr('')}}
      />
      <input
      type='password'
      placeholder='New password'
      style={{width: 200, margin: 5}}
      onChange={(e)=>{setNewpassword(e.target.value); setErr('')}}
      />
      <p
      style={{width: 200, textAlign:'center', margin:'10px 0'}}
      >{err}</p>
      <button
      style={{width: 200, margin: 5}}
      onClick={()=>{console.log(changepass(oldPassword))}}
      >
        Change password
      </button>
      </div>
    </section>
    </>
  )
}
