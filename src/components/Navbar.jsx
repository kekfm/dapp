
import '../../globals.css';
import { Connect } from "./Connect";
import {NavAccount} from "./NavAccount"
import { Link } from 'react-router-dom';


export default function Navbar  ()  {

    return(
        <div className="font-basic font-semibold flex flex-row justify-between pt-8 bg-base-1">
            <Link to="/">
                <div className={`text-4xl connectbox ml-8 px-6 py-2 border-4 border-black bg-base-4`}>
                    kek.gm
                </div>
            </Link>
           
            <div>

            </div>
            <div className="flex flex-row gap-2">
                <NavAccount />
                <Connect />
            </div>

        </div>
    )

}

