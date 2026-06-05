

export default function StartComp(props){
    return(
        <>
            <h1>Quizzical</h1>
          <p>Welcome to the quiz!</p>
          <button onClick={props.startGame}>Start quiz</button>
        </>
    )
}