import LaunchComment from "./LaunchComment"
import Comments from "./Comments"




export default function CommentSection ({tokenAddress, props, txns}) {

    return(
        <div className="flex flex-col font-basic max-w-[500px] w-full ">
            <div className="font-semibold text-xl text-start ">
                discussion
            </div>
            <div className="">
                {props && props.length > 0 && 
                    props.map((item, index) => (<Comments key={index} item={item} latest={txns}/>))
                }
            </div>
            
            <div className="w-full pr-4">
                <LaunchComment tokenAddress={tokenAddress} />
            </div>
        </div>
    )

}