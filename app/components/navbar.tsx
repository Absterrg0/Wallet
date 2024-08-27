'use client';
import { useState } from "react";
import { FaWallet } from "react-icons/fa6";

export default function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="bg-gray-900 shadow-md flex items-center justify-between p-4">
            <div className="flex-grow"></div> {/* Empty space to push Wallet to the center */}

            {/* Centered Wallet Title */}
            <div className="text-white text-2xl font-bold 
            flex-shrink-0 ml-15 mr-15 flex">
                <FaWallet size={26} className="mr-3"></FaWallet>
                Wallet
            </div>

            <div className="flex-grow flex justify-end items-center space-x-4">
                {/* Menu Toggle Button (For Mobile) */}
                <button
                    className="text-white md:hidden p-2 hover:bg-gray-700 rounded"
                    onClick={toggleMenu}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>

            </div>

        </div>
    );
}
