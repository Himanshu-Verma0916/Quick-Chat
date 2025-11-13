import React, { use, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const navigate = useNavigate();
  const [name, setName] = useState(authUser?.fullName);
  const [bio, setBio] = useState(authUser?.bio);

  const [selectedImg, setSelectedImg] = useState(null);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // We have to convert image to Base64 string ,beacause we upload image via cloudinary ,which needs a string url not a object
    let base64Img = null;
    if (selectedImg) {
      base64Img = await toBase64(selectedImg);
    }
    updateProfile({ fullName: name, bio, profilePic: base64Img });
    navigate('/');
  }

  // helper function to convert image to Base64 string
  const toBase64 = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    })
  }
  return (
    <div className=' min-h-screen flex items-center bg-cover bg-no-repeat justify-center '>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>

        <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'> Profile details</h3>
          <label htmlFor='avatar' className='flex  items-center gap-3 cursor-pointer'>
            <input id='avatar' type='file' accept='image/*' onChange={(e) => setSelectedImg(e.target.files && e.target.files[0])} hidden />
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt='profileImg' className={`w-12 h-12 ${selectedImg ? 'rounded-full' : ''}`} /> Upload profile image

          </label>
          <input onChange={(e) => setName(e.target.value)} value={name} autoComplete="name"
            type='text' placeholder='Your name...' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 bg-transparent placeholder:text-gray-400' />

          <textarea onChange={(e) => setBio(e.target.value)} value={bio} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 bg-transparent placeholder:text-gray-400' rows={4}></textarea>
          <button type='submit' className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'>Save</button>
        </form>
        <img src={authUser?.profilePic || assets.logo_icon} className='max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10' alt='Profile' />
      </div>

    </div>
  )
}

export default Profile
