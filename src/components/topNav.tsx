import React, {useCallback, useContext, useRef} from 'react';
import {UserButton, useUser} from "@clerk/nextjs";
import {ThemeContext} from "~/pages/ThemeContext";
import ThemeChanger from "~/components/themeChanger";
import {FaBrush} from "react-icons/fa6";

const TopNavBar = () => {
    const { theme, setTheme } = useContext(ThemeContext);
    const[showThemeChanger, setShowThemeChanger] = React.useState(false);
    const themeButtonRef = useRef(null);
    const toggleThemeChanger = () => {

        setShowThemeChanger(prev => !prev);
    };

    return (
        <nav className={`bg-${theme}-secondary shadow-md`}>
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between">
                    <div className="flex space-x-4">
                        <div>
                            <a href="#" className={`flex items-center py-5 px-2 text-${theme}-accentTwo hover:text-gray-900`}>
                                <span className="font-bold">FoodLog</span>
                            </a>
                        </div>

                        <div className="hidden md:flex items-center space-x-1">
                            <a href="/" className={`py-5 px-3 text-${theme}-accentTwo hover:text-gray-900`}>Home</a>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-1">
                        <button ref={themeButtonRef} onClick={toggleThemeChanger} className={`p-3 hover:bg-${theme}-primary rounded-lg`}>
                            <FaBrush className={`h-5 w-5 text-${theme}-accentTwo`}/>
                        </button>
                        {showThemeChanger && <ThemeChanger anchorEl={themeButtonRef.current}/>}
                        <UserButton afterSignOutUrl="/"/>
                    </div>
                </div>
            </div>

        </nav>
    );
};

export default TopNavBar;
