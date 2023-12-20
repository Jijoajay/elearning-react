import './App.css';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Main/Home'
import Courses from './components/Courses/Courses'
import { Routes, Route, useNavigate } from 'react-router-dom';
import Signup from './components/Main/Signup';
import Signin from './components/Main/Signin';
import Contact from './components/Main/Contact';
import React, { useEffect, useState } from 'react'
import CoursePage from './components/Courses/CoursePage';
import AddNewCourse from './components/Courses/AddNewCourse';
import Edit from './components/Courses/Edit';
import BuyCourse from './components/Courses/BuyCourse';
import flashapi from './components/api/flashapi';
import MyLearning from './components/MyLearning';
import User from './components/Main/User';
import Demo from './Demo';


function App() {
  const navigate = useNavigate();
  const title = "My Learning"
  const [user, setUser] = useState(null)
  const [search,setSearch] = useState("")
  const [courses, setCourses] = useState([])
  const [searchResult,setSearchResult] = useState([])
  const [authenticate, setAuthenticate] = useState(false)
  // useEffect(()=>{
  //   const searchedResult = courses.filter((course)=>{
  //     return (course.name).toLowerCase().includes(search.toLowerCase())
  //   })
  //   setSearchResult(searchedResult)
  // },[search,courses])
  const [favour, setFavour] = useState([])

  useEffect(
    ()=>{
      const fetchCourseData = async()=>{
        try{
          const response = await flashapi.get("/courses");
          setCourses(response.data)
        }catch(err){
          console.log(err.message);
        }
      }
      fetchCourseData();
  },[setCourses])
  useEffect(()=>{
      const fetchUserData = async()=>{
        try{
          const token = localStorage.getItem("token")
          console.log(token);
          if(token){
            try{
              const response = await flashapi.get(`/user-data/${token}`)
              console.log(response.status);
              console.log(response.data);
              setUser(response.data)
            }catch(err){
              console.log(err.message);
            }
            setAuthenticate(true)
          }else{
            setAuthenticate(false)
          }
        }catch(err){
          console.log(err.message);
        }
      }
      fetchUserData();
  },[])
    if(user)console.log("makka users:",user['id']);

    const handleSubmit = (e)=>{
      e.preventDefault();
      navigate('/courses')
    }
  const handleClick = async(course_id)=>{
    if(favour.includes(course_id)){
      const response = await flashapi.post('/remove-from-favourite', {course_id:course_id, user_id:user['id']})
      const removeFavourite = favour.filter((data) => data !== course_id);
      setFavour(removeFavourite);
    }
    else{
      try{
        const response = await flashapi.post('/add-to-favorite', {course_id:course_id, user_id:user['id']})
        setFavour([...favour, course_id])
      }catch(err){
        console.log(err);
      }
    }
  } 
  const handleRemoveCourse = async(course_id)=>{
    const response = await flashapi.get(`/remove-course/${course_id}`)
    alert("Course deleted successfully");
  }

  

  useEffect(()=>{
    const fetchData = async()=>{
      try{
        const response = await flashapi.get(`/get-favourite/${user['id']}`);
        console.log(response.data.favourites)
        const favourite = response.data.favourites
        console.log("favourite",favourite)
        const favorCourseIds = favourite.map((data) => data.course.id);
        setFavour(favorCourseIds);
        console.log("favourIds:",favorCourseIds);
      }catch(err){
        console.log(err);
      }
    }
    fetchData();
  },[setFavour])
  return (
    <div className="App">
      <Navbar 
      search={search}
      setSearch={setSearch}
      handleSubmit={handleSubmit}
      authenticate={authenticate}
      setAuthenticate={setAuthenticate}
      />
      <Routes>
        <Route path='/' element={<Home 
        courses = {courses}
        search={search} 
        handleClick={handleClick}
        favour={favour}/>}/>
        <Route path='/courses'>
          <Route index element={<Courses
          handleRemoveCourse={handleRemoveCourse}
          courses={courses}
          searchResult={searchResult}
          favour={favour}
          handleClick={handleClick}
          user={user}
          />}/>
          <Route path=':id' element={<CoursePage 
          courses={courses}
          handleRemoveCourse={handleRemoveCourse}
          user={user}
          />}/> 
          <Route path='addnewcourse' 
          element={<AddNewCourse 
          courses={courses}
          setCourses={setCourses}
          user = {user}
          />}
          />
        </Route>
        <Route path='/editcourse/:id' 
          courses={courses}
          setCourses={setCourses}
          element={<Edit/>}
        />
        <Route path='/course/:id' 
        element={<BuyCourse 
        courses={courses}
        setCourses={setCourses} 
        />}
        />
        {/* <Route path='/demo/:id' element={<Demo courses={courses} />}
        /> */}
        <Route path='/sign-in' element={<Signup
        setAuthenticate={setAuthenticate}
         />}/>
        <Route path='/sign-up' element={<Signin 
        setAuthenticate={setAuthenticate}
        />}/>
        <Route path='/contact' element={<Contact />}/>
        <Route path='/myLearning'  element={<MyLearning 
        user={user}
        title = {title}
        coursee = {true}
        favs = {false}
        favour={favour}
        handleClick={handleClick}
        />} />
        <Route path='/user' element={<User 
        user={user}
        favour={favour}
        handleClick={handleClick}/>}/>

        <Route path="/favourites" element={<MyLearning user={user}
        title = {title}
        favs = {true}
        coursee = {false}
        favour={favour}
        handleClick={handleClick}
        />}/>
        <Route path='/edit-user' element={<User 
        user={user}
        />}/>
        s<Route path='/demo' element={<Demo />}/>
      </Routes>
    </div>
  );
}

export default App;