import LaunchComment from "./LaunchComment"
import Comments from "./Comments"




export default function CommentSection ({tokenAddress, props, txns}) {

    return(
        <div className="flex flex-col font-basic max-w-[500px] w-full ">
            
            <div className="">
                {props && props.length > 0 ? (
                    props.map((item, index) => (<Comments key={index} item={item} latest={txns}/>))
                ) : (
                    <div className="text-center font-basic text-sm text-black mb-6">
                        be the first to comment, my chad
                    </div>
                )}
            </div>
            
            <div className="w-full pr-4">
                <LaunchComment tokenAddress={tokenAddress} />
            </div>
        </div>
    )

}