import '../../globals.css'



export default function TwitterBtn () {

    return(
        <div onClick={() => window.location.href="https://https://x.com/home"} className={`flex justify-center connectbox border-4 border-black bg-base-5 py-2 px-8 hover:-translate-y-2 delay-50 hover:scale-110 ease-in-out hover:cursor-pointer w-36`}>
            twitter
        </div>
    )
}