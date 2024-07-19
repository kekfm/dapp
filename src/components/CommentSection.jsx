import LaunchComment from "./LaunchComment"
import Comments from "./Comments"




export default function CommentSection ({tokenAddress, props}) {

    return(
        <div className="flex flex-col font-basic items-center">
            <div className=" font-semibold text-xl">
                discussion
            </div>
            {props && props.comments.length > 0 && 
                props.comments.map((item, index) => (<Comments key={index} item={item}/>))
            }
            <LaunchComment tokenAddress={tokenAddress} />
        </div>
    )

}