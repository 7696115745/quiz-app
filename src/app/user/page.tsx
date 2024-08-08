"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import LogOut from "../logout/page";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";

interface Question {
  Questions: string;
  "option-1": string;
  "option-2": string;
  "option-3": string;
  "option-4": string;
  answer: string;
  marks: string;
}

interface Post {
  id: string;
  categories: string;
  questions: Question[];
}

export default function Admin() {
  const [data, setData] = useState<Question[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: string }>({});
  const [totalMarks, setTotalMarks] = useState<number>(0);
  const [maxMarks, setMaxMarks] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [noMatch, setNoMatch] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  useEffect(() => {
    const userToken = Cookies.get("authjs.session-token");
    const adminToken = Cookies.get("email");
    
    if (adminToken) {
      setHasAccess(true);
    } else if (userToken) {
      setHasAccess(false);
    } else {
      setHasAccess(true);
    }
  }, []);

  // Fetch available categories on component mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get<Post[]>("http://localhost:8000/quiz");
        const categories = response.data.map((item) => item.categories);
        setCategories(categories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }

    fetchCategories();
  }, []);

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    if (isSubmitted) {
      setData([]);
      setNoMatch(false);
      setIsSubmitted(false);
      setShowForm(false);
    }
  };

  const handleCategorySubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get<Post[]>("http://localhost:8000/quiz");
      const questions = response.data.find((item) => item.categories === selectedCategory);
      if (questions && questions.questions) {
        setData(questions.questions);
        setNoMatch(false);
        setShowForm(true);

        const total = questions.questions.reduce((acc, question) => acc + parseInt(question.marks, 10), 0);
        setMaxMarks(total);
      } else {
        setData([]);
        setShowForm(false);
        setNoMatch(true);
      }
      setTotalMarks(0);
      setCurrentQuestionIndex(0);
      setSelectedOptions({});
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleOptionChange = (questionIndex: number, optionValue: string) => {
    setSelectedOptions((prev) => ({ ...prev, [questionIndex]: optionValue }));
  };

  const handleSubmit = () => {
    let marks = 0;
    let allQuestionsAnswered = true;

    data.forEach((question, index) => {
      if (selectedOptions[index] === undefined) {
        allQuestionsAnswered = false;
      } else if (selectedOptions[index] === question.answer) {
        marks += parseInt(question.marks, 10);
      }
    });

    if (allQuestionsAnswered) {
      setTotalMarks(marks);
      setIsSubmitted(true);
    } else {
      alert("Please answer all questions.");
    }
  };

  const handleNextQuestion = () => {
    if (selectedOptions[currentQuestionIndex] !== undefined) {
      if (currentQuestionIndex < data.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      }
    } else {
      alert("Please answer the current question before moving to the next.");
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  if (hasAccess === null) {
    return (
      <div className="absolute top-1/2 left-1/2 translate-x-[-50%]">
        <p className='text-white text-[17px] font-semibold'>Checking access...</p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="absolute top-1/2 left-1/2 translate-x-[-50%]">
        <p className='text-red-500 font-semibold'>You do not have access to this page.</p>
      </div>
    );
  }

  return (<>
    <GiHamburgerMenu 
        color="white" 
        className="absolute right-2 top-4 lg:hidden cursor-pointer" 
        size={30}
        onClick={() => setShowSidebar(true)}
      />
  {showSidebar && (
  <div className="side-menu fixed top-0 right-0 h-full w-full bg-gray-800 text-white shadow-lg transition-transform transform translate-x-0 ease-in-out duration-300 sm:w-64 overflow-y-auto">
    <div className="flex justify-between items-center py-4 px-5">
      <h2 className="text-xl font-bold">Admin Panel</h2>
      <FaTimes 
        className="cursor-pointer" 
        size={24} 
        onClick={() => setShowSidebar(false)}
      />
    </div>
    <div className="p-4">
      <LogOut />
    </div>
  </div>
)}
<div className="hidden lg:block p-4 absolute top-7 right-14">
  <LogOut />
</div>
     <div className="Quiz flex flex-col items-center sm:p-6 bg-[#142832] min-h-screen capitalize mt-11">
      <h1 className=" heading font-semibold  my-8 sm:text-[36px] text-2xl text-white">Start Quiz</h1>
      <form onSubmit={handleCategorySubmit} className="search-categories-form flex gap-2 font-semibold">
        <select
           
          onChange={handleCategoryChange}
          className=" border rounded-lg outline-none sm:py-4 py-2 sm:px-5 sm:text-xl"
        >
          <option value="" selected disabled className="font-semibold">Select a category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat} className="font-semibold">
              {cat}
            </option>
          ))}
        </select>
        <button type="submit" className="p-2 sm:px-4 bg-blue-500 text-white rounded-lg font-semibold sm:text-lg">Submit</button>
      </form>

      {noMatch && <p className='text-red-500 font-semibold my-3 lowercase'>Category does not exist.</p>}
      {showForm && data.length > 0 && (
        <div className="quiz-start-form w-full max-w-4xl bg-white sm:p-6 shadow-lg rounded-lg mt-7 p-[12px]">
          <h2 className="font-semibold text-xl mb-4">Questions</h2>
          <div key={currentQuestionIndex} className="mb-6 sm:p-4 border-b border-gray-200">
            <p className="mb-2">
              <strong>Question:</strong> {data[currentQuestionIndex].Questions}?
            </p>
            <div className={`sm:mb-2 mb-3 ${isSubmitted && data[currentQuestionIndex]["option-1"] === data[currentQuestionIndex].answer ? 'bg-green-200' : ''}`}>
              <input
                type="radio"
                id={`option1-${currentQuestionIndex}`}
                name={`question-${currentQuestionIndex}`}
                value={data[currentQuestionIndex]["option-1"]}
                checked={selectedOptions[currentQuestionIndex] === data[currentQuestionIndex]["option-1"]}
                onChange={() => handleOptionChange(currentQuestionIndex, data[currentQuestionIndex]["option-1"])}
                disabled={isSubmitted}
              />
              <label htmlFor={`option1-${currentQuestionIndex}`}>
                {data[currentQuestionIndex]["option-1"]}
              </label>
            </div>
            <div className={`sm:mb-2 mb-3 ${isSubmitted && data[currentQuestionIndex]["option-2"] === data[currentQuestionIndex].answer ? 'bg-green-200' : ''}`}>
              <input
                type="radio"
                id={`option2-${currentQuestionIndex}`}
                name={`question-${currentQuestionIndex}`}
                value={data[currentQuestionIndex]["option-2"]}
                checked={selectedOptions[currentQuestionIndex] === data[currentQuestionIndex]["option-2"]}
                onChange={() => handleOptionChange(currentQuestionIndex, data[currentQuestionIndex]["option-2"])}
                disabled={isSubmitted}
              />
              <label htmlFor={`option2-${currentQuestionIndex}`}>
                {data[currentQuestionIndex]["option-2"]}
              </label>
            </div>
            <div className={`sm:mb-2 mb-3 ${isSubmitted && data[currentQuestionIndex]["option-3"] === data[currentQuestionIndex].answer ? 'bg-green-200' : ''}`}>
              <input
                type="radio"
                id={`option3-${currentQuestionIndex}`}
                name={`question-${currentQuestionIndex}`}
                value={data[currentQuestionIndex]["option-3"]}
                checked={selectedOptions[currentQuestionIndex] === data[currentQuestionIndex]["option-3"]}
                onChange={() => handleOptionChange(currentQuestionIndex, data[currentQuestionIndex]["option-3"])}
                disabled={isSubmitted}
              />
              <label htmlFor={`option3-${currentQuestionIndex}`}>
                {data[currentQuestionIndex]["option-3"]}
              </label>
            </div>
            <div className={`sm:mb-2 mb-3 ${isSubmitted && data[currentQuestionIndex]["option-4"] === data[currentQuestionIndex].answer ? 'bg-green-200' : ''}`}>
              <input
                type="radio"
                id={`option4-${currentQuestionIndex}`}
                name={`question-${currentQuestionIndex}`}
                value={data[currentQuestionIndex]["option-4"]}
                checked={selectedOptions[currentQuestionIndex] === data[currentQuestionIndex]["option-4"]}
                onChange={() => handleOptionChange(currentQuestionIndex, data[currentQuestionIndex]["option-4"])}
                disabled={isSubmitted}
              />
              <label htmlFor={`option4-${currentQuestionIndex}`}>
                {data[currentQuestionIndex]["option-4"]}
              </label>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold sm:text-lg"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
         Previous
            </button>
            {currentQuestionIndex < data.length - 1 && (
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold sm:text-lg"
                onClick={handleNextQuestion}
              >
                Next
              </button>
            )}
            {currentQuestionIndex === data.length - 1 && !isSubmitted && (
              <button
                type="button"
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold sm:text-lg"
                onClick={handleSubmit}
              >
                Submit
              </button>
            )}
          </div>
          {isSubmitted && (
            <div className="mt-6">
              <p className="text-green-600 font-semibold">
                Quiz submitted! Total Marks: {totalMarks}/{maxMarks}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
    </>
  );
}
