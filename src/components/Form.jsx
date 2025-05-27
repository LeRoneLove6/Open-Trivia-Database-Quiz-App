import React, { useState } from "react";

function Form() {
  const [form, setForm] = useState({
    firstName: "",
    category: "",
    difficulty: "",
  });
  const [error, setError] = useState("");
  const [showQuestion, setShowQuestion] = useState(false);
  const [questionData, setQuestionData] = useState(null);
  const [apiError, setApiError] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answerError, setAnswerError] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Helper to shuffle answers
  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.category || !form.difficulty) {
      setError("All fields are required.");
      return;
    }
    // Fetch question from Open Trivia API
    try {
      setApiError("");
      setAnswerError("");
      setSelectedAnswer("");
      setShowResult(false);
      const categoryMap = {
        general: 9,
        "science & nature": 17,
        history: 23,
        sports: 21,
      };
      const url = `https://opentdb.com/api.php?amount=1&category=${categoryMap[form.category]}&difficulty=${form.difficulty}&type=multiple`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.response_code !== 0 || !data.results.length) {
        setApiError("No question found. Try different options.");
        return;
      }
      const q = data.results[0];
      // Combine correct and incorrect answers, then shuffle
      const answers = shuffle([q.correct_answer, ...q.incorrect_answers]);
      setQuestionData({
        question: q.question,
        answers,
        correct: q.correct_answer,
      });
      setShowQuestion(true);
    } catch {
      setApiError("Failed to fetch question. Please try again.");
    }
  };

  const handleAnswerChange = (e) => {
    setSelectedAnswer(e.target.value);
    setAnswerError("");
  };

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    if (!selectedAnswer) {
      setAnswerError("Please select an answer.");
      return;
    }
    setIsCorrect(selectedAnswer === questionData.correct);
    setShowResult(true);
    setShowQuestion(false);
  };

  const handleRestart = () => {
    setForm({
      firstName: "",
      category: "",
      difficulty: "",
    });
    setError("");
    setShowQuestion(false);
    setQuestionData(null);
    setApiError("");
    setSelectedAnswer("");
    setAnswerError("");
    setShowResult(false);
    setIsCorrect(false);
  };

  // Results section
  if (showResult && questionData) {
    return (
      <div>
        <h2>
          {isCorrect
            ? `Congratulations, ${form.firstName}! You answered correctly!`
            : `Sorry, ${form.firstName}, that's incorrect.`}
        </h2>
        {!isCorrect && (
          <div>
            The correct answer was:{" "}
            <span dangerouslySetInnerHTML={{ __html: questionData.correct }} />
          </div>
        )}
        <button onClick={handleRestart}>Start Over</button>
      </div>
    );
  }

  // Render the question form if showQuestion is true
  if (showQuestion && questionData) {
    return (
      <form onSubmit={handleQuestionSubmit}>
        {apiError && <div style={{ color: "red" }}>{apiError}</div>}
        <div>
          <strong dangerouslySetInnerHTML={{ __html: questionData.question }} />
        </div>
        {questionData.answers.map((ans, idx) => (
          <div key={idx}>
            <label>
              <input
                type="radio"
                name="answer"
                value={ans}
                checked={selectedAnswer === ans}
                onChange={handleAnswerChange}
              />
              <span dangerouslySetInnerHTML={{ __html: ans }} />
            </label>
          </div>
        ))}
        {answerError && <div style={{ color: "red" }}>{answerError}</div>}
        <button type="submit">Submit Answer</button>
      </form>
    );
  }

  // Render the initial form
  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <label htmlFor="firstName">First Name:</label>
      <input
        type="text"
        id="firstName"
        name="firstName"
        value={form.firstName}
        onChange={handleChange}
      />

      <label htmlFor="category">Category:</label>
      <select
        id="category"
        name="category"
        value={form.category}
        onChange={handleChange}
      >
        <option value="">Select a category</option>
        <option value="general">General Knowledge</option>
        <option value="science & nature">Science & Nature</option>
        <option value="history">History</option>
        <option value="sports">Sports</option>
      </select>

      <label htmlFor="difficulty">Difficulty:</label>
      <select
        id="difficulty"
        name="difficulty"
        value={form.difficulty}
        onChange={handleChange}
      >
        <option value="">Select difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <button type="submit">Submit</button>
    </form>
  );
}

export default Form;
