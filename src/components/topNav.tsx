import React from 'react';
import {UserButton, useUser} from "@clerk/nextjs";

const TopNavBar = () => {
    return (
        <nav className="bg-secondary shadow-md">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between">
                    <div className="flex space-x-4">
                        <div>
                            <a href="#" className="flex items-center py-5 px-2 text-accentTwo hover:text-gray-900">
                                <span className="font-bold">FoodLog</span>
                            </a>
                        </div>

                        <div className="hidden md:flex items-center space-x-1">
                            <a href="/" className="py-5 px-3 text-accentTwo hover:text-gray-900">Home</a>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-1">
                        <UserButton afterSignOutUrl="/"/>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default TopNavBar;
