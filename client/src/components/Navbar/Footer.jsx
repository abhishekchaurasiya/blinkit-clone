import { Link } from "react-router-dom"
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa"

const Footer = () => {
    return (
        <footer className='border-t'>
            <div className='container mx-auto p-4 text-center flex flex-col gap-2 lg:flex-row lg:justify-between lg:items-center'>
                <p> All rights reserved 2024</p>
                <div className="flex justify-center items-center gap-4 text-2xl">
                    <Link to='#' className="hover:text-primary-100"><FaFacebook /></Link>
                    <Link to='#' className="hover:text-primary-100"><FaInstagram /></Link>
                    <Link to='#' className="hover:text-primary-100"><FaLinkedin /></Link>
                    <Link to='#' className="hover:text-primary-100"><FaGithub /></Link>

                </div>
            </div>
        </footer>
    )
}


export default Footer