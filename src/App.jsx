import { useState, useEffect, useRef, use } from 'react'
import './App.css'
import he from 'he'
import StartComp from './components/StartComp'
import QuestionComp from './components/QuestionComp'


function App() {
  const [IsGameStarted, setIsGameStarted] = useState(false)
  const [isCheckingAnswers, setIsCheckingAnswers] = useState(false)
  const [questions, setQuestions] = useState([])
  const [score, setScore] = useState(0)
  const [gameCount, setGameCount] = useState(0)

  

  const hasFetched = useRef(false)
  useEffect(()=>{
    
    if (hasFetched.current) return
    hasFetched.current = true

    const fetchData = async () =>{
      try{

        const response = await fetch('https://opentdb.com/api.php?amount=5')
        const result = await response.json()

        const processedData = result.results.map(q=>{
          const allAnswers = [...q.incorrect_answers]
          const randomIndex = Math.floor(Math.random()*(allAnswers.length+1))
          allAnswers.splice(randomIndex,0,q.correct_answer)
          return {
            ...q,
            shuffledAnswers:allAnswers
          }
        })
        setQuestions(processedData)
      }
      catch(error){
        console.error('Fetch failed:', error)
      }
    }
    fetchData()
  },[gameCount])

  const questionComp = questions.map((question, index)=>{
    
    const decodedAnswers = question.shuffledAnswers.map(answer=>{return he.decode(answer)})

    return <QuestionComp
      registerAnswer={registerAnswer} 
      key={index}
      questionIndex={index}
      question={he.decode(question.question)}
      wholeQuestion={question} 
      answers={decodedAnswers} 
      isCheckingAnswers={isCheckingAnswers}
    />
  })

  function registerAnswer(questionIndex, answer){
    setQuestions(prevQuestions =>{
      return prevQuestions.map((question,index)=>{
        if(index === questionIndex){
          return {...question, selectedAnswer: answer}
        }
        return question;
      })
    })
  }

  console.log(questions)

  function startGame(){
    setIsGameStarted(true)
  }

  function checkAnswers(){
    const isAllAnswered = questions.map(question=>{
      if(question.selectedAnswer){
        return true
      }else{
        return false
      }
    })

    const allSelected = isAllAnswered.every(answer=>answer === true)

    if(!allSelected){
      alert('All questions must be answered')
      return
    }else{
      let score = 0

      questions.forEach(q=>{
        if(he.decode(q.correct_answer) === he.decode(q.selectedAnswer)){
          score++
        }
      })

      setScore(score)
      setIsCheckingAnswers(true)
    }
  }

  function resetGame(){
    setIsCheckingAnswers(false)
    setScore(0)
    setQuestions([])
    hasFetched.current = false;
    setGameCount(prev => prev + 1)
    setIsGameStarted(false)
  }
  
  return (
    <>
      {!IsGameStarted && <section className='first-screen-section'>
         <StartComp startGame={startGame}/>
      </section>}
      {IsGameStarted && <section className='second-screen-section'>
         {questionComp}
         {!isCheckingAnswers && <button onClick={checkAnswers} className='check-answers-btn'>Check answers</button>}
        {isCheckingAnswers &&
        <div className='play-again-div'>
            <p className='score-p'>You scored {score}/{questions.length} correct answers</p>
            <button className='play-again-btn' onClick={resetGame}>Play again</button>
        </div>
        }
      </section>}
    </>
  )
}

export default App
