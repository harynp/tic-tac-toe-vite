import { useState } from "react";
import PropTypes from 'prop-types';

function Square({value, onSquareClick}) {
  return <button className="square" onClick={onSquareClick}>{value}</button>
}

function whoIsWinner(squares) {
  const checkLines = [
    // horizontal
    [0,1,2],
    [3,4,5],
    [6,7,8],
    // vertical
    [6,7,8],
    [0,3,6],
    [1,4,7],
    // diagonal
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];

  for(let i = 0; i < checkLines.length; i++) {
    const [a,b,c] = checkLines[i];
    if (squares[a] && squares[a] === squares[b] && squares[c]) {
      return squares[a];
    } 
  }

  return false;
}


function Board({xIsNext, squares, onPlay}) {

  function handleClick(i) {
    if (squares[i] || whoIsWinner(squares)) return;
    
    // eslint-disable-next-line react/prop-types
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winnerName = whoIsWinner(squares);
  let status = '';

  if (winnerName) {
    status = `Winner is ${winnerName}`;
  } else {
    status = `Next Player is ${(xIsNext ? 'X' : 'O')}`;
  }

  return (
    <>
      <div>{status}</div>
      <div className="board">
        {Array.from({ length: 9 }).map((_, index) => (
          <Square
            key={index}
            value={squares[index]}
            onSquareClick={() => handleClick(index)}
          />
        ))}
      </div>
    </>
  );
}


export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  
  function handlePlay (nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1)
  }

  const moves = history.map((squares, move) => {
    let description = '';
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  })

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className='game-info'>
        <ol>{moves}</ol>
      </div>
      <div></div> </div>
  );
}

Square.propTypes = {
  value: PropTypes.string.isRequired,
  onSquareClick: PropTypes.func.isRequired,
};

Board.propTypes = {
  xIsNext: PropTypes.bool.isRequired,
  squares: PropTypes.array.isRequired,
  onPlay: PropTypes.func.isRequired,
};