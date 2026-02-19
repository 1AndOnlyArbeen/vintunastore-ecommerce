import React from 'react'
import logo from "../assets/logo.png"


const Logo = () => {
  return (
    <div>
          <img className='w-auto h-8 lg:h-10 mt-2 lg:mt-4'
           src={logo}          
           alt='logo'
            />
      
    </div>
  )
}

export default Logo
