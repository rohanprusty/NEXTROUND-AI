import React from 'react'
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../Utils/firebase';
import axios from 'axios';
import { ServerUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Auth({isModel = false}) {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGoogleAuth = async () => {
        try {
            const response = await signInWithPopup(auth,provider)
            let User = response.user
            let name = User.displayName
            let email = User.email
            const result = await axios.post(ServerUrl + "/api/auth/google" , {name , email} , {withCredentials:true})
            dispatch(setUserData(result.data))
            
            console.log("Login success! User data:", result.data);
            toast.success("Successfully logged in!", { duration: 2000 })
            console.log("Navigating to /interview");
            navigate('/interview')
            


            
        } catch (error) {
            console.log(error)
              dispatch(setUserData(null))
        }
    }
  return (
    <div className={`
      w-full 
      ${isModel ? "py-4" : "min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6 py-20"}
    `}>
        <motion.div 
        initial={{opacity:0 , y:-40}} 
        animate={{opacity:1 , y:0}} 
        transition={{duration:1.05}}
        className={`
        w-full relative
        ${isModel ? "max-w-md p-8 rounded-3xl" : "max-w-lg p-12 rounded-[32px]"}
        bg-[#131127]/80 backdrop-blur-2xl shadow-2xl border border-white/10
      `}>
            <div className='flex items-center justify-center gap-2 mb-6'>
                <img src="/nextRound.png" alt="NextRound AI" className="w-10 h-10 object-contain rounded-xl" />
                <h2 className='font-semibold text-lg text-white'>NextRound AI</h2>
            </div>

            <h1 className='text-2xl md:text-3xl font-semibold text-center leading-snug mb-4 text-white'>
                Continue with
                <span className='bg-green-500/20 text-green-400 px-3 py-1 rounded-full inline-flex items-center gap-2 ml-2'>
                    <IoSparkles size={16}/>
                    AI Smart Interview

                </span>
            </h1>

            <p className='text-gray-400 text-center text-sm md:text-base leading-relaxed mb-8'>
                Sign in to start AI-powered mock interviews,
        track your progress, and unlock detailed performance insights.
            </p>


            <motion.button 
            onClick={handleGoogleAuth}
            whileHover={{opacity:0.9 , scale:1.03}}
            whileTap={{opacity:1 , scale:0.98}}
            className='w-full flex items-center justify-center gap-3 py-3 bg-white text-black font-medium rounded-full shadow-lg border border-transparent hover:border-gray-300 transition-colors'>
                <FcGoogle size={20}/>
                Continue with Google
            </motion.button>
        </motion.div>

      
    </div>
  )
}

export default Auth
