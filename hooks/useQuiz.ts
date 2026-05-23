"use client";

import { useEffect, useState } from "react";

export const useQuiz = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("/api/quiz/questions")
      .then((res) => res.json())
      .then(setQuestions);
  }, []);

  return {
    questions,
  };
};
