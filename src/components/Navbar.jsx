
import '../../globals.css';
import { Connect } from "./Connect";


export default function Navbar  ()  {

    return(
        <div className="font-basic font-semibold flex flex-row justify-between pt-8 bg-base-1">
            <div  className={`text-4xl connectbox ml-8 px-6 py-2 border-4 border-black bg-base-4`}>
                    kek.gm
            </div>
            <div>

            </div>
            <div>
                <Connect />
            </div>

        </div>
    )

}

