import clsx from 'clsx'
import he from 'he'
export default function QuestionComp(props){

    const answers = props.answers
    console.log(props.wholeQuestion.selectedAnswer)

    const answerBtns = answers.map((answer, index)=>{
        let id = ''
        if(!props.isCheckingAnswers){
            id = props.wholeQuestion.selectedAnswer === answer ? 'selected' : ''
        }else{
            if(answer === he.decode(props.wholeQuestion.correct_answer)){
                id = 'btn-correct'
            }else if(answer === props.wholeQuestion.selectedAnswer){
                id = 'btn-incorrect'
            }else{
                id = 'btn-dimmed'
            }
        }
            return <button 
            onClick={()=>props.registerAnswer(props.questionIndex, answer)} 
            key={index} 
            className={clsx("question-btn",id)}>{answer}
        </button>
    })
    
    return(
        <div className="question-div">
            <h2 className="question-h2">{props.question}</h2>
            <div className="question-btn-div">
                {answerBtns}
            </div>
        </div>
    )
}
