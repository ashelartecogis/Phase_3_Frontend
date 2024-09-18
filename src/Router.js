import React from 'react'
import {
    createBrowserRouter,
    redirect
} from "react-router-dom";
import Main from './Main';
import PlayerIntroCard from './components/PlayerIntroCard';
import TossDealing from './components/TossDealing';
import PlayerSittingPositions from './components/PlayerSittingPositions';
import PlayersChipsPage from './components/PlayersChipsPage';
import CardDeal from './components/CardDeal';
import JokerReveal from './components/JokerReveal';
import Deal from './components/Deal';
import BestSeqList from './components/BestSeqList';
import PerfectSort from './components/PerfectSort';
import DealDynamic from './components/DealDynamic';
import HandCardsStrength from './components/HandCardsStrength';
import Dropped from './components/Dropped';
import Declaration from './components/Declaration';
import DealResult from './components/DealResult';
import TopScorer from './components/TopScorer';
import ScoreBoard from './components/ScoreBoard'
import prizeStructure from './components/WinnerOne'
import WinnerOne from './components/WinnerOne';
// import PerfectSort from './components/PerfectSort';
const router = createBrowserRouter([
    {
        path: "/",
        element: <Main/>,
    },
    {
        path: "/player-intro",
        element: <PlayerIntroCard/>,
    },
    {
        path: "/toss-dealing",
        element: <TossDealing/>,
    },
    {
        path: "/player-sitting-positions",
        element: <PlayerSittingPositions/>,
    },
    {
        path: "/player-chips-page",
        element: <PlayersChipsPage/>,
    },
    {
        path: "/cards-deling",
        element: <CardDeal/>,
    },
    {
        path: "/joker-reveal",
        element: <JokerReveal/>,
    },
    {
        path: "/deal",
        element: <Deal/>,
    },
    {
        path: "/perfect-sort",
        element: <PerfectSort/>,
    },
    {
        path: "/player/:playerNo",
        element: <DealDynamic/>,
    },
    {
        path: "/win-meter",
        element: <HandCardsStrength/>,
    },
    {
        path: "/declaration-title",
        element: <Declaration/>,
    },
    {
        path: "/top-scorer",
        element: <TopScorer/>,
    },
    {
        path: "/deal-result",
        element: <DealResult/>,     
    },
    {
        path: "/scoreboard",
        element: <ScoreBoard/>,
    },
    {
        path: "/prize-structure",
        element: <WinnerOne/>,
    },
]);
export default router;