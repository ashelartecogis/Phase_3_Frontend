import React, { useEffect, useState, useCallback, useContext } from "react";
import "./css/DealResult.css";
import "./css/bestseqlist.css";
import GRC from "../images/grc_logo_new.png";
import TITLEBOX from "../images/titlebox.png";
import RC from "../images/rc.svg";
import CHIP from "../images/chip.svg";
import CARDDEALBG from "../images/deal_cards_bg.png";
import CARDDEALTITLEBG from "../images/deal_cards_title_bg.png";
import CARDDEALBGBLACK from "../images/carddealbgblacknew2.png";
import BCM from "../images/back_card_min.png";
import { Cards, ipaddbackend } from "../constants";
import LazyLoad from "react-lazyload";
import { base_url } from "../config";
import perfectSort from "../images/perfectSort.png";
import axios from "axios";
import highlightSets from "../images/highlightSets.png";
import eliminatedBg from "../images/EliminatedBg.png";
import baseURL from "../baseURL";
import greenpointer from "../images/Green_pointer.png";
import showRank from "../images/showRank.png"
import { SocketContext } from "../services/socket";
import {
  levelNumber as levelNumberEndpoint,
  getPlayerTotalChips,
  getLatestDealNumber,
  getLastIngame,
  getDeals
} from "../server/Api";
export default function BestSeqList(props) {
  const [dealNumberCount, setDealNumberCount] = useState(1);
  const [inGame, setInGame] = useState([]);
  const [playerData, setPlayerData] = useState([]);
  const [jokerNumber, setJokerNumber] = useState(null);
  const [chanceCount, setChanceCount] = useState(0);
  const [isStart, setisStart] = useState(0);
  const [firstPlayerIndex, setfirstPlayerIndex] = useState(0);
  const [closeCard, setcloseCard] = useState(0);
  const [latestDealNumber, setLatestDealNumber] = useState(null);
  const [dealsData, setDealsData] = useState([]);
  const [data, setData] = useState([]);
  const [levelNumber, setLevelNumber] = useState(null);
  const [rankings, setRankings] = useState([]);
  const socket = useContext(SocketContext);
  const getDisplayLevel = (levelNumber, eliminationLevel) => {
    const ranges = {
      2: { 1: [1, 6], 2: [7, 12] },
      3: { 1: [1, 4], 2: [5, 8], 3: [9, 12] },
      4: { 1: [1, 3], 2: [4, 6], 3: [7, 9], 4: [10, 12] },
      6: { 1: [1, 2], 2: [3, 4], 3: [5, 6], 4: [7, 8], 5: [9, 10], 6: [11, 12] },
      12: { 1: [1], 2: [2], 3: [3], 4: [4], 5: [5], 6: [6], 7: [7], 8: [8], 9: [9], 10: [10], 11: [11], 12: [12] },
    };

    const levelRanges = ranges[levelNumber];
    if (levelRanges) {
      for (const [displayLevel, range] of Object.entries(levelRanges)) {
        if (eliminationLevel >= range[0] && eliminationLevel <= range[range.length - 1]) {
          return displayLevel;
        }
      }
    }

    return eliminationLevel;
  };

  useEffect(() => {
    if (inGame && inGame.length > 0) {
      // Sort players by elimination status and then by totalChips
      const sortedPlayers = [...inGame].sort((a, b) => {
        // First, compare by elimination status
        if (a.playerStatus === "Eliminated" && b.playerStatus !== "Eliminated") {
          return 1; // Move eliminated players down
        }
        if (a.playerStatus !== "Eliminated" && b.playerStatus === "Eliminated") {
          return -1; // Move non-eliminated players up
        }
  
        // If both players are eliminated, compare by eliminationPosition
        if (a.playerStatus === "Eliminated" && b.playerStatus === "Eliminated") {
          return b.playerId.eliminationPosition - a.playerId.eliminationPosition;
        }
  
        // If neither is eliminated, compare by totalChips in descending order
        return b.playerId.totalChips - a.playerId.totalChips;
      });
  
      // Initialize an array to hold the rank assignments
      let updatedRankings = [];
      let currentRank = 1;
  
      for (let i = 0; i < sortedPlayers.length; i++) {
        let player = sortedPlayers[i];
  
        // Check if it's the start of a tie (for non-eliminated players)
        if (
          i > 0 &&
          player.playerStatus !== "Eliminated" &&
          player.playerId.totalChips === sortedPlayers[i - 1].playerId.totalChips &&
          sortedPlayers[i - 1].playerStatus !== "Eliminated"
        ) {
          // Assign the same rank as the previous player
          updatedRankings.push({
            ...player,
            rank: updatedRankings[i - 1].rank
          });
        } else {
          // Assign the current rank and update for the next unique totalChips or eliminationPosition
          updatedRankings.push({
            ...player,
            rank: currentRank
          });
          currentRank++;
        }
      }
  
      // Set the rankings
      setRankings(updatedRankings);
    }
  }, [inGame]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch player data
        const playerResponse = await fetch(getPlayerTotalChips());
        const playerResult = await playerResponse.json();
        setData(playerResult);

        // Fetch level number
        const levelResponse = await axios.get(levelNumberEndpoint());
        setLevelNumber(levelResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Fetch data immediately on component mount
    fetchData();

    // Listen for socket events
    socket.on("setPickCard", fetchData);
    socket.on("PickCard", fetchData);
    socket.on("showOpenCard", fetchData);
    socket.on("setCloseCard", fetchData);
    socket.on("CloseCard", fetchData);
    socket.on("PickStatus", fetchData);
    socket.on("chance_count", fetchData);
    socket.on("screenType", fetchData);
    socket.on("setPlayerStatus", fetchData);
    socket.on("dealingCard", fetchData);
    socket.on("dealcard", fetchData);
    socket.on("setCardSequence", fetchData);
    socket.on("setBestSeq", fetchData);
    socket.on("setScreenNo", fetchData);
    socket.on("showJoker", fetchData);
    socket.on("Joker", fetchData);
    socket.on("Scanner", fetchData);



    // Cleanup listeners on component unmount
    return () => {
      socket.off("setPickCard", fetchData);
      socket.off("PickCard", fetchData);
      socket.off("showOpenCard", fetchData);
      socket.off("setCloseCard", fetchData);
      socket.off("CloseCard", fetchData);
      socket.off("PickStatus", fetchData); 
      socket.off("chance_count", fetchData);
      socket.off("screenType", fetchData);
      socket.off("setPlayerStatus", fetchData);
      socket.off("dealingCard", fetchData);
      socket.off("dealcard", fetchData);
      socket.off("setCardSequence", fetchData);
      socket.off("setBestSeq", fetchData);
      socket.off("setScreenNo", fetchData);
      socket.off("showJoker", fetchData);
      socket.off("Joker", fetchData);
      socket.off("Scanner", fetchData);


    };
  }, [socket]); // Add socket as a dependency

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dealsResponse = await axios.get(getDeals());
        const dealsData = dealsResponse.data;

        if (dealsData.length > 0) {
          const latestDeal = dealsData[dealsData.length - 1];
          setChanceCount(latestDeal.chanceCount);
          setisStart(latestDeal.isStart);
          setfirstPlayerIndex(latestDeal.firstPlayerIndex);
          setcloseCard(latestDeal.closeCard);

          if (latestDeal.isStart === 0 && latestDeal.jokerCard > 0) {
            setJokerNumber(latestDeal.jokerCard);
          }

          if (latestDeal.isStart === 1 && latestDeal.closeCard > 0) {
            setcloseCard(latestDeal.closeCard);
          }
        }

        const inGameResponse = await axios.get(getLastIngame());
        const inGameData = inGameResponse.data.InGameRes;

        setPlayerData(inGameData);
        setInGame(inGameData);

        if (dealsData.length > 0) {
          const latestDeal = dealsData[dealsData.length - 1];
          setJokerNumber(latestDeal.jokerCard);
        }

        cardsDeck(inGameData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchLatestDealNumber = async () => {
      try {
        const response = await axios.get(getLatestDealNumber());
        setLatestDealNumber(response.data);
      } catch (error) {
        console.error("Error fetching the latest deal number:", error);
      }
    };

    // Fetch data immediately on component mount
    fetchData();
    fetchLatestDealNumber();

    // Listen for socket events and fetch data accordingly
    socket.on("setPickCard", fetchData);
    socket.on("PickCard", fetchData);
    socket.on("showOpenCard", fetchData);
    socket.on("setCloseCard", fetchData);
    socket.on("CloseCard", fetchData);
    socket.on("PickStatus", fetchData);
    socket.on("chance_count", fetchData);
    socket.on("setPlayerStatus", fetchData);
    socket.on("dealingCard", fetchData);
    socket.on("dealcard", fetchData);
    socket.on("setCardSequence", fetchData);
    socket.on("setBestSeq", fetchData);
    socket.on("screenType", fetchData);
    socket.on("setScreenNo", fetchData);
    socket.on("showJoker", fetchData);
    socket.on("Joker", fetchData);
    socket.on("Scanner", fetchData);


    // Cleanup listeners on component unmount
    return () => {
      socket.off("setPickCard", fetchData);
      socket.off("PickCard", fetchData);
      socket.off("showOpenCard", fetchData);
      socket.off("setCloseCard", fetchData);
      socket.off("CloseCard", fetchData);
      socket.off("PickStatus", fetchData);
      socket.off("chance_count", fetchData);
      socket.off("setPlayerStatus", fetchData);
      socket.off("dealingCard", fetchData);
      socket.off("dealcard", fetchData);
      socket.off("setCardSequence", fetchData);
      socket.off("setBestSeq", fetchData);
      socket.off("screenType", fetchData);
      socket.off("setScreenNo", fetchData);
      socket.off("showJoker", fetchData);
      socket.off("Joker", fetchData);
      socket.off("Scanner", fetchData);
    };
  }, [socket, jokerNumber, chanceCount]);

  const renderGreenPointer = (className) => {
    return <img src={greenpointer} alt="" className={className} />;
  };

  function isJokerCard(cardId) {
    let jokerCard = Cards.find((o) => o.cardUuid === jokerNumber);
    let ogCard = Cards.find((o) => o.cardUuid === cardId);

    if (ogCard.Value === "J") {
      ogCard.Value = 11;
    } else if (ogCard.Value === "Q") {
      ogCard.Value = 12;
    } else if (ogCard.Value === "K") {
      ogCard.Value = 13;
    } else if (ogCard.Value === "A") {
      ogCard.Value = 1;
    }

    if (jokerCard.Value === "J") {
      jokerCard.Value = 11;
    } else if (jokerCard.Value === "Q") {
      jokerCard.Value = 12;
    } else if (jokerCard.Value === "K") {
      jokerCard.Value = 13;
    } else if (jokerCard.Value === "A") {
      jokerCard.Value = 1;
    }
    if (jokerCard !== undefined && jokerCard !== null) {
      if (jokerCard.Type !== "Joker") {
        if (ogCard.Value === jokerCard.Value) {
          return true;
        } else {
          return false;
        }
      } else {
        if (ogCard.Value === 1) {
          // console.log("og com", ogCard.Value);
          return true;
        } else {
          return false;
        }
      }
    }
  }

  const cardsDeck = (inGame) => {
    // console.log("seq:", inGame)
    let newInGame = inGame.map((val) => {
      if (val.playerStatus !== "Eliminated") {
        return {
          ...val,
          bestSeq1: val?.bestSequence1?.cards?.map((cval) => {
            let picked = Cards.find((o) => o.cardUuid === cval.cardId);
            let isJoker = isJokerCard(cval.cardId);
            return isJoker ? picked.imageURI2 : picked.imageURI;
          }),
          bestSeq2: val?.bestSequence2?.cards?.map((cval) => {
            let picked = Cards.find((o) => o.cardUuid === cval.cardId);
            let isJoker = isJokerCard(cval.cardId);
            return isJoker ? picked.imageURI2 : picked.imageURI;
          }),
          bestSeq3: val?.bestSequence3?.cards?.map((cval) => {
            let picked = Cards.find((o) => o.cardUuid === cval.cardId);
            let isJoker = isJokerCard(cval.cardId);
            return isJoker ? picked.imageURI2 : picked.imageURI;
          }),
          bestSeq4: val?.bestSequence4?.cards?.map((cval, cindex) => {
            let picked = Cards.find((o) => o.cardUuid == cval.cardId);
            let isJoker = isJokerCard(cval.cardId);
            return isJoker ? picked.imageURI2 : picked.imageURI;
          }),
          bestSeq5: val?.bestSequence5?.cards?.map((cval) => {
            let picked = Cards.find((o) => o.cardUuid === cval.cardId);
            let isJoker = isJokerCard(cval.cardId);
            return isJoker ? picked.imageURI2 : picked.imageURI;
          }),
          bestSeq6: val?.bestSequence6?.cards?.map((cval) => {
            let picked = Cards.find((o) => o.cardUuid === cval.cardId);
            let isJoker = isJokerCard(cval.cardId);
            return isJoker ? picked.imageURI2 : picked.imageURI;
          }),
              };
      } else {
        return { ...val };
      }
    });
    setInGame(newInGame);
    localStorage.setItem("InGame", JSON.stringify(newInGame));
  };

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
          <h4 className="psstitle mb-0">Deal {latestDealNumber}</h4>
        </div>
      </div>
      <div className="maindiv">
        {inGame !== undefined &&
          inGame !== null &&
          inGame.length > 0 &&
          (() => {
            const anyPlayerWinner = inGame.some(
              (player) =>
                player.playerStatus === "Winner" ||
                player.playerStatus === "autoWinner" ||
                player.playerStatus === "validDeclaration" ||
                player.playerStatus === "Declared"
            );
            return inGame.map((value, index) => (
              <div key={index}>
                {isStart === 0 && jokerNumber > 0 && !anyPlayerWinner && (
                  <>
                    {firstPlayerIndex === 1 &&
                      renderGreenPointer("greenpointer1")}
                    {firstPlayerIndex === 2 &&
                      renderGreenPointer("greenpointer2")}
                    {firstPlayerIndex === 3 &&
                      renderGreenPointer("greenpointer3")}
                    {firstPlayerIndex === 4 &&
                      renderGreenPointer("greenpointer4")}
                    {firstPlayerIndex === 5 &&
                      renderGreenPointer("greenpointer5")}
                    {firstPlayerIndex === 6 &&
                      renderGreenPointer("greenpointer6")}
                  </>
                )}

                {isStart === 1 &&
                  closeCard > 0 &&
                  value.playerStatus === "Active" &&
                  !anyPlayerWinner && (
                    <>
                      {index + 1 === chanceCount &&
                        renderGreenPointer(`greenpointer${index + 1}`)}
                    </>
                  )}
              </div>
            ));
          })()}

        <img
          src={perfectSort}
          alt=""
          style={{ marginTop: "470px", marginLeft: "-60px", zIndex: "-1" }}
        />

        <img src={CARDDEALBGBLACK} alt="" className="carddealbgblack" />
        <span className="carddealtitleperfect"></span>
        {inGame !== undefined &&
  inGame !== null &&
  inGame.length > 0 &&
  (() => {
    // Check if any player is the Winner
    const hasWinner = inGame.some(player => player.playerStatus === "Winner");

    return inGame.map((value, index) => (
      <>
        {(value.playerStatus === "Dropped" || value.playerStatus === "Eliminated") && (
          <span className={`res-drop-text d-none res-drop-text-${index + 1}`}>
            Dropped..
          </span>
        )}
        <div className={`cardanres cardanres-pp cardanres${index + 1} ${ (value.playerStatus === "Dropped" || value.playerStatus === "Eliminated") && "dropped-cardanres dropped-cardanres" + index}`}>
          <img src={`${base_url}${value.playerId.shortphoto}`} alt="" className="cduser-res" />
          <span className="cdusername-res">
            {value.playerId.name.split(" ")[0]}
            {latestDealNumber !== 1 && (
              <>
                <img src={showRank} alt="" className="showRankBestSeq" />
                <h3 className="showRankTextBestSeq">
                  Rank {rankings.find(r => r.playerId === value.playerId)?.rank || 'N/A'}
                </h3>
              </>
            )}
          </span>
          {value.playerStatus !== "Eliminated" ? (
            <span className="cdchips-res">
              <img src={CHIP} alt="" className="cdchip-res" />
              {Math.max(0, value.playerId.totalChips)}
            </span>
          ) : (
            <span className="cdchips-res">
              <img src={CHIP} alt="" className="cdchip-res" />0
            </span>
          )}
          <img src={CARDDEALBG} alt="" className="carddealbgimgres" style={{ marginLeft: "-190px", marginBottom: "20px" }} />
          
          {value.playerStatus !== "Eliminated" && value.playerStatus !== "Dropped" && (
            <span className="res-pts">
              {hasWinner ? value.totalPoints : value.bestPoints}{" "}
              <span className="res-pts-key">Pts</span>
            </span>
          )}

          {value.playerStatus === "Dropped" && (
            <span className="res-pts">
              {value.totalPoints} <span className="res-pts-key">Pts</span>
            </span>
          )}

          {(value.playerStatus === "Dropped" || value.playerStatus === "Eliminated") && (
            <div className="allcards ps-card-position-bs">
              {value.playerStatus === "Dropped" && (
                <span className={`res-drop-text res-drop-text-${index + 1}`}>
                  Dropped
                </span>
              )}

              {value.playerStatus === "Eliminated" && (
                <span className={`res-drop-text res-drop-text-${index + 1}`}>
                  <img src={eliminatedBg} className="eliminated-img" />
                  {data.map(player => {
                    if (value && player._id === value.playerId._id && player.eliminationLevel > 0) {
                      const displayLevel = getDisplayLevel(levelNumber, player.eliminationLevel);
                      return (
                        <h3 key={player._id} className="eliminated-text">
                          Eliminated - Lvl {displayLevel}
                        </h3>
                      );
                    }
                    return null;
                  })}
                </span>
              )}
              {/* Additional card images */}
              {[...Array(12)].map((_, i) => (
                <img key={i} src={BCM} alt="" className={`bsc-card`} />
              ))}
            </div>
          )}

          {(value.playerStatus === "Declared" || value.playerStatus === "Rejected" || value.playerStatus === "Winner" || value.playerStatus === "autoWinner" || value.playerStatus === "validDeclaration") && (
            <div className="allcards ps-card-position-bs">
              {value.playerStatus === "Winner" && (
                <span className={`res-drop-text-pp res-Winner-text-${index + 1}`}>
                  Winner
                </span>
              )}
              {value.playerStatus === "autoWinner" && (
                <span className={`res-drop-text-pp res-Winner-text-${index + 1}`}>
                  Auto Winner
                </span>
              )}
              {value.playerStatus === "validDeclaration" && (
                <span className={`res-drop-text-pp res-Winner-text-${index + 1}`}>
                  Winner
                </span>
              )}
              {value.playerStatus === "Declared" && (
                <span className={`res-drop-text-pp res-declared-text-${index + 1}`}>
                  Declared
                </span>
              )}
              {value.playerStatus === "Rejected" && (
                <span className={`res-drop-text-pp res-declared-text-${index + 1}`}>
                  Rejected
                </span>
              )}
            </div>
          )}

          {value.playerStatus !== "Dropped" && (
            <div className="allcardsbestseq">
              <div className="row">
                {Array.from({ length: 5 }, (_, seqIndex) => (
                  <div key={seqIndex} className="col-auto no-gutters p-1 ps-card-position">
                    {value[`bestSeq${seqIndex + 1}`] !== undefined &&
                      value[`bestSeq${seqIndex + 1}`].length > 0 &&
                      value[`bestSeq${seqIndex + 1}`].map((bval, bindex) => (
                        <div className="ins-div" key={bindex}>
                          <img src={bval} alt="" className={`bestlistimg shadow ${bindex + 1}`} />
                          {(value[`bestSequence${seqIndex + 1}`].groupType === "1" ||
                            value[`bestSequence${seqIndex + 1}`].groupType === "2" ||
                            value[`bestSequence${seqIndex + 1}`].groupType === "3") && (
                            <img className="highlight-sets-bs" src={highlightSets} alt="" />
                          )}
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    ));
  })()}

      </div>
    </>
  );
}
