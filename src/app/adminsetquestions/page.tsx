"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import AdminLogOut from "../adminlogout/page"
import { GiHamburgerMenu } from "react-icons/gi";
import {FaTimes } from "react-icons/fa";

interface Question {
  id: string; // Ensure each question has a unique ID
  categories: string;
  Questions: string;
  'option-1': string;
  'option-2': string;
  'option-3': string;
  'option-4': string;
  answer: string;
  marks: string;
}

interface Post {
  id: string;
  categories: string;
  questions: Question[];
}

export default function Admin() {
  const [category, setCategory] = useState<string>('');
  const [filteredData, setFilteredData] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [noMatch, setNoMatch] = useState<boolean>(false);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editForm, setEditForm] = useState<Question | null>(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(false); // State for sidebar visibility


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

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value.toLowerCase()); // Normalize input
  };

  const handleCategorySubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get<Post[]>('http://localhost:8000/quiz');
      console.log(response.data); // Verify the data structure

      const filteredQuestions = response.data
        .filter((item) => item.categories.toLowerCase() === category)
        .flatMap((item) => item.questions);
      
      console.log(filteredQuestions); // Verify filtered questions

      if (filteredQuestions.length === 0) {
        setNoMatch(true);
        setFilteredData([]);
      } else {
        setNoMatch(false);
        setFilteredData(filteredQuestions);
        setCurrentQuestionIndex(0);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleEditClick = (question: Question) => {
    setEditingQuestion(question);
    setEditForm({ ...question }); // Clone question data to form
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (editForm) {
      setEditForm({
        ...editForm,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (editForm) {
      try {
        // Fetch all categories and questions
        const categoryResponse = await axios.get<Post[]>('http://localhost:8000/quiz');
        const categoryData = categoryResponse.data;

        // Find the category that contains the question being edited
        const updatedCategory = categoryData.find((category) =>
          category.questions.some((q) => q.id === editForm.id)
        );

        if (!updatedCategory) {
          console.error("Category not found for the question.");
          return;
        }

        // Update the question in the identified category
        updatedCategory.questions = updatedCategory.questions.map((q) =>
          q.id === editForm.id ? editForm : q
        );

        // Send the updated category data to the server
        await axios.put(`http://localhost:8000/quiz/${updatedCategory.id}`, updatedCategory);

        // Update local state
        setFilteredData(filteredData.map((q) =>
          q.id === editForm.id ? editForm : q
        ));
        setEditingQuestion(null);
        setEditForm(null);
      } catch (err) {
        console.error("Error updating question:", err);
      }
    } else {
      console.error("No question selected for editing.");
    }
  };

  const handleRemove = async (id: string) => {
    try {
      // Fetch all categories and questions
      const categoryResponse = await axios.get<Post[]>('http://localhost:8000/quiz');
      const categoryData = categoryResponse.data;

      // Find the category that contains the question to be removed
      const updatedCategory = categoryData.find((category) =>
        category.questions.some((q) => q.id === id)
      );

      if (!updatedCategory) {
        console.error("Category not found for the question.");
        return;
      }

      // Remove the question from the identified category
      updatedCategory.questions = updatedCategory.questions.filter((q) => q.id !== id);

      // Send the updated category data to the server
      await axios.put(`http://localhost:8000/quiz/${updatedCategory.id}`, updatedCategory);

      // Remove from local state
      setFilteredData(filteredData.filter((q) => q.id !== id));
      if (currentQuestionIndex >= filteredData.length - 1) {
        setCurrentQuestionIndex(filteredData.length - 2);
      }
    } catch (err) {
      console.error("Error removing question:", err);
    }
  };

  // If access status is still loading, display a loading state
  if (hasAccess === null) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <p className='text-white text-[20px] font-semibold text-center whitespace-nowrap'>Checking access...</p>
      </div>
    );
  }

  // If access is denied, show the no access message
  if (!hasAccess) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <p className='text-white font-semibold text-[22px] text-center'>You do not have access to this page.</p>
      </div>
    );
  }

  // If access is granted, render the rest of the component
  return (<>
          <GiHamburgerMenu 
        color="black" 
        className="absolute right-2 top-4 lg:hidden cursor-pointer" 
        size={30}
        onClick={() => setShowSidebar(true)} // Show sidebar on click
      />
      {showSidebar && (
        <div className="side-menu fixed top-0 right-0 h-full w-full bg-gray-800 text-white shadow-lg transition-transform transform translate-x-0 ease-in-out duration-300 sm:w-64 overflow-y-auto ">
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
    <div className='flex flex-col items-center p-[10px] sm:p-6 bg-gray-100 min-h-screen '>
      <h1 className='font-semibold text-2xl mb-6 sm:mb-8 sm:mt-6 mt-24'>Check Set Questions</h1>
      <form className='mb-6 sm:mb-8 w-full max-w-md flex flex-col items-center sm:flex-row sm:items-baseline sm:gap-3' onSubmit={handleCategorySubmit}>
        <input
          type="search"
          placeholder="Search category"
          value={category}
          onChange={handleCategoryChange}
          className='py-3 border rounded-lg mb-4 w-full placeholder:font-semibold px-2'
          pattern='[A-Za-z\s]+'
        />
        <button type="submit" className='p-3 bg-blue-500 text-white rounded-lg  sm:h-max font-semibold '>Submit</button>
      </form>
      {noMatch && <p className='text-red-500 font-semibold mb-4'>Category does not exist.</p>}
      {filteredData.length > 0 ? (
        <div className='w-full max-w-4xl bg-white p-4 sm:p-6 shadow-lg rounded-lg'>
          <h2 className='font-semibold text-xl mb-4'>Questions</h2>
          <div className='mb-6 sm:p-4 p-[10px] border-b border-gray-200'>
            <p className='mb-2'><strong>Question:</strong> {filteredData[currentQuestionIndex].Questions}?</p>
            <p className='mb-2'><strong>Option 1:</strong> {filteredData[currentQuestionIndex]['option-1']}</p>
            <p className='mb-2'><strong>Option 2:</strong> {filteredData[currentQuestionIndex]['option-2']}</p>
            <p className='mb-2'><strong>Option 3:</strong> {filteredData[currentQuestionIndex]['option-3']}</p>
            <p className='mb-2'><strong>Option 4:</strong> {filteredData[currentQuestionIndex]['option-4']}</p>
            <p className='mb-2'><strong>Answer:</strong> {filteredData[currentQuestionIndex].answer}</p>
            <p><strong>Marks:</strong> {filteredData[currentQuestionIndex].marks}</p>
            <button
              onClick={() => handleEditClick(filteredData[currentQuestionIndex])}
              className='py-2 px-4 font-semibold bg-yellow-500 text-white rounded-lg mr-2 my-3'
            >
              Edit
            </button>
            <button
              onClick={() => handleRemove(filteredData[currentQuestionIndex].id)}
              className='p-2 bg-red-500 text-white rounded-lg my-3 font-semibold'
            >
              Remove
            </button>
          </div>
          <div className='flex justify-between'>
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`p-2 bg-blue-500 text-white font-semibold rounded-lg ${currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentQuestionIndex === filteredData.length - 1}
              className={`py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg ${currentQuestionIndex === filteredData.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p className='text-gray-500 text-center font-semibold text-lg'>Enter a valid category to display questions.</p>
      )}

      {editingQuestion && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white sm:p-6 p-[10px] rounded-lg shadow-lg w-full max-w-md overflow-y-auto max-h-full'>
            <h2 className='font-semibold text-xl mb-4'>Edit Question</h2>
            <form onSubmit={handleEditSubmit}>
              <div className='mb-4'>
                <label className='block mb-2 text-lg '>Question</label>
                <input
                  type='text'
                  name='Questions'
                  value={editForm?.Questions || ''}
                  onChange={handleEditChange}
                  className='p-2 border rounded-lg w-full'
                  required
                />
              </div>
              <div className='mb-4'>
                <label className='block mb-2 text-lg '>Option 1</label>
                <input
                  type='text'
                  name='option-1'
                  value={editForm?.['option-1'] || ''}
                  onChange={handleEditChange}
                  className='p-2 border rounded-lg w-full'
                  required
                />
              </div>
              <div className='mb-4'>
                <label className='block mb-2 text-lg '>Option 2</label>
                <input
                  type='text'
                  name='option-2'
                  value={editForm?.['option-2'] || ''}
                  onChange={handleEditChange}
                  className='p-2 border rounded-lg w-full'
                  required
                />
              </div>
              <div className='mb-4'>
                <label className='block mb-2 text-lg'>Option 3</label>
                <input
                  type='text'
                  name='option-3'
                  value={editForm?.['option-3'] || ''}
                  onChange={handleEditChange}
                  className='p-2 border rounded-lg w-full'
                  required
                />
              </div>
              <div className='mb-4'>
                <label className='block mb-2 text-lg'>Option 4</label>
                <input
                  type='text'
                  name='option-4'
                  value={editForm?.['option-4'] || ''}
                  onChange={handleEditChange}
                  className='p-2 border rounded-lg w-full'
                  required
                />
              </div>
              <div className='mb-4'>
                <label className='block mb-2 text-lg'>Answer</label>
                <input
                  type='text'
                  name='answer'
                  value={editForm?.answer || ''}
                  onChange={handleEditChange}
                  className='p-2 border rounded-lg w-full'
                  required
                />
              </div>
              <div className='mb-4'>
                <label className='block mb-2 text-lg'>Marks</label>
                <input
                  type='number'
                  name='marks'
                  value={editForm?.marks || ''}
                  onChange={handleEditChange}
                  className='p-2 border rounded-lg w-full'
                  required
                />
              </div>
              <div className='flex justify-between'>
                <button type='submit' className='py-2 px-4 bg-green-500 text-white rounded-lg font-semibold'>Save</button>
                <button type='button' onClick={() => { setEditingQuestion(null); setEditForm(null); }} className='py-2 px-3 bg-red-500 font-semibold text-white rounded-lg'>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>);
}
