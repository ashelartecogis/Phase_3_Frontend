import axios from 'axios'
import baseURL from './baseURL'

let BASE_API_URL = `${baseURL}:8000/api/table`
const getStatus = async () => {
    let tableId = localStorage.getItem('tableId')
    // let id = JSON.parse(tableId)
    let id = "6448dec5cecd44ad5537aa99"
    console.log(id,"tableID")
    let results = await axios.post(`${BASE_API_URL}/getGameStatus`,id)
    console.log(results,"res")
    if(results && results.data) {
        console.log(results.data,"results")
    }
}


export {
    getStatus
}