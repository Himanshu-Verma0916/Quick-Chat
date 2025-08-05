import React, { useState } from 'react'
import assets from '../assets/assets'
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Assuming you have an AuthContext

const Login = () => {
  const { login } = useContext(AuthContext);
  // Assuming loginUser is a function that handles user login
  // and is provided by AuthContext
  const [currState,setCurrState]=useState('Sign Up');
  const [fullName,setFullName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [bio,setBio]=useState('');
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  
  const onSubmitHandler=async(e)=>{
    e.preventDefault();
    if(currState==='Sign Up' && !isDataSubmitted){
      setIsDataSubmitted(true);
      return;
    }

    await login( currState ==='Sign Up'? 'signUp':'login',{
      fullName,
      email,
      password,
      bio
    })

    
  }
  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>

      {/*-------left -------  */}
      <img src={assets.logo_big} alt='' className='w-[min(30vw,250px)]'></img>
      
      {/*-------right -------  */}
      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>{currState}
        
        {isDataSubmitted && <img src={assets.arrow_icon} alt='' onClick={()=>setIsDataSubmitted(false)} className='w-5 cursor-pointer'/>}
        </h2>
       {currState==='Sign Up' && !isDataSubmitted && (
        <input onChange={(e)=>setFullName(e.target.value)} value={fullName} type='text' autoComplete="name" className='p-2 border border-gray-500 rounded-md focus:outline-none text-gray-700' placeholder='Full Name' required/>

       )}
       {!isDataSubmitted && (
        <>
        <input onChange={(e)=>setEmail(e.target.value)} value={email} type='email' autoComplete="email" className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700' placeholder='Email Address' required/>
        <input onChange={(e)=> setPassword(e.target.value)} value={password} type='password' autoComplete="current-password" className='p-2 border border-gray-500 rounded-md focus:outline-none text-gray-700' placeholder='Password' required/>
        </>

       ) }
       
       {currState==='Sign Up' && isDataSubmitted && (
        <textarea onChange={(e)=>setBio(e.target.value)} value={bio} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700' placeholder='Provide a short bio.....' required/>
       )}

       <button type='submit' className='bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-600 transition-colors duration-300'>
        {currState==='Sign Up' ?'Create Account' : 'Login Now'}
       </button>

       <div className='flex items-center gap-2 text-sm text-gray-500'>
        <input type='checkbox' required></input>
        <p>Agree to terms of use & privacy policy</p>
       </div>
       
       <div className='flex flex-col gap-2'>
        {
          currState==='Sign Up'?
          (
            <p>Already have an account? <span className='text-indigo-500 cursor-pointer' onClick={()=>{setCurrState('Login'); setIsDataSubmitted(false)}}>Login Here</span></p>
          ):
          (
            <p>Don't have an account? <span className='text-indigo-500 cursor-pointer' onClick={()=>{setCurrState('Sign Up')}}>Create an account</span></p>
          )
        }
       </div>

      </form>

    </div>
  )
}

export default Login
