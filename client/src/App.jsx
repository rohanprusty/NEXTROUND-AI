import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from './redux/userSlice'
import InterviewPage from './pages/interviewPage'
import InterviewHistory from './pages/InterviewHistory'
import Pricing from './pages/Pricing'
import InterviewReport from './pages/interviewReport'
import toast from 'react-hot-toast'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './Utils/firebase'
import ProtectedRoute from './components/ProtectedRoute'

export const ServerUrl = import.meta.env.MODE === "development" ? "http://localhost:8000" : "https://nextround-ai-backend.onrender.com";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status >= 400) {
      toast.error("An unexpected error occurred.");
    }
    return Promise.reject(error);
  }
);

function App() {

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth state changed. Firebase user present:", !!firebaseUser);
      if (firebaseUser) {
        try {
          const result = await axios.get(ServerUrl + "/api/user/current-user", {withCredentials:true})
          dispatch(setUserData(result.data))
        } catch (error) {
          console.log("Current user fetch failed (expected during login or 3rd-party cookie block):", error)
          // Fallback: If GET fails (e.g. cookies blocked on cross-origin refresh),
          // sync with backend again using Firebase user data to get fresh session.
          try {
             const fallbackResult = await axios.post(ServerUrl + "/api/auth/google", {
                name: firebaseUser.displayName,
                email: firebaseUser.email
             }, {withCredentials:true});
             dispatch(setUserData(fallbackResult.data));
          } catch (fallbackError) {
             console.log("Fallback auth failed", fallbackError);
          }
        }
      } else {
        dispatch(setUserData(null))
      }
      setLoading(false);
    });

    return () => unsubscribe();
  },[dispatch])

  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/auth' element={<Auth/>}/>
      <Route path='/interview' element={
        <ProtectedRoute loading={loading}>
          <InterviewPage/>
        </ProtectedRoute>
      }/>
      <Route path='/history' element={
        <ProtectedRoute loading={loading}>
          <InterviewHistory/>
        </ProtectedRoute>
      }/>
      <Route path='/pricing' element={<Pricing/>}/>
      <Route path='/report/:id' element={
        <ProtectedRoute loading={loading}>
          <InterviewReport/>
        </ProtectedRoute>
      }/>
    </Routes>
  )
}

export default App
