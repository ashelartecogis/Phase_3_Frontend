import React, { useEffect, useState } from "react";

import "./css/TopScorer.css";
import GRC from "../images/grc_logo_new.png";
import TITLEBOX from "../images/titlebox.png";
import RC from "../images/rc.svg";
import deal_winner_red_bg from "../images/deal_winner_red_bg.png";
import deal_winner_glow from "../images/deal_winner_glow.png";
import tsg2 from "../images/tsg2.png";
import user1 from "../images/user1.png";
import tsdealbg from "../images/ts-deal-bg.png";
import ts_deal_username from "../images/ts-deal-username.png";
import ts_deal_bg_bg from "../images/ts-deal-bg-bg.png";
import ts_scorer_cup from "../images/ts_scorer_cup.png";

import LazyLoad from "react-lazyload";
import { base_url } from "../config";
export default function TopScorer(props) {
  const [dealNumberCount, setDealNumberCount] = useState(1)
  const [winner, setWinner] = useState({});
  useEffect(() => {
    if(props.winner === undefined || Object.keys(props.winner).length === 0){
      setWinner(JSON.parse(localStorage.getItem('winner')));
    }
    else{
        setWinner(props.winner);
    }
    setWinner(JSON.parse(localStorage.getItem('winner')));
    console.log(winner);
  }, [props]);
  useEffect(() => {
    let localDealNo = localStorage.getItem('dealNumberCount')
    if(localDealNo !== undefined && localDealNo !== null){
        setDealNumberCount(localDealNo)
    }
    else{
        setDealNumberCount(props.dealNumberCount)
    }
}, []);
  return (
    <>
      <div className="fade-in-intro">
        <div className="logodiv">
          {/* <LazyLoad height={"100%"}>
            <img
              src={RC}
              alt=""
              className="rc"
            />
          </LazyLoad > */}
          <LazyLoad height={"100%"}>
            <img
              src={GRC}
              alt=""
              className="grc"
            />
          </LazyLoad >

        </div>
        <div className="titlebox">
          <img
              src={TITLEBOX}
              alt=""
              className="titleboximg"
            />
          <h4 className="psstitle mb-0">Deal {dealNumberCount}</h4>
        </div>
      </div>
      <div className="maindiv">
      {/* <img
              src={deal_winner_red_bg}
              alt=""
              className="deal_winner_red_bg"
            /> */}
            {/* <img
              src={deal_winner_glow}
              alt=""
              className="deal_winner_glow"
            /> */}
            {/* <img
              src={tsg2}
              alt=""
              className="tsg2"
            /> */}
            {/* */}
            {/* <img
            src={`${base_url}${winner.playerId !== undefined && winner.playerId.photo}`}
              alt=""
              className="deal_winner_user"
            /> */}

            <img 
              src={tsdealbg}
              alt=""
              className="tsdealbg"
            /> 
            <img 
              src={ts_deal_username}
              alt=""
              className="ts_deal_username"
            /> 
            <img 
              src={ts_deal_bg_bg}
              alt=""
              className="ts_deal_bg_bg"
            /> 
            <img 
              src={ts_scorer_cup}
              alt=""
              className="ts_scorer_cup"
            /> 
            
            <div className="dealwinnerdetails">
                <span className="dealwinnername"><strong>{winner.playerId !== undefined && winner.playerId.name}</strong>  is the Top Scorer</span>
                <span className="dealwinnercity">{winner.playerId !== undefined && winner.playerId.location}</span>
            </div>
            <span className="dealwinnernotext">Deal {dealNumberCount}</span>
      </div>
    </>
  );
}

//   <span 
//         style={{
//             fontSize: "68px",
//             fontWeight: "600",
//             marginTop: "540px",
//             marginLeft: "-370px",
//         }}
//         className="dealwinnername">{winner.playerId !== undefined && winner.playerId.name.split(' ')}</span>  
//     <span 
//     style={{
//       fontSize: "38px",
//             fontWeight: "500",
//       marginTop: "560px",
//       marginLeft: "-130px",
//     }} className="dealwinnercity">{winner.playerId !== undefined && winner.playerId.location}</span>
// </div>