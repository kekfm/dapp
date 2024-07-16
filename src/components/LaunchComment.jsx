import "../../globals.css"
import { useEthers } from "@usedapp/core"
import { useState } from "react"
import axios from "axios"
import DOMPurify from "dompurify"



export default function LaunchComment ({tokenAddress}) {

        const {account} = useEthers()

        const [commentText, setCommentText] = useState("")
        const [errors, setErrors] = useState({})

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
            const response = await axios.post(`http://103.26.10.88/api/postComment/${tokenAddress}`, commentData, {withCredentials: true})
            console.log("response", response)
        }


    return(
        <div className="connectbox bg-base-3 m-2 border-4 border-black">
            <form
                name="commentform"
                onSubmit={handleSubmit}
            >
                <div className="mx-4">
                    <label htmlFor="comment"> your comment</label>
                </div>
                <div>
                    <textarea
                        placeholder="put your wisdom here"
                        type="text"
                        id="comment"
                        name="comment"
                        onChange={handleChange}
                        value={commentText}
                        className="connectbox mx-4 mt-4 border-4 border-black"
                    >
                    </textarea>
                </div>
                    {errors && errors.short && <span className="text-base-8 mx-4">{errors.short}</span>}
                    {errors && errors.long && <span className="text-base-8 mx-4">{errors.long}</span>}
                    {errors && errors.account && <span className="text-base-8 mx-4">{errors.account}</span>}
                <div>
                    <button 
                        className="connectbox border-4 border-black bg-base-6 px-2 mx-4 my-2"
                        type="submit"
                        >
                            post
                        </button>
                </div>
               

            </form>
        </div>
    )
}