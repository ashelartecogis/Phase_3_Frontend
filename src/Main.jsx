import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
} from "react";
import logo from "./logo.svg";
import "./App.css";
import ReactPlayer from "react-player";
import PlayerIntroCard from "./components/PlayerIntroCard";
import IntroBanner from "./components/IntroBanner";
import PlayerSittingPositions from "./components/PlayerSittingPositions";
import CardDeal from "./components/CardDeal";
import JokerReveal from "./components/JokerReveal";
import Deal from "./components/Deal";
import Dropped from "./components/Dropped";
import Declaration from "./components/Declaration";
import DealShow from "./components/DealShow";
import Declare from "./components/Declare";
import TopScorer from "./components/TopScorer";
import EliminatePlayer from "./components/EliminatePlayer";
import DealResult from "./components/DealResult";
import ScoreBoard from "./components/ScoreBoard";
import DealArrangement from "./components/DealArrangement";
import HandCardsStrength from "./components/HandCardsStrength";
import PlayersChipsPage from "./components/PlayersChipsPage";
import TossDeal from "./components/TossDeal";
import BestSeqList from "./components/BestSeqList";
import WinnerBanner from "./components/WinnerBanner";
import WinnerOne from "./components/WinnerOne";
import WinnerThree from "./components/WinnerThree";
import WinnerSix from "./components/WinnerSix";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import TossDealing from "./components/TossDealing";
import io from "socket.io-client";
import { getStatus } from "./service";
import { Cards } from "./constants";
import "bootstrap/dist/css/bootstrap.min.css";
import BgVideo from "./images/RC-BG-Video.mp4";
import { base_url } from "./config";
// import { useDispatch, useSelector } from "react-redux";
import { savePlayerData, setScreenNo } from "./slice/screenTypeSlice";
import { Link, Navigate } from "react-router-dom";
import { SocketContext } from "./services/socket";

function Main() {
  const playerRef = useRef(null);
  const [tableId, setTableId] = useState(null);
  const [initialPosition, setInitialPosition] = useState(null);
  const [firstPlayerIndex, setFirstPlayerIndex] = useState(1);
  const [dealNumberCount, setDealNumberCount] = useState(1);
  const [finalPosition, setFinalPosition] = useState([]);
  const [dealtCards, setDealtCards] = useState([]);
  const [playerData, setPlayerData] = useState("");
  const [tossState, setTossState] = useState(false);
  const [gameStatus, setGameStatus] = useState("introduction");
  // const [socket, setSocket] = useState(null);
  const [screenNo, setScreen] = useState(0);
  const [jokerCard, setJokerCard] = useState(null);
  const [openCard, setOpenCard] = useState(null);
  const [curOpenCard, setCurOpenCard] = useState(null);
  const [inGame, setInGame] = useState([]);
  const [activePlayer, setActivePlayer] = useState({});
  const [closeCard, setCloseCard] = useState({});
  const [winner, setWinner] = useState({});
  const [eliminate, setEliminate] = useState({});
  const [pickCard, setPickCard] = useState({});
  const [probability, setProbability] = useState({});
  const [bestSeq, setBestSeq] = useState({});
  let [allPlayer, setAllPlayer] = useState([]);
  const [dealProb, setDealProb] = useState(false);
  const [aceJoker, setAceJoker] = useState(false);
  const [isOpenPick, setIsOpenPick] = useState(false);
  const [dealPlayerCount, setDealPlayerCount] = useState(0);
  const [dealCardCount, setDealCardCount] = useState(0);
  const [isSeq1, setIsSeq1] = useState(-1);
  const [isSeq2, setIsSeq2] = useState(-1);
  const [isSeq3, setIsSeq3] = useState(-1);
  const [isSeq4, setIsSeq4] = useState(-1);
  const [isSeq5, setIsSeq5] = useState(-1);
  const [isSeq6, setIsSeq6] = useState(-1);
  const [isOpenDrop, setIsOpenDrop] = useState(false);
  const [activePlayerScreen, setActivePlayerScreen] = useState(null);
  const [scoreCount, setScoreCount] = useState(false);
  const [playerArrangement, setPlayerArrangement] = useState(false);
  const socket = useContext(SocketContext);
  // const dispatch = useDispatch();
  // const {singlePlayerData, screenNumber} = useSelector((state) => state.screenType);

  // const dispatch = useDispatch();
  // const {singlePlayerData, screenNumber} = useSelector((state) => state.screenType);

  // function is called when cards are distributed during dealing cards, called by socket
  let dealCardsCallBack = useCallback((results) => {
    console.log("res", results);
    if (results) {
      let localDealPlayerCount = localStorage.getItem("dealPlayerCount");
      let localDealCardCount = localStorage.getItem("dealCardCount");
      console.log("localDealPlayerCount", localDealPlayerCount);
      if (
        localDealPlayerCount !== undefined &&
        localDealPlayerCount !== null &&
        localDealPlayerCount !== NaN
      ) {
        localDealPlayerCount = parseInt(localDealPlayerCount);
        // let totalPlayers = 0;
        // finalPosition.forEach((val) => {

        // });
        if (localDealPlayerCount === 6) {
          localDealCardCount = parseInt(localDealCardCount);
          localDealCardCount++;
          localStorage.setItem("dealCardCount", localDealCardCount);
          localDealPlayerCount = 1;
          // console.log('in');
        } else {
          localDealPlayerCount = localDealPlayerCount + 1;
          // console.log('out');
        }
        localStorage.setItem("dealPlayerCount", localDealPlayerCount);
      } else {
        localStorage.setItem("dealPlayerCount", 1);
        localStorage.setItem("dealCardCount", 1);
      }

      let fp = JSON.parse(localStorage.getItem("finalPosition"));

      let playersDetail = fp.map((value) => {
        // Find the corresponding player data in results.data
        let resultData = results.allDeals.find(
          (data) => data.playerId._id === value.playerId._id
        );

        if (resultData) {
          return {
            playerId: value.playerId,
            name: value.playerId.name,
            cards: resultData.playerCards.map((pval, pin) => {
              let picked = Cards.find((o) => o.cardUuid == pval.cardId);
              return picked.imageURI;
            }),
            photo: value.playerId.shortphoto,
          };
        } else {
          return {
            playerId: value.playerId,
            name: value.playerId.name,
            cards: [],
            photo: value.playerId.shortphoto,
          };
        }
      });

      setDealtCards(playersDetail);
      console.log("playersDetail", playersDetail);
      localStorage.setItem("dealtcards", JSON.stringify(playersDetail));
    }
  }, []);

  // used to set playerStatus , callback function
  let setPlayerStatus = useCallback((data) => {
    if (data !== undefined) {
      // if(data.playerStatus === 'Winner'){
      //   setTimeout(() => {
      //     localStorage.setItem('screenNo', 9);
      //     setScreen(9);
      //     setTimeout(() => {
      //       localStorage.setItem('screenNo', 10);
      //       setScreen(10);
      //     }, 15000);
      //   }, 15000);
      // }
      // else
      if (data.playerStatus === "Declared") {
        localStorage.setItem("isDeclared", 1);
        localStorage.setItem("screenNo", 12);
        setScreen(12);
        setTimeout(() => {
          let activePlayerIndex = localStorage.getItem("activePlayerIndex");
          localStorage.setItem("screenNo", activePlayerIndex);
          setScreen(activePlayerIndex);
        }, 3000);
      } else if (data.playerStatus === "Dropped") {
        localStorage.setItem("isDeclared", 0);
      }
    }
  }, []);

  // called when new deal is created , deletes previous data from localstorage
  let setCreateDealCallBack = useCallback((data) => {
    console.log("new deal", data);
    localStorage.setItem("dealNumberCount", data.dealResult.dealNumber);
    setDealNumberCount(data.dealResult.dealNumber);
    localStorage.removeItem("ActivePlayer");
    localStorage.removeItem("activePlayerIndex");
    localStorage.removeItem("bestSeq");
    localStorage.removeItem("aceJoker");
    localStorage.removeItem("curOpenCard");
    localStorage.removeItem("dealCardCount");
    localStorage.removeItem("dealPlayerCount");
    localStorage.removeItem("dealtcards");
    // localStorage.removeItem("gameStatus");
    localStorage.removeItem("InGame");
    localStorage.removeItem("isCloseCard");
    localStorage.removeItem("isOpenCard");
    localStorage.removeItem("isOpenPick");
    localStorage.removeItem("isPick");
    localStorage.removeItem("isSeq1");
    localStorage.removeItem("isSeq2");
    localStorage.removeItem("isSeq3");
    localStorage.removeItem("isSeq4");
    localStorage.removeItem("isSeq5");
    localStorage.removeItem("isSeq6");
    localStorage.removeItem("jokerCard");
    localStorage.removeItem("jokerNumber");
    localStorage.removeItem("openCard");
    localStorage.removeItem("playerData");
    localStorage.removeItem("probability");
    localStorage.removeItem("screenNo");
    localStorage.removeItem("setDealProb");
    localStorage.removeItem("winnerStatus");
    // let lindex = parseInt(data.index);
    // if(lindex === 6){
    //   lindex = 1;
    // }
    // else{
    //   lindex = lindex + 1;
    // }
    // console.log("lindex", lindex);
    localStorage.removeItem("activePlayerIndex");
    // let localAllPlayers = JSON.parse(localStorage.getItem("AllPlayers"));
    // console.log("localAllPlayers 1", localAllPlayers)
    // if(localAllPlayers !== undefined && localAllPlayers !== null){
    //     const firstItem = localAllPlayers.shift(); // Remove the first item
    //     console.log("firstItem", firstItem);
    //     // localAllPlayers.reverse();
    //     localAllPlayers.push(firstItem);
    //     setAllPlayer(localAllPlayers);
    //     localStorage.setItem("AllPlayers", JSON.stringify(localAllPlayers))
    //     // console.log("localAllPlayers 2", localAllPlayers)
    // }
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }, []);

  // to check if the card is a joker card (used to show joker image on card)
  function isJokerCard(cardId) {
    let jokerNumber = localStorage.getItem("jokerNumber");
    let jokerCard = Cards.find((o) => o.cardUuid == jokerNumber);

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

    if (jokerCard.Type !== "Joker") {
      // console.log("jokerNumber out", ogCard.Value , jokerCard.Value);
      if (ogCard.Value === jokerCard.Value) {
        // console.log("jokerNumber", ogCard.Value , jokerCard.Value);
        // console.log("in");
        return true;
      } else {
        // console.log("out");
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

  let socketCallBack = useCallback(() => {
    console.log("Im running");
    if (socket !== null && socket !== undefined) {
      if (socket.active) {
        socket.on("screenType", (data) => {
          if (data.screenNumber === 26) {
            console.log("player 6 eliminated");
          }
          // setAllPlayer(updatedAllPlayers);
          // localStorage.setItem("AllPlayers", JSON.stringify(updatedAllPlayers));
          // dispatch(savePlayerData(data.playerData));
          // dispatch(setScreenNo(data.screenNumber));
          console.log("data", data);
          if (data.probability !== false) {
            setDealProb(data.probability);
            localStorage.setItem("setDealProb", data.probability);
          } else if (data.scorecount === true) {
            setScoreCount(data.scorecount);
            localStorage.setItem("scoreCount", data.scorecount);
          } else if (data.playerarrangement === true) {
            //   setInitialPosition(updatedAllPlayers);
            // localStorage.setItem("InitialPosition", JSON.stringify(updatedAllPlayers));
            console.log("data.playerarrangement", data.playerarrangement);
            setPlayerArrangement(data.playerarrangement);
            localStorage.setItem("playerArrangement", data.playerarrangement);
            setScreen(data.screenNumber);
          } else {
            setDealProb(false);
            localStorage.setItem("setDealProb", false);
            setPlayerData(data.playerData);
            localStorage.setItem("playerData", JSON.stringify(data.playerData));
            // console.log(data,'screen');

            if (data.screenNumber !== undefined) {
              // console.log(data.screenNumber,'screen2');
              setScreen(data.screenNumber);
              localStorage.setItem("screenNo", data.screenNumber);

              // setActivePlayerScreen(data.screenNumber);
              // localStorage.setItem("activePlayerScreen", data.screenNumber);

              let localInGame = JSON.parse(localStorage.getItem("InGame"));
              // console.log("screen data",localInGame);
              if (localInGame !== null && localInGame !== undefined) {
                let newInGame = localInGame.map((val, index) => {
                  if (val.playerStatus !== "Eliminated") {
                    let seq1 = val.cardSequence1.cards.map((pval, pin) => {
                      let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                      let isJoker = isJokerCard(pval.cardId);
                      // console.log("isJoker1", isJoker);
                      if (isJoker) {
                        return { img: picked.imageURI2, cardId: pval.cardId };
                      } else {
                        return { img: picked.imageURI, cardId: pval.cardId };
                      }
                    });
                    // let popped = seq1.pop();
                    let seq2 = val.cardSequence2.cards.map((pval, pin) => {
                      let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                      let isJoker = isJokerCard(pval.cardId);
                      // console.log("isJoker2", isJoker);
                      if (isJoker) {
                        return { img: picked.imageURI2, cardId: pval.cardId };
                      } else {
                        return { img: picked.imageURI, cardId: pval.cardId };
                      }
                    });

                    let seq3 = val.cardSequence3.cards.map((pval, pin) => {
                      let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                      let isJoker = isJokerCard(pval.cardId);
                      // console.log("isJoker3", isJoker);
                      if (isJoker) {
                        return { img: picked.imageURI2, cardId: pval.cardId };
                      } else {
                        return { img: picked.imageURI, cardId: pval.cardId };
                      }
                    });

                    let seq4 = val.cardSequence4.cards.map((pval, pin) => {
                      let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                      let isJoker = isJokerCard(pval.cardId);
                      if (isJoker) {
                        return { img: picked.imageURI2, cardId: pval.cardId };
                      } else {
                        return { img: picked.imageURI, cardId: pval.cardId };
                      }
                    });

                    let seq5 = val.cardSequence5.cards.map((pval, pin) => {
                      let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                      let isJoker = isJokerCard(pval.cardId);
                      if (isJoker) {
                        return { img: picked.imageURI2, cardId: pval.cardId };
                      } else {
                        return { img: picked.imageURI, cardId: pval.cardId };
                      }
                    });

                    let seq6 = val.cardSequence6.cards.map((pval, pin) => {
                      let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                      let isJoker = isJokerCard(pval.cardId);
                      if (isJoker) {
                        return { img: picked.imageURI2, cardId: pval.cardId };
                      } else {
                        return { img: picked.imageURI, cardId: pval.cardId };
                      }
                    });

                    let bseq1 = val.bestSequence1.cards.map((pval, pin) => {
                      let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                      let isJoker = isJokerCard(pval.cardId);
                      // console.log("isJoker1", isJoker);
                      if (isJoker) {
                        return { img: picked.imageURI2, cardId: pval.cardId };
                      } else {
                        return { img: picked.imageURI, cardId: pval.cardId };
                      }
                    });
                    // let popped = bseq1.pop();
                    let bseq2 = val.bestSequence2.cards.map((pval, pin) => {
                      let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                      let isJoker = isJokerCard(pval.cardId);
                      // console.log("isJoker2", isJoker);
                      if (isJoker) {
                        return { img: picked.imageURI2, cardId: pval.cardId };
                      } else {
                        return { img: picked.imageURI, cardId: pval.cardId };
                      }
                    });

                    let bseq3 = val.bestSequence3.cards.map((pval, pin) => {
                      let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                      let isJoker = isJokerCard(pval.cardId);
                      // console.log("isJoker3", isJoker);
                      if (isJoker) {
                        return { img: picked.imageURI2, cardId: pval.cardId };
                      } else {
                        return { img: picked.imageURI, cardId: pval.cardId };
                      }
                    });

                    let bseq4 = val.bestSequence4.cards.map((pval, pin) => {
                      let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                      let isJoker = isJokerCard(pval.cardId);
                      if (isJoker) {
                        return { img: picked.imageURI2, cardId: pval.cardId };
                      } else {
                        return { img: picked.imageURI, cardId: pval.cardId };
                      }
                    });

                    let bseq5 = val.bestSequence5.cards.map((pval, pin) => {
                      let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                      let isJoker = isJokerCard(pval.cardId);
                      if (isJoker) {
                        return { img: picked.imageURI2, cardId: pval.cardId };
                      } else {
                        return { img: picked.imageURI, cardId: pval.cardId };
                      }
                    });

                    let bseq6 = val.bestSequence6.cards.map((pval, pin) => {
                      let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                      let isJoker = isJokerCard(pval.cardId);
                      if (isJoker) {
                        return { img: picked.imageURI2, cardId: pval.cardId };
                      } else {
                        return { img: picked.imageURI, cardId: pval.cardId };
                      }
                    });

                    // if(seq2.length === 0){
                    //   seq1.push(popped);
                    // }
                    // else if(seq3.length === 0){
                    //   seq2.push(popped);
                    // }
                    // else if(seq4.length === 0){
                    //   seq3.push(popped);
                    // }
                    // else{
                    //   seq4.push(popped);
                    // }

                    let newSeq = [
                      ...seq1,
                      ...seq2,
                      ...seq3,
                      ...seq4,
                      ...seq5,
                      ...seq6,
                    ];

                    let newBSeq = [
                      ...bseq1,
                      ...bseq2,
                      ...bseq3,
                      ...bseq4,
                      ...bseq5,
                      ...bseq6,
                    ];

                    let bestSeq1, bestSeq2, bestSeq3, bestSeq4, bestSeq5, bestSeq6;
                    let isbestSeq1,
                      isbestSeq2,
                      isbestSeq3,
                      isbestSeq4,
                      isbestSeq5,
                      isbestSeq6;
                    let bestPoints = 0;
                    if (val.bestSequence1.cards !== undefined) {
                      bestSeq1 = [...val.bestSequence1.cards];
                      isbestSeq1 = val.bestSequence1.groupType;
                    }

                    if (val.bestSequence2.cards !== undefined) {
                      bestSeq2 = [...val.bestSequence2.cards];
                      isbestSeq2 = val.bestSequence2.groupType;
                    }

                    if (val.bestSequence3.cards !== undefined) {
                      bestSeq3 = [...val.bestSequence3.cards];
                      isbestSeq3 = val.bestSequence3.groupType;
                    }

                    if (val.bestSequence4.cards !== undefined) {
                      bestSeq4 = [...val.bestSequence4.cards];
                      isbestSeq4 = val.bestSequence4.groupType;
                    }

                    if (val.bestSequence5.cards !== undefined) {
                      bestSeq5 = [...val.bestSequence5.cards];
                      isbestSeq5  = val.bestSequence5.groupType;
                    }

                    if (val.bestSequence6.cards !== undefined) {
                      bestSeq6 = [...val.bestSequence6.cards];
                      isbestSeq6 = val.bestSequence6.groupType;
                    }
                    let newBestSeq = [];
                    let newBestSeq1 = [];
                    let newBestSeq2 = [];
                    let newBestSeq3 = [];
                    let newBestSeq4 = [];
                    let newBestSeq5 = [];
                    let newBestSeq6 = [];
                    if (bestSeq1 !== undefined) {
                      newBestSeq.push(...bestSeq1);
                      newBestSeq1 = bestSeq1.map((val, index) => {
                        let picked = Cards.find(
                          (o) => o.cardUuid == val.cardId
                        );
                        let isJoker = isJokerCard(val.cardId);
                        if (isJoker) {
                          return picked.imageURI2;
                        } else {
                          return picked.imageURI;
                        }
                      });
                    }
                    if (bestSeq2 !== undefined) {
                      newBestSeq.push(...bestSeq2);
                      newBestSeq2 = bestSeq2.map((val, index) => {
                        let picked = Cards.find(
                          (o) => o.cardUuid == val.cardId
                        );
                        let isJoker = isJokerCard(val.cardId);
                        if (isJoker) {
                          return picked.imageURI2;
                        } else {
                          return picked.imageURI;
                        }
                      });
                    }
                    if (bestSeq3 !== undefined) {
                      newBestSeq.push(...bestSeq3);
                      newBestSeq3 = bestSeq3.map((val, index) => {
                        let picked = Cards.find(
                          (o) => o.cardUuid == val.cardId
                        );
                        let isJoker = isJokerCard(val.cardId);
                        if (isJoker) {
                          return picked.imageURI2;
                        } else {
                          return picked.imageURI;
                        }
                      });
                    }
                    if (bestSeq4 !== undefined) {
                      newBestSeq.push(...bestSeq4);
                      newBestSeq4 = bestSeq4.map((val, index) => {
                        let picked = Cards.find(
                          (o) => o.cardUuid == val.cardId
                        );
                        let isJoker = isJokerCard(val.cardId);
                        if (isJoker) {
                          return picked.imageURI2;
                        } else {
                          return picked.imageURI;
                        }
                      });
                    }
                    if (bestSeq5 !== undefined) {
                      newBestSeq.push(...bestSeq5);
                      newBestSeq5 = bestSeq5.map((val, index) => {
                        let picked = Cards.find(
                          (o) => o.cardUuid == val.cardId
                        );
                        let isJoker = isJokerCard(val.cardId);
                        if (isJoker) {
                          return picked.imageURI2;
                        } else {
                          return picked.imageURI;
                        }
                      });
                    }

                    if (bestSeq6 !== undefined) {
                      newBestSeq.push(...bestSeq6);
                      newBestSeq6 = bestSeq6.map((val, index) => {
                        let picked = Cards.find(
                          (o) => o.cardUuid == val.cardId
                        );
                        let isJoker = isJokerCard(val.cardId);
                        if (isJoker) {
                          return picked.imageURI2;
                        } else {
                          return picked.imageURI;
                        }
                      });
                    }

                    // newBestSeq = bestSeq1 !== undefined || bestSeq2 !== undefined || bestSeq3 !== undefined || bestSeq4!== undefined ? [...bestSeq1, ...bestSeq2, ...bestSeq3, ...bestSeq4] : []
                    let newBestCards = newBestSeq.map((val, index) => {
                      let picked = Cards.find((o) => o.cardUuid == val.cardId);
                      return picked.imageURI;
                    });

                    if (index == data.screenNumber - 1) {
                      // // console.log("new seq scree", newSeq);
                      // setBestSeq(newCards)
                      // localStorage.setItem("bestSeq", JSON.stringify(newCards));

                      setActivePlayer({
                        ...val.playerId,
                        totalPoints: val.totalPoints,
                        bestPoints: val.bestPoints,
                        playerStatus: val.playerStatus,
                        seq1,
                        seq2,
                        seq3,
                        seq4,
                        seq5,
                        seq6,
                        newSeq,
                        bseq1,
                        bseq2,
                        bseq3,
                        bseq4,
                        bseq5,
                        bseq6,
                        newBSeq,
                        bestseq: newBestCards,
                        newBestSeq1,
                        newBestSeq2,
                        newBestSeq3,
                        newBestSeq4,
                        newBestSeq5,
                        newBestSeq6,
                        isbestSeq1,
                        isbestSeq2,
                        isbestSeq3,
                        isbestSeq4,
                        isbestSeq5, 
                        isbestSeq6,
                      });
                      localStorage.setItem(
                        "ActivePlayer",
                        JSON.stringify({
                          ...val.playerId,
                          totalPoints: val.totalPoints,
                          bestPoints: val.bestPoints,
                          playerStatus: val.playerStatus,
                          seq1,
                          seq2,
                          seq3,
                          seq4,
                          seq5,
                          seq6,
                          newSeq,
                          bseq1,
                          bseq2,
                          bseq3,
                          bseq4,
                          bseq5,
                          bseq6,
                          newBSeq,
                          bestseq: newBestCards,
                          newBestSeq1,
                          newBestSeq2,
                          newBestSeq3,
                          newBestSeq4,
                          newBestSeq1,
                          newBestSeq2,
                          newBestSeq3,
                          newBestSeq4,
                          newBestSeq5,
                          newBestSeq6,
                          isbestSeq1,
                          isbestSeq2,
                          isbestSeq3,
                          isbestSeq4,
                          isbestSeq5,
                          isbestSeq6,
                        })
                      );
                      return {
                        ...val,
                        isActive: 1,
                      };
                    } else {
                      return { ...val, isActive: 0 };
                    }
                  } else {
                    return { ...val, isActive: 0 };
                  }
                });

                console.log("new", newInGame);
                localStorage.setItem("InGame", JSON.stringify(newInGame));
                setInGame(newInGame);
              }
            }
          }

          if (data.screenNumber === 0 && gameStatus === "introduction") {
            window.location.reload();
          }
        });
        socket.on("Tosscard", (data) => {
          setTossState(false);
          // console.log(data.tossCard, "card-vals");
          let TossCard;
          if (data.tossCard === 0) {
            TossCard = {
              imageURI: 0,
            };
          } else {
            Cards.map((value) => {
              if (parseInt(value.cardUuid) == data.tossCard) {
                TossCard = {
                  imageURI: value.imageURI,
                };
              }
            });
          }

          let players = localStorage.getItem("AllPlayers");
          let allplayers = JSON.parse(players);
          let updatedAllPlayers = allplayers.map((val) => {
            if (val._id == data._id) {
              return {
                ...val,
                tossCard: TossCard.imageURI,
              };
            } else {
              return {
                ...val,
              };
            }
          });

          setAllPlayer(updatedAllPlayers);
          localStorage.setItem("AllPlayers", JSON.stringify(updatedAllPlayers));
          setTossState(true);
        });
        socket.on("playerPosition", (data) => {
          localStorage.setItem("finalPosition", JSON.stringify(data.finalRes));
          localStorage.setItem("winnerStatus", true);
          setFinalPosition(data.finalRes);

          console.log("finalres", data.finalRes);
        });
        socket.on("setProbability", (data) => {
          if (data !== undefined) {
            setProbability(data.InGameRes);
            localStorage.setItem("probability", JSON.stringify(data.InGameRes));
          }
        });

        socket.on("setBestSeq", (data) => {
          console.log("best", data);
          if (data !== undefined) {
            let oldInGame = JSON.parse(localStorage.getItem("InGame"));
            let ActivePlayer = JSON.parse(localStorage.getItem("ActivePlayer"));
            let bestSeq1, bestSeq2, bestSeq3, bestSeq4, bestSeq5, bestSeq6;
            let isbestSeq1, isbestSeq2, isbestSeq3, isbestSeq4, isbestSeq5, isbestSeq6;
            let scrNo = localStorage.getItem("screenNo");
            let bestPoints = 0;
            if (oldInGame !== null && oldInGame !== undefined) {
              let newInGame = oldInGame.map((val, index) => {
                if (val.playerStatus !== "Eliminated") {
                  if (val._id === data.InGameRes._id) {
                    if (scrNo >= 1 && scrNo <= 6) {
                      if (data.InGameRes.bestSequence1.cards !== undefined) {
                        bestSeq1 = [...data.InGameRes.bestSequence1.cards];
                        setIsSeq1(data.InGameRes.bestSequence1.groupType);
                        localStorage.setItem(
                          "isSeq1",
                          data.InGameRes.bestSequence1.groupType
                        );
                        isbestSeq1 = data.InGameRes.bestSequence1.groupType;
                      }

                      if (data.InGameRes.bestSequence2.cards !== undefined) {
                        bestSeq2 = [...data.InGameRes.bestSequence2.cards];
                        setIsSeq2(data.InGameRes.bestSequence2.groupType);
                        localStorage.setItem(
                          "isSeq2",
                          data.InGameRes.bestSequence2.groupType
                        );
                        isbestSeq2 = data.InGameRes.bestSequence2.groupType;
                      }

                      if (data.InGameRes.bestSequence3.cards !== undefined) {
                        bestSeq3 = [...data.InGameRes.bestSequence3.cards];
                        setIsSeq3(data.InGameRes.bestSequence3.groupType);
                        localStorage.setItem(
                          "isSeq3",
                          data.InGameRes.bestSequence3.groupType
                        );
                        isbestSeq3 = data.InGameRes.bestSequence3.groupType;
                      }

                      if (data.InGameRes.bestSequence4.cards !== undefined) {
                        bestSeq4 = [...data.InGameRes.bestSequence4.cards];
                        setIsSeq4(data.InGameRes.bestSequence4.groupType);
                        localStorage.setItem(
                          "isSeq4",
                          data.InGameRes.bestSequence4.groupType
                        );
                        isbestSeq4 = data.InGameRes.bestSequence4.groupType;
                      }

                      if (data.InGameRes.bestSequence5.cards !== undefined) {
                        bestSeq5 = [...data.InGameRes.bestSequence5.cards];
                        setIsSeq5(data.InGameRes.bestSequence5.groupType);
                        localStorage.setItem(
                          "isSeq5",
                          data.InGameRes.bestSequence5.groupType
                        );
                        isbestSeq5 = data.InGameRes.bestSequence5.groupType;
                      }

                      if (data.InGameRes.bestSequence6.cards !== undefined) {
                        bestSeq6 = [...data.InGameRes.bestSequence6.cards];
                        setIsSeq6(data.InGameRes.bestSequence6.groupType);
                        localStorage.setItem(
                          "isSeq6",
                          data.InGameRes.bestSequence6.groupType
                        );
                        isbestSeq6 = data.InGameRes.bestSequence6.groupType;
                      }
                      let newBestSeq = [];
                      let newBestSeq1 = [];
                      let newBestSeq2 = [];
                      let newBestSeq3 = [];
                      let newBestSeq4 = [];
                      let newBestSeq5 = [];
                      let newBestSeq6 = [];
                      if (bestSeq1 !== undefined) {
                        newBestSeq.push(...bestSeq1);
                        newBestSeq1 = bestSeq1.map((val, index) => {
                          let picked = Cards.find(
                            (o) => o.cardUuid == val.cardId
                          );
                          let isJoker = isJokerCard(val.cardId);
                          if (isJoker) {
                            return picked.imageURI2;
                          } else {
                            return picked.imageURI;
                          }
                        });
                      }
                      if (bestSeq2 !== undefined) {
                        newBestSeq.push(...bestSeq2);
                        newBestSeq2 = bestSeq2.map((val, index) => {
                          let picked = Cards.find(
                            (o) => o.cardUuid == val.cardId
                          );
                          let isJoker = isJokerCard(val.cardId);
                          if (isJoker) {
                            return picked.imageURI2;
                          } else {
                            return picked.imageURI;
                          }
                        });
                      }
                      if (bestSeq3 !== undefined) {
                        newBestSeq.push(...bestSeq3);
                        newBestSeq3 = bestSeq3.map((val, index) => {
                          let picked = Cards.find(
                            (o) => o.cardUuid == val.cardId
                          );
                          let isJoker = isJokerCard(val.cardId);
                          if (isJoker) {
                            return picked.imageURI2;
                          } else {
                            return picked.imageURI;
                          }
                        });
                      }
                      if (bestSeq4 !== undefined) {
                        newBestSeq.push(...bestSeq4);
                        newBestSeq4 = bestSeq4.map((val, index) => {
                          let picked = Cards.find(
                            (o) => o.cardUuid == val.cardId
                          );
                          let isJoker = isJokerCard(val.cardId);
                          if (isJoker) {
                            return picked.imageURI2;
                          } else {
                            return picked.imageURI;
                          }
                        });
                      }
                      if (bestSeq5 !== undefined) {
                        newBestSeq.push(...bestSeq5);
                        newBestSeq5 = bestSeq5.map((val, index) => {
                          let picked = Cards.find(
                            (o) => o.cardUuid == val.cardId
                          );
                          let isJoker = isJokerCard(val.cardId);
                          if (isJoker) {
                            return picked.imageURI2;
                          } else {
                            return picked.imageURI;
                          }
                        });
                      }
                      if (bestSeq6 !== undefined) {
                        newBestSeq.push(...bestSeq6);
                        newBestSeq6 = bestSeq6.map((val, index) => {
                          let picked = Cards.find(
                            (o) => o.cardUuid == val.cardId
                          );
                          let isJoker = isJokerCard(val.cardId);
                          if (isJoker) {
                            return picked.imageURI2;
                          } else {
                            return picked.imageURI;
                          }
                        });
                      }
                      // newBestSeq = bestSeq1 !== undefined || bestSeq2 !== undefined || bestSeq3 !== undefined || bestSeq4!== undefined ? [...bestSeq1, ...bestSeq2, ...bestSeq3, ...bestSeq4] : []
                      let newBestCards = newBestSeq.map((val, index) => {
                        let picked = Cards.find(
                          (o) => o.cardUuid == val.cardId
                        );
                        let isJoker = isJokerCard(val.cardId);
                        if (isJoker) {
                          return picked.imageURI2;
                        } else {
                          return picked.imageURI;
                        }
                      });

                      setActivePlayer({
                        ...ActivePlayer,
                        bestPoints: data.InGameRes.bestPoints,
                        bestseq: newBestCards,
                        newBestSeq1,
                        newBestSeq2,
                        newBestSeq3,
                        newBestSeq4,
                        newBestSeq5,
                        newBestSeq6,
                        isbestSeq1,
                        isbestSeq2,
                        isbestSeq3,
                        isbestSeq4,
                        isbestSeq5,
                        isbestSeq6,
                      });
                      localStorage.setItem(
                        "ActivePlayer",
                        JSON.stringify({
                          ...ActivePlayer,
                          bestPoints: data.InGameRes.bestPoints,
                          bestseq: newBestCards,
                          newBestSeq1,
                          newBestSeq2,
                          newBestSeq3,
                          newBestSeq4,
                          newBestSeq5,
                          newBestSeq6,
                          isbestSeq1,
                          isbestSeq2,
                          isbestSeq3,
                          isbestSeq4,
                          isbestSeq5,
                          isbestSeq6,
                        })
                      );
                    }
                    return {
                      ...data.InGameRes,
                      bestPoints: data.InGameRes.bestPoints,
                    };
                  } else {
                    return { ...val };
                  }
                } else {
                  return { ...val };
                }
              });
              // console.log("new best:", newInGame);
              setInGame(newInGame);
              localStorage.setItem("InGame", JSON.stringify(newInGame));
            }
          }
        });

        socket.on("showOpenCard", (datas) => {
          let data = datas.updateDealOpenCard;
          if (data.openCard !== undefined && data.openCard.length > 0) {
            if (datas.status === "pick") {
              setIsOpenPick(true);
              localStorage.setItem("isOpenPick", true);
              // setTimeout(()=>{
              //   setIsOpenPick(false);
              //   localStorage.setItem("isOpenPick", false);
              // }, 1000);
            } else if (datas.status === "drop") {
              setIsOpenPick(false);
              localStorage.setItem("isOpenPick", false);
              let LocalScreen = localStorage.getItem("screenNo");
              let LocalActivePlayer = localStorage.getItem("ActivePlayer");
              // console.log("out open card drop", LocalScreen);
              if (LocalScreen >= 1 && LocalScreen <= 6) {
                // console.log("in open card drop", LocalScreen);
              }
            } else {
              setIsOpenDrop(false);
              localStorage.setItem("isOpenDrop", false);
              setIsOpenPick(false);
              localStorage.setItem("isOpenPick", false);
            }

            //   setTimeout(()=>{
            let picked = Cards.find(
              (o) =>
                o.cardUuid == data.openCard[data.openCard.length - 1].cardId
            );
            // setTimeout(() => {

            // }, 2000);
            setOpenCard(picked.imageURI);
            // setScreen(2);
            localStorage.setItem("openCard", picked.imageURI);
            setCurOpenCard(picked.imageURI);
            // setScreen(2);
            localStorage.setItem("curOpenCard", picked.imageURI);

            //   }, 1000);
          } else {
            localStorage.removeItem("openCard");
          }
        });

        // setInGame(oldInGame);

        socket.on("TableId", (data) => {
          // console.log(data);
          localStorage.setItem("tableId", JSON.stringify(data.tableId));
          setTableId(data.tableId);
          localStorage.setItem("gameStatus", JSON.stringify(data.gameStatus));
          localStorage.setItem("dealNumberCount", 1);
          setDealNumberCount(1);
          // window.location.reload();
        });

        socket.on("setScreenNo", (data) => {
          // console.log(data, "emited screen");
        });

        socket.on("StatusChanged", (data) => {
          if (data.gameStatus === "Deal1") {
            // localStorage.setItem("screenNo", 11);
            let newInGame = data.InGameRes.map((val, index) => {
              if (val.playerStatus !== "Eliminated") {
                let seq1 = val.cardSequence1.cards.map((pval, pin) => {
                  let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                  let isJoker = isJokerCard(pval.cardId);
                  if (isJoker) {
                    return { img: picked.imageURI2, cardId: pval.cardId };
                  } else {
                    return { img: picked.imageURI, cardId: pval.cardId };
                  } 
                }) || [];

                let seq2 = val.cardSequence2.cards.map((pval, pin) => {
                  let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                  let isJoker = isJokerCard(pval.cardId);
                  if (isJoker) {
                    return { img: picked.imageURI2, cardId: pval.cardId };
                  } else {
                    return { img: picked.imageURI, cardId: pval.cardId };
                  }
                }) || [];

                let seq3 = val.cardSequence3.cards.map((pval, pin) => {
                  let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                  let isJoker = isJokerCard(pval.cardId);
                  if (isJoker) {
                    return { img: picked.imageURI2, cardId: pval.cardId };
                  } else {
                    return { img: picked.imageURI, cardId: pval.cardId };
                  }
                }) || [];

                let seq4 = val.cardSequence4.cards.map((pval, pin) => {
                  let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                  let isJoker = isJokerCard(pval.cardId);
                  if (isJoker) {
                    return { img: picked.imageURI2, cardId: pval.cardId };
                  } else {
                    return { img: picked.imageURI, cardId: pval.cardId };
                  }
                }) || [];

                let seq5 = val.cardSequence5.cards.map((pval, pin) => {
                  let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                  let isJoker = isJokerCard(pval.cardId);
                  if (isJoker) {
                    return { img: picked.imageURI2, cardId: pval.cardId };
                  } else {
                    return { img: picked.imageURI, cardId: pval.cardId };
                  }
                }) || [];

                let seq6 = val.cardSequence6.cards.map((pval, pin) => {
                  let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                  let isJoker = isJokerCard(pval.cardId);
                  if (isJoker) {
                    return { img: picked.imageURI2, cardId: pval.cardId };
                  } else {
                    return { img: picked.imageURI, cardId: pval.cardId };
                  }
                }) || [];

                let bseq1 = val.bestSequence1?.cards?.map((pval, pin) => {
                  let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                  let isJoker = isJokerCard(pval.cardId);
                  if (isJoker) {
                    return { img: picked?.imageURI2, cardId: pval.cardId };
                  } else {
                    return { img: picked?.imageURI, cardId: pval.cardId };
                  }
                }) || [];
                
                let bseq2 = val.bestSequence2?.cards?.map((pval, pin) => {
                  let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                  let isJoker = isJokerCard(pval.cardId);
                  if (isJoker) {
                    return { img: picked?.imageURI2, cardId: pval.cardId };
                  } else {
                    return { img: picked?.imageURI, cardId: pval.cardId };
                  }
                }) || [];
                
                let bseq3 = val.bestSequence3?.cards?.map((pval, pin) => {
                  let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                  let isJoker = isJokerCard(pval.cardId);
                  if (isJoker) {
                    return { img: picked?.imageURI2, cardId: pval.cardId };
                  } else {
                    return { img: picked?.imageURI, cardId: pval.cardId };
                  }
                }) || [];
                
                let bseq4 = val.bestSequence4?.cards?.map((pval, pin) => {
                  let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                  let isJoker = isJokerCard(pval.cardId);
                  if (isJoker) {
                    return { img: picked?.imageURI2, cardId: pval.cardId };
                  } else {
                    return { img: picked?.imageURI, cardId: pval.cardId };
                  }
                }) || [];
                
                let bseq5 = val.bestSequence5?.cards?.map((pval, pin) => {
                  let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                  let isJoker = isJokerCard(pval.cardId);
                  if (isJoker) {
                    return { img: picked?.imageURI2, cardId: pval.cardId };
                  } else {
                    return { img: picked?.imageURI, cardId: pval.cardId };
                  }
                }) || [];
                
                  let bseq6 = val.bestSequence6?.cards?.map((pval, pin) => {
                  let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                  let isJoker = isJokerCard(pval.cardId);
                  if (isJoker) {
                    return { img: picked?.imageURI2, cardId: pval.cardId };
                  } else {
                    return { img: picked?.imageURI, cardId: pval.cardId };
                  }
                }) || [];

                let newSeq = [
                  ...seq1,
                  ...seq2,
                  ...seq3,
                  ...seq4,
                  ...seq5,
                  ...seq6,
                ];

                let newBSeq = [
                  ...bseq1,
                  ...bseq2,
                  ...bseq3,
                  ...bseq4,
                  ...bseq5,
                  ...bseq6,
                ];

                if (index == data.currentScreenNo - 1) {
                  let bestSeq1, bestSeq2, bestSeq3, bestSeq4, bestSeq5, bestSeq6;
                  let isbestSeq1,
                    isbestSeq2,
                    isbestSeq3,
                    isbestSeq4,
                    isbestSeq5,
                    isbestSeq6;
                  let bestPoints = 0;
                  if (val.bestSequence1.cards !== undefined) {
                    bestSeq1 = [...val.bestSequence1.cards];
                    setIsSeq1(val.bestSequence1.groupType);
                    localStorage.setItem("isSeq1", val.bestSequence1.groupType);
                    isbestSeq1 = val.bestSequence1.groupType;
                  }

                  if (val.bestSequence2.cards !== undefined) {
                    bestSeq2 = [...val.bestSequence2.cards];
                    setIsSeq2(val.bestSequence2.groupType);
                    localStorage.setItem("isSeq2", val.bestSequence2.groupType);
                    isbestSeq2 = val.bestSequence2.groupType;
                  }

                  if (val.bestSequence3.cards !== undefined) {
                    bestSeq3 = [...val.bestSequence3.cards];
                    setIsSeq3(val.bestSequence3.groupType);
                    localStorage.setItem("isSeq3", val.bestSequence3.groupType);
                    isbestSeq3 = val.bestSequence3.groupType;
                  }

                  if (val.bestSequence4.cards !== undefined) {
                    bestSeq4 = [...val.bestSequence4.cards];
                    setIsSeq4(val.bestSequence4.groupType);
                    localStorage.setItem("isSeq4", val.bestSequence4.groupType);
                    isbestSeq4 = val.bestSequence4.groupType;
                  }

                  if (val.bestSequence5.cards !== undefined) {
                    bestSeq5 = [...val.bestSequence5.cards];
                    setIsSeq5(val.bestSequence5.groupType);
                    localStorage.setItem("isSeq5", val.bestSequence5.groupType);
                    isbestSeq5 = val.bestSequence5.groupType;
                  }
                  if (val.bestSequence6.cards !== undefined) {
                    bestSeq6 = [...val.bestSequence6.cards];
                    setIsSeq6(val.bestSequence6.groupType);
                    localStorage.setItem("isSeq6", val.bestSequence6.groupType);
                    isbestSeq6 = val.bestSequence6.groupType;
                  }
                  let newBestSeq = [];
                  let newBestSeq1 = [];
                  let newBestSeq2 = [];
                  let newBestSeq3 = [];
                  let newBestSeq4 = [];
                  let newBestSeq5 = [];
                  let newBestSeq6 = [];
                  if (bestSeq1 !== undefined) {
                    newBestSeq.push(...bestSeq1);
                    newBestSeq1 = bestSeq1.map((val, index) => {
                      let picked = Cards.find((o) => o.cardUuid == val.cardId);
                      let isJoker = isJokerCard(val.cardId);
                      if (isJoker) {
                        return picked.imageURI2;
                      } else {
                        return picked.imageURI;
                      }
                    });
                  }
                  if (bestSeq2 !== undefined) {
                    newBestSeq.push(...bestSeq2);
                    newBestSeq2 = bestSeq2.map((val, index) => {
                      let picked = Cards.find((o) => o.cardUuid == val.cardId);
                      let isJoker = isJokerCard(val.cardId);
                      if (isJoker) {
                        return picked.imageURI2;
                      } else {
                        return picked.imageURI;
                      }
                    });
                  }
                  if (bestSeq3 !== undefined) {
                    newBestSeq.push(...bestSeq3);
                    newBestSeq3 = bestSeq3.map((val, index) => {
                      let picked = Cards.find((o) => o.cardUuid == val.cardId);
                      let isJoker = isJokerCard(val.cardId);
                      if (isJoker) {
                        return picked.imageURI2;
                      } else {
                        return picked.imageURI;
                      }
                    });
                  }
                  if (bestSeq4 !== undefined) {
                    newBestSeq.push(...bestSeq4);
                    newBestSeq4 = bestSeq4.map((val, index) => {
                      let picked = Cards.find((o) => o.cardUuid == val.cardId);
                      let isJoker = isJokerCard(val.cardId);
                      if (isJoker) {
                        return picked.imageURI2;
                      } else {
                        return picked.imageURI;
                      }
                    });
                  }
                  if (bestSeq5 !== undefined) {
                    newBestSeq.push(...bestSeq5);
                    newBestSeq5 = bestSeq5.map((val, index) => {
                      let picked = Cards.find((o) => o.cardUuid == val.cardId);
                      let isJoker = isJokerCard(val.cardId);
                      if (isJoker) {
                        return picked.imageURI2;
                      } else {
                        return picked.imageURI;
                      }
                    });
                  }
                  if (bestSeq6 !== undefined) {
                    newBestSeq.push(...bestSeq6);
                    newBestSeq6 = bestSeq6.map((val, index) => {
                      let picked = Cards.find((o) => o.cardUuid == val.cardId);
                      let isJoker = isJokerCard(val.cardId);
                      if (isJoker) {
                        return picked.imageURI2;
                      } else {
                        return picked.imageURI;
                      }
                    });
                  }

                  // newBestSeq = bestSeq1 !== undefined || bestSeq2 !== undefined || bestSeq3 !== undefined || bestSeq4!== undefined ? [...bestSeq1, ...bestSeq2, ...bestSeq3, ...bestSeq4] : []
                  let newBestCards = newBestSeq.map((val, index) => {
                    let picked = Cards.find((o) => o.cardUuid == val.cardId);
                    return picked.imageURI;
                  });

                  setActivePlayer({
                    ...val.playerId,
                    totalPoints: val.totalPoints,
                    playerStatus: val.playerStatus,
                    bestPoints: val.bestPoints,
                    seq1,
                    seq2,
                    seq3,
                    seq4,
                    seq5,
                    seq6,
                    newSeq,
                    bseq1,
                    bseq2,
                    bseq3,
                    bseq4,
                    bseq5,
                    bseq6,
                    newBSeq,
                    newBestSeq1,
                    newBestSeq2,
                    newBestSeq3,
                    newBestSeq4,
                    newBestSeq5,
                    newBestSeq6,
                    bestseq: newBestCards,
                    isbestSeq1,
                    isbestSeq2,
                    isbestSeq3,
                    isbestSeq4,
                    isbestSeq5,
                    isbestSeq6
                  });
                  localStorage.setItem(
                    "ActivePlayer",
                    JSON.stringify({
                      ...val.playerId,
                      totalPoints: val.totalPoints,
                      playerStatus: val.playerStatus,
                      bestPoints: val.bestPoints,
                      seq1,
                      seq2,
                      seq3,
                      seq4,
                      seq5,
                      seq6,
                      newSeq,
                      bseq1,
                      bseq2,
                      bseq3,
                      bseq4,
                      bseq5,
                      bseq6,
                      newBSeq,
                      newBestSeq1,
                      newBestSeq2,
                      newBestSeq3,
                      newBestSeq4,
                      newBestSeq5,
                      newBestSeq6,
                      bestseq: newBestCards,
                      isbestSeq1,
                      isbestSeq2,
                      isbestSeq3,
                      isbestSeq4,
                      isbestSeq5,
                      isbestSeq6,
                    })
                  );
                  return { ...val, isActive: 1, bestPoints: val.bestPoints };
                } else {
                  return { ...val, isActive: 0 };
                }
              } else {
                return { ...val, isActive: 0 };
              }
            });
            localStorage.setItem("InGame", JSON.stringify(newInGame));
            setInGame(newInGame);
            setScreen(1);
            localStorage.setItem("screenNo", 1);
          }

          let status = localStorage.getItem("gameStatus");
          if (status) {
            let parsedStatus = JSON.parse(status);
            if (parsedStatus) {
              localStorage.removeItem("gameStatus");
              localStorage.setItem(
                "gameStatus",
                JSON.stringify(data.gameStatus)
              );
              if (data.gameStatus === "Deal1") {
                localStorage.setItem("screenNo", 11);
                setScreen(11);
              } else {
                localStorage.setItem("screenNo", data.currentScreenNo);
              }

              let players = data.AllPlayers.map((value, i) => {
                return {
                  ...value.playerId,
                  tossCard: "",
                };
              });

              localStorage.setItem("AllPlayers", JSON.stringify(players));
              setGameStatus(data.gameStatus);
            } else {
              localStorage.setItem(
                "gameStatus",
                JSON.stringify(data.gameStatus)
              );
              if (data.gameStatus === "Deal1") {
                localStorage.setItem("screenNo", 11);
                setScreen(11);
              } else {
                localStorage.setItem("screenNo", data.currentScreenNo);
              }
              let players = data.AllPlayers.map((value, i) => {
                return {
                  ...value.playerId,
                  tossCard: "",
                };
              });

              localStorage.setItem("AllPlayers", JSON.stringify(players));
              setGameStatus(data.gameStatus);
            }
          } else {
            localStorage.setItem("gameStatus", JSON.stringify(data.gameStatus));
            if (data.currentScreenNo !== undefined) {
              localStorage.setItem(
                "screenNo",
                JSON.stringify(data.currentScreenNo)
              );
            }
            let players = data.AllPlayers.map((value, i) => {
              return {
                ...value.playerId,
                tossCard: "",
              };
            });

            localStorage.setItem("AllPlayers", JSON.stringify(players));
            setGameStatus(data.gameStatus);
          }

          // if (data.gameStatus === "introduction") {
          // window.location.reload();
          // }
        });

        socket.on("setPlayerStatus", setPlayerStatus);
        socket.on("dealcard", dealCardsCallBack);

        socket.on("firstPlayerIndex", (data) => {
          localStorage.setItem("firstPlayerIndex", data);
          localStorage.setItem("activePlayerIndex", data);
          console.log("firstPlayerIndex", data);
          setFirstPlayerIndex(data);
        });

        socket.on("isStart", (data) => {
          console.log("start", data);

          setTimeout(() => {
            if (data.isStart == 0) {
              localStorage.setItem(
                "activePlayerIndex",
                localStorage.getItem("firstPlayerIndex")
              );
            }
          }, 1000);
        });

        socket.on("showJoker", (data) => {
          if (data.jokerCard) {
            if (data.jokerCard == 106 || data.jokerCard == 53) {
              setAceJoker(true);
              localStorage.setItem("aceJoker", true);
            }
            localStorage.setItem("jokerNumber", data.jokerCard);
            let picked = Cards.find((o) => o.cardUuid == data.jokerCard);
            setJokerCard(picked.imageURI);
            setScreen(2);
            localStorage.setItem("jokerCard", picked.imageURI);
          }
        });

        socket.on("redeal", (data) => {
          if (data.redeal) {
            localStorage.setItem("dealCardCount", 0);
            localStorage.removeItem("dealtcards");
            localStorage.removeItem("probability");
            localStorage.removeItem("jokerCard");
            localStorage.removeItem("setDealProb");
            localStorage.removeItem("curOpenCard");
            localStorage.removeItem("isOpenPick");
            localStorage.removeItem("jokerNumber");
            localStorage.removeItem("openCard");
            localStorage.setItem("activePlayerIndex", data.index);
            window.location.reload();
          }
        });

        socket.on("clearLocalStorage", (data) => {
          localStorage.clear();
          window.location.reload();
        });

        socket.on("changeDealingCard", (data) => {
          console.log("deal", data);
          let cards = data.cards.map((pval, pin) => {
            let picked = Cards.find((o) => o.cardUuid == pval.cardId);
            return picked.imageURI;
          });
          let dclocal = JSON.parse(localStorage.getItem("dealtcards"));
          let newDeals = dclocal.map((val, index) => {
            if (val.playerId._id.toString() == data.playerId.toString()) {
              return { ...val, cards };
            } else {
              return { ...val };
            }
          });
          console.log("new deals:", newDeals, data.playerId);
          localStorage.setItem("dealtcards", JSON.stringify(newDeals));
          let dc = JSON.parse(localStorage.getItem("dealtcards"));
          let newdeals = dc.map((dval, dindex) => {
            if (dval.playerId._id.toString() == data.playerId.toString()) {
              console.log(dval.playerId, data.playerId);
              return {
                playerId: dval.playerId,
                name: dval.name,
                cards: cards,
                photo: dval.photo,
              };
            } else {
              return {
                ...dval,
              };
            }
          });
          // console.log(data.playerId, newdeals);
          setDealtCards(newdeals);
        });

        socket.on("createDeal", setCreateDealCallBack);
      } else {
        socket.connect();
      }
    }
    //  else {
    //   setSocket(
    //     io(base_url, {
    //       transports: ["websocket"],
    //       // autoConnect: false
    //     })
    //   );
    // }

    // getStatus()
    return () => {
      if (socket) {
        socket.off("dealcard", dealCardsCallBack);
        socket.off("createDeal", setCreateDealCallBack);
      }
    };
  }, []);
  useEffect(socketCallBack, []);

  useEffect(() => {
    let players = localStorage.getItem("AllPlayers");
    let allplayers = JSON.parse(players);
    setAllPlayer(allplayers);
  }, [tossState]);

  useEffect(() => {
    let status = localStorage.getItem("gameStatus");
    let parsedStatus = JSON.parse(status);
    setGameStatus(parsedStatus);
  }, []);

  useEffect(() => {
    let finalp = localStorage.getItem("finalPosition");
    let final = JSON.parse(finalp);
    if (final) {
      setFinalPosition(final);
    }
  }, []);

  return (
    <div>
      {/* <ReactPlayer
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: "auto",
        }}
        width="100%"
        height="100%"
        ref={playerRef}
        url={VIDEO_PATH}
        controls={false}
      /> */}
      <div className="video-background">
        {/* <iframe className="mainiframe" src={"https://tecogis-working-files.s3.ap-south-1.amazonaws.com/GRC-Placeholder-Video.mp4"} width="100%" height="100%" allow="autoplay" loop="true" frameBorder="0" allowFullScreen></iframe> */}
        {/* <iframe src={BgVideo} width="100%" allow="autoplay" height="100%" frameBorder="0" scrolling="no"></iframe> */}
      </div>
      <ReactCSSTransitionGroup
        transitionName="Fade"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnter={false}
        transitionLeave={false}
      >
        {/* <IntroBanner/> */}
        {/* <PlayerIntroCard
                key={playerData && playerData.name ? playerData.name : ""}
                socket={socket}
                name={playerData && playerData.name ? playerData.name : ""}
                photo={playerData && playerData.photo ? playerData.photo : ""}
                State={
                  playerData && playerData.location ? playerData.location : ""
                }
                gameStatus={gameStatus}
                club="Platinum"
                description={
                  playerData && playerData.introduction
                    ? playerData.introduction
                    : ""
                }
              /> */}
        {/* <TossDeal/>  */}
        {/* <PlayerSittingPositions gameStatus={gameStatus} playerPosition={finalPosition} /> */}
        {/* <PlayersChipsPage/>  */}
        {/* <CardDeal dealtCards={dealtCards} gameStatus={gameStatus} playerPosition={finalPosition} /> */}
        {/* <JokerReveal/> */}
        {/* <Deal gameStatus={gameStatus} playerPosition={finalPosition} inGame={inGame} activePlayer={activePlayer} /> */}
        {/* <HandCardsStrength/> */}
        {/* <Dropped/> */}
        {/* <Declaration/> */}
        {/* <Declare/> */}
        {/* <TopScorer/> */}
        {/* <DealResult/> */}
        {/* <JokerReveal aceJoker={aceJoker} jokerCard={jokerCard} playerPosition={finalPosition} /> */}
        {/* <Deal isOpenPick={isOpenPick} bestSeq={bestSeq} screenNo={screenNo} probability={probability} dealProb={dealProb} closeCard={closeCard} gameStatus={gameStatus} playerPosition={finalPosition} inGame={inGame} activePlayer={activePlayer} /> */}
        {/* <ScoreBoard dealNumberCount={dealNumberCount} inGame={inGame} /> */}
        {gameStatus === "introduction" && (
          <>
            {screenNo === 0 && <IntroBanner />}
            {playerData && playerData.name && (
              // <Link to='/player-intro' state={{socket}}></Link>
              // <Navigate  to={"/player-intro"}/>
              <PlayerIntroCard
                socket={socket}
                name={playerData && playerData.name ? playerData.name : ""}
                photo={playerData && playerData.photo ? playerData.photo : ""}
                State={
                  playerData && playerData.location ? playerData.location : ""
                }
                gameStatus={gameStatus}
                club="Platinum"
                description={
                  playerData && playerData.introduction
                    ? playerData.introduction
                    : ""
                }
              />
            )}
          </>
        )}
        {gameStatus === "TossCard" && (
          <>
            {screenNo == 1 && (
              <TossDeal allPlayer={allPlayer} tossState={tossState} />
            )}
            {screenNo == 2 && (
              <PlayerSittingPositions
                gameStatus={gameStatus}
                playerPosition={finalPosition}
                dealNumberCount={dealNumberCount}
              />
            )}
            {screenNo == 3 && (
              <PlayersChipsPage
                dealNumberCount={dealNumberCount}
                playerPosition={finalPosition}
              />
            )}
          </>
        )}
        {gameStatus === "DealingCards" && (
          <>
            {screenNo == 1 && (
              <CardDeal
                dealtCards={dealtCards}
                gameStatus={gameStatus}
                playerPosition={finalPosition}
                dealNumberCount={dealNumberCount}
              />
            )}
            {screenNo == 2 ? (
              <JokerReveal
                aceJoker={aceJoker}
                jokerCard={jokerCard}
                playerPosition={finalPosition}
                dealNumberCount={dealNumberCount}
              />
            ) : (
              <></>
            )}
          </>
        )}
        {gameStatus === "Deal1" && (
          <>
            {/* {screenNo == 0 && <WinnerBanner />} */}
            {/* {screenNo == 0 && <WinnerOne />} */}
            {/* {screenNo == 0 && <WinnerThree />}
            {screenNo == 0 && <WinnerSix />} */}
            {screenNo == 0 && <BestSeqList inGame={inGame} />}
            {screenNo >= 1 && screenNo <= 6 && (
              <Deal
                firstPlayerIndex={firstPlayerIndex}
                aceJoker={aceJoker}
                isSeq1={isSeq1}
                isSeq2={isSeq2}
                isSeq3={isSeq3}
                isSeq4={isSeq4}
                isSeq5={isSeq5}
                isSeq6={isSeq6}
                isOpenPick={isOpenPick}
                bestSeq={bestSeq}
                screenNo={screenNo}
                probability={probability}
                dealProb={dealProb}
                closeCard={closeCard}
                gameStatus={gameStatus}
                playerPosition={finalPosition}
                inGame={inGame}
                activePlayer={activePlayer}
                dealNumberCount={dealNumberCount}
              />
            )}
            {screenNo == 7 && (
              <HandCardsStrength
                dealNumberCount={dealNumberCount}
                initialPosition={initialPosition}
                inGame={inGame}
                probability={probability}
              />
            )}
            {screenNo == 8 && (
              <DealShow
                dealNumberCount={dealNumberCount}
                inGame={inGame}
                probability={probability}
              />
            )}
            {screenNo == 9 && (
              <TopScorer dealNumberCount={dealNumberCount} winner={winner} />
            )}
            {screenNo == 10 && (
              <DealResult
                dealNumberCount={dealNumberCount}
                playerArrangement={playerArrangement}
                scoreCount={scoreCount}
                inGame={inGame}
              />
            )}

            {screenNo === 21 && (
              <EliminatePlayer
                dealNumberCount={dealNumberCount}
                eliminate={eliminate}
                playerIndex={5}
              />
            )}
            {screenNo === 22 && (
              <EliminatePlayer
                dealNumberCount={dealNumberCount}
                eliminate={eliminate}
                playerIndex={4}
              />
            )}
            {screenNo === 23 && (
              <EliminatePlayer
                dealNumberCount={dealNumberCount}
                eliminate={eliminate}
                playerIndex={3}
              />
            )}
            {screenNo === 24 && (
              <EliminatePlayer
                dealNumberCount={dealNumberCount}
                eliminate={eliminate}
                playerIndex={2}
              />
            )}
            {screenNo === 26 && (
              <EliminatePlayer
                dealNumberCount={dealNumberCount}
                eliminate={eliminate}
                playerIndex={0}
              />
            )}
            {screenNo === 25 && (
              <EliminatePlayer
                dealNumberCount={dealNumberCount}
                eliminate={eliminate}
                playerIndex={1}
              />
            )}

            {screenNo == 11 && (
              <BestSeqList dealNumberCount={dealNumberCount} inGame={inGame} />
            )}
            {screenNo == 12 && (
              <Declaration dealNumberCount={dealNumberCount} />
            )}
            {/* {screenNo == 18 && <AutoWinner dealNumberCount={dealNumberCount} />} */}

            {screenNo == 13 && (
              <ScoreBoard
                tableId={tableId}
                dealNumberCount={dealNumberCount}
                inGame={inGame}
              />
            )}
            {screenNo == 14 && (
              <WinnerBanner dealNumberCount={dealNumberCount} inGame={inGame} />
            )}
            {screenNo == 15 && (
              <WinnerOne dealNumberCount={dealNumberCount} inGame={inGame} />
            )}
            {screenNo == 16 && (
              <WinnerThree dealNumberCount={dealNumberCount} inGame={inGame} />
            )}
            {screenNo == 17 && (
              <WinnerSix dealNumberCount={dealNumberCount} inGame={inGame} />
            )}

            {/* {screenNo == 13 && <DealArrangement playerArrangement={playerArrangement} inGame={inGame} />} */}
          </>
        )}
        {/*  */}
      </ReactCSSTransitionGroup>
    </div>
  );
}

const styles = {
  box: {},
};
export default Main;
