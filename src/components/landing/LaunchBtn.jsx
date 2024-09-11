import '../../../globals.css'
import { Link } from 'react-router-dom'


export default function LaunchBtn () {

    return(
        
        <Link to="/create">
            <div className={`flex justify-center connectbox border-4 border-black bg-base-2 py-2 px-8 hover:-translate-y-2 delay-50 hover:scale-110 ease-in-out hover:cursor-pointer w-36 -rotate-6`}>
                launch
            </div>
        </Link>
        
    )
}