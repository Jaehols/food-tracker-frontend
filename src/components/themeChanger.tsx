import React, {useContext, useRef} from 'react';
import { ThemeContext } from '~/components/ThemeContext';
import {FaLeaf} from "react-icons/fa";
import {BsFillMoonStarsFill} from "react-icons/bs";
import {IoSunny} from "react-icons/io5";
import {GiTwirlyFlower} from "react-icons/gi";

interface ThemeChangerProps {
    anchorEl: HTMLElement | null;
}

const ThemeChanger: React.FC<ThemeChangerProps> = ({ anchorEl}) => {
    const {theme, setTheme} = useContext(ThemeContext);
    useRef<HTMLDivElement>(null);
    const topValue = (anchorEl?.offsetTop ?? 0) + (anchorEl?.offsetHeight ?? 0);
    const leftValue = anchorEl?.offsetLeft ?? 0;

    const style: React.CSSProperties = {
        position: 'absolute',
        top: topValue,
        left: leftValue,
    };

    return (
        <div style={style} className={`bg-${theme}-primary shadow-lg rounded-lg p-4`}>
            <div className="flex justify-around">
                <button onClick={() => setTheme('classicGreen')} className="p-2 bg-classicGreen-secondary mr-2 rounded-lg hover:bg-classicGreen-accentOne">
                    <FaLeaf className="h-5 w-5 text-classicGreen-primary"/>
                </button>
                <button onClick={() => setTheme('light')} className="p-2 bg-light-primary rounded-lg hover:bg-light-secondary">
                    <IoSunny className="h-5 w-5 text-light-accentTwo"/>
                </button>
            </div>
            <div className="flex justify-around mt-2">
                <button onClick={() => setTheme('purpleMoonlight')} className="p-2 bg-purpleMoonlight-secondary mr-2 rounded-lg hover:bg-purpleMoonlight-accentOne">
                    <BsFillMoonStarsFill className="h-5 w-5 text-purpleMoonlight-accentTwo"/>
                </button>
                <button onClick={() => setTheme('pink')} className="p-2 bg-pink-primary rounded-lg hover:bg-pink-secondary">
                    <GiTwirlyFlower className="h-5 w-5 text-pink-accentTwo"/>
                </button>
            </div>
        </div>
    );
};

export default ThemeChanger;
