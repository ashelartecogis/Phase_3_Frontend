import React, { useEffect, useState } from "react";
import axios from "axios";
import GRC from "../images/grc_logo_new.png";
import TITLEBOX from "../images/titlebox.png";
import eliminatedbadge from "../images/eliminated.png";
import eliminatedPlayerGlow from "../images/eliminated-glow.png";
import RC from "../images/rc.svg";
import CHIP from "../images/chip.svg";
import eliminatedPlayerBanner from "../images/eliminated-red-bar.png";
import LazyLoad from "react-lazyload";
import { base_url } from "../config";
// import "./css/DealResult.css";
import "./css/EliminatePlayer.css";
import baseURL from "../baseURL";
import tsdealbg from "../images/ts-deal-bg.png";
import ts_deal_username from "../images/ts-deal-username.png";
import ts_deal_bg_bg from "../images/ts-deal-bg-bg.png";
import eliminated from "../images/eliminated-new.png";

export default function EliminatePlayer(props) {
  const [dealNumberCount, setDealNumberCount] = useState(1);
  const { eliminate, playerIndex } = props;
  const [eliminatedPlayer, setEliminatedPlayer] = useState(null);

  useEffect(() => {
    let localDealNo = localStorage.getItem("dealNumberCount");
    if (localDealNo !== undefined && localDealNo !== null) {
      setDealNumberCount(localDealNo);
    } else {
      setDealNumberCount(props.dealNumberCount);
    }
  }, []);

  useEffect(() => {
    const fetchLatestDealNumber = async () => {
      const response = await axios.get(
        `${baseURL}:8000/api/table/getLatestDealNumber`
      );
      return response.data;
    };

    const fetchData = async () => {
      try {
        // Fetch latest deal number
        const latestDealNumber = await fetchLatestDealNumber();

        // Fetch player positions
        const response1 = await axios.get(
          `${baseURL}:8000/api/table/getPlayerPosition`
        );
        const playerPositions = response1.data;

        // Extract player IDs in the order of their positions
        const playerIdsInOrder = playerPositions
          .sort((a, b) => b.position - a.position)
          .map((player) => player.playerId);

        // Fetch players' total chips
        const response2 = await axios.get(
          `${baseURL}:8000/api/players/getPlayerTotalChips`
        );
        const matchingPlayersData = response2.data.filter((player) =>
          playerIdsInOrder.includes(player._id)
        );

        if (matchingPlayersData.length > playerIndex) {
          // Sort matching players according to their positions
          const sortedPlayers = matchingPlayersData.sort(
            (a, b) =>
              playerIdsInOrder.indexOf(a._id) - playerIdsInOrder.indexOf(b._id)
          );
          const playerToEliminate = sortedPlayers[playerIndex];

          setEliminatedPlayer(playerToEliminate);

          await axios.post(
            `${baseURL}:8000/api/ingame/seteliminatedPlayerStatusOne`,
            {
              playerId: playerToEliminate._id,
              eliminatedPlayerStatus: "Eliminated",
            }
          );

          await axios.post(`${baseURL}:8000/api/players/updateTotalChips`, {
            id: playerToEliminate._id,
            totalChips: 0,
          });

          // Send the POST request to set elimination time for the player
          await axios.post(`${baseURL}:8000/api/players/eliminationPosition`, {
            _id: playerToEliminate._id,
            eliminationLevel: latestDealNumber,
          });

          // console.log(eliminationResponse.data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [playerIndex]);

  return (
    <>
      <div className="fade-in-intro">
        <div className="logodiv">
          <LazyLoad height={"100%"}>
            <img src={GRC} alt="" className="grc" />
          </LazyLoad>
        </div>
        <div className="titlebox">
          <img src={TITLEBOX} alt="" className="titleboximg" />
          <h4 className="psstitle mb-0">Deal {dealNumberCount}</h4>
        </div>
      </div>
      <div className="maindiv">
        <div>
          <div className="">
            {/* <img
              className="eleminited-banner"
              src={eliminatedPlayerBanner}
              alt="Eliminated"
            />
            <img
              className="eleminited-badge"
              src={eliminatedbadge}
              alt="Eliminated"
            />
            <img
              className="eleminited-glow"
              src={eliminatedPlayerGlow}
              alt="Eliminated"
            /> */}

            <img src={tsdealbg} alt="" className="tsdealbg" />
            <img
              src={ts_deal_username}
              alt=""
              className="ts_deal_username_ep"
            />
            <img src={ts_deal_bg_bg} alt="" className="ts_deal_bg_bg" />
            <img src={eliminated} alt="" className="eliminated_ep" />

            <span className="dealwinnernotext">Deal {dealNumberCount}</span>

            {/* <span className="lowest-chips ele-lowest-chips">
              <img src={CHIP} alt="" />
            </span> */}
            {eliminatedPlayer && (
              <>
                {/* <img
                  src={`${baseURL}:8000/${eliminatedPlayer.photo}`}
                  className="eleminated-userpic"
                  alt="Eliminated"
                /> */}
                <h1 className="eleminated-username-ep">
                  {eliminatedPlayer.name}
                </h1>
                {/* Use optional chaining to safely access totalChips */}
                {/* <h1 className="lowest-chips ele-lowest-chips ele-lowest-chips-number">
                  {eliminatedPlayer.totalChips}
                </h1> */}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
