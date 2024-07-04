'use client'
import '../../globals.css'


export default function LaunchBtn () {

    return(
        <div onClick={() => location.href="/pages/launch/form"} className={`connectbox border-4 border-black bg-base-2 py-2 px-8 hover:-translate-y-2 delay-50 hover:scale-110 ease-in-out hover:cursor-pointer`}>
            launch
        </div>
    )
}