import axios  from "axios"

const API_KEY =  "923adjhb-288cbjSudhuido-828bchbcj"
const BACKEND_URL = "https://bizchat.fly.dev"


export type Response = { error?: string, message?: string, chatId?: string};
export const startChat = async (message: string) : Promise<Response> => {
    try {
        const { data} = await axios.post(`${BACKEND_URL}/chats`, {
            prompt: message
        }, {
            headers: {
            'x-api-key': API_KEY
            }
        })
        if(data.agentResponse.error == null) {
            return  {
                chatId: data.chatId,
                message: data.agentResponse.message
            }
        } else {
            return {
                error: data.agentResponse.message
            }
        }
    } catch(error: any) {
        return {
            error
        }
    }
}

export const continueChat = async (message: string, chatID: string) : Promise<Response> => {
    try {
        const { data} =await axios.put(`${BACKEND_URL}/chats/${chatID}`, {
            type: "MESSAGE",
            functionName: "string",
            content: message
        }, {
            headers: {
            'x-api-key': API_KEY
            }
        })
        if(data.error == null) {
            return  {
                message: data.message
            }
        } else {
            return {
                error: data.message
            }
        }
    } catch(error: any) {
        return {
            error
        }
    }
}