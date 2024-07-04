import { ethers } from "ethers";

export const formatter = {

    formatTxReceipt: (receipt) => {
        try{
            const IEvent = new ethers.utils.Interface(["event Created(address owner, address tokenAddress, string name, string symbol, string description, uint256 timestamp)"])
            const relevantLog = receipt.logs.filter(item => item.topics.includes("0x31406981fbfb40a5f93f14dd0c7b1193859d0703ae76450bce5976b11b64b54c"))[0]
            const event = IEvent.decodeEventLog("Created", relevantLog.data, relevantLog.topics)
            return event.tokenAddress
        } catch(e){console.log("error", e)}
    }
}

