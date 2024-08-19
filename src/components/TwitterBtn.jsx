import '../../globals.css'
import tears from "../assets/tears.svg"



export default function TwitterBtn () {

    return(
        <div className="relative">
            <div onClick={() => window.location.href="https://x.com/kekchads"} className={`flex justify-center connectbox border-4 border-black bg-base-5 py-2 px-8 hover:-translate-y-2 delay-50 hover:scale-110 ease-in-out hover:cursor-pointer w-36`}>
                twitter
            </div>
            <div className="absolute top-12 left-4 w-[100px] max-md:hidden">
                <img src={tears} ></img>
            </div>
        </div>
        
    )
}