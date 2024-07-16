import '../../globals.css'
import icon from '../assets/loading3.svg'
import noimage from '../assets/noimage.svg'
import Progressbar from './Progressbar';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';



export default function LaunchCard ({data}) {

    const imgWidth = 30
    const imgHeight = 30

    const navigate = useNavigate()

    const handleClick = () => {
        const tokenAddress = data.tokenAddress
        console.log("tokenAddress", tokenAddress)
        navigate(`/launch?token=${tokenAddress}`)
    }

    const info = {
        name:"tyson the killer",
        ticker:"myke",
        description:"mike is a token that is awesome and that does contain a lot of ferocity and bite really awesome guy super man just not describable how great he is, he will kick jakes ass for sure. everbody has a plan and then they get punched in the mouth. 7 times seven equal punching your teeths out sucker",
        twitter:"https://www.x.com",
        telegram:"https://www.t.me",
        url:"https://www.kickz.com",
        image:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Mike_Tyson_2019_by_Glenn_Francis.jpg/480px-Mike_Tyson_2019_by_Glenn_Francis.jpg",
        progress:"10",
        dev:"0x062dc81A61b8C5fBA95c0c5d158fA6D41e0061Eb"
    }

    const d = JSON.parse(data.description)

    

    return(
    <div onClick={handleClick} className="flex flex-col connectbox border-4 border-black w-[300px] h-[250px] bg-base-7">
        <div className= "flex flex-row">
            <div className="flex flex-row justify-between">
                <div className="relative w-[120px] h-[100px] border-4 bg-base-4 border-black mx-2 my-4 content-center">
                    <img src={d.logo} layout="fill" objectFit="cover" alt={noimage}/>
                </div>
                <div className="flex flex-col pl-2 pt-2 w-full">
                    <div className={`font-basic font-bold text-md text-black`}>{data.name}</div>
    
                    <div className="flex flex-col items-start justify-start">
                        <div className={`font-basic flex text-xs text-black font-bold pt-2 items-center`}>
                            progress {info.progress}%
                        </div>
                        <Progressbar percentage={info.progress} />
                    </div>
                    <div className= "flex flex-row justify-start gap-2 pt-1">
                        <div className="text-xs">
                            <Link to={d.website}>
                                [web]
                            </Link>
                        </div>
                        <div className="text-xs">
                            <Link to={d.twitter}>
                                [x]
                            </Link>
                        </div>
                        <div className="text-xs">
                            <Link to={d.telegram}>
                                [telegram]
                        </Link>
                        </div>
                    </div>
                    <div className={` mt-2 text-xs text-black`}>
                        created by <span className='text-base-2'>{data.owner.slice(0,4)}...{data.owner.slice(data.owner.length -4, data.owner.length)}</span>
                    </div>

                </div>
                <div className="flex flex-col items-start pt-2 pr-2">
                    <img className="animate-pulse" src={icon} width={imgWidth} height={imgHeight} />
                </div>
            </div>
        </div>
        <div className='text-xs text-wrap truncate connectbox border-2 border-black px-1 py-1 mx-2 h-24 bg-base-4'>
            {d.des.slice(0,205)}...
        </div>
    </div>
    )
}

