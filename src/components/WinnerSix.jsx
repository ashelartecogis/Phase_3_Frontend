import React, { useEffect, useState } from "react";
import "./css/WinnerSix.css";
import "./css/prize-distribution-screen.css";
// import LOGO_BACKDROP from "../images/logobgglow.png";
// import GRC from "../images/svg/grcb.svg";
// import RC from "../images/svg/rcb.svg";
import BG from "../images/bg.png";
import CUP from "../images/winner3cup.png";
import CUP4 from "../images/cup4.png";
import CUP5 from "../images/cup5.png";
import CUP6 from "../images/cup6.png";
import CUPDOWN from "../images/cup_down_bg.png";
import grswinner1 from "../images/grcwinner1.png";
import grswinner2 from "../images/grcwinner2.png";
import grswinner3 from "../images/grcwinner3.png";
import redbar from "../images/deal_winner_red_bg_2.png";
import glow from "../images/rays.png";
import grc24 from "../images/grc-24-winnrers.png";
import USER1 from "../images/user1.png";
import RAHUL from "../images/rahul.png";
import SNEHAL from "../images/snehal.png";
import NAVEEN from "../images/naveen.png";
import SANKET from "../images/sanket.png";
import SWAPNIL from "../images/swapnil.png";
import axios from "axios";
import prize1 from "../images/prize1.png";
import prize2 from "../images/prize2.png";
import prize3 from "../images/prize3.png";
import prize4 from "../images/prize4.png";
import baseURL from "../baseURL";
import pdnumber1 from "../images/1.png";
import pdnumber2 from "../images/2.png";
import pdnumber3 from "../images/3.png";
import pdnumber4 from "../images/4.png";
import pdnumber5 from "../images/5.png";
import pdnumber6 from "../images/6.png";
import glowpd from "../images/glow-pd.png";
import Ellipsepd from "../images/Ellipse-pd.png";

import LazyLoad from "react-lazyload";
import { base_url } from "../config";

export default function WinnerSix(props) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pointsResponse = await axios.get(
          `${baseURL}:8000/api/ingame/getTotalPoints`
        );
        const chipsResponse = await axios.get(
          `${baseURL}:8000/api/players/getPlayerTotalChips`
        );
        const positionsResponse = await axios.get(
          `${baseURL}:8000/api/table/getPlayerPosition`
        );

        const pointsData = pointsResponse.data;
        const chipsData = chipsResponse.data;
        const positionsData = positionsResponse.data;

        // Merge the data
        const mergedData = pointsData.map((pointsPlayer) => {
          const matchingChipsPlayer = chipsData.find(
            (chipsPlayer) => chipsPlayer._id === pointsPlayer.playerId
          );
          return {
            ...pointsPlayer,
            ...(matchingChipsPlayer || {}),
          };
        });

        // Separate and sort the players
        const nonEliminatedPlayers = mergedData.filter(
          (player) => player.playerStatus !== "Eliminated"
        );
        const eliminatedPlayers = mergedData.filter(
          (player) => player.playerStatus === "Eliminated"
        );

        nonEliminatedPlayers.sort((a, b) => {
          if (b.totalChips === a.totalChips) {
            const positionA =
              positionsData.find((pos) => pos.playerId === a.playerId)
                ?.position || Infinity;
            const positionB =
              positionsData.find((pos) => pos.playerId === b.playerId)
                ?.position || Infinity;
            return positionA - positionB;
          }
          return b.totalChips - a.totalChips;
        });

        eliminatedPlayers.sort(
          (a, b) => b.eliminationPosition - a.eliminationPosition
        );

        setPlayers([...nonEliminatedPlayers, ...eliminatedPlayers]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="fade-in-banner">
        <div className="maindiv">
          {/* Displaying the first three winners */}
          {players.slice(0, 3).map((player, index) => (
            <div key={index} className={`pd-list pd-list-${index + 1}`}>
              <img
                src={`${baseURL}:8000/${player.shortphoto}`}
                alt=""
                className="pdlist-winner-img"
              />
              <div className="pd-content">
                <span>{player.name}</span>
                {index === 0 && (
                  <>
                    <img
                      src={glowpd}
                      alt=""
                      className="pdlist-glow-winner glowpd "
                    />
                    <strong>Won ₹ 10,000,000 & Thar</strong>
                    <img src={pdnumber1} alt="" className="pdlist-number1" />
                    <img src={prize1} alt="" className="pdlist-winner-prize1" />
                  </>
                )}
                {index === 1 && (
                  <>
                    <strong>Won ₹ 2,500,000 & Bike</strong>
                    <img src={pdnumber2} alt="" className="pdlist-number2" />
                    <img src={prize2} alt="" className="pdlist-winner-prize2" />
                    <img
                      src={Ellipsepd}
                      alt=""
                      className="pdlist-glow-winner"
                    />
                  </>
                )}
                {index === 2 && (
                  <>
                    <strong>Won ₹ 1,000,000 & iPhone</strong>
                    <img src={pdnumber3} alt="" className="pdlist-number3" />
                    <img src={prize3} alt="" className="pdlist-winner-prize3" />
                    <img
                      src={Ellipsepd}
                      alt=""
                      className="pdlist-glow-winner"
                    />
                  </>
                )}
              </div>
              <img
                src={player.prizeImage}
                alt=""
                className="pdlist-winner-prize"
              />
            </div>
          ))}

          {/* Displaying additional winners */}
          {players.slice(3).map((player, index) => (
            <div key={index} className={`pd-list pd-last-three-${index + 1}`}>
              <img
                src={`${baseURL}:8000/${player.shortphoto}`}
                alt=""
                className="pdlist-winner-img"
              />
              <div className="pd-content">
                <span>{player.name}</span>
                {index === 0 && (
                  <strong className="ltwp-1">Won ₹ 5,00,000</strong>
                )}
                {index === 1 && (
                  <strong className="ltwp-2">Won ₹ 325,000</strong>
                )}
                {index === 2 && (
                  <strong className="ltwp-3">Won ₹ 150,000</strong>
                )}
              </div>

              <img src={pdnumber4} alt="" className="pdlist-number ltwp-1" />
              <img src={pdnumber5} alt="" className="pdlist-number ltwp-2" />
              <img src={pdnumber6} alt="" className="pdlist-number ltwp-3" />
              <img src={prize4} alt="" className="pdlist-winner-prize" />

              <img
                src={player.prizeImage}
                alt=""
                className="pdlist-winner-prize"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
