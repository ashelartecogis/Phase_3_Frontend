import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
} from "react";
import "./css/DealResult.css";
import "./css/DealResult.css";
import "./css/winner1chip.css";
import "./css/winner2chip.css";
import "./css/winner3chip.css";
import "./css/winner4chip.css";
import "./css/winner5chip.css";
import "./css/winner6chip.css";
import baseURL from "../baseURL";
import GRC from "../images/grc_logo_new.png";
import TITLEBOX from "../images/titlebox.png";
import RC from "../images/rc.svg";
import CHIP from "../images/chip.svg";
import CARDDEALBG from "../images/deal_cards_bg.png";
import CARDDEALTITLEBG from "../images/deal_cards_title_bg.png";
import CARDDEALBGBLACK from "../images/carddealbgblacknew2.png";
import BCM from "../images/back_card_min.png";
import { Cards } from "../constants";
import LazyLoad from "react-lazyload";
import { base_url } from "../config";
import { SocketContext } from "../services/socket";
import dealResultImg from "../images/dealResultImg.png";
import eliminatedPlayerBanner from "../images/eliminated-red-bar.png";
import eliminatedPlayerGlow from "../images/eliminated-glow.png";
import eliminatedbadge from "../images/eliminated.png";
import chipbig from "../images/chip-big.gif";
import chipbigr from "../images/chip-big-reverse.gif";
import axios from "axios";
import highlightSets from "../images/highlightSets.png";
import winnercup from "../images/ts_scorer_cup.png";
import eliminated from "../images/Eliminated_marker.png";
import glowpd from "../images/glow-pd.png";
export default function DealResult(props) {
  const socket = useContext(SocketContext);
  const [dealNumberCount, setDealNumberCount] = useState(1);
  const [inGame, setInGame] = useState({});
  const [allCards, setAllCards] = useState([]);
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();
  const [left1, setLeft1] = useState();
  const [left2, setLeft2] = useState();
  const [left3, setLeft3] = useState();
  const [latestDealNumber, setLatestDealNumber] = useState("");
  const [playerPoint1, setPlayerPoint1] = useState(null);
  const [playerPoint2, setPlayerPoint2] = useState(null);
  const [playerPoint3, setPlayerPoint3] = useState(null);
  const [playerPoint4, setPlayerPoint4] = useState(null);
  const [playerPoint5, setPlayerPoint5] = useState(null);
  const [playerPoint6, setPlayerPoint6] = useState(null);
  const [playerChips1, setPlayerChips1] = useState(null);
  const [playerChips2, setPlayerChips2] = useState(null);
  const [playerChips3, setPlayerChips3] = useState(null);
  const [playerChips4, setPlayerChips4] = useState(null);
  const [playerChips5, setPlayerChips5] = useState(null);
  const [playerChips6, setPlayerChips6] = useState(null);
  const [showElements, setShowElements] = useState(false);
  const [hideChips, setHideChips] = useState(false);
  const [playerId, setPlayerId] = useState("");
  const [playerStatus, setPlayerStatus] = useState("");
  const [animationShown, setAnimationShown] = useState(false);
  const [winningChips, setWinningChips] = useState(0);
  const [losingChips, setLosingChips] = useState([]);
  const [lowestChipsPlayerId, setLowestChipsPlayerId] = useState(null);
  const [bestPointsCalculation, setBestPointsCalculation] = useState(null);
  const dealNumberEndpoint = `${baseURL}:8000/api/table/getLatestDealNumber`;
  const [scoreCount, setScoreCount] = useState(false);
  const [playerArrangement, setPlayerArrangement] = useState(false);
  const [isScaling, setIsScaling] = useState(false);
  
  const [allPlayersPoints, setAllPlayersPoints] = useState([
    { totalPoints: playerPoint1, totalChips: playerChips1, isWinner: false },
    { totalPoints: playerPoint2, totalChips: playerChips2, isWinner: false },
    { totalPoints: playerPoint3, totalChips: playerChips3, isWinner: false },
    { totalPoints: playerPoint4, totalChips: playerChips4, isWinner: false },
    { totalPoints: playerPoint5, totalChips: playerChips5, isWinner: false },
    { totalPoints: playerPoint6, totalChips: playerChips6, isWinner: false },
  ]);

  let setScreenTypeCallBack = useCallback(
    (data) => {
      if (data.scorecount === true) {
        if (!scoreCount) {
          setScoreCount(true);
          setAnimationShown(true);
  
          localStorage.setItem("scoreCount", data.scorecount);
          let interval;
  
          if (data.scorecount !== undefined && data.scorecount) {
            let LocalInGame = JSON.parse(localStorage.getItem("InGame"));
            let winnerChips = 0;
            let losingArr = [];
  
            if (LocalInGame.length > 0) {
              let newArrayIngame = LocalInGame.map((val) => val.totalPoints);
              let chipsArrayIngame = LocalInGame.map((val) => {
                if (
                  val.playerStatus === "Winner" ||
                  val.playerStatus === "autoWinner"
                ) {
                  winnerChips = val.playerId.totalChips;
                }
                return val.playerId.totalChips;
              });
  
              // Set initial player points and chips
              let initialPlayersData = LocalInGame.map((val, index) => ({
                totalPoints: val.totalPoints,
                totalChips: val.playerId.totalChips,
                isWinner: val.totalPoints === 0 ? true : false,
              }));
              setAllPlayersPoints(initialPlayersData);
  
              // Calculate total chips and losing chips array
              let allChips = newArrayIngame.reduce(
                (sum, points) => sum + points,
                0
              );
              setWinningChips(allChips + winnerChips);
              winnerChips = allChips + winnerChips;
              losingArr = newArrayIngame.map(
                (points, index) => chipsArrayIngame[index] - points
              );
              setLosingChips(losingArr);
  
              // Start decrementing points and chips animation
              let windex = LocalInGame.findIndex(
                (val) =>
                  val.playerStatus === "Winner" ||
                  val.playerStatus === "autoWinner"
              );
              let incrementInterval = 10; // Milliseconds between each increment
              let incrementAmount = Math.ceil(winnerChips / 1700); // Smaller amount to increment each time
  
              interval = setInterval(() => {
                setAllPlayersPoints((prevData) => {
                  const newData = prevData.map((obj, ind) => {
                    if (
                      !obj.isWinner &&
                      obj.totalPoints > 0 &&
                      obj.playerStatus !== "Eliminated"
                    ) {
                      // Decrement totalPoints and totalChips for non-winners who are not eliminated
                      return {
                        ...obj,
                        totalPoints: obj.totalPoints - 1,
                        totalChips:
                          obj.totalChips > losingArr[ind]
                            ? obj.totalChips - 1
                            : obj.totalChips,
                      };
                    } else {
                      return obj; // Keep eliminated player's data unchanged
                    }
                  });
  
                  // Check if all totalPoints are reduced to zero
                  if (newData.every((player) => player.totalPoints === 0)) {
                    clearInterval(interval);
  
                    setTimeout(() => {
                      let currentChips = newData[windex].totalChips;
                      let chipsInterval = setInterval(() => {
                        currentChips += incrementAmount;
                        newData[windex].totalChips = currentChips;
  
                        if (currentChips >= winnerChips) {
                          newData[windex].totalChips = winnerChips; // Ensure final value is exact
                          clearInterval(chipsInterval);
                          setHideChips(true);
  
                          // Update localStorage with modified game data
                          let OldInGame = JSON.parse(
                            localStorage.getItem("InGame")
                          );
                          if (OldInGame !== null && OldInGame !== undefined) {
                            let NewInGame = OldInGame.map((val, index) => ({
                              ...val,
                              totalPoints: 0,
                            }));
  
                            cardsDeck(NewInGame);
                            console.log("allPlayersPointssss", NewInGame);
                          }
                        }
  
                        // Add the scaling animation class
                        document.querySelectorAll('.player-chip').forEach((el) => {
                          el.classList.add('scale-animation');
                        });
  
                        setAllPlayersPoints(
                          newData.map((player) => ({
                            ...player,
                            totalChips: player.totalChips
                              .toString()
                              .padStart(4, "0"),
                          }))
                        );
  
                        // Remove the scaling animation class after the transition duration
                        setTimeout(() => {
                          document.querySelectorAll('.player-chip').forEach((el) => {
                            el.classList.remove('scale-animation');
                          });
                        }, 500); // Duration should match the CSS transition duration
  
                      }, incrementInterval);
                    }, 3800); // 3.8-second delay before starting chip increment animation
                  }
  
                  return newData;
                });
              }, incrementInterval);
            }
          }
        }
      } else {
        // Reset scoreCount and animationShown when other buttons are clicked
        setScoreCount(false);
        setAnimationShown(false);
        localStorage.setItem("scoreCount", false);
      }
    },
    [scoreCount]
  );
  

  useEffect(() => {
    if (socket !== undefined) {
      socket.on("screenType", setScreenTypeCallBack);
    }
    return () => {
      if (socket) {
        socket.off("screenType", setScreenTypeCallBack);
      }
    };
  }, [socket]);

  useEffect(() => {
    // Show the elements
    setShowElements(true);

    // Set a timeout to hide the elements after 5 seconds
    const timeout = setTimeout(() => {
      setShowElements(false);
    }, 5000);

    // Clean up the timeout to avoid memory leaks
    return () => clearTimeout(timeout);
  }, []); // This effect runs only once when the component mounts

  useEffect(() => {
    if (lowestChipsPlayerId) {
      const apiUrl = "${baseURL}:8000/api/ingame/seteliminatedPlayerStatus";
      const requestBody = {
        playerId: lowestChipsPlayerId,
        eliminatedPlayerStatus: "Eliminated",
      };

      axios
        .post(apiUrl, requestBody)
        .then((response) => {
          console.log("POST request successful:", response.data);
          // Optionally, you can handle any success logic here
        })
        .catch((error) => {
          console.error("Error while making POST request:", error);
          // Optionally, you can handle any error logic here
        });
    }
  }, [lowestChipsPlayerId]);

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
    const fetchLatestDealNumber = async () => {
      try {
        const response = await axios.get(dealNumberEndpoint);
        setLatestDealNumber(response.data);
      } catch (error) {
        console.error("Error fetching latest deal number:", error);
      }
    };

    fetchLatestDealNumber();
  }, []);

  useEffect(() => {
    let LocalPlayerArrangement = localStorage.getItem("playerArrangement");

    if (LocalPlayerArrangement !== undefined) {
      setPlayerArrangement(LocalPlayerArrangement);
    } else {
      setPlayerArrangement(props.playerArrangement);
    }

    if (LocalPlayerArrangement !== undefined) {
      if (LocalPlayerArrangement) {
        // setTimeout(() => {
        let OldInGame = JSON.parse(localStorage.getItem("NewInGame"));
        let NewInGame = OldInGame.sort(
          (a, b) =>
            parseInt(b.playerId.totalChips) - parseInt(a.playerId.totalChips)
        );
        setAllPlayersPoints((prevData) => {
          console.log("prevData", prevData);
          const sortedArray = prevData
            .slice()
            .sort((a, b) => b.totalChips - a.totalChips);
          console.log("sortedArray", sortedArray);
          return sortedArray;
        });
        // console.log("setAllPlayersPoints",allPlayersPoints);
        cardsDeck(NewInGame);
        // }, 500);
      }
    }
  }, [props.playerArrangement]);

  useEffect(() => {
    // localStorage.setItem("scoreCount", false);
    // localStorage.setItem("playerArrangement", false);

    let localDealNo = localStorage.getItem("dealNumberCount");
    if (localDealNo !== undefined && localDealNo !== null) {
      setDealNumberCount(localDealNo);
    } else {
      setDealNumberCount(props.dealNumberCount);
    }

    let LocalPlayerArrangement = JSON.parse(
      localStorage.getItem("playerArrangement")
    );
    let LocalScoreCount = JSON.parse(localStorage.getItem("scoreCount"));
    let LocalInGame = JSON.parse(localStorage.getItem("InGame"));
    if (props.inGame !== undefined) {
      setInGame(props.inGame);
    } else {
      setInGame(LocalInGame);
    }

    if (LocalInGame.length > 0) {
      let newArrayIngame = props.inGame.map((val, index) => {
        return val.totalPoints;
      });
      let winnerChips = 0;
      let chipsArrayIngame = props.inGame.map((val, index) => {
        if (
          val.playerStatus === "Winner" ||
          val.playerStatus === "autoWinner"
        ) {
          winnerChips = val.playerId.totalChips;
        }
        return val.playerId.totalChips;
      });

      setPlayerPoint1(newArrayIngame[0]);
      setPlayerPoint2(newArrayIngame[1]);
      setPlayerPoint3(newArrayIngame[2]);
      setPlayerPoint4(newArrayIngame[3]);
      setPlayerPoint5(newArrayIngame[4]);
      setPlayerPoint6(newArrayIngame[5]);

      setPlayerChips1(chipsArrayIngame[0]);
      setPlayerChips2(chipsArrayIngame[1]);
      setPlayerChips3(chipsArrayIngame[2]);
      setPlayerChips4(chipsArrayIngame[3]);
      setPlayerChips5(chipsArrayIngame[4]);
      setPlayerChips6(chipsArrayIngame[5]);

      setAllPlayersPoints([
        {
          totalPoints: newArrayIngame[0],
          totalChips: chipsArrayIngame[0],
          isWinner: newArrayIngame[0] == 0 ? true : false,
        },
        {
          totalPoints: newArrayIngame[1],
          totalChips: chipsArrayIngame[1],
          isWinner: newArrayIngame[1] == 0 ? true : false,
        },
        {
          totalPoints: newArrayIngame[2],
          totalChips: chipsArrayIngame[2],
          isWinner: newArrayIngame[2] == 0 ? true : false,
        },
        {
          totalPoints: newArrayIngame[3],
          totalChips: chipsArrayIngame[3],
          isWinner: newArrayIngame[3] == 0 ? true : false,
        },
        {
          totalPoints: newArrayIngame[4],
          totalChips: chipsArrayIngame[4],
          isWinner: newArrayIngame[4] == 0 ? true : false,
        },
        {
          totalPoints: newArrayIngame[5],
          totalChips: chipsArrayIngame[5],
          isWinner: newArrayIngame[5] == 0 ? true : false,
        },
      ]);

      console.log("allplayers referes 2", allPlayersPoints);
      let allChips =
        parseInt(newArrayIngame[0]) +
        parseInt(newArrayIngame[1]) +
        parseInt(newArrayIngame[2]) +
        parseInt(newArrayIngame[3]) +
        parseInt(newArrayIngame[4]) +
        parseInt(newArrayIngame[5]);
      setWinningChips(parseInt(allChips) + parseInt(winnerChips));
      let losingArr = [
        parseInt(chipsArrayIngame[0]) - newArrayIngame[0],
        parseInt(chipsArrayIngame[1]) - newArrayIngame[1],
        parseInt(chipsArrayIngame[2]) - newArrayIngame[2],
        parseInt(chipsArrayIngame[3]) - newArrayIngame[3],
        parseInt(chipsArrayIngame[4]) - newArrayIngame[4],
        parseInt(chipsArrayIngame[5]) - newArrayIngame[5],
      ];
      setLosingChips(losingArr);
      console.log("winnerChips", allPlayersPoints);

      // cardsDeck(LocalInGame)
    }
  }, []);
  useEffect(() => {
    let LocalInGame = JSON.parse(localStorage.getItem("InGame"));
    if (props.inGame !== undefined) {
      setInGame(props.inGame);
    } else {
      setInGame(LocalInGame);
    }
    // console.log("inGame",inGame)
    console.log("localinGame", LocalInGame);

    if (LocalInGame.length > 0) {
      cardsDeck(props.inGame);
    }
  }, []);
  const cardsDeck = (inGame) => {
    let newInGame = inGame.map((val) => {
      if (val.playerStatus !== "Eliminated") {
        return {
          ...val,
          seq1: val.cardSequence1.cards.map((cval, cindex) => {
            let picked = Cards.find((o) => o.cardUuid == cval.cardId);
            let isJoker = isJokerCard(cval.cardId);
            if (isJoker) {
              return picked.imageURI2;
            } else {
              return picked.imageURI;
            }
          }),
          seq2: val.cardSequence2.cards.map((cval, cindex) => {
            let picked = Cards.find((o) => o.cardUuid == cval.cardId);
            let isJoker = isJokerCard(cval.cardId);
            if (isJoker) {
              return picked.imageURI2;
            } else {
              return picked.imageURI;
            }
          }),
          seq3: val.cardSequence3.cards.map((cval, cindex) => {
            let picked = Cards.find((o) => o.cardUuid == cval.cardId);
            let isJoker = isJokerCard(cval.cardId);
            if (isJoker) {
              return picked.imageURI2;
            } else {
              return picked.imageURI;
            }
          }),
          seq4: val.cardSequence4.cards.map((cval, cindex) => {
            let picked = Cards.find((o) => o.cardUuid == cval.cardId);
            let isJoker = isJokerCard(cval.cardId);
            if (isJoker) {
              return picked.imageURI2;
            } else {
              return picked.imageURI;
            }
          }),
          seq5: val.cardSequence5.cards.map((cval, cindex) => {
            let picked = Cards.find((o) => o.cardUuid == cval.cardId);
            let isJoker = isJokerCard(cval.cardId);
            if (isJoker) {
              return picked.imageURI2;
            } else {
              return picked.imageURI;
            }
          }),
          seq6: val.cardSequence6.cards.map((cval, cindex) => {
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
          <LazyLoad height={"100%"}>
            {/* <img
                            src={RC}
                            alt=""
                            className="rc"
                        /> */}
          </LazyLoad>
          <LazyLoad height={"100%"}>
            <img src={GRC} alt="" className="grc" />
          </LazyLoad>
        </div>
        <div className="titlebox">
          {/* <img
                        src={TITLEBOX}
                        alt=""
                        className="titleboximg"
                        /> */}
          {/* <h4 className="psstitle mb-0">Deal {dealNumberCount}</h4> */}
        </div>
      </div>

      <div className="maindiv">
        <img src={CARDDEALBGBLACK} alt="" className="carddealbgblack" />
        {/* <img
                    src={CARDDEALTITLEBG}
                    alt=""
                    className="carddealtitlebg"
                /> */}
        <span className="carddealtitle">
          <img
            src={dealResultImg}
            alt="dealResultImg"
            className="dealResultImg"
            style={{
              display: "flex",
              position: "absolute",
              zIndex: "-1",
              width: "548px",
              height: "147px",
              marginTop: "-27px",
              marginLeft: "-60px",
            }}
          />
          Deal {dealNumberCount} <br />{" "}
          <p
            style={{
              fontSize: "35px",
            }}
          >
            Results
          </p>
        </span>

        {inGame &&
          inGame.length > 0 &&
          inGame.map((value, index) => (
            <>
              {(value.playerStatus === "Dropped" ||
                value.playerStatus === "Eliminated") && (
                <span
                  className={`res-drop-text d-none res-drop-text-${index + 1}`}
                >
                  Dropped
                </span>
              )}
              <div
                key={index}
                className={`cardanres cardanres${index + 1} ${
                  value.playerStatus === "Dropped" &&
                  "dropped-cardanres dropped-cardanres" + index
                }`}
              >
                <img
                  src={`${base_url}${value.playerId.shortphoto}`}
                  alt=""
                  className="cduser-res"
                />
                <span className="cdusername-res">
                  {value.playerId.name.split(" ")[0]}{" "}
                </span>
                <div>
                  <img
                    src={CARDDEALBG}
                    alt=""
                    className="carddealbgimgres"
                    style={{
                      marginLeft: "-190px",
                      marginBottom: "20px",
                    }}
                  />
                </div>

                {/* Total chip count for scoreboard */}
                <span className="cdchips-res">
                  <img src={CHIP} alt="" className="cdchip-res" />
                  {/* <b className="pointzoom"> */}
                  {value.playerStatus !== "Eliminated"
                    ? props.playerArrangement
                      ? value.playerId.totalChips
                      : allPlayersPoints[index].totalChips
                    : 0}
                    {/* </b> */}
                </span>

                {(value.playerStatus === "Winner" ||
                  value.playerStatus === "autoWinner") && (
                  <>
                    <img src={winnercup} className="winnercup-dr" alt="" />
                    <img
                      src={glowpd}
                      alt=""
                      className="pdlist-glow-winner glowpd dd-worldcup"
                    />
                  </>
                )}

                {!hideChips && value.playerStatus !== "Eliminated" && (
                  <span className="res-pts">
                    {allPlayersPoints[index].totalPoints}
                    <span className="res-pts-key"> &nbsp; Pts</span>
                  </span>
                )}

                {/* <div className={`allcards`}> */}
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
                        {value.seq1 != undefined &&
                          value.seq1.length > 0 &&
                          value.seq1.map((value2, vindex) => (
                            <div className="ins-div">
                              <img
                                src={value2}
                                alt=""
                                className={`bestlistimg shadow bestimg${
                                  vindex + 1
                                }`}
                                // style={{
                                //     width:"99px"
                                // }}
                              />
                              {(value.cardSequence1.seqType === "pure" ||
                                value.cardSequence1.seqType === "impure" ||
                                value.cardSequence1.seqType === "trio") && (
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
                        {value.seq2 != undefined &&
                          value.seq2.length > 0 &&
                          value.seq2.map((value2, vindex) => (
                            <div className="ins-div">
                              <img
                                src={value2}
                                alt=""
                                className={`bestlistimg shadow bestimg${
                                  vindex + 1
                                }`}
                              />
                              {(value.cardSequence2.seqType === "pure" ||
                                value.cardSequence2.seqType === "impure" ||
                                value.cardSequence2.seqType === "trio") && (
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
                        {value.seq3 != undefined &&
                          value.seq3.length > 0 &&
                          value.seq3.map((value2, vindex) => (
                            <div className="ins-div">
                              <img
                                src={value2}
                                alt=""
                                className={`bestlistimg shadow bestimg${
                                  vindex + 1
                                }`}
                              />
                              {(value.cardSequence3.seqType === "pure" ||
                                value.cardSequence3.seqType === "impure" ||
                                value.cardSequence3.seqType === "trio") && (
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
                        {value.seq4 != undefined &&
                          value.seq4.length > 0 &&
                          value.seq4.map((value2, vindex) => (
                            <div className="ins-div">
                              <img
                                src={value2}
                                alt=""
                                className={`bestlistimg shadow bestimg${
                                  vindex + 1
                                }`}
                              />
                              {(value.cardSequence4.seqType === "pure" ||
                                value.cardSequence4.seqType === "impure" ||
                                value.cardSequence4.seqType === "trio") && (
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
                        {value.seq5 != undefined &&
                          value.seq5.length > 0 &&
                          value.seq5.map((value2, vindex) => (
                            <div className="ins-div">
                              <img
                                src={value2}
                                alt=""
                                className={`bestlistimg shadow bestimg${
                                  vindex + 1
                                }`}
                              />
                              {(value.cardSequence5.seqType === "pure" ||
                                value.cardSequence5.seqType === "impure" ||
                                value.cardSequence5.seqType === "trio") && (
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
                        {value.seq6 != undefined &&
                          value.seq6.length > 0 &&
                          value.seq6.map((value2, vindex) => (
                            <div className="ins-div">
                              <img
                                src={value2}
                                alt=""
                                className={`bestlistimg shadow bestimg${
                                  vindex + 1
                                }`}
                              />
                              {(value.cardSequence6.seqType === "pure" ||
                                value.cardSequence6.seqType === "impure" ||
                                value.cardSequence6.seqType === "trio") && (
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

              {scoreCount &&
                animationShown &&
                index < 6 &&
                (value.playerStatus === "Winner" ||
                  value.playerStatus === "autoWinner") && (
                  <div className={`winner winner${index + 1}`}>
                    {[...Array(10)].map((_, chipIndex) => (
                      <img
                        key={chipIndex}
                        src={chipIndex % 2 === 0 ? chipbig : chipbigr}
                        className={`chipbig chip${chipIndex + 1}`}
                        alt=""
                      />
                    ))}
                  </div>
                )}
            </>
          ))}
      </div>
    </>
  );
}
