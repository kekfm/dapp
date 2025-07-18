import '../../../globals.css';
import { Connect } from "./Connect";
import { NavAccount } from "./NavAccount";
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import burger from "../../assets/burger.svg";
import Recent from '../landing/Recent';
import { useAppKitAccount } from '@reown/appkit/react';
import play from "../../assets/play.png"
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const boxRef = useRef(null);
    const { address } = useAppKitAccount();
    const navigate = useNavigate();

    const handleOpen = () => {
        setIsOpen(prevState => !prevState);
    };

    const handleGame = () => {
        navigate("/game");
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
                <div className="text-4xl connectbox max-sm:ml-2 px-10 py-2 border-4 border-black bg-base-4 mb-2">
                    kek
                </div>
            </Link>
            <div className="max-xl:hidden">
                <Recent />
            </div>
            <div className="flex flex-row gap-2 justify-between mr-2 max-sm:hidden items-center">
                <div className="flex justify-center -rotate-6" onClick={handleGame}>
                    <img src={play} className="w-[50px] hover:scale-110 hover:cursor-pointer" alt="game"></img>
                </div>
                {address &&
                    <NavAccount handleOpen={handleOpen} isOpen={isOpen} />
                }
                <Connect handleOpen={handleOpen} isOpen={isOpen} />
            </div>
            <div className="flex flex-col gap-2 items-end mr-2 sm:hidden">
                <div onClick={handleOpen}>
                    <img src={burger} alt="Menu" />
                </div>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex justify-end" ref={boxRef}>
                        <div className="bg-black bg-opacity-50 absolute inset-0" onClick={handleOpen}></div>
                        <div className="flex flex-col connectbox bg-base-2 border-4 border-black p-4 sm:p-6 m-2 sm:m-4 mt-16 sm:mt-20 h-fit max-h-[80vh] w-full max-w-[280px] sm:max-w-[320px] relative">
                            <div className="font-basic font-bold pb-4 text-lg sm:text-xl">navigate</div>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-center py-2" onClick={handleGame}>
                                    <img src={play} className="w-[60px] hover:scale-110 hover:cursor-pointer -rotate-6" alt="game"></img>
                                </div>
                                {address &&
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
