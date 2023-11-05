'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Home() {

    
  const nav = useRouter()

  const [userList, setUserList] = useState([])
  const [blacklist, setBlacklist] = useState([])
  const [newUser, setNewUser] = useState('')
  const [newBlacklistName, setnewBlacklistName] = useState('')
  const [isAdmin, setIsAdmin] = useState()
  const [err, setErr] = useState('')

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
  async function listAllBlacklistedUsers() {
    try{
      const responce = fetch('http://localhost:3001/blacklist')   
      .then((response) => { 
        response.json().then((data) => {
          setBlacklist(data);
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
          } else{
            nav.push('/')
          }
        }
    }, [])
    useEffect(()=>{
      listAllBlacklistedUsers()

  }, [])

  async function pullLog(actionMode) {
    let res = await axios.post('http://localhost:3001/logsystem', 
    {
      log:`ADMIN: ${actionMode} `,
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
              href={'/loggedActions'}>
                <h3>
                  Watch logged actions
                </h3>
              </Link>
            }
            {
              isAdmin &&
              <Link
              href={'/profile'}>
                <h3>
                  Profile
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
          </div>
        </header>
        <section>
            
            <div 
            style={{display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center', width: '100%', height:'100svh'}}>
            <h1 style={{margin:'10px 0'}}>Tools</h1>
            <div
            style={{width: 500, margin: 5}}>
                add new user{' '}
                <input type='text' placeholder='Username'
                onChange={(e)=> {setNewUser(e.target.value);setErr('')}}
                style={{width:100}}
                /> {' '}
                <button
                onClick={async ()=>{
                  try{
                    blacklist.map(el =>{
                      if(newUser === el.name){
                        throw new Error('blacklist')
                      }
                    })
                    userList.map(el =>{
                      if(newUser === el.login){
                        throw new Error('userexist')
                      }
                    })

                    const res = await axios.post(`http://localhost:3001/users/`,{
                        login: newUser,
                        password: '',
                        banned: false,
                        strictPass: true,
                        createdAt: new Date().toISOString()
                    })
                    pullLog('NEW USER WAS ADDED')
                    window.location.reload()
                  }
                  catch(err) {
                    if (err.message === 'blacklist') {
                      setErr('This username blacklisted')
                    }
                    if (err.message === 'userexist') {
                      setErr('This username already exists')
                    }
                  }
                }}>
                    submit
                </button>
            </div>
            <div
            style={{width: 500, margin: 5}}>
                add blacklisted username{' '}
                <input type='text' placeholder='Username'
                style={{width:100}}
                onChange={(e)=>{setnewBlacklistName(e.target.value)}}
                /> {' '}
                <button
                onClick={async ()=>{
                    const res = await axios.post(`http://localhost:3001/blacklist/`, {name: newBlacklistName})
                    pullLog('NEW BLACKLIST NICKNAME WAS ADDED')
                    window.location.reload()
                }}>
                    submit
                </button>
            </div>
            <p>{err}</p>
            <h1 style={{margin:'10px 0'}}>Userlist</h1>
            {userList.length > 0 ?  userList.map((el)=>{
                return (
                    <p
                    placeholder='Login'
                    style={{width: 500, margin: 5}}
                    key={el.id}
                    > {(el.id+1)+') '} user name: {el.login}
                    {' '}
                    BAN - <input type='checkbox'
                    checked={el.banned}
                    onChange={async ()=>{
                        const res = await axios.put(`http://localhost:3001/users/${el.id}`,{
                            id: el.id,
                            login: el.login,
                            password: el.password,
                            banned: !el?.banned,
                            strictPass: el?.strictPass
                        })
                        pullLog('BANNED/UNBANNED SOMEONE')
                        window.location.reload()
                    }}
                    />
                    {' '}
                    STRICT PASS - <input type='checkbox'
                    checked={el.strictPass}
                    onChange={async ()=>{
                        const res = await axios.put(`http://localhost:3001/users/${el.id}`,{
                            id: el.id,
                            login: el.login,
                            password: el.password,
                            banned: el.banned,
                            strictPass: !el?.strictPass
                        })
                        pullLog('TURNED ON/OFF STRICT PASSWORD RULE FOR SOMEONE')
                        window.location.reload()
                    }}
                    />
                     </p>
                )
            }) : '...:Loading'}
            <h1 style={{margin:'10px 0'}}>Blacklisted usernames</h1>
            {blacklist.length > 0 ? blacklist.map((el, index)=>{
              return <p key={index}>
                {(index+1)+'.'}{' '}{el.name}
              </p>
            }) : '...:Loading'}
            </div>
        </section>
        </>

    )
}