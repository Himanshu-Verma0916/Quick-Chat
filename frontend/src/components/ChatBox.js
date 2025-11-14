import React, { useRef, useEffect, useContext, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageDate } from '../lib/utils';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ChatBox = () => {
  const { messages, selectedUser, setSelectedUser, sendMessages, fetchMessages } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState('');
  const scrollEnd = useRef();

  // Function to handle sending messages
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    await sendMessages({ text: input.trim() });
    setInput('');
  }

  // Function to handle image upload
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error("Please upload a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessages({ image: reader.result });
      e.target.value = ''; // Clear the input after sending
    }
    reader.readAsDataURL(file);
  }

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  return selectedUser ? (
    <div className='h-full overflow-y-auto relative  backdrop-blur-lg'>

      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt='profile' className='w-8 rounded-full' />
        <p className='text-white'>{selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 ml-2 rounded-full bg-green-500 inline-block'></span>}
        </p>
        <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt='arrow' className='md:hidden max-w-7' />
        <img src={assets.help_icon} alt='help' className='max-md:hidden max-w-5' />
      </div>

      {/* -------------chat Area---------------- */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-auto p-3 pb-6'>
        {
          messages.map((message, index) => (
            <div key={index} className={`flex items-end gap-2 justify-end ${message.senderId !== authUser._id && 'flex-row-reverse'}`}>
              {
                message.image ? (
                  <img src={message.image} alt='message' className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' />
                )
                  : (
                    <p className={`p-2 max-w-[200px] md:text-sm font-light  rounded-lg mb-8 break-all bg-violet-500/30 text-white ${message.senderId ===authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>{message.text}</p>
                  )

              }
              <div className='text-center text-xs'>
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || assets.avatar_icon
                      : selectedUser?.profilePic || assets.avatar_icon
                  }
                  alt='avatar'
                  className='w-7 rounded-full'
                />

                <p className='text-gray-400'>{formatMessageDate(message.createdAt)}</p>
              </div>


            </div>
          ))
        }
        <div ref={scrollEnd}></div>
      </div>

      {/*--------------- bottom area for chat inputs------- */}
      <div className='absolute bottom-0 left-3 right-3 flex items-center gap-3 p-3 rounded-full'>

        {/* Message input + gallery icon */}
        <div className='flex flex-1 items-center bg-gray-100/10 px-3 rounded-full'>
          <input onChange={(e) => setInput(e.target.value)} value={input}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage(e);
            }}
            type='text' placeholder='Send a message...' className='flex-1 text-sm py-2 bg-transparent border-none outline-none text-white placeholder-gray-400' />

          {/* Gallery Icon */}
          <input onChange={handleSendImage} type='file' id='file' accept='image/*' hidden />
          <label htmlFor='file' className='cursor-pointer'>
            <img src={assets.gallery_icon} alt='attach' className='w-5 ml-2' />
          </label>
        </div>
        <img onClick={handleSendMessage} src={assets.send_button} alt='send' className='w-7 cursor-pointer' />
      </div>

    </div>
  ) :
    (
      <div className=' flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
        <img src={assets.logo_icon} alt='logo' className='max-w-20'></img>
        <p className='text-lg font-medium text-white'>Chat anytime , anywhere</p>
      </div>
    )
}

export default ChatBox
