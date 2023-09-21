'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {

  const nav = useRouter()

  const [userList, setUserList] = useState([])
  const [login, setLogin] = useState(null)
  const [password, setPassword] = useState(null)

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
    if (user) {
        window.localStorage.setItem('authData', JSON.stringify(user))
        nav.push('/profile')
        return 1; //success sign in
    } else {
        return 0; //failed sign in
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
        href={'/profile'}
        >
        <h1>
          Home
        </h1>
        </Link>
      </div>
    </header>
    <section
    style={{display:'flex', justifyContent:'center', margin: '300px 0'}}
    >
        <h1 style={{width:700, textAlign:'center'}}>Fullstack веб-проект виконаний Данилом Шаповаловим Михайловичем з групи 172-20-1. 
        <p>У рамках практичної роботи #1</p>
        <p>Розмежування повноважень користувачів на основі парольної аутентифікації.</p>
        <p>За індивідуальним завданням треба було проробити за варіантом перевірку пароля на зміст латинських букв і символів кирилиці.</p>
    </h1>
    </section>
    </>
  )
}