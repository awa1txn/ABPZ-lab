'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Home() {
  //variables that directly connected to web page.
  const nav = useRouter()
  const [login, setLogin] = useState('')
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
  function passwordToNumbers(password) {
    let num = 0;
    if(password !== ''){
      for (let i = 0; i < password.length; i++) {
        num += password.charCodeAt(i);
      }
      return Math.sin(Math.PI/num);
    } else {
      return '';
    }
  }
  function vigenereEncrypt(text, key) {
    let encryptedText = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      if (isLatinLetter(charCode)) {
        const shift = key.charCodeAt(i % key.length) - getBaseCharCode(key);
        const encryptedCharCode = ((charCode - getBaseCharCode(text) + shift) % 26) + getBaseCharCode(text);
        encryptedText += String.fromCharCode(encryptedCharCode);
      } else if (isCyrillicLetter(charCode)) {
        const shift = key.charCodeAt(i % key.length) - getBaseCharCode(key);
        const encryptedCharCode = ((charCode - getBaseCharCode(text) + shift) % 32) + getBaseCharCode(text);
        encryptedText += String.fromCharCode(encryptedCharCode);
      } else {
        encryptedText += text[i];
      }
    }
    return encryptedText;
  }
  
  function isLatinLetter(charCode) {
    return (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122);
  }
  
  function isCyrillicLetter(charCode) {
    return (charCode >= 1040 && charCode <= 1071) || (charCode >= 1072 && charCode <= 1103);
  }
  
  function getBaseCharCode(text) {
    return isLatinLetter(text.charCodeAt(0)) ? 65 : 1040;
  }

  async function changepass(oldpass) {
    //changepass func
    console.log(userList)
    const user = userList.find(user => user.password === passwordToNumbers(oldpass) && user.login === JSON.parse(window.localStorage.getItem('authData')).login);
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
                password: passwordToNumbers(newPassword)
            }
            const responce = await axios.put(`http://localhost:3001/users/${user.id}`,{
                    ...user,
                    id: user.id,
                    login: data.login,
                    password: data.password
            })
            console.log(responce)
            window.localStorage.setItem('authData', JSON.stringify(data))
            pullLog()
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

    setLogin(JSON.parse(window.localStorage.getItem('authData')).login)
  }, [])

  async function pullLog() {
    let res = await axios.post('http://localhost:3001/logsystem', 
    {
      log:`user with name: ${login} - changed password and logged out.`,
      createdAt: new Date().toISOString()  
    }
    )
  }
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
      onClick={()=>{console.log(changepass(vigenereEncrypt(oldPassword)))}}
      >
        Change password
      </button>
      </div>
    </section>
    </>
  )
}
