import React, { useEffect, useState, useRef } from "react";
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
export default function BestSeqList(props) {
  const [dealNumberCount, setDealNumberCount] = useState(1);
  const [inGame, setInGame] = useState({});
  const [allCards, setAllCards] = useState([]);
  const [left1, setLeft1] = useState();
  const [left2, setLeft2] = useState();
  const [left3, setLeft3] = useState();
  const [isSeq1, setIsSeq1] = useState(-1);
  const [isSeq2, setIsSeq2] = useState(-1);
  const [isSeq3, setIsSeq3] = useState(-1);
  const [isSeq4, setIsSeq4] = useState(-1);
  const [isSeq5, setIsSeq5] = useState(-1);
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();
  const [booster, setBooster] = useState(0);
  const dynamicDiv1 = useRef(null);
  const dynamicDiv2 = useRef(null);
  const dynamicDiv3 = useRef(null);
  const dynamicDiv4 = useRef(null);

  function isJokerCard(cardId) {
    let jokerNumber = localStorage.getItem("jokerNumber");
    let jokerCard = Cards.find((o) => o.cardUuid == jokerNumber);
    // console.log("jokerNumber", jokerNumber);
    // console.log("jokerCard", jokerCard);
    let ogCard = Cards.find((o) => o.cardUuid == cardId);

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

  useEffect(() => {
    let localDealNo = localStorage.getItem("dealNumberCount");
    if (localDealNo !== undefined && localDealNo !== null) {
      setDealNumberCount(localDealNo);
    } else {
      setDealNumberCount(props.dealNumberCount);
    }
    // console.log("I am done");
    let LocalInGame = JSON.parse(localStorage.getItem("InGame"));
    if (LocalInGame !== undefined) {
      setInGame(LocalInGame);
    } else {
      setInGame(props.inGame);
    }

    let LocalIsSeq1 = localStorage.getItem("isSeq1");
    // console.log(lo)
    if (LocalIsSeq1 !== undefined) {
      setIsSeq1(LocalIsSeq1);
    } else {
      setIsSeq1(props.isSeq1);
    }
  }, []);

  useEffect(() => {
    let LocalInGame = JSON.parse(localStorage.getItem("InGame"));

    if (LocalInGame.length > 0) {
      let localJoker = localStorage.getItem("jokerNumber");
      LocalInGame.forEach((val) => {
        if (val.playerStatus === "Active") {
          axios
            .post(`${ipaddbackend}api/ingame/setBestSeq`, {
              dealId: val.dealId,
              playerId: val.playerId._id,
              joker: localJoker,
            })
            .then(async (data) => {
              // console.log("val", data, val.playerId._id, "");
              // if(data.data !== undefined){
              // }
            });
        }
        // cardsDeck(LocalInGame)
      });
    }
  }, []);

  useEffect(() => {
    let LocalInGame = JSON.parse(localStorage.getItem("InGame"));
    // console.log(LocalInGame, "ingame");
    if (LocalInGame !== undefined) {
      setInGame(LocalInGame);
    } else {
      setInGame(props.inGame);
    }
    if (LocalInGame.length > 0) {
      cardsDeck(LocalInGame);
    }
    // console.log('props');
  }, [props]);

  useEffect(() => {
    let LocalIsSeq1 = localStorage.getItem("isSeq1");
    if (LocalIsSeq1 !== undefined) {
      setIsSeq1(LocalIsSeq1);
    } else {
      setIsSeq1(props.isSeq1);
    }
  }, [props.isSeq1]);
  // useEffect(() => {

  // }, []);

  useEffect(() => {
    let LocalIsSeq2 = localStorage.getItem("isSeq2");
    if (LocalIsSeq2 !== undefined) {
      setIsSeq2(LocalIsSeq2);
    } else {
      setIsSeq2(props.isSeq2);
    }
  }, [props.isSeq2]);

  useEffect(() => {
    let LocalIsSeq3 = localStorage.getItem("isSeq3");
    if (LocalIsSeq3 !== undefined) {
      setIsSeq3(LocalIsSeq3);
    } else {
      setIsSeq3(props.isSeq3);
    }
  }, [props.isSeq3]);

  useEffect(() => {
    let LocalIsSeq4 = localStorage.getItem("isSeq4");
    if (LocalIsSeq4 !== undefined) {
      setIsSeq4(LocalIsSeq4);
    } else {
      setIsSeq4(props.isSeq4);
    }
  }, [props.isSeq4]);

  useEffect(() => {
    let LocalIsSeq5 = localStorage.getItem("isSeq5");
    if (LocalIsSeq5 !== undefined) {
      setIsSeq5(LocalIsSeq5);
    } else {
      setIsSeq5(props.isSeq5);
    }
  }, [props.isSeq5]);

  // create card deck
  const cardsDeck = (inGame) => {
    // console.log("seq:", inGame)
    let newInGame = inGame.map((val) => {
      if (val.playerStatus !== "Eliminated") {
        return {
          ...val,
          bestSeq1: val?.bestSequence1?.cards?.map((cval, cindex) => {
            let picked = Cards.find((o) => o.cardUuid == cval.cardId);
            let isJoker = isJokerCard(cval.cardId);
            if (isJoker) {
              return picked.imageURI2;
            } else {
              return picked.imageURI;
            }
          }),
          bestSeq2: val?.bestSequence2?.cards?.map((cval, cindex) => {
            let picked = Cards.find((o) => o.cardUuid == cval.cardId);
            let isJoker = isJokerCard(cval.cardId);
            if (isJoker) {
              return picked.imageURI2;
            } else {
              return picked.imageURI;
            }
          }),
          bestSeq3: val?.bestSequence3?.cards?.map((cval, cindex) => {
            let picked = Cards.find((o) => o.cardUuid == cval.cardId);
            let isJoker = isJokerCard(cval.cardId);
            if (isJoker) {
              return picked.imageURI2;
            } else {
              return picked.imageURI;
            }
          }),
          bestSeq4: val?.bestSequence4?.cards?.map((cval, cindex) => {
            let picked = Cards.find((o) => o.cardUuid == cval.cardId);
            let isJoker = isJokerCard(cval.cardId);
            if (isJoker) {
              return picked.imageURI2;
            } else {
              return picked.imageURI;
            }
          }),
          bestSeq5: val?.bestSequence5?.cards?.map((cval, cindex) => {
            let picked = Cards.find((o) => o.cardUuid == cval.cardId);
            let isJoker = isJokerCard(cval.cardId);
            if (isJoker) {
              return picked.imageURI2;
            } else {
              return picked.imageURI;
            }
          }),
        };
      } else {
        return {
          ...val,
        };
      }
    });
    setInGame(newInGame);
    localStorage.setItem("InGame", JSON.stringify(newInGame));
  };

  return (
    <>
      <div className="fade-in-intro">
        <div className="logodiv">
          {/* <LazyLoad height={"100%"}>
            <img src={RC} alt="" className="rc" />
          </LazyLoad> */}
          <LazyLoad height={"100%"}>
            <img src={GRC} alt="" className="grc" />
          </LazyLoad>
        </div>
        {/* <div className="titlebox">
          <img src={TITLEBOX} alt="" className="titleboximg" />
          <h4 className="psstitle mb-0">Deal {dealNumberCount}</h4>
        </div> */}
      </div>
      <div className="maindiv">
        <img src={CARDDEALBGBLACK} alt="" className="carddealbgblack" />
        <span className="carddealtitleperfect">
          <img
            src={perfectSort}
            alt=""
            style={{ marginTop: "-40px", zIndex: "-1" }}
          />
        </span>

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
                className={`cardanres cardanres${index + 1} ${
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
                {value.playerStatus !== "Eliminated" && (
                  <span className="res-pts">
                    {value.bestPoints} <span className="res-pts-key">Pts</span>
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

                {/* </div> */}
              </div>
            </>
          ))}
      </div>
    </>
  );
}
