import '../../globals.css';
import { Connect } from "./Connect";
import { NavAccount } from "./NavAccount";
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import burger from "../assets/burger.svg";
import { useEthers } from '@usedapp/core';
import Recent from './Recent';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const boxRef = useRef(null);
    const {account} = useEthers()

    const handleOpen = () => {
        setIsOpen(prevState => !prevState);
    };

    const handleClickOutside = (event) => {
        if (boxRef.current && !boxRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="font-basic font-semibold flex flex-row justify-between pt-8 bg-base-1">
            <Link to="/">
                <div className="text-4xl connectbox ml-8 px-10 py-2 border-4 border-black bg-base-4 ">
                    kek
                </div>
            </Link>
            <div className="max-lg:hidden">
                <Recent />
            </div>
            <div className="flex flex-row gap-2 justify-between mr-2 max-sm:hidden">
                {account &&
                    <NavAccount handleOpen={handleOpen} isOpen={isOpen} />
                }
                <Connect handleOpen={handleOpen} isOpen={isOpen} />
            </div>
            <div className="flex flex-col gap-2 items-end mr-2 sm:hidden">
                <div onClick={handleOpen}>
                    <img src={burger} alt="Menu" />
                </div>
                {isOpen && (
                    <div className="flex fixed inset-0 z-50 mt-20 h-80 max-w-80" ref={boxRef}>
                        <div className="flex flex-col connectbox fixed inset-0 bg-base-2 mx-4 border-4 border-black p-10 mt-32 h-64 max-w-[300px]">
                            <div className="font-basic font-bold pb-4 text-xl">navigate</div>
                            <div className="flex flex-col z-100">
                                {account &&
                                    <NavAccount handleOpen={handleOpen} isOpen={isOpen} />
                                }
                                <Connect handleOpen={handleOpen} isOpen={isOpen} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
