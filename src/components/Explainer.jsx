
import '../../globals.css'


export default function ({handleExplainerModal}) {
    
    return(
        <div onClick={handleExplainerModal} className={` font-basic font-semibold text-center hover:cursor-pointer hover:scale-110`}>
            *how it werks
        </div>
    )
}