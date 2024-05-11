import React from 'react'
const Quote = () => {
  return (
    <div className='text-xl md:text-4xl font-semibold mx-auto py-5 pb-20 text-center text-white'>
        "We are passionate about revolutionizing the way we learn. Our innovative platform
      <span className='bg-gradient-to-b from-[#1fa2ff] via-[#12d8fa] to-[#a6ffcb] text-transparent bg-clip-text font-bold'>{" "}combines technology</span>
      <span className='bg-gradient-to-b from-[#ff512f] to-[#f09819] text-transparent bg-clip-text font-bold'>
        {" "}
        expertise
      </span>
      , and community to create an
      <span className='bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold'>
       {" "}
        unparalleled educational experience."
      </span>
    </div>
  )
}

export default Quote
