"use client";
import { useState, useEffect } from "react";

export default function TopicTimer() {
  const [topics, setTopics] = useState([]);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [topicName, setTopicName] = useState("");
  const [duration, setDuration] = useState("");

  const addTopic = () => {
    if (topicName.trim() !== "" && duration > 0) {
      setTopics([...topics, { name: topicName, duration: parseFloat(duration), actualTime: 0 }]);
      setTopicName("");
      setDuration("");
    }
  };

  const deleteTopic = (index) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const startTimer = () => {
    if (topics.length > 0) {
      setCurrentTopicIndex(0);
      setTimeLeft(Math.round(topics[0].duration * 60));
      setRunning(true);
      setPaused(false);
    }
  };

  const stopTimer = () => {
    setRunning(false);
    setPaused(false);
  };

  const resetTimer = () => {
    setRunning(false);
    setPaused(false);
    setCurrentTopicIndex(0);
    setTimeLeft(0);
    setTopics(topics.map((t) => ({ ...t, actualTime: 0 })));
  };

  useEffect(() => {
    if (running && !paused) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        setTopics((prevTopics) => {
          const updatedTopics = [...prevTopics];
          updatedTopics[currentTopicIndex] = {
            ...updatedTopics[currentTopicIndex],
            actualTime: updatedTopics[currentTopicIndex].actualTime + 1,
          };
          return updatedTopics;
        });
        if (timeLeft === 1) {
          alert(`Time's up for ${topics[currentTopicIndex].name}!`);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, running, paused]);

  const pauseTimer = () => {
    setPaused(!paused);
  };

  const moveToNextTopic = () => {
    if (currentTopicIndex < topics.length - 1) {
      setCurrentTopicIndex((prev) => prev + 1);
      setTimeLeft(Math.round(topics[currentTopicIndex + 1].duration * 60));
    }
  };

  const moveToPreviousTopic = () => {
    if (currentTopicIndex > 0) {
      setCurrentTopicIndex((prev) => prev - 1);
      setTimeLeft(Math.round(topics[currentTopicIndex - 1].duration * 60));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-blue-400">Topic Timer</h1>
      <div className="flex flex-col gap-3 mb-4">
        <input 
          type="text" 
          value={topicName} 
          onChange={(e) => setTopicName(e.target.value)}
          placeholder="Topic Name" 
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
        />
        <input 
          type="number" 
          step="0.1"
          value={duration} 
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Minutes" 
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
        />
        <button onClick={addTopic} className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-500">Add Topic</button>
      </div>
      {topics.length > 0 && (
        <div className="w-full max-w-md bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Topics:</h2>
          <table className="w-full border-collapse border border-gray-700">
            <thead>
              <tr>
                <th className="border border-gray-700 px-2 py-1">Topic</th>
                <th className="border border-gray-700 px-2 py-1">Planned</th>
                <th className="border border-gray-700 px-2 py-1">Actual</th>
                <th className="border border-gray-700 px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((t, index) => (
                <tr key={index} className="border border-gray-700">
                  <td className="border border-gray-700 px-2 py-1">{t.name}</td>
                  <td className="border border-gray-700 px-2 py-1">{t.duration.toFixed(1)} min</td>
                  <td className="border border-gray-700 px-2 py-1">{Math.max(0, Math.floor(t.actualTime / 60))}:{String(Math.max(0, t.actualTime % 60)).padStart(2, '0')}</td>
                  <td className="border border-gray-700 px-2 py-1">
                    <button onClick={() => deleteTopic(index)} className="bg-red-500 px-2 py-1 rounded-lg hover:bg-red-400">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {running && (
        <div className="mt-6 text-center p-4 bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-yellow-400">Current Topic:</h2>
          <h3 className={`text-xl mt-2 ${timeLeft <= 0 ? 'text-red-500' : 'text-white'}`}>{topics[currentTopicIndex]?.name}</h3>
          <h3 className={`text-3xl mt-4 font-bold ${timeLeft <= 0 ? 'text-red-400' : 'text-green-300'}`}>{Math.max(0, Math.floor(timeLeft / 60))}:{String(Math.max(0, timeLeft % 60)).padStart(2, '0')}</h3>
          <div className="mt-4 flex gap-2">
            <button onClick={pauseTimer} className="bg-yellow-500 px-4 py-2 rounded-lg">{paused ? "Resume" : "Pause"}</button>
            <button onClick={moveToPreviousTopic} className="bg-gray-600 px-4 py-2 rounded-lg">Previous</button>
            <button onClick={moveToNextTopic} className="bg-blue-600 px-4 py-2 rounded-lg">Next</button>
            <button onClick={stopTimer} className="bg-red-600 px-4 py-2 rounded-lg">Stop</button>
          </div>
        </div>
      )}
      <button onClick={startTimer} disabled={running || topics.length === 0} className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-500 mt-4">Start Call</button>
      <button onClick={resetTimer} className="bg-red-600 px-6 py-3 rounded-lg hover:bg-red-500 mt-4">Reset</button>
    </div>
  );
}
