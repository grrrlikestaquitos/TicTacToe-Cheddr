import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

type Board = (string | null)[];
type GameStatus = 'playing' | 'win' | 'draw';

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width - 40, 350);
const SQUARE_SIZE = BOARD_SIZE / 3;

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
      return "It's a draw! 🤝";
    } else {
      return `Current player: ${isXNext ? 'X' : 'O'}`;
    }
  };

  const Square = ({ value, index }: { value: string | null; index: number }) => (
    <TouchableOpacity
      style={[
        styles.square,
        value === 'X' && styles.squareX,
        value === 'O' && styles.squareO,
      ]}
      onPress={() => handleSquarePress(index)}
      activeOpacity={0.7}
    >
      <Text style={[styles.squareText, value === 'O' && styles.squareTextO]}>
        {value}
      </Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#0f0f1e', '#1a0a2e', '#16213e']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Tic-Tac-Toe</Text>

        <View style={styles.statusContainer}>
          <Text style={styles.status}>{getStatusMessage()}</Text>
        </View>

        <View style={styles.boardWrapper}>
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
        </View>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={resetGame}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#00d4ff', '#0099cc']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.resetButtonGradient}
          >
            <Text style={styles.resetButtonText}>New Game</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <StatusBar style="light" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 10,
    letterSpacing: 2,
    textShadowColor: '#00d4ff',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  statusContainer: {
    marginBottom: 40,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#00d4ff',
  },
  status: {
    fontSize: 18,
    color: '#00d4ff',
    fontWeight: '700',
    textAlign: 'center',
  },
  boardWrapper: {
    marginBottom: 50,
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  board: {
    marginBottom: 0,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#0a0e1a',
  },
  row: {
    flexDirection: 'row',
  },
  square: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1f3a',
  },
  squareX: {
    backgroundColor: 'rgba(0, 212, 255, 0.05)',
  },
  squareO: {
    backgroundColor: 'rgba(255, 107, 107, 0.05)',
  },
  squareText: {
    fontSize: 44,
    fontWeight: '900',
    color: '#00d4ff',
    textShadowColor: '#00d4ff',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  squareTextO: {
    color: '#ff6b6b',
    textShadowColor: '#ff6b6b',
  },
  resetButton: {
    width: 200,
    height: 54,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  resetButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f0f1e',
    letterSpacing: 1,
  },
});
