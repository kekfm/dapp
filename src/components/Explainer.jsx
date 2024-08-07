
import '../../globals.css'


export default function ({handleExplainerModal}) {
    
    return(
        <div onClick={handleExplainerModal} className={`flex w-[200px] font-basic font-semibold justify-center  hover:cursor-pointer hover:text-base-2`}>
            *how it werks
        </div>
    )
}