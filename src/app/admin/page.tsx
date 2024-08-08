"use client";
import { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid"; // Import uuid for unique IDs
import AdminLogOut from "../adminlogout/AdminLogout";

export default function Page() {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [categories, setCategories] = useState<string>("");
  const [hasAccess, setHasAccess] = useState<boolean | null>(null); // Use null for loading state
  const [showSidebar, setShowSidebar] = useState<boolean>(false); // State for sidebar visibility
  const [questions, setQuestions] = useState<any[]>([
    {
      id: uuidv4(), // Add unique ID to each question
      Questions: "",
      "option-1": "",
      "option-2": "",
      "option-3": "",
      "option-4": "",
      marks: "",
      answer: "",
    },
  ]);

  const formRef = useRef<HTMLFormElement>(null);

  const handleShowForm = () => {
    setShowForm(true);
    setQuestions([
      {
        id: uuidv4(), // Add unique ID to the initial question
        Questions: "",
        "option-1": "",
        "option-2": "",
        "option-3": "",
        "option-4": "",
        marks: "",
        answer: "",
      },
    ]); // Reset questions state with a new unique ID
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({ categories, questions });

    try {
      const { data: existingCategories } = await axios.get(
        "http://localhost:8000/quiz"
      );
      const categoryExists = existingCategories.find(
        (category: any) => category.categories === categories
      );

      if (categoryExists) {
        await axios.put(
          `http://localhost:8000/quiz/${categoryExists.id}`,
          {
            ...categoryExists,
            questions: [...categoryExists.questions, ...questions],
          },
          { headers: { "Content-Type": "application/json" } }
        );
      } else {
        await axios.post(
          "http://localhost:8000/quiz",
          { id: uuidv4(), categories, questions },
          { headers: { "Content-Type": "application/json" } }
        );
      }

      setShowForm(false);
      setCategories("");
      setQuestions([
        {
          id: uuidv4(),
          Questions: "",
          "option-1": "",
          "option-2": "",
          "option-3": "",
          "option-4": "",
          marks: "",
          answer: "",
        },
      ]);
    } catch (error) {
      console.error("Error handling form submission:", error);
      alert("An error occurred while submitting the form. Please try again.");
    }
  };

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, i) =>
        i === index ? { ...question, [name]: value } : question
      )
    );
  };

  const handleAddQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        id: uuidv4(),
        Questions: "",
        "option-1": "",
        "option-2": "",
        "option-3": "",
        "option-4": "",
        marks: "",
        answer: "",
      },
    ]);
  };

  useEffect(() => {
    const userToken = Cookies.get("authjs.session-token");
    const adminToken = Cookies.get("email");

    if (adminToken) {
      setHasAccess(true);
    } else if (userToken) {
      setHasAccess(false);
    } else {
      setHasAccess(false);
    }
  }, []);

  if (hasAccess === null) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <p className="text-white font-semibold text-20px text-center">Checking access...</p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <p className="text-white text-22px font-semibold text-center">
          You do not have access to this page.
        </p>
      </div>
    );
  }

  return (
    <>
      <GiHamburgerMenu 
        color="white" 
        className="absolute right-2 top-4 lg:hidden cursor-pointer" 
        size={30}
        onClick={() => setShowSidebar(true)} // Show sidebar on click
      />
      {showSidebar && (
        <div className="side-menu fixed top-0 right-0 h-full w-full bg-gray-800 text-white shadow-lg transition-transform transform translate-x-0 ease-in-out duration-300 sm:w-64 overflow-y-auto">
          <div className="flex justify-between items-center py-4 px-5">
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <FaTimes 
              className="cursor-pointer" 
              size={24} 
              onClick={() => setShowSidebar(false)} // Hide sidebar on click
            />
          </div>
          <div className="p-4">
            <AdminLogOut /> {/* Logout button or component */}
          </div>
        </div>
      )}
      <div className="hidden lg:block p-4 absolute top-7 right-14">
  <AdminLogOut /> {/* Show logout only on large devices */}
</div>
      <div className='container-fluid sm:mt-12 flex flex-col items-center mt-36'>
        <h1 className="text-center text-3xl font-bold mb-10 text-white">
          Admin Set Questions
        </h1>
        {!showForm && (
          <button
            className="bg-blue-600 text-white rounded-md px-6 py-2 font-semibold shadow-md hover:bg-blue-700 transition"
            onClick={handleShowForm}
          >
            Start Adding Questions
          </button>
        )}
      </div>
      {showForm && (
        <form
          className="max-w-4xl mx-auto sm:p-6 p-2 bg-white shadow-lg rounded-lg relative overflow-y-auto max-h-[80vh]"
          ref={formRef}
          onSubmit={handleSubmit}
        >
          <FaArrowLeft
            className="absolute top-7 left-[-40px] text-gray-600 cursor-pointer hover:text-gray-800"
            size={24}
            onClick={() => setShowForm(false)}
            color="white"
          />
          <div className="mb-2">
            <p className="text-xl font-semibold mb-2">Categories</p>
            <input
              type="text"
              placeholder="Categories"
              id="categories"
              name="categories"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 transition placeholder:font-semibold"
              required
            />
          </div>
          {questions.map((question, index) => (
            <div key={question.id} className="mb-6 Question-form">
              <p>Set Question {index + 1}</p>
              <input
                type="text"
                placeholder="Question"
                id={`Questions-${index}`}
                name="Questions"
                value={question.Questions}
                onChange={(e) => handleInputChange(index, e)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 transition"
                required
              />
              <p>Option 1</p>
              <input
                type="text"
                placeholder="Option 1"
                id={`option-1-${index}`}
                name="option-1"
                value={question["option-1"]}
                onChange={(e) => handleInputChange(index, e)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 transition"
                required
              />
              <p>Option 2</p>
              <input
                type="text"
                placeholder="Option 2"
                id={`option-2-${index}`}
                name="option-2"
                value={question["option-2"]}
                onChange={(e) => handleInputChange(index, e)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 transition"
                required
              />
              <p>Option 3</p>
              <input
                type="text"
                placeholder="Option 3"
                id={`option-3-${index}`}
                name="option-3"
                value={question["option-3"]}
                onChange={(e) => handleInputChange(index, e)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 transition"
                required
              />
              <p>Option 4</p>
              <input
                type="text"
                placeholder="Option 4"
                id={`option-4-${index}`}
                name="option-4"
                value={question["option-4"]}
                onChange={(e) => handleInputChange(index, e)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 transition"
                required
              />
              <p>Marks</p>
              <input
                type="number"
                placeholder="Marks"
                id={`marks-${index}`}
                name="marks"
                value={question.marks}
                onChange={(e) => handleInputChange(index, e)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 transition"
                required
              />
              <p>Answer</p>
              <input
                type="text"
                placeholder="Answer"
                id={`answer-${index}`}
                name="answer"
                value={question.answer}
                onChange={(e) => handleInputChange(index, e)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 transition"
                required
              />
            </div>
          ))}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              className="bg-green-600 text-white rounded-md px-4 py-2 font-semibold shadow-md hover:bg-green-700 transition"
              onClick={handleAddQuestion}
            >
              Add Another Question
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-md px-4 py-2 font-semibold shadow-md hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </>
  );
}
