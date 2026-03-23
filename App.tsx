import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';

type Board = (string | null)[];
type GameStatus = 'playing' | 'win' | 'draw';

export default function App() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [status, setStatus] = useState<GameStatus>('playing');

  const calculateWinner = (squares: Board): string | null => {
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
  };

  const winner = calculateWinner(board);
  const isBoardFull = board.every((square) => square !== null);

  const handleSquarePress = (index: number) => {
    if (board[index] || winner || status !== 'playing') {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setStatus('win');
    } else if (isBoardFull || newBoard.every((square) => square !== null)) {
      setStatus('draw');
    }

    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setStatus('playing');
  };

  const getStatusMessage = () => {
    if (winner) {
      return `Player ${winner} wins! 🎉`;
    } else if (status === 'draw' || isBoardFull) {
      return "It's a draw!";
    } else {
      return `Current player: ${isXNext ? 'X' : 'O'}`;
    }
  };

  const Square = ({ value, index }: { value: string | null; index: number }) => (
    <TouchableOpacity
      style={[styles.square, value === 'X' && styles.squareX]}
      onPress={() => handleSquarePress(index)}
    >
      <Text style={[styles.squareText, value === 'O' && styles.squareTextO]}>
        {value}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic-Tac-Toe</Text>
      <Text style={styles.status}>{getStatusMessage()}</Text>

      <View style={styles.board}>
        <View style={styles.row}>
          <Square value={board[0]} index={0} />
          <Square value={board[1]} index={1} />
          <Square value={board[2]} index={2} />
        </View>
        <View style={styles.row}>
          <Square value={board[3]} index={3} />
          <Square value={board[4]} index={4} />
          <Square value={board[5]} index={5} />
        </View>
        <View style={styles.row}>
          <Square value={board[6]} index={6} />
          <Square value={board[7]} index={7} />
          <Square value={board[8]} index={8} />
        </View>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetButtonText}>Reset Game</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  status: {
    fontSize: 18,
    color: '#4ecdc4',
    marginBottom: 30,
    fontWeight: '600',
  },
  board: {
    marginBottom: 40,
  },
  row: {
    flexDirection: 'row',
  },
  square: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#4ecdc4',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#262626',
  },
  squareX: {
    backgroundColor: '#2a2a2a',
  },
  squareText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4ecdc4',
  },
  squareTextO: {
    color: '#ff6b6b',
  },
  resetButton: {
    backgroundColor: '#4ecdc4',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});
