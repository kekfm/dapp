import { useState, useEffect } from "react"
import FeatureCard from "./FeatureCard"
import axios from "axios"
import feat from "../../assets/featured.png"





export default function Featured () {

    const [featured, setFeatured] = useState([])

    useEffect(() => {
        const fetchFeatured = async () => {
            const response = await axios.get(`${import.meta.env.VITE_GET_FEATURED}`)
            setFeatured(response.data)
        }
        fetchFeatured()
    }, [])


    return (
        <div className="flex flex-col items-center">
            <img src={feat} className="w-[220px]"></img>
            <div className="flex justify-center flex-wrap p-4 gap-20">
                {featured &&
                    featured.map((item,index) => (<FeatureCard key={index} data={item} />))
                }
            </div>
        </div>
    )
}