import { useState,useContext } from 'react'
import LeftSidebar from '../components/LeftSidebar'
import ChatBox from '../components/ChatBox'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../context/ChatContext'


const Home = () => {
  // const [selectedUser, setSelectedUser]=useState(false);
  const {selectedUser}=useContext(ChatContext)
  return (
    <div className='border h-screen sm:px-[15%] sm:py-[5%] w-full'>
      <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative ${selectedUser? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]':'md:grid-cols-2'}`}>
        <LeftSidebar />
        <ChatBox />
        <RightSidebar/>
      </div>
    </div>
  )
}

export default Home
