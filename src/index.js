import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
          
      renderSquare(i) {
        return (
          <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
          />
        );
      }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }

  class Toggle extends React.Component{

    constructor(props) {
      super(props);
      this.state = {value: false};
    }

    handleChange(){
      this.setState({
        value: !this.state.value
      })
    }

    render(){
      return (
        <div class="toggle-switch">
          <input id="toggle" class="toggle-input" type='checkbox' value={this.state.value} onChange={this.handleChange()}/>
          <label for="toggle" class="toggle-label"/>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          user: null,
          pos: null,
        }],
        stepNumber: 0,
        xIsNext: true,
        select: null
      };
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
          return;
        }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
          user: squares[i],
          pos: i,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        select: null
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
        select: step
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const select = this.state.select;

      const moves = history.map((step, move) => {
        const row = Math.trunc(step.pos / 3) + 1;
        const col = (step.pos % 3) + 1;
        const desc = move ?
          'Go to move #' + move + ' col:' + col + ' row:' + row + ' user:' + step.user:
          'Go to game start';
        if(move === select ){
          return (
            <li key={move}>
              <button><b>{desc}</b></button>
            </li>
          );
        } else {
          return (
            <li key={move}>
              <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
          );
        }
      });

      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }