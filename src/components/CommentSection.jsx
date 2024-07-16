import LaunchComment from "./LaunchComment"




export default function CommentSection ({tokenAddress}) {

    return(
        <div className="flex flex-col font-basic items-center">
            <div className="text-xl">
                discussion
            </div>
            <LaunchComment tokenAddress={tokenAddress} />
        </div>
    )

}