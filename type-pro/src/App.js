import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [timer, setTimer] = useState(30); // Default timer value
  const [isRunning, setIsRunning] = useState(false); // Timer state
  const [text, setText] = useState(''); // User's typed text
  const [selectedTimer, setSelectedTimer] = useState(30); // User-selected timer
  const [results, setResults] = useState({
    wpm: 0,
    accuracy: 0,
    mistakes: 0,
    rank: '',
  });

  const predefinedTexts = {
    30: 'A good typing speed comes with consistent practice. The key is to focus on accuracy and gradually improve.',
    60: 'Typing is an essential skill in the digital world. To master it, practice daily and aim for consistent improvement. Start with accuracy, then build speed. Over time, you will become a confident and efficient typist.',
  };

  const predefinedText = predefinedTexts[selectedTimer];

  // Timer countdown logic
  useEffect(() => {
    let interval;
    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsRunning(false); // Stop the timer
      calculateResults(); // Calculate results when timer ends
    }
    return () => clearInterval(interval); // Cleanup
  }, [isRunning, timer]);

  // Start button handler
  const handleStart = () => {
    setIsRunning(true);
    setText(''); // Clear the text area
    setResults({ wpm: 0, accuracy: 0, mistakes: 0, rank: '' }); // Reset results
    setTimer(selectedTimer); // Set timer to user-selected value
  };

  // Reset button handler
  const handleReset = () => {
    setIsRunning(false);
    setTimer(selectedTimer); // Reset timer to selected value
    setText(''); // Clear the text area
    setResults({ wpm: 0, accuracy: 0, mistakes: 0, rank: '' }); // Reset results
  };

  // Calculate WPM, accuracy, mistakes, and rank
  const calculateResults = () => {
    const predefinedWords = predefinedText.split(' ');
    const typedWords = text.trim().split(' ');
    const totalWords = predefinedWords.length;

    let correctWords = 0;
    let mistakes = 0;

    // Compare word by word
    typedWords.forEach((word, index) => {
      if (word === predefinedWords[index]) {
        correctWords++;
      } else {
        mistakes++;
      }
    });

    const wpm = Math.round((correctWords / (selectedTimer / 60)) || 0); // Adjust based on timer
    const accuracy = Math.round((correctWords / totalWords) * 100) || 0;

    // Determine rank
    let rank = '';
    if (wpm < 20) {
      rank = 'Beginner';
    } else if (wpm >= 20 && wpm <= 40) {
      rank = 'Intermediate';
    } else {
      rank = 'Pro';
    }

    setResults({ wpm, accuracy, mistakes, rank });
  };

  // Done button handler
  const handleDone = () => {
    setIsRunning(false);
    calculateResults();
  };

  return (
    <div className="App">
      <h1>Type Pro</h1>
      <div className="timer-selection">
        <label>Select Timer: </label>
        <select
          value={selectedTimer}
          onChange={(e) => setSelectedTimer(Number(e.target.value))}
          disabled={isRunning}
        >
          <option value={30}>30 Seconds</option>
          <option value={60}>1 Minute</option>
        </select>
      </div>
      
      {/* Display Timer and Ideal WPM at the top */}
      {isRunning && (
        <div className="top-info">
          <p>Time Left: {timer} seconds</p>
          <p>Ideal WPM: {selectedTimer === 30 ? '20-30' : '40-50'}</p>
        </div>
      )}

      <div className="controls">
        <button onClick={handleStart} disabled={isRunning}>
          Start
        </button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleDone} disabled={!isRunning}>
          Done
        </button>
      </div>
      <div className="predefined-text">
        <p>{predefinedText}</p>
      </div>
      <textarea
        placeholder="Start typing here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!isRunning}
      ></textarea>
      <div className="results">
        <p>Words Per Minute (WPM): {results.wpm}</p>
        <p>Accuracy: {results.accuracy}%</p>
        <p>Mistakes: {results.mistakes}</p>
        <p>Rank: {results.rank}</p>
      </div>
    </div>
  );
}

export default App;
