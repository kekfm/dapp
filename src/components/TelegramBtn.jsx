import '../../globals.css'

export default function TelegramBtn () {

    return(
        <div onClick={() => window.location.href="https://t.me/arigato_alerts"} className={` connectbox border-4 border-black bg-base-7 py-2 px-8 hover:-translate-y-2 delay-50 hover:scale-110 ease-in-out hover:cursor-pointer`}>
            telegram
        </div>
    )
}