import React, { useEffect, useState, useCallback } from "react";
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
import eliminated from "../images/Eliminated_marker.png";
import baseURL from "../baseURL";
import greenpointer from "../images/Green_pointer.png";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dealsResponse = await axios.get(
          `${baseURL}:8000/api/table/getDeals`
        );
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

        const inGameResponse = await axios.get(
          `${baseURL}:8000/api/ingame/getLastIngame`
        );
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

    fetchData();

    const fetchLatestDealNumber = async () => {
      try {
        const response = await axios.get(
          `${baseURL}:8000/api/table/getLatestDealNumber`
        );
        setLatestDealNumber(response.data); // Directly use the response data
      } catch (error) {
        console.error("Error fetching the latest deal number:", error);
      }
    };

    fetchLatestDealNumber();

    const interval = setInterval(() => {
      fetchData();
      fetchLatestDealNumber();
    }, 3000);

    return () => clearInterval(interval);
  }, [jokerNumber, chanceCount]);

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
          inGame.map((value, index) => (
            <>
              {(value.playerStatus === "Dropped" ||
                value.playerStatus === "Eliminated") && (
                <span
                  className={`res-drop-text d-none res-drop-text-${index + 1}`}
                >
                  Dropped..
                </span>
              )}
              <div
                className={`cardanres cardanres-pp cardanres${index + 1} ${
                  (value.playerStatus === "Dropped" ||
                    value.playerStatus === "Eliminated") &&
                  "dropped-cardanres dropped-cardanres" + index
                }`}
              >
                <img
                  src={`${base_url}${value.playerId.shortphoto}`}
                  alt=""
                  className="cduser-res"
                />
                <span className="cdusername-res">
                  {value.playerId.name.split(" ")[0]}
                </span>
                {value.playerStatus !== "Eliminated" ? (
                  <span className="cdchips-res">
                    <img src={CHIP} alt="" className="cdchip-res" />
                    {value.playerId.totalChips}
                  </span>
                ) : (
                  <span className="cdchips-res">
                    <img src={CHIP} alt="" className="cdchip-res" />0
                  </span>
                )}
                <img
                  src={CARDDEALBG}
                  alt=""
                  className="carddealbgimgres"
                  style={{
                    marginLeft: "-190px",
                    marginBottom: "20px",
                  }}
                />
                {value.playerStatus !== "Eliminated" &&
                  value.playerStatus !== "Dropped" && (
                    <span className="res-pts">
                      {value.bestPoints}{" "}
                      <span className="res-pts-key">Pts</span>
                    </span>
                  )}

                {value.playerStatus === "Dropped" && (
                  <span className="res-pts">
                    {value.totalPoints} <span className="res-pts-key">Pts</span>
                  </span>
                )}

                {(value.playerStatus === "Dropped" ||
                  value.playerStatus === "Eliminated") && (
                  <div className="allcards ps-card-position-bs">
                    {value.playerStatus === "Dropped" && (
                      <span
                        className={`res-drop-text res-drop-text-${index + 1}`}
                      >
                        Dropped
                      </span>
                    )}

                    {value.playerStatus === "Eliminated" && (
                      <span
                        className={`res-drop-text res-drop-text-${index + 1}`}
                      >
                        <img src={eliminated} className="eliminated-img" />
                      </span>
                    )}
                    <img src={BCM} alt="" className={`bsc-card`} />
                    <img src={BCM} alt="" className={`bsc-card`} />
                    <img src={BCM} alt="" className={`bsc-card`} />
                    <img src={BCM} alt="" className={`bsc-card`} />
                    <img src={BCM} alt="" className={`bsc-card`} />
                    <img src={BCM} alt="" className={`bsc-card`} />
                    <img src={BCM} alt="" className={`bsc-card`} />
                    <img src={BCM} alt="" className={`bsc-card`} />
                    <img src={BCM} alt="" className={`bsc-card`} />
                    <img src={BCM} alt="" className={`bsc-card`} />
                    <img src={BCM} alt="" className={`bsc-card`} />
                    <img src={BCM} alt="" className={`bsc-card`} />
                    <img src={BCM} alt="" className={`bsc-card`} />
                  </div>
                )}

                {(value.playerStatus === "Declared" ||
                  value.playerStatus === "Rejected" ||
                  value.playerStatus === "Winner" ||
                  value.playerStatus === "autoWinner" ||
                  value.playerStatus === "validDeclaration") && (
                  <div className="allcards ps-card-position-bs">
                    {value.playerStatus === "Winner" && (
                      <span
                        className={`res-drop-text-pp res-Winner-text-${
                          index + 1
                        }`}
                      >
                        Winner
                      </span>
                    )}
                    {value.playerStatus === "autoWinner" && (
                      <span
                        className={`res-drop-text-pp res-Winner-text-${
                          index + 1
                        }`}
                      >
                        Auto Winner
                      </span>
                    )}
                    {value.playerStatus === "validDeclaration" && (
                      <span
                        className={`res-drop-text-pp res-Winner-text-${
                          index + 1
                        }`}
                      >
                        Winner
                      </span>
                    )}
                    {value.playerStatus === "Declared" && (
                      <span
                        className={`res-drop-text-pp res-declared-text-${
                          index + 1
                        }`}
                      >
                        Declared
                      </span>
                    )}

                    {value.playerStatus === "Rejected" && (
                      <span
                        className={`res-drop-text-pp res-declared-text-${
                          index + 1
                        }`}
                      >
                        Rejected
                      </span>
                    )}
                  </div>
                )}

                {value.playerStatus !== "Dropped" && (
                  <div className="allcardsbestseq">
                    <div className="row">
                      <div className="col-auto no-gutters p-1 ps-card-position">
                        {value.bestSeq1 !== undefined &&
                          value.bestSeq1.length > 0 &&
                          value.bestSeq1.map((bval, bindex) => (
                            <div className="ins-div">
                              <img
                                src={bval}
                                alt=""
                                className={`bestlistimg shadow ${bindex + 1}`}
                              />
                              {(value.bestSequence1.groupType === "1" ||
                                value.bestSequence1.groupType === "2" ||
                                value.bestSequence1.groupType === "3") && (
                                <img
                                  className="highlight-sets-bs"
                                  src={highlightSets}
                                  alt=""
                                />
                              )}
                            </div>
                          ))}
                      </div>
                      <div className="col-auto no-gutters p-1 ps-card-position">
                        {value.bestSeq2 !== undefined &&
                          value.bestSeq2.length > 0 &&
                          value.bestSeq2.map((bval, bindex) => (
                            <div className="ins-div">
                              <img
                                src={bval}
                                alt=""
                                className={`bestlistimg shadow ${bindex + 1}`}
                              />
                              {(value.bestSequence2.groupType === "1" ||
                                value.bestSequence2.groupType === "2" ||
                                value.bestSequence2.groupType === "3") && (
                                <img
                                  className="highlight-sets-bs"
                                  src={highlightSets}
                                  alt=""
                                />
                              )}
                            </div>
                          ))}
                      </div>
                      <div className="col-auto no-gutters p-1 ps-card-position">
                        {value.bestSeq3 !== undefined &&
                          value.bestSeq3.length > 0 &&
                          value.bestSeq3.map((bval, bindex) => (
                            <div className="ins-div">
                              <img
                                src={bval}
                                alt=""
                                className={`bestlistimg shadow ${bindex + 1}`}
                              />
                              {(value.bestSequence3.groupType === "1" ||
                                value.bestSequence3.groupType === "2" ||
                                value.bestSequence3.groupType === "3") && (
                                <img
                                  className="highlight-sets-bs"
                                  src={highlightSets}
                                  alt=""
                                />
                              )}
                            </div>
                          ))}
                      </div>
                      <div className="col-auto no-gutters p-1 ps-card-position">
                        {value.bestSeq4 !== undefined &&
                          value.bestSeq4.length > 0 &&
                          value.bestSeq4.map((bval, bindex) => (
                            <div className="ins-div">
                              <img
                                src={bval}
                                alt=""
                                className={`bestlistimg shadow ${bindex + 1}`}
                              />
                              {(value.bestSequence4.groupType === "1" ||
                                value.bestSequence4.groupType === "2" ||
                                value.bestSequence4.groupType === "3") && (
                                <img
                                  className="highlight-sets-bs"
                                  src={highlightSets}
                                  alt=""
                                />
                              )}
                            </div>
                          ))}
                      </div>
                      <div className="col-auto no-gutters p-1 ps-card-position">
                        {value.bestSeq5 !== undefined &&
                          value.bestSeq5.length > 0 &&
                          value.bestSeq5.map((bval, bindex) => (
                            <div className="ins-div">
                              <img
                                src={bval}
                                alt=""
                                className={`bestlistimg shadow ${bindex + 1}`}
                              />
                              {(value.bestSequence5.groupType === "1" ||
                                value.bestSequence5.groupType === "2" ||
                                value.bestSequence5.groupType === "3") && (
                                <img
                                  className="highlight-sets-bs"
                                  src={highlightSets}
                                  alt=""
                                />
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ))}
      </div>
    </>
  );
}
