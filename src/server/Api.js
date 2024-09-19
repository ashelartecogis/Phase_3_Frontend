const MAIN_URL = "http://192.168.9.245"; 


// API for LEVELS model 

export const calculatedCHips = () => {
    return MAIN_URL + ":8000/api/levels/calculatedChips"
}

export const levelNumber = () => {
    return MAIN_URL + ":8000/api/levels/levelNumber"
}

export const boosters = () => {
    return MAIN_URL + ":8000/api/levels/boosters"
}

export const firstDrop = () => {
    return MAIN_URL + ":8000/api/levels/firstDrop"
}

export const elimination = () => {
    return MAIN_URL + ":8000/api/levels/elimination"
}

export const boxContent = () => {
    return MAIN_URL + ":8000/api/levels/boxContent"
}





// API for PLAYERS model 
export const getAllPlayersIds = () => {
    return MAIN_URL + ":8000/api/players/getAllPlayersIds"
}

export const updateTotalChips = () => {
    return MAIN_URL + ":8000/api/players/updateTotalChips"
}

export const getPlayerTotalChips = () => {
    return MAIN_URL + ":8000/api/players/getPlayerTotalChips"
}

export const eliminationPosition = () => {
    return MAIN_URL + ":8000/api/players/eliminationPosition"
}



// API for TABLES model 
export const getLatestDealNumber = () => {
    return MAIN_URL + ":8000/api/table/getLatestDealNumber"
}

export const getPlayerPosition = () => {
    return MAIN_URL + ":8000/api/table/getPlayerPosition"
}

export const getDeals = () => {
    return MAIN_URL + ":8000/api/table/getDeals"
}

export const getJokerCard = () => {
    return MAIN_URL + ":8000/api/table/getJokerCard"
}



// API for INGAME model 

export const getPlayerIdAndStatus = () => {
    return MAIN_URL + ":8000/api/ingame/getPlayerIdAndStatus"
}

export const getLastIngame = () => {
    return MAIN_URL + ":8000/api/ingame/getLastIngame"
}

export const getTotalPoints = () => {
    return MAIN_URL + ":8000/api/ingame/getTotalPoints"
}

export const seteliminatedPlayerStatus = () => {
    return MAIN_URL + ":8000/api/ingame/seteliminatedPlayerStatus"
}

export const seteliminatedPlayerStatusOne = () => {
    return MAIN_URL + ":8000/api/ingame/seteliminatedPlayerStatusOne"
}

export const getAllTotalPoints = () => {
    return MAIN_URL + ":8000/api/ingame/getAllTotalPoints"
}

export const setProbability = () => {
    return MAIN_URL + ":8000/api/ingame/setProbability"
}