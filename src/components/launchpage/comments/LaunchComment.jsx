import "/globals.css"
import { useEthers } from "@usedapp/core"
import { useState } from "react"
import axios from "axios"
import DOMPurify from "dompurify"
import CommentSuccessModal from "./CommentSuccessModal"
import CommentFailModal from "./CommentFailModal"



export default function LaunchComment ({tokenAddress}) {

        const {account} = useEthers()

        const [commentText, setCommentText] = useState("")
        const [errors, setErrors] = useState({})
        const [commentStatus, setCommentStatus] = useState(0)

        const handleChange = (e) => {
            const {value} = e.target
            setCommentText(value)
            
        }

        const handleSubmit = (e) => {
           e.preventDefault()

           const stringComment = commentText.toString()
           const cleanComment = DOMPurify.sanitize(stringComment)

            if(validateForm()){
                const timestamp = Date.now()
                try{

                    const commentData = {
                        tokenAddress: tokenAddress,
                        account: account,
                        comment: cleanComment,
                        timestamp: timestamp
                    }

                    sendForm(commentData)

                }catch(e){console.log("error",e)}
            }
        }

        const validateForm = () => {
            let newErrors = {}
            if(commentText.length < 1){newErrors.short = "cannot send an empty comment, sir"}
            if(commentText.length > 1000){newErrors.long = "max is 1000 characters"}
            if(!account){newErrors.account = "connect your wallet to comment"}

            setErrors(newErrors)
            return Object.keys(newErrors).length === 0
        }

        const sendForm = async (commentData) => {
            setCommentStatus(3)
            const response = await axios.post(`https://kek.fm/api/postComment/${tokenAddress}`, commentData, {withCredentials: true})
            console.log("response", response)
            if(response.status == 201){ 
                setCommentStatus(1)
                setCommentText("")
            }
            if(response.status == 500){
                setCommentStatus(2)
            }
        }

        const closeModal = () => {
            setCommentStatus(0)
        }


    return(
        <div className="flex flex-col connectbox bg-base-2 border-4 border-black w-full">
            <CommentSuccessModal closeModal={closeModal} commentStatus={commentStatus}/>
            <CommentFailModal closeModal={closeModal} commentStatus={commentStatus} />
            <form
                name="commentform"
                onSubmit={handleSubmit}
            >
                <div className="mx-4 font-basic font-bold">
                    <label htmlFor="comment"> your comment</label>
                </div>
                <div className="flex w-full">
                    <textarea
                        placeholder="put your wisdom here"
                        type="text"
                        id="comment"
                        name="comment"
                        onChange={handleChange}
                        value={commentText}
                        className="connectbox mx-4 mt-2 border-4 border-black w-full md:h-24"
                    >
                    </textarea>
                </div>
                    {errors && errors.short && <span className="text-base-8 mx-4">{errors.short}</span>}
                    {errors && errors.long && <span className="text-base-8 mx-4">{errors.long}</span>}
                    {errors && errors.account && <span className="text-base-8 mx-4">{errors.account}</span>}
                <div>
                    { (commentStatus == 0 || commentStatus == 1 || commentStatus == 2) &&
                        <button 
                            className="connectbox border-4 border-black bg-base-1 font-basic px-2 mx-4 my-2"
                            type="submit"
                            >
                                post
                        </button>
                    }
                    { commentStatus == 3 &&
                        <button 
                            className="connectbox border-4 border-black bg-base-11 px-2 mx-4 my-2 animate-pulse"
                            type="submit"
                            >
                                posting...
                        </button>
                    }
                        
                </div>
               

            </form>
        </div>
    )
}