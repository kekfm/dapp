import fetchData from "../api/launchtable/All";
import LaunchTable from "./LaunchTable";
import axios from "axios"


export default async function Created () {

    const data = await fetchData()
    
    return(
        <div>
        </div>
    )
}
