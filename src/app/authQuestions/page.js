'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const questions = [
    {
      question: "2+2?",
      answer: 4,
      id: 1
    },
    {
      question: "2/2?",
      answer: 1,
      id: 2
    },
    {
      question: "2*2?",
      answer: 4,
      id: 3
    },
    {
      question: "2-2?",
      answer: 0,
      id: 4
    },
    {
      question: "4+4?",
      answer: 8,
      id: 5
    },
    {
      question: "4-4?",
      answer: 0,
      id: 6
    },
    {
      question: "4*4?",
      answer: 16,
      id: 7
    },
    {
      question: "4/4?",
      answer: 1,
      id: 8
    },
    {
      question: "8+8?",
      answer: 16,
      id: 9
    },
    {
      question: "8-8?",
      answer: 0,
      id: 10
    },
    {
      question: "8/8?",
      answer: 1,
      id: 11
    },
    {
      question: "8*8?",
      answer: 64,
      id: 12
    },
    {
      question: "5+5?",
      answer: 10,
      id: 13
    },
    {
      question: "5-5?",
      answer: 0,
      id: 14
    },
    {
      question: "5*5?",
      answer: 25,
      id: 15
    }
  ]

export default function Home() {
  const [questionNums, setQuestionNums] = useState(null)
  const [q, setQ] = useState(questions)
  const [success1, setSuccess1] = useState(null);
  const [success2, setSuccess2] = useState(null);
  const [success3, setSuccess3] = useState(null);
  const [err, serErr] = useState('')
  let temparr = null;
  const nav = useRouter()

  function generateRandomArray() {
    const arr = [];
  
    while (arr.length < 3) {
      const randomNum = Math.floor(Math.random() * 15) + 1;
  
      if (!arr.includes(randomNum)) {
        arr.push(randomNum);
      }
    }
    temparr = arr;
    setQuestionNums(arr)
    console.log(arr)
    return arr;
  }

  useEffect(()=>{
    generateRandomArray()
  },[])
  return (
    <>
    <section
    style={{display:'flex', justifyContent:'center', margin: '300px 0'}}
    >
    <div
    style={{display:'flex', flexDirection:'column', gap: 10}}>
            <div>
    {
        questionNums?.length > 0 &&
        q.map((el)=>{
            if(el.id === questionNums[0]) {
                return <>
                <p>
                    {el.question}
                </p>
                <input 
                onChange={()=>setSuccess1(null)}
                onBlur={(e)=>{
                    console.log(e.target.value)
                    e.target.value === `${el.answer}` ? setSuccess1(true) : setSuccess1(false)
                }}
                />
                {success1 === true && <>✅</>}
                {success1 === false && <>❌</>}
                </>
                
            }
        }
        )
    }
    </div>
    <div>
    {
        questionNums?.length > 0 &&
        q.map((el)=>{
            if(el.id === questionNums[1]) {
                return <>
                <p>
                    {el.question}
                </p>
                <input 
                onChange={()=>setSuccess2(null)}
                onBlur={(e)=>{
                    console.log(e.target.value)
                    e.target.value === `${el.answer}` ? setSuccess2(true) : setSuccess2(false)
                }}
                />
                {success2 === true && <>✅</>}
                {success2 === false && <>❌</>}
                </>
                
            }
        }
        )
    }
    </div>
    <div>
        {
        questionNums?.length > 0 &&
        q.map((el)=>{
            if(el.id === questionNums[2]) {
                return <>
                <p>
                    {el.question}
                </p>
                <input 
                onChange={()=>setSuccess3(null)}
                onBlur={(e)=>{
                    console.log(e.target.value)
                    e.target.value === `${el.answer}` ? setSuccess3(true) : setSuccess3(false)
                }}
                />
                {success3 === true && <>✅</>}
                {success3 === false && <>❌</>}
                </>
                
            }
        }
        )
    }
    </div>
    <div style={{width:200, textAlign:'center'}}>
    {err}
    </div>
    <div
    style={{border: '1px solid white', padding:5, textAlign:'center', cursor:'pointer', width:175}}
    onClick={()=>{
        if(success1+success2+success3 !== 3){
            serErr('You ain\'t answer all quizes right to auth')
        } else{
            nav.push('/profile')
        }
    }}
    >
       {questionNums?.length > 0 ? "Continue" : 'Wait'} 
    </div>
    </div>
    
    </section>
    </>
  )
}