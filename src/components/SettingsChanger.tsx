import React, {useContext, useState} from "react";
import {ThemeContext} from "~/pages/ThemeContext";
import {UserSettingsContext} from "~/components/UserSettingsProvider";
import {styled, Switch, ToggleButton, ToggleButtonGroup} from '@mui/material';


interface SettingsChangerProps {
    anchorEl: HTMLElement | null;
}
const SettingsChanger: React.FC<SettingsChangerProps> = ({ anchorEl}) => {
    const {theme, setTheme} = useContext(ThemeContext);
    const {userSettings} = useContext(UserSettingsContext);

    const [isEnergyOn, setIsEnergyOn] = useState(userSettings?.energyShown ?? false);
    const [energyUnit, setEnergyUnit] = useState(userSettings?.energyUnit ?? 'Kilojoules');


    const handleEnergyToggle = () => {
        setIsEnergyOn(!isEnergyOn);
    };

    const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEnergyUnit(e.target.value);
    };

    const handleSave = () => {
        console.log('Settings saved:', { isEnergyOn, energyUnit });
    };

    const style: React.CSSProperties = {
        position: 'absolute',
        top: (anchorEl?.offsetTop ?? 0) + (anchorEl?.offsetHeight ?? 0),
        left: (anchorEl?.offsetLeft ?? 0) - 50, // Adjust this value to move to the left
    };


    const tailwindColors = {
        primary: `${theme}-primary`,
        secondary: `${theme}-secondary`,
    };

    const CustomSwitch = styled(Switch)(({ theme }) => ({
        '& .MuiSwitch-switchBase.Mui-checked': {
            color: tailwindColors.primary,
            '&:hover': {
                backgroundColor: tailwindColors.secondary,
            },
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: tailwindColors.primary,
        },
    }));

    return (
        <div style={style} className={`bg-${theme}-primary shadow-lg rounded-lg p-4`}>
            <label className={`text-${theme}-secondary`}>
                Toggle Energy
                <Switch
                    classes={{
                        root: `text-${theme}-secondary`,
                        switchBase: `text-${theme}-secondary`,
                        thumb: `bg-${theme}-secondary`,
                        track: `bg-${theme}-secondary`,
                        checked: `text-${theme}-secondary`,

                    }}
                    className={`bg-${theme}-secondary`}
                    checked={isEnergyOn}
                    onChange={handleEnergyToggle}
                />
            </label>

            {isEnergyOn && (
                <div className={`text-${theme}-accentOne`}>
                    <label>
                        <ToggleButtonGroup
                            value={energyUnit}
                            exclusive
                            onChange={handleUnitChange}
                            className={`bg-${theme}-accentTwo`}
                        >
                            <ToggleButton value="Kilojoules">Kilojoules</ToggleButton>
                            <ToggleButton value="Calories">Calories</ToggleButton>
                        </ToggleButtonGroup>
                    </label>
                </div>
            )}
            <div>
                <button
                    onClick={handleSave}
                    className={`bg-${theme}-secondary hover:bg-${theme}-accentOne text-white font-bold py-2 px-4 rounded`}
                >
                    Save
                </button>
            </div>
        </div>
    );
}

export default SettingsChanger;