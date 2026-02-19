import React from 'react'
import { FaFacebook } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa6";







const Footer = () => {
    return (
        <footer className='border-t'>
            <div className='container mx-auto p-4 text-center flex flex-col gap-2'>
                <p> All Right Reserved &copy; 2024 Vintuna Store</p>

                <div className='flex items-center gap-4 justify-center text-2xl text-gray-600'>

                    <a href="">
                        <FaFacebook />
                    </a>

                    <a href="">
                        <FaInstagram />
                    </a>

                    <a href="">
                        <FaLinkedin/>
                    </a>

                    <a href="">
                        <FaTiktok />
                    </a>



                </div>
            </div>

        </footer>
    )
}

export default Footer
