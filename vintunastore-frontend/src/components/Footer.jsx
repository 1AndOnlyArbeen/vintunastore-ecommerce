import React from 'react'
import { FaFacebook } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa6";







const Footer = () => {
    return (
        <footer className='border-t'>
            <div className='container mx-auto p-4 text-center flex flex-col gap-2 lg:flex-row lg:justify-between'>
                <p> All Right Reserved &copy; 2024 Vintuna Store</p>

                <div className='flex items-center gap-4 justify-center text-2xl '>

                    <a href="" className='hover:text-primary-200'>
                        <FaFacebook />
                    </a>

                    <a href="" className='hover:text-primary-200' >
                        <FaInstagram />
                    </a>

                    <a href="" className='hover:text-primary-200'>
                        <FaLinkedin/>
                    </a>

                    <a href="" className='hover:text-primary-200'>
                        <FaTiktok />
                    </a>



                </div>
            </div>

        </footer>
    )
}

export default Footer
