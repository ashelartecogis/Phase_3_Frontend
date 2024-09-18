import React, { useEffect, useState } from "react";
import styled, { keyframes } from 'styled-components';
import BackCard from "../SVG/backcard.svg";
import GRC from "../SVG/GRClogo.svg";
import RC from "../SVG/RC.svg";
import PlayerCardBg from "../images/pcbg.png";
import LazyLoad from "react-lazyload";
import lodash from "lodash";
import { lightSpeedIn } from 'react-animations';
import {base_url} from "../config";
const bounceAnimation = keyframes`${lightSpeedIn}`;

const BouncyDiv = styled.div`
  animation: 1s ${bounceAnimation};
  position: absolute;
  right: 100%;
`;
export default function TossDealing(props) {


  const [winnerStatus, setWinnerStatus] = useState(false);
  const [allPlayers, setallPlayers] = useState([]);
  const [updatedAllPlayers, setupdatedAllPlayers] = useState([]);
  const [winnerPlayer, setwinnerPlayer] = useState(null);

  useEffect(() => {
    let status = localStorage.getItem('winnerStatus');
    if (!status && status !== undefined) {
      setWinnerStatus(status);
    }
  }, []);

  useEffect(() => {
    let playersJson = localStorage.getItem('AllPlayers');
    if (playersJson) {
      let players = JSON.parse(playersJson);
      // console.log("json",updatedAllPlayers);
      setallPlayers(players);
    }
  }, [props]);

  useEffect(() => {
    // if(winnerStatus){
    let finalPositionJson = localStorage.getItem("finalPosition");
    if (finalPositionJson) {
      let finalPosition = JSON.parse(finalPositionJson);
      
      
      let newPlayer = allPlayers.map((value, index) => {
        var picked = lodash.filter(finalPosition, x => x.playerId._id === value._id);
        // console.log('picked:',picked);
        // if (value._id === finalPosition[0].playerId._id) {
        if (picked[0].position == 1) {
          let replaced = value.photo.replace(/\\/g, "/")
        
          setwinnerPlayer({ ...value, photo:replaced });
          
          return {
            ...value,
            position: 1
          };
        }
        else {
          return {
            ...value,
            position: picked[0].position
          };
        }
      });
      setupdatedAllPlayers(newPlayer);
    }

    // console.log("finalPosition:",finalPosition);
    // console.log("all player",updatedAllPlayers);
    // }
  }, [props]);

  return (
    <div>
      <div className="logobox">
        <LazyLoad className="mb-2" height={"100%"}>
          <img
            src={RC}
            alt=""
            className="rc"
            style={{ position: "absolute", height: "35px", }}
          />
        </LazyLoad >
        <LazyLoad height={"100%"}>
          <img
            src={GRC}
            alt=""
            className="grc mt-4"
            style={{ position: "absolute", height: "60px" }}
          />
        </LazyLoad >
      </div>
      <div className="tossstyle">
        <h5 className="text-white gameStatus w-100">Toss</h5>
      </div>
      <div>
        <div className="Toss-background"></div>
        <div className={!winnerPlayer ? "Toss-Dark" : "Toss-Dark-New"}>
          {!winnerPlayer && (<span style={{ position: 'absolute', textAlign: 'center', top: 20, left: 30, right: 30, fontSize: 18, color: 'white' }}>Toss</span>)}
          {winnerPlayer && (<img className="winnerImage" src={`${base_url}${winnerPlayer.photo}`} />)}
          <div className={!winnerPlayer ? "Toss-Description" : "Toss-Description-New"}>
            <span style={{ position: 'absolute', textAlign: 'center', top: 18, left: 30, right: 30, fontSize: 18, color: 'white' }}>{winnerPlayer ? `${winnerPlayer.name} Won the toss & will play first` : "Dealer is dealing cards for Toss"}</span>
          </div>
        </div>

      </div>
      <div className="toss-background"></div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          position: "absolute",
          top: "10px",
          right: 0,
          //   left: 1300,
          bottom: 0,
          flexDirection: "column",
        }}
      >
        {/* {console.log('data', updatedAllPlayers)} */}
        {updatedAllPlayers && updatedAllPlayers.length > 0 ? updatedAllPlayers.map((value) => (
          <div style={{ display: 'flex', height: "100%", alignItems: 'center', marginRight: "10%", flexDirection: 'column', padding: '7px', width: "100%", backgroundImage: value.position === 1 ? `url(${PlayerCardBg})` : "", backgroundRepeat: "no-repeat", backgroundPosition: "cover" }}>
            <BouncyDiv><span style={{ fontSize: '23px', position: "absolute", top: "40px", right: "100%", backgroundColor: "white", color: "#000", borderRadius: "50%", border: "1px solid #fff" }} className="badge pss pl-2 pr-2 pt-2 pb-2">{value.position}</span></BouncyDiv>
            
            <span style={{ color: "white", marginBottom: 5, fontSize: '16px' }}>{value.name}</span>
            {/* <LazyLoad height={"100%"}> */}
            <img src={value.tossCard ? value.tossCard : BackCard} width={value.tossCard ? "35%" : "50%"} />
            {/* </LazyLoad> */}
          </div>
        )) : (
          <>
            {allPlayers && allPlayers.length > 0 && allPlayers.map(value => (
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', padding: '7px', width: "100%" }}>
                <span style={{ color: "white", marginBottom: 5, fontSize: '16px' }}>{value.name}</span>
                {/* <LazyLoad width={"100%"} height={"100%"}> */}
                <img src={value.tossCard ? value.tossCard : BackCard} width={value.tossCard ? "40%" : "40%"} height="100%" />
                {/* </LazyLoad> */}
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}
