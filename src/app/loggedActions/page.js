'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
export default function Home() {
    const [loggs, setLoggs] = useState(null)
    function listAllLoggs() {
        const responce = fetch('http://localhost:3001/logsystem')   
        .then((response) => { 
          response.json().then((data) => {
            console.log(data)
            setLoggs(data);
              return data;
          }).catch((err) => {
              console.log(err);
          })
      });
    }

    useEffect(()=>{
        listAllLoggs()
    },[])
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
    style={{display:'flex', justifyContent:'center', margin: '50px 0'}}>
        <div
        style={{display:'block'}}>
            {
                loggs === null ? 'Wait' :
                loggs.map((el)=> <p>
                    {el.log}
                </p>)
            }
        </div>
    </section>
    </>
  )
}