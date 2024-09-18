import React, { useEffect, useState } from "react";
import "./css/WinnerSix.css";
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
import { base_url } from "../config";
import axios from "axios";
import baseURL from "../baseURL";

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
          <img src={redbar} className="redbar" alt="" />
          <img src={grc24} className="grc24" alt="" />
          <img src={glow} className="winner-glow" alt="" />
          <div className="text-center mx-auto grswinner1">
            <img src={grswinner1} alt="" className="winnerimgbanner" />

            <span className="prize-div-1">
              ₹ 10,000,000 + <strong>Thar</strong>
            </span>
          </div>
          <div className="text-center mx-auto grswinner2">
            <img src={grswinner2} alt="" className="winnerimgbanner" />

            <span className="prize-div-2">
              ₹ 2,500,000 +<strong>Bike</strong>
            </span>
          </div>
          <div className="text-center mx-auto grswinner3">
            <img src={grswinner3} alt="" className="winnerimgbanner" />

            <span className="prize-div-3">
              ₹ 1,000,000 +<strong>Phone</strong>
            </span>
          </div>
          {/* Cup images for the first three winners */}
          //{" "}
          <div className="text-center mx-auto backdropsup4 ">
            // <img src={CUPDOWN} alt="" className="winnerimgbanner" />
            //{" "}
          </div>
          //{" "}
          <div className="text-center mx-auto backdropholder4 ">
            // <img src={CUP4} alt="" className="winnerimgbanner" />
            //{" "}
          </div>
          //{" "}
          <div className="text-center mx-auto backdrop4price ">
            // <span className="winnerpricealt winnerslast4">₹ 500,000</span>
            //{" "}
          </div>
          //{" "}
          <div className="text-center mx-auto backdropsup5 ">
            // <img src={CUPDOWN} alt="" className="winnerimgbanner" />
            //{" "}
          </div>
          //{" "}
          <div className="text-center mx-auto backdropholder5 ">
            // <img src={CUP5} alt="" className="winnerimgbanner" />
            //{" "}
          </div>
          //{" "}
          <div className="text-center mx-auto backdrop5price ">
            // <span className="winnerpricealt winnerslast5">₹ 325,000</span>
            //{" "}
          </div>
          <div className="text-center mx-auto backdropsup6 ">
            <img src={CUPDOWN} alt="" className="winnerimgbanner" />
          </div>
          <div className="text-center mx-auto backdropholder6 ">
            <img src={CUP6} alt="" className="winnerimgbanner" />
          </div>
          <div className="text-center mx-auto backdrop6price ">
            <span className="winnerpricealt winnerslast6">₹ 150,000</span>
          </div>
          {/* Displaying the first three players based on inGame data */}
          {players.slice(0, 6).map((player, index) => (
            <>
              <div
                key={index}
                className={`text-center mx-auto backdrop${index + 1}user`}
              >
                <img
                  src={`${baseURL}:8000/${player.photo}`}
                  alt={player.name}
                  className="winnerimgbanner"
                />
              </div>
              <div
                key={index}
                className={`text-center winnername-main-div wmd${index + 1}`}
              >
                <h1 className={`winnername-${index + 1}`}>{player.name}</h1>
              </div>
            </>
          ))}
          {/* Displaying additional winners */}
          {players.slice(3).map((player, index) => (
            <React.Fragment key={index}>
              <div className={`text-center mx-auto backdropsup${index + 4}`}>
                {/* <img src={CUPDOWN} alt="" className="winnerimgbanner" /> */}
              </div>
              <div className={`text-center mx-auto backdropholder${index + 4}`}>
                <img src={player.cupImage} alt="" className="winnerimgbanner" />
              </div>
              <div className={`text-center mx-auto backdrop${index + 4}price`}>
                {/* <span className="winnerpricealt winnerslast">{player.prize}</span> */}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
