import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
} from "react";
import "./css/Deal.css";
import GRC from "../images/grc_logo_new.png";
import back_card_min from "../images/back_card_min.png";
import open_card_holder from "../images/open_card_holder.png";
import close_deck from "../images/close_deck.png";
import close_deck_back_card from "../images/close_deck_back_card.png";
import joker_min_on_card from "../images/joker-min-on-card.png";
import valid_declaration from "../images/valid_declaration.png";
import levelTopRight from "../images/levelTopRight2.png";
import droppedBanner from "../images/droppedBanner.png";
import samplecard from "../images/sample-card.png";
import dealbgimgnew_declaration from "../images/dealbgimgnew_declaration.png";
import axios from "axios";
import WGB from "../images/wgb.png";
import DIMG from "../images/d.png";
import auto_declare from "../images/auto_declare.png";
import highlightSets from "../images/highlightSets.png";
import highlightCards from "../images/highlightCards.png";
import highlightCardsRed from "../images/highlightCardsRed.png";
import UP from "../images/up.png";
import DOWN from "../images/down.png";
import RPBG from "../images/rightplayerbg.png";
import DCBB from "../images/dealchipblackbg.png";
import STAR from "../images/star.png";
import CHIP from "../images/chip.svg";
import LazyLoad from "react-lazyload";
import FIRST from "../images/first.svg";
import SECOND from "../images/second.svg";
import THIRD from "../images/third.svg";
import DEALBG from "../images/dealbgplayerdetails.png";
import DEALBGIMG from "../images/dealbgimgnew.png";
import prob_rect from "../images/prob_rect.png";
import prob_active from "../images/prob_active.png";
import { Cards } from "../constants";
import PERFECT_SORT_LIST from "../images/perfect_sort_list.png";
import PERFECT_SORT from "../images/perfect_sort.png";
import tsdealbg from "../images/ts-deal-bg.png";
import ts_deal_username from "../images/ts-deal-username.png";
import ts_deal_bg_bg from "../images/ts-deal-bg-bg.png";
import dropped_card from "../images/dropped-card.png";
import { base_url } from "../config";
import { SocketContext } from "../services/socket";
import baseURL from "../baseURL";
import dealShow from "../images/dealShow.png";
import {
  boosters as boosterEndpoint,
  levelNumber as levelNumberEndpoint,
  getTotalPoints,
  getLatestDealNumber,
  getDeals
} from "../server/Api";
let pickSocket;

export default function Deal(props) {
  const socket = useContext(SocketContext);
  const [dealNumberCount, setDealNumberCount] = useState(1);
  const [animateOnce, setAnimateOnce] = useState(true);
  const [animateDropCardOnce, setAnimateDropCardOnce] = useState(true);
  const [imgCount, setImgCount] = useState(1);
  const [isPick, setIsPick] = useState(false);
  const [activePlayerIndex, setActivePlayerIndex] = useState();
  const [playerPosition, setplayerPosition] = useState([]);
  const [inGame, setInGame] = useState({});
  const [activePlayerData, setActivePlayerData] = useState({});
  const [closeCard, setCloseCard] = useState({});
  const [jokerCard, setJokerCard] = useState(null);
  const [openCard, setOpenCard] = useState(null);
  const [curOpenCard, setCurOpenCard] = useState(null);
  const [dealProb, setDealProb] = useState(false);
  const [probability, setProbability] = useState({});
  const [oldProbability, setOldProbability] = useState({});
  const [bestSeq, setBestSeq] = useState({});
  const [screenNo, setScreenNo] = useState(0);
  const [activeWinProb, setActiveWinProb] = useState(0);
  const [isOpenPick, setIsOpenPick] = useState(false);
  const [isOpenCard, setIsOpenCard] = useState(false);
  const [isCloseCard, setIsCloseCard] = useState(false);
  const [isDropCard, setIsDropCard] = useState(null);
  const [isOpenDrop, setIsOpenDrop] = useState(false);
  const [activePlayer, setActivePlayer] = useState({});
  const [aceJoker, setAceJoker] = useState(false);
  const [levelNumber, setLevelNumber] = useState(null);
  const [showWinnerImage, setShowWinnerImage] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [dealShowImage, setDealShowImage] = useState(false);
  const [dealText, setDealText] = useState("");
  const [currentBoosterValue, setCurrentBoosterValue] = useState(0); // De
  const [latestDealNumber, setLatestDealNumber] = useState("");
  const [data, setData] = useState([]);
  const [latestDeal, setLatestDeal] = useState(null);
  const [chanceSum, setChanceSum] = useState(null);
  const eliminatedCount = Array.isArray(inGame)
    ? inGame.reduce(
        (count, value) =>
          value.playerStatus === "Eliminated" ? count + 1 : count,
        0
      )
    : 0;
  // Function to perform the calculations
  async function calculateBoosterValue() {
    try {
      const [boostersResponse, levelNumberResponse, dealNumberResponse] =
        await Promise.all([
          axios.get(boosterEndpoint()),
          axios.get(levelNumberEndpoint()),
          axios.get(getLatestDealNumber()),
        ]);

      const boostersData = boostersResponse.data;
      const levelNumber = levelNumberResponse.data;
      const dealNumber = dealNumberResponse.data;

      let boosterIndex = 0;
      if (levelNumber === 1) {
        boosterIndex = 0;
      } else if (levelNumber === 2) {
        boosterIndex = dealNumber <= 6 ? 0 : 1;
      } else if (levelNumber === 3) {
        boosterIndex = dealNumber <= 4 ? 0 : dealNumber <= 8 ? 1 : 2;
      } else if (levelNumber === 4) {
        boosterIndex =
          dealNumber <= 3 ? 0 : dealNumber <= 6 ? 1 : dealNumber <= 9 ? 2 : 3;
      } else if (levelNumber === 6) {
        boosterIndex =
          dealNumber <= 2
            ? 0
            : dealNumber <= 4
            ? 1
            : dealNumber <= 6
            ? 2
            : dealNumber <= 8
            ? 3
            : dealNumber <= 10
            ? 4
            : 5;
      } else if (levelNumber === 12) {
        boosterIndex = Math.min(dealNumber - 1, 11);
      }

      const currentBoosterValue = boostersData[boosterIndex];

      console.log("Current Booster Value:", currentBoosterValue);
      setCurrentBoosterValue(currentBoosterValue); // Set currentBoosterValue state
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  

  useEffect(() => {
    const fetchLatestDeal = async () => {
      try {
        const response = await axios.get(getDeals());
        const deals = response.data;

        // Find the latest deal based on createdAt field
        if (deals.length > 0) {
          const latest = deals.reduce((prev, current) => {
            return new Date(current.createdAt) > new Date(prev.createdAt)
              ? current
              : prev;
          });

          // Set the latest deal in state
          setLatestDeal(latest);
          // Set the chanceSum from the latest deal
          setChanceSum(latest.chanceSum);
        }
      } catch (error) {
        console.error("Error fetching latest deal:", error);
      }
    };

    fetchLatestDeal();
  }, []);

  useEffect(() => {
    if (activePlayerData && activePlayerData.playerStatus === "autoWinner") {
      setShowImage(true);
      const timer = setTimeout(() => {
        setShowImage(false);
      }, 5000); // 5 seconds
      return () => clearTimeout(timer);
    }
  }, [activePlayerData?.playerStatus]);

  useEffect(() => {
    if (
      activePlayerData &&
      activePlayerData.playerStatus === "Winner" &&
      chanceSum + eliminatedCount <= 6
    ) {
      setDealShowImage(true);
      const timer = setTimeout(() => {
        setDealShowImage(false);
      }, 5000); // 5 seconds
      return () => clearTimeout(timer);
    }
  }, [activePlayerData?.playerStatus, eliminatedCount, chanceSum]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(getTotalPoints());
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (
      activePlayerData.playerStatus === "Winner" ||
      activePlayerData.playerStatus === "autoWinner"
    ) {
      setShowWinnerImage(true);
      const timer = setTimeout(() => {
        setShowWinnerImage(false);
      }, 5000); // 5000 milliseconds = 5 seconds
      return () => clearTimeout(timer);
    }
  }, [activePlayerData?.playerStatus]);

  useEffect(() => {
    calculateBoosterValue(); // Call calculateBoosterValue function
  }, [latestDealNumber]); // Trigger the effect whenever latestDealNumber changes

  useEffect(() => {
    const fetchLatestDealNumber = async () => {
      try {
        const response = await axios.get(getLatestDealNumber());
        setLatestDealNumber(response.data);
      } catch (error) {
        console.error("Error fetching latest deal number:", error);
      }
    };

    fetchLatestDealNumber();
  }, []);

  useEffect(() => {
    const fetchLevelNumber = async () => {
      try {
        const levelResponse = await axios.get(levelNumberEndpoint());
        setLevelNumber(levelResponse.data);
      } catch (error) {
        console.error("Error fetching level number:", error);
      }
    };

    fetchLevelNumber();
  }, []);

  let showLevel = "";
  let showDeal = "";

  if (levelNumber === 1) {
    showLevel = 1;
    showDeal = `Deal ${latestDealNumber}/12`;
  } else if (levelNumber === 2) {
    if (latestDealNumber <= 6) {
      showLevel = 1;
      showDeal = `Deal ${latestDealNumber}/12`;
    } else {
      showLevel = 2;
      showDeal = `Deal ${latestDealNumber}/12`;
    }
  } else if (levelNumber === 3) {
    if (latestDealNumber <= 4) {
      showLevel = 1;
      showDeal = `Deal ${latestDealNumber}/12`;
    } else if (latestDealNumber <= 8) {
      // Corrected this condition
      showLevel = 2;
      showDeal = `Deal ${latestDealNumber}/12`;
    } else {
      showLevel = 3;
      showDeal = `Deal ${latestDealNumber}/12`;
    }
  } else if (levelNumber === 4) {
    if (latestDealNumber <= 3) {
      showLevel = 1;
      showDeal = `Deal ${latestDealNumber}/12`;
    } else if (latestDealNumber <= 6) {
      // Corrected this condition
      showLevel = 2;
      showDeal = `Deal ${latestDealNumber}/12`;
    } else if (latestDealNumber <= 9) {
      showLevel = 3;
      showDeal = `Deal ${latestDealNumber}/12`;
    } else {
      showLevel = 4;
      showDeal = `Deal ${latestDealNumber}/12`;
    }
  } else if (levelNumber === 6) {
    if (latestDealNumber <= 2) {
      showLevel = 1;
      showDeal = `Deal ${latestDealNumber}/12`;
    } else if (latestDealNumber <= 4) {
      // Corrected this condition
      showLevel = 2;
      showDeal = `Deal ${latestDealNumber}/12`;
    } else if (latestDealNumber <= 6) {
      showLevel = 3;
      showDeal = `Deal ${latestDealNumber}/12`;
    } else if (latestDealNumber <= 8) {
      showLevel = 4;
      showDeal = `Deal ${latestDealNumber}/12`;
    } else if (latestDealNumber <= 10) {
      showLevel = 5;
      showDeal = `Deal ${latestDealNumber}/12`;
    } else {
      showLevel = 6;
      showDeal = `Deal ${latestDealNumber}/12`;
    }
  } else if (levelNumber === 12) {
    showLevel = latestDealNumber;
    showDeal = `Deal ${latestDealNumber}`;
  }

  // Checks if the card is joker card and show joker image
  function isJokerCard(cardId) {
    let jokerNumber = localStorage.getItem("jokerNumber");
    let jokerCard = Cards.find((o) => o.cardUuid == jokerNumber);
    // console.log("jokerNumber", jokerNumber);
    // console.log("jokerCard", jokerCard);
    let ogCard = Cards.find((o) => o.cardUuid == cardId);

    if (ogCard !== undefined && ogCard !== null) {
      if (ogCard.Value === "J") {
        ogCard.Value = 11;
      } else if (ogCard.Value === "Q") {
        ogCard.Value = 12;
      } else if (ogCard.Value === "K") {
        ogCard.Value = 13;
      } else if (ogCard.Value === "A") {
        ogCard.Value = 1;
      }
    }

    if (jokerCard !== undefined && jokerCard !== null) {
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
  }

  let setCardSequence = useCallback((data) => {
    console.log("cs", data);

    let reqdata = data.InGameRes;
    let screenNo = localStorage.getItem("screenNo");
    // console.log(data);
    if (reqdata !== undefined) {
      let seq1 = reqdata.cardSequence1.cards.map((pval, pin) => {
        let picked = Cards.find((o) => o.cardUuid == pval.cardId);
        let isJoker = isJokerCard(pval.cardId);
        if (isJoker) {
          return { img: picked.imageURI2, cardId: pval.cardId };
        } else {
          return { img: picked.imageURI, cardId: pval.cardId };
        }
      });

      let seq2 = reqdata.cardSequence2.cards.map((pval, pin) => {
        let picked = Cards.find((o) => o.cardUuid == pval.cardId);
        let isJoker = isJokerCard(pval.cardId);
        if (isJoker) {
          return { img: picked.imageURI2, cardId: pval.cardId };
        } else {
          return { img: picked.imageURI, cardId: pval.cardId };
        }
      });

      let seq3 = reqdata.cardSequence3.cards.map((pval, pin) => {
        let picked = Cards.find((o) => o.cardUuid == pval.cardId);
        let isJoker = isJokerCard(pval.cardId);
        if (isJoker) {
          return { img: picked.imageURI2, cardId: pval.cardId };
        } else {
          return { img: picked.imageURI, cardId: pval.cardId };
        }
      });

      let seq4 = reqdata.cardSequence4.cards.map((pval, pin) => {
        let picked = Cards.find((o) => o.cardUuid == pval.cardId);
        let isJoker = isJokerCard(pval.cardId);
        if (isJoker) {
          return { img: picked.imageURI2, cardId: pval.cardId };
        } else {
          return { img: picked.imageURI, cardId: pval.cardId };
        }
      });

      let seq5 = reqdata.cardSequence5.cards.map((pval, pin) => {
        let picked = Cards.find((o) => o.cardUuid == pval.cardId);
        let isJoker = isJokerCard(pval.cardId);
        if (isJoker) {
          return { img: picked.imageURI2, cardId: pval.cardId };
        } else {
          return { img: picked.imageURI, cardId: pval.cardId };
        }
      });

      let seq6 = reqdata.cardSequence6.cards.map((pval, pin) => {
        let picked = Cards.find((o) => o.cardUuid == pval.cardId);
        let isJoker = isJokerCard(pval.cardId);
        if (isJoker) {
          return { img: picked.imageURI2, cardId: pval.cardId };
        } else {
          return { img: picked.imageURI, cardId: pval.cardId };
        }
      });

      let bseq1 = reqdata.bestSequence1.cards.map((pval, pin) => {
        let picked = Cards.find((o) => o.cardUuid == pval.cardId);
        let isJoker = isJokerCard(pval.cardId);
        if (isJoker) {
          return { img: picked.imageURI2, cardId: pval.cardId };
        } else {
          return { img: picked.imageURI, cardId: pval.cardId };
        }
      });

      let bseq2 = reqdata.bestSequence2.cards.map((pval, pin) => {
        let picked = Cards.find((o) => o.cardUuid == pval.cardId);
        let isJoker = isJokerCard(pval.cardId);
        if (isJoker) {
          return { img: picked.imageURI2, cardId: pval.cardId };
        } else {
          return { img: picked.imageURI, cardId: pval.cardId };
        }
      });

      let bseq3 = reqdata.bestSequence3.cards.map((pval, pin) => {
        let picked = Cards.find((o) => o.cardUuid == pval.cardId);
        let isJoker = isJokerCard(pval.cardId);
        if (isJoker) {
          return { img: picked.imageURI2, cardId: pval.cardId };
        } else {
          return { img: picked.imageURI, cardId: pval.cardId };
        }
      });

      let bseq4 = reqdata.bestSequence4.cards.map((pval, pin) => {
        let picked = Cards.find((o) => o.cardUuid == pval.cardId);
        let isJoker = isJokerCard(pval.cardId);
        if (isJoker) {
          return { img: picked.imageURI2, cardId: pval.cardId };
        } else {
          return { img: picked.imageURI, cardId: pval.cardId };
        }
      });

      let bseq5 = reqdata.bestSequence5.cards.map((pval, pin) => {
        let picked = Cards.find((o) => o.cardUuid == pval.cardId);
        let isJoker = isJokerCard(pval.cardId);
        if (isJoker) {
          return { img: picked.imageURI2, cardId: pval.cardId };
        } else {
          return { img: picked.imageURI, cardId: pval.cardId };
        }
      });

      // let bseq6 = reqdata.bestSequence6.cards.map((pval, pin) => {
      //   let picked = Cards.find((o) => o.cardUuid == pval.cardId);
      //   let isJoker = isJokerCard(pval.cardId);
      //   if (isJoker) {
      //     return { img: picked.imageURI2, cardId: pval.cardId };
      //   } else {
      //     return { img: picked.imageURI, cardId: pval.cardId };
      //   }
      // });

      let newSeq = [...seq1, ...seq2, ...seq3, ...seq4, ...seq5, ...seq6];
      let newBSeq = [...bseq1, ...bseq2, ...bseq3, ...bseq4, ...bseq5];

      let bestSeq1, bestSeq2, bestSeq3, bestSeq4, bestSeq5;
      let isbestSeq1, isbestSeq2, isbestSeq3, isbestSeq4, isbestSeq5;

      let bestPoints = 0;
      if (reqdata.bestSequence1.cards !== undefined) {
        bestSeq1 = [...reqdata.bestSequence1.cards];
        isbestSeq1 = reqdata.bestSequence1.groupType;
      }

      if (reqdata.bestSequence2.cards !== undefined) {
        bestSeq2 = [...reqdata.bestSequence2.cards];
        isbestSeq2 = reqdata.bestSequence2.groupType;
      }

      if (reqdata.bestSequence3.cards !== undefined) {
        bestSeq3 = [...reqdata.bestSequence3.cards];
        isbestSeq3 = reqdata.bestSequence3.groupType;
      }

      if (reqdata.bestSequence4.cards !== undefined) {
        bestSeq4 = [...reqdata.bestSequence4.cards];
        isbestSeq4 = reqdata.bestSequence4.groupType;
      }

      if (reqdata.bestSequence5.cards !== undefined) {
        bestSeq5 = [...reqdata.bestSequence5.cards];
        isbestSeq5 = reqdata.bestSequence5.groupType;
      }

      // if (reqdata.bestSequence6.cards !== undefined) {
      //   bestSeq6 = [...reqdata.bestSequence6.cards];
      //   isbestSeq6 = reqdata.bestSequence6.groupType;
      // }

      let newBestSeq = [];
      let newBestSeq1 = [];
      let newBestSeq2 = [];
      let newBestSeq3 = [];
      let newBestSeq4 = [];
      let newBestSeq5 = [];
      // let newBestSeq6 = [];
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
      // if (bestSeq6 !== undefined) {
      //   newBestSeq.push(...bestSeq6);
      //   newBestSeq6 = bestSeq6.map((val, index) => {
      //     let picked = Cards.find((o) => o.cardUuid == val.cardId);
      //     let isJoker = isJokerCard(val.cardId);
      //     if (isJoker) {
      //       return picked.imageURI2;
      //     } else {
      //       return picked.imageURI;
      //     }
      //   });
      // }
      // console.log("best", newBestSeq1);
      // newBestSeq = bestSeq1 !== undefined || bestSeq2 !== undefined || bestSeq3 !== undefined || bestSeq4!== undefined ? [...bestSeq1, ...bestSeq2, ...bestSeq3, ...bestSeq4] : []
      let newBestCards = newBestSeq.map((val, index) => {
        let picked = Cards.find((o) => o.cardUuid == val.cardId);
        return picked.imageURI;
      });

      let oldInGame = JSON.parse(localStorage.getItem("InGame"));
      let newInGame = oldInGame.map((val, index) => {
        // console.log("ids", val._id , reqdata._id);
        if (val._id === reqdata._id) {
          // console.log("in");
          let localindex = localStorage.getItem("activePlayerIndex");
          if (localindex === undefined || localindex === null) {
            localindex = 1;
          }
          console.log("screen", localindex, index + 1);
          if (
            parseInt(localindex) === parseInt(index + 1) ||
            parseInt(index + 1) === parseInt(screenNo)
          ) {
            // console.log(true)
            console.log("set seq");
            if (data.type === "drop") {
              setIsDropCard(data.cardId);
              console.log(data.cardId);
              localStorage.setItem("isDropCard", data.cardId);
              let oldseq = [
                ...val.cardSequence1.cards,
                ...val.cardSequence2.cards,
                ...val.cardSequence3.cards,
                ...val.cardSequence4.cards,
                ...val.cardSequence5.cards,
                ...val.cardSequence6.cards,
                ...val.bestSequence1.cards,
                ...val.bestSequence2.cards,
                ...val.bestSequence3.cards,
                ...val.bestSequence4.cards,
                ...val.bestSequence5.cards,
                // ...val.bestSequence6.cards,
              ];
              let dropIndex = 0;
              oldseq.forEach((oldValue, oldIndex) => {
                if (oldValue.cardId == data.cardId) {
                  dropIndex = oldIndex + 1;
                }
              });
              // setTimeout(() => {
              //     let openCard = localStorage.getItem("openCard");
              //     setOpenCard(openCard);
              //     let curOpenCard = localStorage.getItem("curOpenCard");
              //     setCurOpenCard(curOpenCard);
              // }, dropIndex < 5 ? );
              setTimeout(() => {
                setActivePlayerData({
                  ...reqdata.playerId,
                  totalPoints: reqdata.totalPoints,
                  playerStatus: reqdata.playerStatus,
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
                  // bseq6,
                  newBSeq,
                  bestseq: newBestCards,
                  newBestSeq1,
                  newBestSeq2,
                  newBestSeq3,
                  newBestSeq4,
                  newBestSeq5,
                  // newBestSeq6,
                  bestPoints: reqdata.bestPoints,
                  isbestSeq1,
                  isbestSeq2,
                  isbestSeq3,
                  isbestSeq4,
                  isbestSeq5,
                  // isbestSeq6,
                });
                localStorage.setItem(
                  "ActivePlayer",
                  JSON.stringify({
                    ...reqdata.playerId,
                    totalPoints: reqdata.totalPoints,
                    playerStatus: reqdata.playerStatus,
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
                    // bseq6,
                    newBSeq,
                    bestseq: newBestCards,
                    newBestSeq1,
                    newBestSeq2,
                    newBestSeq3,
                    newBestSeq4,
                    newBestSeq5,
                    // newBestSeq6,
                    bestPoints: reqdata.bestPoints,
                    isbestSeq1,
                    isbestSeq2,
                    isbestSeq3,
                    isbestSeq4,
                    isbestSeq5,
                    // isbestSeq6,
                  })
                );
              }, 1000);
            } else {
              setActivePlayerData({
                ...reqdata.playerId,
                totalPoints: reqdata.totalPoints,
                playerStatus: reqdata.playerStatus,
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
                // bseq6,
                newBSeq,
                bestseq: newBestCards,
                newBestSeq1,
                newBestSeq2,
                newBestSeq3,
                newBestSeq4,
                newBestSeq5,
                // newBestSeq6,
                bestPoints: reqdata.bestPoints,
                isbestSeq1,
                isbestSeq2,
                isbestSeq3,
                isbestSeq4,
                isbestSeq5,
                // isbestSeq6,
              });
              localStorage.setItem(
                "ActivePlayer",
                JSON.stringify({
                  ...reqdata.playerId,
                  totalPoints: reqdata.totalPoints,
                  playerStatus: reqdata.playerStatus,
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
                  // bseq6,
                  newBSeq,
                  bestseq: newBestCards,
                  newBestSeq1,
                  newBestSeq2,
                  newBestSeq3,
                  newBestSeq4,
                  newBestSeq5,
                  // newBestSeq6,
                  bestPoints: reqdata.bestPoints,
                  isbestSeq1,
                  isbestSeq2,
                  isbestSeq3,
                  isbestSeq4,
                  isbestSeq5,
                  // isbestSeq6,
                })
              );
            }
          }
          if (parseInt(localindex) === index + 1) {
            return { ...reqdata, isActive: 1 };
          } else {
            return { ...reqdata, isActive: 0 };
          }
        } else {
          // console.log("out");
          if (val._id === reqdata._id) {
            return { ...reqdata, isActive: 0 };
          } else {
            return { ...val, isActive: 0 };
          }
        }
      });
      // console.log("newInGame", newInGame);
      localStorage.setItem("InGame", JSON.stringify(newInGame));
      setInGame(newInGame);
      let oldActivePlayer = JSON.parse(localStorage.getItem("ActivePlayer"));
      // console.log("oldActivePlayer", oldActivePlayer);
    }
  }, []);

  // called when card is picked
  let setPicked = useCallback((datas) => {
    console.log("datas");
    let data = datas.inGame;
    if (data !== undefined && data !== null) {
      let oldInGame = JSON.parse(localStorage.getItem("InGame"));
      let scrNo = localStorage.getItem("screenNo");
      let newInGame = oldInGame.map((val, index) => {
        // console.log(data,"inside-pick")
        if (val._id.toString() === data._id.toString()) {
          console.log("in pick");

          if (scrNo >= 1 && scrNo <= 6) {
            setIsPick(true);
            localStorage.setItem("isPick", true);
            localStorage.setItem("activePlayerIndex", parseInt(index) + 1);
            setActivePlayerIndex(parseInt(index) + 1);
            clearTimeout(pickSocket);
            // console.log("in pick", scrNo);
            // let localindex = localStorage.getItem("activePlayerIndex");
            // localStorage.setItem("activePlayerIndex", parseInt(index) + 1);
            // setActivePlayerIndex(parseInt(index) + 1)
            // clearTimeout(pickSocket)
            let seq1 = data.cardSequence1.cards.map((pval, pin) => {
              let picked = Cards.find((o) => o.cardUuid == pval.cardId);
              let isJoker = isJokerCard(pval.cardId);
              if (isJoker) {
                return { img: picked.imageURI2, cardId: pval.cardId };
              } else {
                return { img: picked.imageURI, cardId: pval.cardId };
              }
            });
            // let popped = seq1.pop();
            // console.log(seq1.length);
            let seq2 = data.cardSequence2.cards.map((pval, pin) => {
              let picked = Cards.find((o) => o.cardUuid == pval.cardId);
              let isJoker = isJokerCard(pval.cardId);
              if (isJoker) {
                return { img: picked.imageURI2, cardId: pval.cardId };
              } else {
                return { img: picked.imageURI, cardId: pval.cardId };
              }
            });

            let seq3 = data.cardSequence3.cards.map((pval, pin) => {
              let picked = Cards.find((o) => o.cardUuid == pval.cardId);
              let isJoker = isJokerCard(pval.cardId);
              if (isJoker) {
                return { img: picked.imageURI2, cardId: pval.cardId };
              } else {
                return { img: picked.imageURI, cardId: pval.cardId };
              }
            });

            let seq4 = data.cardSequence4.cards.map((pval, pin) => {
              let picked = Cards.find((o) => o.cardUuid == pval.cardId);
              let isJoker = isJokerCard(pval.cardId);
              if (isJoker) {
                return { img: picked.imageURI2, cardId: pval.cardId };
              } else {
                return { img: picked.imageURI, cardId: pval.cardId };
              }
            });

            let seq5 = data.cardSequence5.cards.map((pval, pin) => {
              let picked = Cards.find((o) => o.cardUuid == pval.cardId);
              let isJoker = isJokerCard(pval.cardId);
              if (isJoker) {
                return { img: picked.imageURI2, cardId: pval.cardId };
              } else {
                return { img: picked.imageURI, cardId: pval.cardId };
              }
            });

            let seq6 = data.cardSequence6.cards.map((pval, pin) => {
              let picked = Cards.find((o) => o.cardUuid == pval.cardId);
              let isJoker = isJokerCard(pval.cardId);
              if (isJoker) {
                return { img: picked.imageURI2, cardId: pval.cardId };
              } else {
                return { img: picked.imageURI, cardId: pval.cardId };
              }
            });

            let bseq1 = data.bestSequence1.cards.map((pval, pin) => {
              let picked = Cards.find((o) => o.cardUuid == pval.cardId);
              let isJoker = isJokerCard(pval.cardId);
              if (isJoker) {
                return { img: picked.imageURI2, cardId: pval.cardId };
              } else {
                return { img: picked.imageURI, cardId: pval.cardId };
              }
            });
            // let popped = bseq1.pop();
            // console.log(bseq1.length);
            let bseq2 = data.bestSequence2.cards.map((pval, pin) => {
              let picked = Cards.find((o) => o.cardUuid == pval.cardId);
              let isJoker = isJokerCard(pval.cardId);
              if (isJoker) {
                return { img: picked.imageURI2, cardId: pval.cardId };
              } else {
                return { img: picked.imageURI, cardId: pval.cardId };
              }
            });

            let bseq3 = data.bestSequence3.cards.map((pval, pin) => {
              let picked = Cards.find((o) => o.cardUuid == pval.cardId);
              let isJoker = isJokerCard(pval.cardId);
              if (isJoker) {
                return { img: picked.imageURI2, cardId: pval.cardId };
              } else {
                return { img: picked.imageURI, cardId: pval.cardId };
              }
            });

            let bseq4 = data.bestSequence4.cards.map((pval, pin) => {
              let picked = Cards.find((o) => o.cardUuid == pval.cardId);
              let isJoker = isJokerCard(pval.cardId);
              if (isJoker) {
                return { img: picked.imageURI2, cardId: pval.cardId };
              } else {
                return { img: picked.imageURI, cardId: pval.cardId };
              }
            });

            let bseq5 = data.bestSequence5.cards.map((pval, pin) => {
              let picked = Cards.find((o) => o.cardUuid == pval.cardId);
              let isJoker = isJokerCard(pval.cardId);
              if (isJoker) {
                return { img: picked.imageURI2, cardId: pval.cardId };
              } else {
                return { img: picked.imageURI, cardId: pval.cardId };
              }
            });

            // let bseq6 = data.bestSequence6.cards.map((pval, pin) => {
            //   let picked = Cards.find((o) => o.cardUuid == pval.cardId);
            //   let isJoker = isJokerCard(pval.cardId);
            //   if (isJoker) {
            //     return { img: picked.imageURI2, cardId: pval.cardId };
            //   } else {
            //     return { img: picked.imageURI, cardId: pval.cardId };
            //   }
            // });


            let newSeq = [...seq1, ...seq2, ...seq3, ...seq4, ...seq5, ...seq6];
            let newBSeq = [...bseq1, ...bseq2, ...bseq3, ...bseq4, ...bseq5];
            // newSeq.push(popped);
            let bestSeq1, bestSeq2, bestSeq3, bestSeq4, bestSeq5;
            let isbestSeq1, isbestSeq2, isbestSeq3, isbestSeq4, isbestSeq5;
            let bestPoints = 0;
            if (data.bestSequence1.cards !== undefined) {
              bestSeq1 = [...data.bestSequence1.cards];
              isbestSeq1 = data.bestSequence1.groupType;
            }

            if (data.bestSequence2.cards !== undefined) {
              bestSeq2 = [...data.bestSequence2.cards];
              isbestSeq2 = data.bestSequence2.groupType;
            }

            if (data.bestSequence3.cards !== undefined) {
              bestSeq3 = [...data.bestSequence3.cards];
              isbestSeq3 = data.bestSequence3.groupType;
            }

            if (data.bestSequence4.cards !== undefined) {
              bestSeq4 = [...data.bestSequence4.cards];
              isbestSeq4 = data.bestSequence4.groupType;
            }

            if (data.bestSequence5.cards !== undefined) {
              bestSeq5 = [...data.bestSequence5.cards];
              isbestSeq5 = data.bestSequence5.groupType;
            }
            // if (data.bestSequence6.cards !== undefined) {
            //   bestSeq6 = [...data.bestSequence6.cards];
            //   isbestSeq6 = data.bestSequence6.groupType;
            // }
            let newBestSeq = [];
            let newBestSeq1 = [];
            let newBestSeq2 = [];
            let newBestSeq3 = [];
            let newBestSeq4 = [];
            let newBestSeq5 = [];
            // let newBestSeq6 = [];
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
            // if (bestSeq6 !== undefined) {
            //   newBestSeq.push(...bestSeq6);
            //   newBestSeq6 = bestSeq6.map((val, index) => {
            //     let picked = Cards.find((o) => o.cardUuid == val.cardId);
            //     let isJoker = isJokerCard(val.cardId);
            //     if (isJoker) {
            //       return picked.imageURI2;
            //     } else {
            //       return picked.imageURI;
            //     }
            //   });
            // }

            // newBestSeq = bestSeq1 !== undefined || bestSeq2 !== undefined || bestSeq3 !== undefined || bestSeq4!== undefined ? [...bestSeq1, ...bestSeq2, ...bestSeq3, ...bestSeq4] : []
            let newBestCards = newBestSeq.map((val, index) => {
              let picked = Cards.find((o) => o.cardUuid == val.cardId);
              return picked.imageURI;
            });
            setTimeout(() => {
              setActivePlayerData({
                ...data.playerId,
                totalPoints: data.totalPoints,
                playerStatus: data.playerStatus,
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
                // bseq6,
                newBSeq,
                bestseq: newBestCards,
                newBestSeq1,
                newBestSeq2,
                newBestSeq3,
                newBestSeq4,
                newBestSeq5,
                // newBestSeq6,
                bestPoints: data.bestPoints,
                isbestSeq1,
                isbestSeq2,
                isbestSeq3,
                isbestSeq4,
                isbestSeq5,
                // isbestSeq6,
              });
              localStorage.setItem(
                "ActivePlayer",
                JSON.stringify({
                  ...data.playerId,
                  totalPoints: data.totalPoints,
                  playerStatus: data.playerStatus,
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
                  // bseq6,
                  newBSeq,
                  bestseq: newBestCards,
                  newBestSeq1,
                  newBestSeq2,
                  newBestSeq3,
                  newBestSeq4,
                  newBestSeq5,
                  // newBestSeq6,
                  bestPoints: data.bestPoints,
                  isbestSeq1,
                  isbestSeq2,
                  isbestSeq3,
                  isbestSeq4,
                  isbestSeq5,
                  // isbestSeq6,
                })
              );
            }, 1000);

            // console.log('active player', activePlayerData);
          }

          return { ...data, isActive: 1, bestPoints: data.bestPoints };
        } else {
          return { ...val, isActive: 0 };
        }
      });

      localStorage.setItem("InGame", JSON.stringify(newInGame));
      setInGame(newInGame);

      // console.log("pick in game", newInGame);
    }
  }, []);

  let showOpenCard = useCallback((datas) => {
    console.log("openc", datas);
    let data = datas.updateDealOpenCard;
    // console.log("data.openCard", data.openCard);

    if (datas.status === "pick") {
      setIsOpenPick(true);
      localStorage.setItem("isOpenPick", true);
      // setTimeout(() => {
      setIsOpenCard(true);
      localStorage.setItem("isOpenCard", true);
      // }, 1000);
      let localp = localStorage.getItem("isOpenCard");
      // console.log("on pick", localp);
      setIsDropCard(null);
      localStorage.removeItem("isDropCard");
      // setTimeout(() => {
      //     setIsOpenPick(false);
      //     localStorage.setItem("isOpenPick", false);
      // }, 1000);
    } else if (datas.status === "drop") {
      // console.log("show drop");
      setIsOpenPick(false);
      localStorage.setItem("isOpenPick", false);
      setIsOpenCard(false);
      localStorage.setItem("isOpenCard", false);
      setIsCloseCard(false);
      localStorage.setItem("isCloseCard", false);
      setIsPick(false);
      localStorage.setItem("isPick", false);
      let LocalScreen = localStorage.getItem("screenNo");
      // let LocalActivePlayer = localStorage.getItem("ActivePlayer");
      // console.log("out open card drop", LocalScreen);
      if (LocalScreen >= 1 && LocalScreen <= 6) {
        // console.log("in open card drop", LocalScreen);
        let currentPlayerId = datas.playerId;
        let InGame = JSON.parse(localStorage.getItem("InGame"));
        InGame.forEach((val, index) => {
          if (val.playerStatus === "Active") {
            if (val.playerId._id.toString() === currentPlayerId.toString()) {
              // let oldActivePlayer = JSON.parse(localStorage.getItem('ActivePlayer'));
              // console.log("oldActivePlayer", oldActivePlayer);
              // setActivePlayerData(oldActivePlayer);
              // localStorage.setItem("ActivePlayer", JSON.stringify(oldActivePlayer));
              let seq1 = val.cardSequence1.cards.map((pval, pin) => {
                let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                let isJoker = isJokerCard(pval.cardId);
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
                if (isJoker) {
                  return { img: picked.imageURI2, cardId: pval.cardId };
                } else {
                  return { img: picked.imageURI, cardId: pval.cardId };
                }
              });

              let seq3 = val.cardSequence3.cards.map((pval, pin) => {
                let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                let isJoker = isJokerCard(pval.cardId);
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
                if (isJoker) {
                  return { img: picked.imageURI2, cardId: pval.cardId };
                } else {
                  return { img: picked.imageURI, cardId: pval.cardId };
                }
              });

              let bseq3 = val.bestSequence3.cards.map((pval, pin) => {
                let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                let isJoker = isJokerCard(pval.cardId);
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

              // let bseq6 = val.bestSequence6.cards.map((pval, pin) => {
              //   let picked = Cards.find((o) => o.cardUuid == pval.cardId);
              //   let isJoker = isJokerCard(pval.cardId);
              //   if (isJoker) {
              //     return { img: picked.imageURI2, cardId: pval.cardId };
              //   } else {
              //     return { img: picked.imageURI, cardId: pval.cardId };
              //   }
              // });

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
                // ...bseq6,
              ];
              let bestSeq1, bestSeq2, bestSeq3, bestSeq4, bestSeq5;
              let isbestSeq1, isbestSeq2, isbestSeq3, isbestSeq4, isbestSeq5;
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
                isbestSeq5 = val.bestSequence5.groupType;
              }

              // if (val.bestSequence6.cards !== undefined) {
              //   bestSeq6 = [...val.bestSequence6.cards];
              //   isbestSeq6 = val.bestSequence6.groupType;
              // }
              let newBestSeq = [];
              let newBestSeq1 = [];
              let newBestSeq2 = [];
              let newBestSeq3 = [];
              let newBestSeq4 = [];
              let newBestSeq5 = [];
              // let newBestSeq6 = [];
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
              // if (bestSeq6 !== undefined) {
              //   newBestSeq.push(...bestSeq6);
              //   newBestSeq6 = bestSeq6.map((val, index) => {
              //     let picked = Cards.find((o) => o.cardUuid == val.cardId);
              //     let isJoker = isJokerCard(val.cardId);
              //     if (isJoker) {
              //       return picked.imageURI2;
              //     } else {
              //       return picked.imageURI;
              //     }
              //   });
              // }
              let newBestCards = newBestSeq.map((val, index) => {
                let picked = Cards.find((o) => o.cardUuid == val.cardId);
                return picked.imageURI;
              });
              setTimeout(() => {
                // console.log("done drop");
                setActivePlayerData({
                  ...val.playerId,
                  totalPoints: val.totalPoints,
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
                  // bseq6,
                  newBSeq,
                  bestseq: newBestCards,
                  newBestSeq1,
                  newBestSeq2,
                  newBestSeq3,
                  newBestSeq4,
                  newBestSeq5,
                  // newBestSeq6,
                  bestPoints: val.bestPoints,
                  isbestSeq1,
                  isbestSeq2,
                  isbestSeq3,
                  isbestSeq4,
                  isbestSeq5,
                  // isbestSeq6,
                });
                localStorage.setItem(
                  "ActivePlayer",
                  JSON.stringify({
                    ...val.playerId,
                    totalPoints: val.totalPoints,
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
                    // bseq6,
                    newBSeq,
                    bestseq: newBestCards,
                    newBestSeq1,
                    newBestSeq2,
                    newBestSeq3,
                    newBestSeq4,
                    newBestSeq5,
                    // newBestSeq6,
                    bestPoints: val.bestPoints,
                    isbestSeq1,
                    isbestSeq2,
                    isbestSeq3,
                    isbestSeq4,
                    isbestSeq5,
                    // isbestSeq6,
                  })
                );
              }, 1000);
            }
          }
        });

        let LocalActivePlayer = JSON.parse(
          localStorage.getItem("ActivePlayer")
        );
        // console.log("LocalActivePlayer", LocalActivePlayer);
        // console.log("currentPlayerId", currentPlayerId);
        let newInGame = InGame.map((val, index) => {
          if (
            val.playerId._id.toString() === LocalActivePlayer._id.toString()
          ) {
            if (val.playerStatus === "Active") {
              return { ...val, isActive: 1 };
            } else {
              return { ...val, isActive: 0 };
            }
          } else {
            return { ...val, isActive: 0 };
          }
        });
        localStorage.setItem("InGame", JSON.stringify(newInGame));
        setInGame(newInGame);
      }
    } else {
      setIsOpenDrop(false);
      localStorage.setItem("isOpenDrop", false);
      setIsOpenPick(false);
      localStorage.setItem("isOpenPick", false);
      setIsOpenCard(false);
      localStorage.setItem("isOpenCard", false);
    }

    if (data.openCard !== undefined && data.openCard.length > 0) {
      // console.log("isd rop", isDropCard);
      //   setTimeout(()=>{
      let picked = Cards.find(
        (o) => o.cardUuid == data.openCard[data.openCard.length - 1].cardId
      );
      // console.log("picked", picked)
      setOpenCard(picked.imageURI);
      localStorage.setItem("openCard", picked.imageURI);
      if (datas.status === "pick") {
        setTimeout(() => {
          setCurOpenCard(picked.imageURI);
          localStorage.setItem("curOpenCard", picked.imageURI);
        }, 1000);
      } else if (datas.status === "drop") {
        setCurOpenCard(picked.imageURI);
        localStorage.setItem("curOpenCard", picked.imageURI);
      }

      // setScreen(2);

      //   }, 1000);
    } else {
      // console.log('empty');
      setTimeout(() => {
        setOpenCard(null);
        localStorage.removeItem("openCard");
      }, 1000);
    }
  }, []);

  let setClosedCard = useCallback((datas) => {
    let data1 = datas.closeResult;
    // console.log("in close")
    // if(datas !== undefined){
    if (datas.closeResult !== 0) {
      let newcardId = Cards.find((o) => o.cardUuid == datas.closeResult);
      setCloseCard(newcardId.imageURI);
      localStorage.setItem("closeCard", JSON.stringify(newcardId.imageURI));
      setIsPick(true);
      localStorage.setItem("isPick", true);
      setIsCloseCard(true);
      localStorage.setItem("isCloseCard", true);
      setTimeout(() => {
        setCloseCard(null);
        localStorage.removeItem("closeCard");
      }, 1000);
    } else {
      setCloseCard(null);
      localStorage.removeItem("closeCard");
    }
    // console.log("cc:", closeCard);
  }, []);

  let setPlayerStatus = useCallback((data) => {
    if (data !== undefined) {
      // console.log("in active status", data);
      let oldInGame = JSON.parse(localStorage.getItem("InGame"));
      // console.log("old in game", oldInGame)
      let screenNo = localStorage.getItem("screenNo");
      let newInGame = oldInGame.map((val, index) => {
        if (val._id.toString() === data._id.toString()) {
          let localActivePlayerIndex =
            localStorage.getItem("activePlayerIndex");
          // console.log("dec", parseInt(screenNo) , index + 1);
          if (data.playerId._id.toString() === val.playerId._id.toString()) {
            console.log(
              "in active status 2",
              data.playerId._id.toString(),
              val.playerId._id.toString()
            );
            // console.log("in active status 3", data.playerStatus);
            // || data.playerStatus === 'Declared'

            let seq1 = data.cardSequence1.cards.map((pval, pin) => {
              let picked = Cards.find((o) => o.cardUuid == pval.cardId);
              let isJoker = isJokerCard(pval.cardId);
              if (isJoker) {
                return { img: picked.imageURI2, cardId: pval.cardId };
              } else {
                return { img: picked.imageURI, cardId: pval.cardId };
              }
            });

            let seq2 = data.cardSequence2.cards.map((pval, pin) => {
              let picked = Cards.find((o) => o.cardUuid == pval.cardId);
              let isJoker = isJokerCard(pval.cardId);
              if (isJoker) {
                return { img: picked.imageURI2, cardId: pval.cardId };
              } else {
                return { img: picked.imageURI, cardId: pval.cardId };
              }
            });

            let seq3 = data.cardSequence3.cards.map((pval, pin) => {
              let picked = Cards.find((o) => o.cardUuid == pval.cardId);
              let isJoker = isJokerCard(pval.cardId);
              if (isJoker) {
                return { img: picked.imageURI2, cardId: pval.cardId };
              } else {
                return { img: picked.imageURI, cardId: pval.cardId };
              }
            });

            let seq4 = data.cardSequence4.cards.map((pval, pin) => {
              let picked = Cards.find((o) => o.cardUuid == pval.cardId);
              let isJoker = isJokerCard(pval.cardId);
              if (isJoker) {
                return { img: picked.imageURI2, cardId: pval.cardId };
              } else {
                return { img: picked.imageURI, cardId: pval.cardId };
              }
            });

            let seq5 = data.cardSequence5.cards.map((pval, pin) => {
              let picked = Cards.find((o) => o.cardUuid == pval.cardId);
              let isJoker = isJokerCard(pval.cardId);
              if (isJoker) {
                return { img: picked.imageURI2, cardId: pval.cardId };
              } else {
                return { img: picked.imageURI, cardId: pval.cardId };
              }
            });

            let seq6 = data.cardSequence6.cards.map((pval, pin) => {
              let picked = Cards.find((o) => o.cardUuid == pval.cardId);
              let isJoker = isJokerCard(pval.cardId);
              if (isJoker) {
                return { img: picked.imageURI2, cardId: pval.cardId };
              } else {
                return { img: picked.imageURI, cardId: pval.cardId };
              }
            });

            let bseq1 = data.bestSequence1.cards.map((pval, pin) => {
              let picked = Cards.find((o) => o.cardUuid == pval.cardId);
              let isJoker = isJokerCard(pval.cardId);
              if (isJoker) {
                return { img: picked.imageURI2, cardId: pval.cardId };
              } else {
                return { img: picked.imageURI, cardId: pval.cardId };
              }
            });

            let bseq2 = data.bestSequence2.cards.map((pval, pin) => {
              let picked = Cards.find((o) => o.cardUuid == pval.cardId);
              let isJoker = isJokerCard(pval.cardId);
              if (isJoker) {
                return { img: picked.imageURI2, cardId: pval.cardId };
              } else {
                return { img: picked.imageURI, cardId: pval.cardId };
              }
            });

            let bseq3 = data.bestSequence3.cards.map((pval, pin) => {
              let picked = Cards.find((o) => o.cardUuid == pval.cardId);
              let isJoker = isJokerCard(pval.cardId);
              if (isJoker) {
                return { img: picked.imageURI2, cardId: pval.cardId };
              } else {
                return { img: picked.imageURI, cardId: pval.cardId };
              }
            });

            let bseq4 = data.bestSequence4.cards.map((pval, pin) => {
              let picked = Cards.find((o) => o.cardUuid == pval.cardId);
              let isJoker = isJokerCard(pval.cardId);
              if (isJoker) {
                return { img: picked.imageURI2, cardId: pval.cardId };
              } else {
                return { img: picked.imageURI, cardId: pval.cardId };
              }
            });

            let bseq5 = data.bestSequence5.cards.map((pval, pin) => {
              let picked = Cards.find((o) => o.cardUuid == pval.cardId);
              let isJoker = isJokerCard(pval.cardId);
              if (isJoker) {
                return { img: picked.imageURI2, cardId: pval.cardId };
              } else {
                return { img: picked.imageURI, cardId: pval.cardId };
              }
            });

            // let bseq6 = data.bestSequence6.cards.map((pval, pin) => {
            //   let picked = Cards.find((o) => o.cardUuid == pval.cardId);
            //   let isJoker = isJokerCard(pval.cardId);
            //   if (isJoker) {
            //     return { img: picked.imageURI2, cardId: pval.cardId };
            //   } else {
            //     return { img: picked.imageURI, cardId: pval.cardId };
            //   }
            // });

            let newSeq = [...seq1, ...seq2, ...seq3, ...seq4, ...seq5, ...seq6];
            let newBSeq = [...bseq1, ...bseq2, ...bseq3, ...bseq4, ...bseq5];

            let bestSeq1, bestSeq2, bestSeq3, bestSeq4, bestSeq5;
            let isbestSeq1, isbestSeq2, isbestSeq3, isbestSeq4, isbestSeq5;

            let bestPoints = 0;
            if (data.bestSequence1.cards !== undefined) {
              bestSeq1 = [...data.bestSequence1.cards];
              isbestSeq1 = data.bestSequence1.groupType;
            }

            if (data.bestSequence2.cards !== undefined) {
              bestSeq2 = [...data.bestSequence2.cards];
              isbestSeq2 = data.bestSequence2.groupType;
            }

            if (data.bestSequence3.cards !== undefined) {
              bestSeq3 = [...data.bestSequence3.cards];
              isbestSeq3 = data.bestSequence3.groupType;
            }

            if (data.bestSequence4.cards !== undefined) {
              bestSeq4 = [...data.bestSequence4.cards];
              isbestSeq4 = data.bestSequence4.groupType;
            }

            if (data.bestSequence5.cards !== undefined) {
              bestSeq5 = [...data.bestSequence5.cards];
              isbestSeq5 = data.bestSequence5.groupType;
            }

            // if (data.bestSequence6.cards !== undefined) {
            //   bestSeq6 = [...data.bestSequence6.cards];
            //   isbestSeq6 = data.bestSequence6.groupType;
            // }

            let newBestSeq = [];
            let newBestSeq1 = [];
            let newBestSeq2 = [];
            let newBestSeq3 = [];
            let newBestSeq4 = [];
            let newBestSeq5 = [];
            // let newBestSeq6 = [];
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

            // if (bestSeq6 !== undefined) {
            //   newBestSeq.push(...bestSeq6);
            //   newBestSeq6 = bestSeq6.map((val, index) => {
            //     let picked = Cards.find((o) => o.cardUuid == val.cardId);
            //     let isJoker = isJokerCard(val.cardId);
            //     if (isJoker) {
            //       return picked.imageURI2;
            //     } else {
            //       return picked.imageURI;
            //     }
            //   });
            // }

            let newBestCards = newBestSeq.map((val, index) => {
              let picked = Cards.find((o) => o.cardUuid == val.cardId);
              return picked.imageURI;
            });

            setActivePlayerData({
              ...data.playerId,
              totalPoints: data.totalPoints,
              playerStatus: data.playerStatus,
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
              // bseq6,
              newBSeq,
              bestseq: newBestCards,
              newBestSeq1,
              newBestSeq2,
              newBestSeq3,
              newBestSeq4,
              newBestSeq5,
              // newBestSeq6,
              bestPoints: data.bestPoints,
              isbestSeq1,
              isbestSeq2,
              isbestSeq3,
              isbestSeq4,
              isbestSeq5,
              // isbestSeq6,
            });
            localStorage.setItem(
              "ActivePlayer",
              JSON.stringify({
                ...data.playerId,
                totalPoints: data.totalPoints,
                playerStatus: data.playerStatus,
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
                // bseq6,
                newBSeq,
                bestseq: newBestCards,
                newBestSeq1,
                newBestSeq2,
                newBestSeq3,
                newBestSeq4,
                newBestSeq5,
                // newBestSeq6,
                bestPoints: data.bestPoints,
                isbestSeq1,
                isbestSeq2,
                isbestSeq3,
                isbestSeq4,
                isbestSeq5,
                // isbestSeq6,
              })
            );

            localStorage.setItem("activePlayerIndex", index + 1);
            setActivePlayerIndex(index + 1);
            console.log(index + 1, "index + 1");
            return { ...data, isActive: 1 };
          }
        } else {
          return { ...val, isActive: 0 };
        }
      });
      console.log("newInGame", newInGame);
      localStorage.setItem("InGame", JSON.stringify(newInGame));
      setInGame(newInGame);

      if (
        data.playerStatus === "Winner" ||
        data.playerStatus === "autoWinner"
      ) {
        localStorage.setItem("winner", JSON.stringify(data));
        localStorage.setItem("autoWinner", JSON.stringify(data));
        //   setTimeout(() => {
        // localStorage.setItem('screenNo', 9);
        // setScreenNo(9);
        //   }, 3000);
        //   setWinner(data);
      } else if (data.playerStatus === "Declared") {
        clearTimeout(pickSocket);
      }
    }
  }, []);

  let setProbabilityScore = useCallback((data) => {
    if (data !== undefined) {
      setProbability(data.InGameRes);
      localStorage.setItem("probability", JSON.stringify(data.InGameRes));
    }
    setOldProbability(probability);
    let LocalProbability = JSON.parse(localStorage.getItem("probability"));
    let screenNO = localStorage.getItem("screenNo");
    let localindex = localStorage.getItem("activePlayerIndex");
    localindex = parseInt(localindex);
    if (LocalProbability !== undefined) {
      setProbability(LocalProbability);
    } else {
      setProbability(props.probability);
    }
    let LocalScreen = localStorage.getItem("screenNo");
    if (LocalScreen !== undefined) {
      setScreenNo(LocalScreen);
    } else {
      setScreenNo(screenNO);
    }
    // console.log("pro", LocalProbability);
    // console.log('scr p', LocalProbability[localindex - 1], localindex)
    if (LocalProbability[localindex] !== undefined) {
      setActiveWinProb(LocalProbability[localindex]);
    }
  }, []);

  let setPlayerChips = useCallback((data) => {
    // setTimeout(() => {
    let localInGame = JSON.parse(localStorage.getItem("InGame"));
    if (localInGame !== undefined) {
      let newLocalInGame = localInGame.map((val, index) => {
        return { ...val, totalPoints: data[index].totalPoints };
      });
      localStorage.setItem("InGame", JSON.stringify(newLocalInGame));
      setInGame(newLocalInGame);
    }
    localStorage.setItem("NewInGame", JSON.stringify(data));
    console.log("nava", data);
    // }, 23000);
    // setInGame(data);
  }, []);

  // set current player / active player Profiler, green marker and cards
  let setCurrentActivePlayer = useCallback((data) => {
    debugger;
    let screenNo = localStorage.getItem("screenNo");
    let isDeclared = localStorage.getItem("isDeclared");
    console.log("isDec", isDeclared);
    // if(isDeclared == 0){
    if (screenNo >= 1 || screenNo <= 6) {
      console.log("active index", data);
      pickSocket = setTimeout(() => {
        let InGame = JSON.parse(localStorage.getItem("InGame"));
        // console.log('after active', screenNo);
        let currentPlayerId = data.playerId;
        let currentActive = 1;
        InGame.forEach((val, index) => {
          if (val.playerId._id.toString() === currentPlayerId.toString()) {
            if (val.playerStatus === "Declared") {
              localStorage.setItem("activePlayerIndex", parseInt(index) + 1);
              setActivePlayerIndex(parseInt(index) + 1);
              return;
            } else {
              val = InGame[0];
              if (index < 5) {
                val = InGame[index + 1];
              }
              currentActive = index + 1;
              if (
                val !== undefined &&
                (val.playerStatus === "Dropped" ||
                  val.playerStatus === "Eliminated")
              ) {
                // console.log('d1');
                val = InGame[index + 1];
                currentActive = index + 1;
                if (
                  val !== undefined &&
                  (val.playerStatus === "Dropped" ||
                    val.playerStatus === "Eliminated")
                ) {
                  // console.log('d2');
                  val = InGame[index + 2];
                  currentActive = index + 2;
                  if (
                    val !== undefined &&
                    (val.playerStatus === "Dropped" ||
                      val.playerStatus === "Eliminated")
                  ) {
                    // console.log('d3');
                    val = InGame[index + 3];
                    currentActive = index + 3;
                    if (
                      val !== undefined &&
                      (val.playerStatus === "Dropped" ||
                        val.playerStatus === "Eliminated")
                    ) {
                      // console.log('d4');
                      val = InGame[index + 4];
                      currentActive = index + 4;
                    }
                  }
                }
              }
              console.log("currr0", currentActive, val);
              if (val === undefined) {
                currentActive = 0;
                val = InGame[currentActive];
                if (
                  val.playerId._id.toString() !== currentPlayerId.toString()
                ) {
                  if (
                    (val !== undefined && val.playerStatus === "Dropped") ||
                    val.playerStatus === "Eliminated"
                  ) {
                    currentActive = 1;
                    val = InGame[currentActive];
                    if (
                      val.playerId._id.toString() !== currentPlayerId.toString()
                    ) {
                      if (
                        (val !== undefined && val.playerStatus === "Dropped") ||
                        val.playerStatus === "Eliminated"
                      ) {
                        currentActive = 2;
                        val = InGame[currentActive];
                        if (
                          val.playerId._id.toString() !==
                          currentPlayerId.toString()
                        ) {
                          if (
                            (val !== undefined &&
                              val.playerStatus === "Dropped") ||
                            val.playerStatus === "Eliminated"
                          ) {
                            currentActive = 3;
                            val = InGame[currentActive];
                            if (
                              val.playerId._id.toString() !==
                              currentPlayerId.toString()
                            ) {
                              if (
                                (val !== undefined &&
                                  val.playerStatus === "Dropped") ||
                                val.playerStatus === "Eliminated"
                              ) {
                                currentActive = 4;
                                val = InGame[currentActive];
                                if (
                                  val.playerId._id.toString() !==
                                  currentPlayerId.toString()
                                ) {
                                  if (
                                    (val !== undefined &&
                                      val.playerStatus === "Dropped") ||
                                    val.playerStatus === "Eliminated"
                                  ) {
                                    currentActive = 5;
                                    val = InGame[currentActive];
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
              if (currentActive === 6) {
                currentActive = 0;
                val = InGame[currentActive];
                if (
                  val.playerId._id.toString() !== currentPlayerId.toString()
                ) {
                  if (val !== undefined && val.playerStatus === "Eliminated") {
                    currentActive = 1;
                    val = InGame[currentActive];
                    if (
                      val.playerId._id.toString() !== currentPlayerId.toString()
                    ) {
                      if (
                        val !== undefined &&
                        val.playerStatus === "Eliminated"
                      ) {
                        currentActive = 2;
                        val = InGame[currentActive];
                        if (
                          val.playerId._id.toString() !==
                          currentPlayerId.toString()
                        ) {
                          if (
                            val !== undefined &&
                            val.playerStatus === "Eliminated"
                          ) {
                            currentActive = 3;
                            val = InGame[currentActive];
                            if (
                              val.playerId._id.toString() !==
                              currentPlayerId.toString()
                            ) {
                              if (
                                val !== undefined &&
                                val.playerStatus === "Eliminated"
                              ) {
                                currentActive = 4;
                                val = InGame[currentActive];
                                if (
                                  val.playerId._id.toString() !==
                                  currentPlayerId.toString()
                                ) {
                                  if (
                                    val !== undefined &&
                                    val.playerStatus === "Eliminated"
                                  ) {
                                    currentActive = 5;
                                    val = InGame[currentActive];
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }

              if (
                val !== undefined &&
                (val.playerStatus === "Active" ||
                  val.playerStatus === "Winner" ||
                  val.playerStatus === "autoWinner")
              ) {
                // console.log('in active d');

                if (currentActive === 6) {
                  // console.log('set to 0');
                  currentActive = 0;
                }
                console.log("currentActive", currentActive);
                localStorage.setItem(
                  "activePlayerIndex",
                  parseInt(currentActive) + 1
                );
                setActivePlayerIndex(parseInt(currentActive) + 1);
                // console.log("activePlayerIndex", activePlayerIndex);
                // console.log("after val", val)
                let seq1 = val.cardSequence1.cards.map((pval, pin) => {
                  let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                  let isJoker = isJokerCard(pval.cardId);
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
                  if (isJoker) {
                    return { img: picked.imageURI2, cardId: pval.cardId };
                  } else {
                    return { img: picked.imageURI, cardId: pval.cardId };
                  }
                });

                let seq3 = val.cardSequence3.cards.map((pval, pin) => {
                  let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                  let isJoker = isJokerCard(pval.cardId);
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
                  if (isJoker) {
                    return { img: picked.imageURI2, cardId: pval.cardId };
                  } else {
                    return { img: picked.imageURI, cardId: pval.cardId };
                  }
                });

                let bseq3 = val.bestSequence3.cards.map((pval, pin) => {
                  let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                  let isJoker = isJokerCard(pval.cardId);
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

                // let bseq6 = val.bestSequence6.cards.map((pval, pin) => {
                //   let picked = Cards.find((o) => o.cardUuid == pval.cardId);
                //   let isJoker = isJokerCard(pval.cardId);
                //   if (isJoker) {
                //     return { img: picked.imageURI2, cardId: pval.cardId };
                //   } else {
                //     return { img: picked.imageURI, cardId: pval.cardId };
                //   }
                // });

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
                  // ...bseq6,
                ];
                let bestSeq1, bestSeq2, bestSeq3, bestSeq4, bestSeq5, bestSeq6;
                let isbestSeq1, isbestSeq2, isbestSeq3, isbestSeq4, isbestSeq5, isbestSeq6;
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
                  isbestSeq5 = val.bestSequence5.groupType;
                }

                // if (val.bestSequence6.cards !== undefined) {
                //   bestSeq6 = [...val.bestSequence6.cards];
                //   isbestSeq6 = val.bestSequence6.groupType;
                // }
                let newBestSeq = [];
                let newBestSeq1 = [];
                let newBestSeq2 = [];
                let newBestSeq3 = [];
                let newBestSeq4 = [];
                let newBestSeq5 = [];
                // let newBestSeq6 = [];
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

                //       if (bestSeq6 !== undefined) {
                //   newBestSeq.push(...bestSeq6);
                //   newBestSeq6 = bestSeq6.map((val, index) => {
                //     let picked = Cards.find((o) => o.cardUuid == val.cardId);
                //     let isJoker = isJokerCard(val.cardId);
                //     if (isJoker) {
                //       return picked.imageURI2;
                //     } else {
                //       return picked.imageURI;
                //     }
                //   });
                // }
                let newBestCards = newBestSeq.map((val, index) => {
                  let picked = Cards.find((o) => o.cardUuid == val.cardId);
                  return picked.imageURI;
                });
                console.log("act");
                setActivePlayerData({
                  ...val.playerId,
                  totalPoints: val.totalPoints,
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
                  // bseq6,
                  newBSeq,
                  bestseq: newBestCards,
                  newBestSeq1,
                  newBestSeq2,
                  newBestSeq3,
                  newBestSeq4,
                  newBestSeq5,
                  // newBestSeq6,
                  bestPoints: val.bestPoints,
                  isbestSeq1,
                  isbestSeq2,
                  isbestSeq3,
                  isbestSeq4,
                  isbestSeq5,
                  // isbestSeq6,
                });
                localStorage.setItem(
                  "ActivePlayer",
                  JSON.stringify({
                    ...val.playerId,
                    totalPoints: val.totalPoints,
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
                    // bseq6,
                    newBSeq,
                    bestseq: newBestCards,
                    newBestSeq1,
                    newBestSeq2,
                    newBestSeq3,
                    newBestSeq4,
                    newBestSeq5,
                    // newBestSeq6,
                    bestPoints: val.bestPoints,
                    isbestSeq1,
                    isbestSeq2,
                    isbestSeq3,
                    isbestSeq4,
                    isbestSeq5,
                    // isbestSeq6,
                  })
                );
              }
            }
            // return {...val}
          }
        });
        // console.log("Active InGame", InGame);
        let LocalActivePlayer = JSON.parse(
          localStorage.getItem("ActivePlayer")
        );
        let newInGame = InGame.map((val, index) => {
          if (
            val.playerId._id.toString() === LocalActivePlayer._id.toString()
          ) {
            return { ...val, isActive: 1 };
          } else {
            return { ...val, isActive: 0 };
          }
        });

        localStorage.setItem("InGame", JSON.stringify(newInGame));
        setInGame(newInGame);
        // console.log('active after', newInGame);
        let localindex = localStorage.getItem("activePlayerIndex");
        let LocalProbability = JSON.parse(localStorage.getItem("probability"));
        setProbability(LocalProbability);
        if (parseInt(screenNo) === 6) {
          localStorage.setItem("screenNo", 1);
        } else {
          localStorage.setItem("screenNo", parseInt(screenNo) + 1);
        }
        // console.log("a pro", LocalProbability, localindex);
        if (LocalProbability !== null && LocalProbability !== undefined) {
          if (LocalProbability[localindex - 1] !== undefined) {
            setActiveWinProb(LocalProbability[localindex - 1]);
            // console.log("scr a", LocalProbability[localindex - 1], localindex);
          }
        }
      }, 3500);
      // dropped and greenLine timing
    }
    console.log("data.isStart", data.isStart);
    if (parseInt(data.isStart) === 0) {
      console.log(
        "data.isStart 2",
        data.isStart,
        localStorage.getItem("firstPlayerIndex")
      );
      localStorage.setItem(
        "activePlayerIndex",
        localStorage.getItem("firstPlayerIndex")
      );
    }
    // }
  }, []);

  // perfect sort data is set here
  let setBestSeqCallback = useCallback((data) => {
    if (data !== undefined) {
      let oldInGame = JSON.parse(localStorage.getItem("InGame"));
      let ActivePlayer = JSON.parse(localStorage.getItem("ActivePlayer"));
      let bestSeq1, bestSeq2, bestSeq3, bestSeq4, bestSeq5;
      let isbestSeq1, isbestSeq2, isbestSeq3, isbestSeq4, isbestSeq5;
      let scrNo = localStorage.getItem("screenNo");
      let bestPoints = 0;
      if (oldInGame !== null && oldInGame !== undefined) {
        let newInGame = oldInGame.map((val, index) => {
          if (data.InGameRes.bestSequence1.cards !== undefined) {
            bestSeq1 = [...data.InGameRes.bestSequence1.cards];
            isbestSeq1 = data.InGameRes.bestSequence1.groupType;
          }

          if (data.InGameRes.bestSequence2.cards !== undefined) {
            bestSeq2 = [...data.InGameRes.bestSequence2.cards];
            isbestSeq2 = data.InGameRes.bestSequence2.groupType;
          }

          if (data.InGameRes.bestSequence3.cards !== undefined) {
            bestSeq3 = [...data.InGameRes.bestSequence3.cards];
            isbestSeq3 = data.InGameRes.bestSequence3.groupType;
          }

          if (data.InGameRes.bestSequence4.cards !== undefined) {
            bestSeq4 = [...data.InGameRes.bestSequence4.cards];
            isbestSeq4 = data.InGameRes.bestSequence4.groupType;
          }

          if (data.InGameRes.bestSequence5.cards !== undefined) {
            bestSeq5 = [...data.InGameRes.bestSequence5.cards];
            isbestSeq5 = data.InGameRes.bestSequence5.groupType;
          }

          // if (data.InGameRes.bestSequence6.cards !== undefined) {
          //   bestSeq6 = [...data.InGameRes.bestSequence6.cards];
          //   isbestSeq6 = data.InGameRes.bestSequence6.groupType;
          // }
          let newBestSeq = [];
          let newBestSeq1 = [];
          let newBestSeq2 = [];
          let newBestSeq3 = [];
          let newBestSeq4 = [];
          let newBestSeq5 = [];
          // let newBestSeq6 = [];
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
          // if (bestSeq6 !== undefined) {
          //   newBestSeq.push(...bestSeq6);
          //   newBestSeq6 = bestSeq6.map((val, index) => {
          //     let picked = Cards.find((o) => o.cardUuid == val.cardId);
          //     let isJoker = isJokerCard(val.cardId);
          //     if (isJoker) {
          //       return picked.imageURI2;
          //     } else {
          //       return picked.imageURI;
          //     }
          //   });
          // }

          if (val._id === data.InGameRes._id) {
            // console.log("id:", data.InGameRes._id, val._id)
            if (scrNo >= 1 && scrNo <= 6) {
              // console.log("best seq ui:", scrNo)
              // newBestSeq = bestSeq1 !== undefined || bestSeq2 !== undefined || bestSeq3 !== undefined || bestSeq4!== undefined ? [...bestSeq1, ...bestSeq2, ...bestSeq3, ...bestSeq4] : []
              let newBestCards = newBestSeq.map((val, index) => {
                let picked = Cards.find((o) => o.cardUuid == val.cardId);
                return picked.imageURI;
              });

              setActivePlayerData({
                ...ActivePlayer,
                bestPoints: data.InGameRes.bestPoints,
                bestseq: newBestCards,
                newBestSeq1,
                newBestSeq2,
                newBestSeq3,
                newBestSeq4,
                newBestSeq5,
                // newBestSeq6,
                isbestSeq1,
                isbestSeq2,
                isbestSeq3,
                isbestSeq4,
                isbestSeq5,
                // isbestSeq6,
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
                  // newBestSeq6,
                  isbestSeq1,
                  isbestSeq2,
                  isbestSeq3,
                  isbestSeq4,
                  isbestSeq5,
                  // isbestSeq6,
                })
              );
              return {
                ...data.InGameRes,
              };
            }
            return {
              ...val,
            };
          } else {
            return { ...val };
          }
        });
        //   console.log("new best:", newInGame);
        setInGame(newInGame);
        localStorage.setItem("InGame", JSON.stringify(newInGame));
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("${baseURL}/api/levels/boxContent");
        // Assuming the response.data is an array
        const deals = response.data;
        if (deals.length > 0) {
          const firstDeal = deals[0];
          const [deal, numbers] = firstDeal.split(" "); // Split the string into "Deal" and "1-3"
          const [start, end] = numbers.split("-"); // Split "1-3" into "1" and "3"
          setDealText(`${deal} ${start}/${end}`); // Join the parts with "/"
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (animateOnce) {
      setAnimateOnce(false); // Disable user card animation after the first render
    }
    if (animateDropCardOnce) {
      setAnimateDropCardOnce(false); // Disable drop card animation after the first render
    }
  }, []); // Run on mount

  useEffect(() => {
    let localIsPick = localStorage.getItem("isPick");
    if (localIsPick !== undefined && localIsPick !== null) {
      setIsPick(localIsPick);
    }

    let localDealNo = localStorage.getItem("dealNumberCount");
    if (localDealNo !== undefined && localDealNo !== null) {
      setDealNumberCount(localDealNo);
    } else {
      setDealNumberCount(props.dealNumberCount);
    }

    localStorage.removeItem("aceJoker");
  }, []);

  useEffect(() => {
    let localindex = localStorage.getItem("activePlayerIndex");
    if (localindex !== undefined && localindex !== null) {
      setActivePlayerIndex(parseInt(localindex));
    }
  }, []);

  useEffect(() => {
    if (socket !== undefined) {
      //   console.log(socket,"socket-1")
      socket.on("setCardSequence", setCardSequence);
      socket.on("setPickCard", setPicked);
      socket.on("showOpenCard", showOpenCard);
      socket.on("setCloseCard", setClosedCard);
      socket.on("setPlayerStatus", setPlayerStatus);
      socket.on("setProbability", setProbabilityScore);
      socket.on("SetPlayerChips", setPlayerChips);
      socket.on("ActivePlayer", setCurrentActivePlayer);
      socket.on("setBestSeq", setBestSeqCallback);
    }
    return () => {
      if (socket) {
        socket.off("ActivePlayer", setCurrentActivePlayer);
        socket.off("setCardSequence", setCardSequence);
      }
    };
  }, [socket]);

  useEffect(() => {
    let LocalAceJoker = localStorage.getItem("aceJoker");
    if (LocalAceJoker !== undefined) {
      setAceJoker(LocalAceJoker);
    } else {
      setAceJoker(props.aceJoker);
    }
  }, [props.aceJoker]);

  useEffect(() => {
    setOldProbability(probability);
    let LocalProbability = JSON.parse(localStorage.getItem("probability"));
    if (LocalProbability !== undefined) {
      setProbability(LocalProbability);
    } else {
      setProbability(props.probability);
    }
    let LocalScreen = localStorage.getItem("screenNo");
    if (LocalScreen !== undefined) {
      setScreenNo(LocalScreen);
    } else {
      setScreenNo(props.screenNo);
    }
    if (probability !== null && probability !== undefined) {
      if (probability[screenNo - 1] !== undefined) {
        setActiveWinProb(probability[screenNo - 1]);
        // console.log('screen',probability[screenNo - 1], screenNo)
      }
    }
  }, [props]);
  //On screen click use Effect
  useEffect(() => {
    let ActivePlayer = JSON.parse(localStorage.getItem("ActivePlayer"));
    if (ActivePlayer !== undefined) {
      setActivePlayerData(ActivePlayer);
      if (ActivePlayer?.bestseq !== undefined) {
        setBestSeq(ActivePlayer.bestseq);
        localStorage.setItem("bestSeq", JSON.stringify(ActivePlayer));
      }
    } else {
      setActivePlayerData(props.activePlayer);
    }
  }, [props.activePlayer]);

  useEffect(() => {
    let LocalInGame = JSON.parse(localStorage.getItem("InGame"));
    if (LocalInGame !== undefined) {
      setInGame(LocalInGame);
    } else {
      setInGame(props.inGame);
    }
  }, [props.inGame]);

  useEffect(() => {
    let LocalProb = JSON.parse(localStorage.getItem("setDealProb"));
    if (LocalProb !== undefined) {
      setDealProb(LocalProb);
    } else {
      setDealProb(props.dealProb);
    }
  }, [props.dealProb]);

  useEffect(() => {
    setplayerPosition(props.playerPosition);

    let jokerCard = localStorage.getItem("jokerCard");
    setJokerCard(jokerCard);

    setTimeout(() => {
      let openCard = localStorage.getItem("openCard");
      setOpenCard(openCard);
      let curOpenCard = localStorage.getItem("curOpenCard");
      setCurOpenCard(curOpenCard);
    }, 1200);

    // console.log("prop active", activePlayerData);
  }, [props]);

  useEffect(() => {
    let LocalIsOpenPick = localStorage.getItem("isOpenPick");
    if (LocalIsOpenPick !== undefined) {
      setIsOpenPick(LocalIsOpenPick);
    } else {
      setIsOpenPick(props.isOpenPick);
    }
    // console.log("is pick", isOpenPick);
  }, [props.isOpenPick]);

  useEffect(() => {
    let LocalIsOpenCard = localStorage.getItem("isOpenCard");
    if (LocalIsOpenCard !== undefined) {
      setIsOpenCard(LocalIsOpenCard);
    } else {
      setIsOpenCard(false);
    }
    console.log("LocalIsOpenCard", LocalIsOpenCard);
  }, []);

  useEffect(() => {
    let LocalIsOpenDrop = localStorage.getItem("isOpenDrop");
    if (LocalIsOpenDrop !== undefined) {
      setIsOpenDrop(LocalIsOpenDrop);
    } else {
      setIsOpenDrop(props.isOpenDrop);
    }
    // console.log("is Drop", isOpenDrop);
  }, [props.isOpenDrop]);

  const setImgCounter = () => {
    setImgCount((prevCounter) => prevCounter + 1);
  };

  const getAnimationClass = () => {
    if (activePlayerData.bseq2.length === 0) {
      return "oc2";
    } else if (activePlayerData.bseq3.length === 0) {
      return "oc3";
    } else if (activePlayerData.bseq4.length === 0) {
      return "oc4";
    } else if (activePlayerData.bseq5.length === 0) {
      return "oc5";
    } else {
      return "oc5"; // Default case
    }
  };
  

  if (
    activePlayerData &&
    activePlayerData.name &&
    activePlayerData.shortphoto
  ) {
    // console.log("cc2:", closeCard)
    if ([activePlayerData.playerStatus]) {
      return (
        <>
          <div className="fade-in-intro">
            <div className="logodiv">
              <LazyLoad height={"100%"}>
                <img src={GRC} alt="" className="grc" />
              </LazyLoad>
            </div>
            <div className="titlebox">
              {/* <img
                            src={TITLEBOX}
                            alt=""
                            className="titleboximg"
                            />
                        <h4 className="psstitle mb-0">Deal {dealNumberCount}</h4> */}
            </div>
          </div>

          <div className="maindiv">
            <div className="leftsection">
              <LazyLoad height={"100%"}></LazyLoad>
              <LazyLoad height={"100%"}></LazyLoad>
              <LazyLoad height={"100%"}></LazyLoad>
              <img
                src={`${base_url}${activePlayerData.shortphoto}`}
                alt=""
                className="deal-user-img"
              />
              {dealProb && (
                <>
                  {/* <img
                                    src={win_meter}
                                    alt=""
                                    className="win_meter"
                                />
                                <img
                                    src={perbg}
                                    alt=""
                                    className="perbg"
                                /> */}
                  {activeWinProb !== 0 && (
                    <>
                      {/* <img
                                            src={activeWinProb >= 60 ? per60 : activeWinProb >= 50 && activeWinProb <= 60 ? per50 : activeWinProb >= 20 && activeWinProb <= 50 ? per20 : per10}
                                            alt=""
                                            className="winperline"
                                        />
                                        <img
                                            src={activeWinProb === 0 ? DOWN : activeWinProb === oldProbability[screenNo - 1] ? UP : activeWinProb > oldProbability[screenNo - 1] ? UP : DOWN}
                                            alt=""
                                            className="winperarrows"
                                        /> */}
                    </>
                  )}
                  {activeWinProb === 0 && (
                    <>
                      {/* <img
                                            src={DOWN}
                                            alt=""
                                            className="winperarrows"
                                        /> */}
                    </>
                  )}

                  {/* <span className="winperdiv"><span className="winpercount">{activeWinProb}</span>%</span> */}
                </>
              )}

              {/* this is where points are hidden when card is picked or when a player has 14 cards  */}
              {bestSeq.length > 0 &&
                (activePlayerData.playerStatus === "Active" ||
                  activePlayerData.playerStatus === "Declared" ||
                  activePlayerData.playerStatus === "Winner" ||
                  activePlayerData.playerStatus === "validDeclaration"
                ) && dealProb == true &&  
                 (
                  <>
                    <span className="pstext">Hand Sort</span>
              
                    <div className="best-points-deal hand-sort-point">
                        {activePlayerData.totalPoints / currentBoosterValue}
                        {/* bottom left perfect sort points  */}
                        <span className="tracking-in-contract-chips-deal-pts points-new">
                         <span>Pts</span> <strong>({currentBoosterValue}x)</strong>
                        </span>
                       
                      </div>
               
                  </>
                )}
                    {(activePlayerData.playerStatus === "Active" ||
                activePlayerData.playerStatus === "Declared" ||
                activePlayerData.playerStatus === "Winner" ||
               
                activePlayerData.playerStatus === "validDeclaration") &&
                dealProb == true && (
                  <>
                    <div className="perfect_sort_cards"></div>
                    {bestSeq.length > 0 && (
                      <>
                        {/* <img
                                        src={PERFECT_SORT}
                                        alt=""
                                        className="perfect_sort"
                                    /> */}
                        <img
                          src={PERFECT_SORT_LIST}
                          alt=""
                          className="perfect_sort_list"
                        />
                      </>
                    )}
                  </>
                )}
              {(activePlayerData.playerStatus === "Active" ||
                activePlayerData.playerStatus === "Declared") && (
                <span className="plstext d-none">Player's Sort</span>
              )}
              <div className="dealdiv">
                <LazyLoad height={"100%"}>
                  {/* <img
                                    src={DEALBG}
                                    alt=""
                                    className="rotate-vert-center-deal-new"
                                /> */}
                </LazyLoad>
                {!(showImage || dealShowImage) &&
                  (activePlayerData.playerStatus === "Winner" ||
                  activePlayerData.playerStatus === "validDeclaration" ? (
                    <span
                      style={{
                        marginLeft: "1px",
                        marginTop: "-15px",
                        fontSize: "40px",
                        fontWeight: "500",
                       fontWeight: "bold",
                      }}
                      className="tracking-in-contract-username"
                    >
                     
                      {(activePlayerData.playerStatus === "Winner" ||
                        activePlayerData.playerStatus ===
                          "validDeclaration") && (
                        <span className="mark-valid">
                           <b>{activePlayerData.name.split(" ")[0]}'s Declaration is </b> <b className="green-color">
                              Valid
                            </b>{" "}
                        </span>
                      )}
                    </span>
                  ) : activePlayerData.playerStatus ===
                    "Dropped" ? null : activePlayerData.playerStatus ===
                    "autoWinner" ? (
                    <>
                      <span className="tracking-in-contract-username auto-winner">
                        {activePlayerData.name.split(" ")[0]} is{" "}
                        <b className="green-color">Auto Winner</b>
                      </span>
                      <span className="tracking-in-contract-chips-deal">
                        {activePlayerData.totalPoints}
                        <span className="tracking-in-contract-chips-deal-pts">
                          {" "}
                          Pts
                        </span>
                      </span>
                    </>
                  ) : (
                    <span
                      style={{
                        marginBottom: "-13px",
                      }}
                      className="tracking-in-contract-username"
                    ></span>
                  ))}

                {activePlayerData.playerStatus === "Active" && (
                  <span
                    style={{
                      marginBottom: "-13px",
                    }}
                    className="tracking-in-contract-username"
                  >
                    {activePlayerData.name.split(" ")[0]} (Perfect Sort)
                  </span>
                )}

{!(showImage || dealShowImage) &&
                  (activePlayerData.playerStatus === "Declared" ? (
                    <span
                      style={{
                        marginLeft: "1px",
                        marginTop: "-15px",
                        fontSize: "40px",
                        fontWeight: "500",
                      }}
                      className="tracking-in-contract-username validation-under-progress"
                    >
                      {activePlayerData.playerStatus === "Declared" && (
                        <>
                          <span className="valdiation_under_progress"
                            style={{
                              fontWeight: "500",
                              color: "#FFC961",
                              fontWeight: "bold",
                              top
                            }}
                          >
                            {" "}
                            {activePlayerData.name.split(" ")[0]}'s card validation under progress <span className="loader-validation"></span>
                          </span>
                          
                        </>
                      )}
                    </span>
                  ) : activePlayerData.playerStatus ===
                    "Dropped" ? null : activePlayerData.playerStatus ===
                    "autoWinner" ? (
                    <>
                      <span className="tracking-in-contract-username auto-winner">
                        {activePlayerData.name.split(" ")[0]} is{" "}
                        <b className="green-color">Auto Winner</b>
                      </span>
                      <span className="tracking-in-contract-chips-deal">
                        {activePlayerData.totalPoints}
                        <span className="tracking-in-contract-chips-deal-pts">
                          {" "}
                          Pts
                        </span>
                      </span>
                    </>
                  ) : (
                    <span
                      style={{
                        marginBottom: "-13px",
                      }}
                      className="tracking-in-contract-username"
                    ></span>
                  ))}

                {(activePlayerData.playerStatus === "Active" ||
                activePlayerData.playerStatus === "Declared" ||
                  activePlayerData.playerStatus === "Dropped") && (
                  <>
                    {activePlayerData.playerStatus !== "Dropped" && (
                      <div className="tracking-in-contract-chips-deal">
                        {activePlayerData.bestPoints / currentBoosterValue}
                        {/* bottom left perfect sort points  */}
                        <span className="tracking-in-contract-chips-deal-pts points-new">
                         <span>Pts</span> <strong>({currentBoosterValue}x)</strong>
                        </span>
                       
                      </div>
                    )}
                  </>
                )}  

                {!(showImage || dealShowImage) &&
                  !(
                    activePlayerData.playerStatus === "Declared" ||
                    activePlayerData.playerStatus === "Rejected" ||
                    activePlayerData.playerStatus === "Winner"
                  ) && (
                    <>
                      {/* <span className="tracking-in-contract-chips-deal">
                        {activePlayerData.totalPoints}
                        <span className="tracking-in-contract-chips-deal-pts">
                          {" "}
                          Ptss
                        </span>
                      </span> */}
                    </>
                  )}

              
                {/* showing total points for hand sort */}
                {!(showImage || dealShowImage) && 
                  (
                    activePlayerData.playerStatus === "Winner" ||
                    activePlayerData.playerStatus === "validDeclaration") && (
                    <>
                         <div className="tracking-in-contract-chips-deal">
                        {activePlayerData.totalPoints / currentBoosterValue}
                        <span className="tracking-in-contract-chips-deal-pts points-new">
                         <span>Ptss</span> <strong>({currentBoosterValue}x)</strong>
                        </span>
                       
                      </div>
                    </>
                  )}
                <div>
                 

                  {showImage && (
                    <img
                      src={auto_declare}
                      alt=""
                      className="validation_div"
                      style={{
                        width: "1920px",
                        height: "184px",
                        marginLeft: "1.57px",
                        marginTop: "-240px",
                      }}
                    />
                  )}

                  {dealShowImage && (
                    <img
                      src={dealShow}
                      alt=""
                      className="validation_div"
                      style={{
                        width: "1920px",
                        height: "184px",
                        marginLeft: "1.57px",
                        marginTop: "-240px",
                      }}
                    />
                  )}
                </div>
              </div>
              {!(showImage || dealShowImage) && (
                <div>
                  {(activePlayerData.playerStatus !== "Dropped" && activePlayerData.playerStatus !== "Rejected") && (
                    <div className="bgdivdealdeal">
                      <LazyLoad height={"100%"}>
                        {activePlayerData.playerStatus === "Declared" ||
                        activePlayerData.playerStatus === "validDeclaration" ||
                        activePlayerData.playerStatus === "Rejected" ||
                        activePlayerData.playerStatus === "Winner" ||
                        activePlayerData.playerStatus === "autoWinner" ? (
                          <img
                            src={dealbgimgnew_declaration}
                            alt=""
                            className="dealbgimgnew_declaration"
                            style={{
                              marginLeft: "-150px",
                              width: "1450px",
                            }}
                          />
                        ) : (
                          <img
                            src={DEALBGIMG}
                            alt=""
                            className="slide-in-left-deal-bg-img-deal"
                          />
                        )}
                      </LazyLoad>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* {(activePlayerData.playerStatus === 'Active' || activePlayerData.playerStatus === 'Dropped') && (<span className="tracking-in-contract-chips-deal">{activePlayerData.totalPoints}<span className="tracking-in-contract-chips-deal-pts"> Pts</span></span>)} */}

            {(activePlayerData.playerStatus === "Dropped" || activePlayerData.playerStatus === "Rejected") && (
              <div className="">
                <img src={tsdealbg} alt="" className="tsdealbg" />
                <img
                  src={ts_deal_username}
                  alt=""
                  className="ts_deal_dropped"
                />
                <img src={ts_deal_bg_bg} alt="" className="ts_deal_bg_bg" />
                <img src={dropped_card} alt="" className="dropped_img" />

                <span className="dealwinnernotext">Deal {dealNumberCount}</span>

                <div className="dropped-user-txt">
                  {activePlayerData.name} has dropped
                </div>
              </div>
            )}

    {/* Players sort or hand sort cards  */}
    {!(showImage || dealShowImage) && dealProb == true && (
              <div
                className={`usercardsdiv delay-load ${
                  (activePlayerData.playerStatus === "Dropped" ||
                    activePlayerData.playerStatus === "Rejected") &&
                  "usercardsdiv-dropped"
                }`}
              >
                {!(
                  activePlayerData.playerStatus === "Dropped" ||
                  activePlayerData.playerStatus === "Rejected"
                ) &&
                  dealProb == true &&
                  (activePlayerData.playerStatus === "Active" ||
                    activePlayerData.playerStatus === "Declared" ||
                    activePlayerData.playerStatus === "Winner" ||
                    activePlayerData.playerStatus === "validDeclaration" 
                  ) && (
                    <>
                 <div className="row">
  <div className="col-auto no-gutters p-1 ps-card-position">
    {activePlayerData.seq1.length > 0 &&
      activePlayerData.seq1.map((value, index) => (
        <div className="ins-div" key={index}>
          {activePlayerData.seq2.length === 0 &&
          activePlayerData.newSeq.length === 14 &&
          activePlayerData.seq1.length - 1 === index ? (
            <div className="roll-in-last-card">
              <img
                src={value.img}
                alt=""
                className={`usercarddeal shadow usercarddeal1${index + 1}`}
              />
            </div>
          ) : (
            <img
              src={value.img}
              alt=""
              className={`usercarddeal shadow usercarddeal1${index + 1}`}
            />
          )}
        </div>
      ))}
  </div>

  <div className="col-auto no-gutters p-1 ps-card-position">
    {activePlayerData.seq2.length > 0 &&
      activePlayerData.seq2.map((value, index) => (
        <div className="ins-div" key={index}>
          {activePlayerData.seq3.length === 0 &&
          activePlayerData.newSeq.length === 14 &&
          activePlayerData.seq2.length - 1 === index ? (
            <div className="roll-in-last-card">
              <img
                src={value.img}
                alt=""
                className={`usercarddeal shadow usercarddeal1${index + 1}`}
              />
            </div>
          ) : (
            <img
              src={value.img}
              alt=""
              className={`usercarddeal shadow usercarddeal1${index + 1}`}
            />
          )}
        </div>
      ))}
  </div>

  <div className="col-auto no-gutters p-1 ps-card-position">
    {activePlayerData.seq3.length > 0 &&
      activePlayerData.seq3.map((value, index) => (
        <div className="ins-div" key={index}>
          {activePlayerData.seq4.length === 0 &&
          activePlayerData.newSeq.length === 14 &&
          activePlayerData.seq3.length - 1 === index ? (
            <div className="roll-in-last-card">
              <img
                src={value.img}
                alt=""
                className={`usercarddeal shadow usercarddeal1${index + 1}`}
              />
            </div>
          ) : (
            <img
              src={value.img}
              alt=""
              className={`usercarddeal shadow usercarddeal1${index + 1}`}
            />
          )}
        </div>
      ))}
  </div>

  <div className="col-auto no-gutters p-1 ps-card-position">
    {activePlayerData.seq4.length > 0 &&
      activePlayerData.seq4.map((value, index) => (
        <div className="ins-div" key={index}>
          {activePlayerData.newSeq.length === 14 &&
          activePlayerData.seq4.length - 1 === index ? (
            <div className="roll-in-last-card">
              <img
                src={value.img}
                alt=""
                className={`usercarddeal shadow usercarddeal1${index + 1}`}
              />
            </div>
          ) : (
            <img
              src={value.img}
              alt=""
              className={`usercarddeal shadow usercarddeal1${index + 1}`}
            />
          )}
        </div>
      ))}
  </div>

  <div className="col-auto no-gutters p-1 ps-card-position">
    {activePlayerData.seq5.length > 0 &&
      activePlayerData.seq5.map((value, index) => (
        <div className="ins-div" key={index}>
          {activePlayerData.newSeq.length === 14 &&
          activePlayerData.seq5.length - 1 === index ? (
            <div className="roll-in-last-card">
              <img
                src={value.img}
                alt=""
                className={`usercarddeal shadow usercarddeal1${index + 1}`}
              />
            </div>
          ) : (
            <img
              src={value.img}
              alt=""
              className={`usercarddeal shadow usercarddeal1${index + 1}`}
            />
          )}
        </div>
      ))}
  </div>

  <div className="col-auto no-gutters ps-card-position p-1">
    {activePlayerData.seq6.length > 0 &&
      activePlayerData.seq6.map((value, index) => (
        <div className="ins-div" key={index}>
          {activePlayerData.newSeq.length === 14 &&
          activePlayerData.seq6.length - 1 === index ? (
            <div className="roll-in-last-card">
              <img
                src={value.img}
                alt=""
                className={`usercarddeal shadow usercarddeal1${index + 1}`}
              />
            </div>
          ) : (
            <img
              src={value.img}
              alt=""
              className={`usercarddeal shadow usercarddeal1${index + 1}`}
            />
          )}
        </div>
      ))}
  </div>
</div>

                  </>
                )}

               
                {activePlayerData.playerStatus === "Dropped" && <></>}
              </div>
            )}

{/* Perfect sort cards  */}
{!(showImage || dealShowImage)  && (
              <div
                className={`usercardsdivPs delay-load ${
                  (activePlayerData.playerStatus === "Dropped" ||
                    activePlayerData.playerStatus === "Rejected") &&
                  "usercardsdiv-dropped"
                }`}
              >


{( activePlayerData.playerStatus !== "Dropped" && activePlayerData.playerStatus !== "Rejected") && (
                  <>
                   <div className="row">
  <div className="col-auto no-gutters p-1 ps-card-position">
    {activePlayerData.bseq1.length > 0 &&
      activePlayerData.bseq1.map((value, index) => (
        <div className="ins-div">
          {activePlayerData.bseq2.length === 0 &&
          activePlayerData.newBSeq.length === 14 &&
          activePlayerData.bseq1.length - 1 === index ? (
            <div className="roll-in-last-card">
              <img
                src={value.img}
                alt=""
                className={`usercarddealPs ${
                  isDropCard !== null &&
                  isDropCard == value.cardId &&
                  `discard14 border-fluorescent`
                } usercard14 shadow usercarddeal1${index + 1}`}
              />
                 
                                  <img
                                    className="highlight-sets"
                                    src={highlightSets}
                                    alt=""
                                  />
                              
            </div>
          ) : (
            <img
              src={value.img}
              alt=""
              className={`usercarddealPs ${
                isDropCard !== null &&
                isDropCard == value.cardId &&
                `discard${index + 1} border-fluorescent`
              } shadow usercarddeal1${index + 1}`}
            />
          )}
        </div>
      ))}
  </div>
  <div className="col-auto no-gutters p-1 ps-card-position">
    {activePlayerData.bseq2.length > 0 &&
      activePlayerData.bseq2.map((value, index) => (
        <div className="ins-div">
          {activePlayerData.bseq3.length === 0 &&
          activePlayerData.newBSeq.length === 14 &&
          activePlayerData.bseq2.length - 1 === index ? (
            <div className="roll-in-last-card">
              <img
                src={value.img}
                alt=""
                className={`usercarddealPs ${
                  isDropCard !== null &&
                  isDropCard == value.cardId &&
                  `discard14 border-fluorescent`
                } usercard14 shadow usercarddeal1${index + 1}`}
              />
            </div>
          ) : (
            <img
              src={value.img}
              alt=""
              className={`usercarddealPs ${
                isDropCard !== null &&
                isDropCard == value.cardId &&
                `discard${
                  activePlayerData.bseq1.length + index + 1
                } border-fluorescent`
              } shadow usercarddeal1${index + 1}`}
            />
          )}
        </div>
      ))}
  </div>
  <div className="col-auto no-gutters p-1 ps-card-position">
    {activePlayerData.bseq3.length > 0 &&
      activePlayerData.bseq3.map((value, index) => (
        <div className="ins-div">
          {activePlayerData.bseq4.length === 0 &&
          activePlayerData.newBSeq.length === 14 &&
          activePlayerData.bseq3.length - 1 === index ? (
            <div className="roll-in-last-card">
              <img
                src={value.img}
                alt=""
                className={`usercarddealPs ${
                  isDropCard !== null &&
                  isDropCard == value.cardId &&
                  `discard14 border-fluorescent`
                } usercard14 shadow usercarddeal1${index + 1}`}
              />
            </div>
          ) : (
            <img
              src={value.img}
              alt=""
              className={`usercarddealPs ${
                isDropCard !== null &&
                isDropCard == value.cardId &&
                `discard${
                  activePlayerData.bseq1.length +
                  activePlayerData.bseq2.length +
                  index +
                  1
                } border-fluorescent`
              } shadow usercarddeal1${index + 1}`}
            />
          )}
        </div>
      ))}
  </div>
  <div className="col-auto no-gutters p-1 ps-card-position">
    {activePlayerData.bseq4.length > 0 &&
      activePlayerData.bseq4.map((value, index) => (
        <div className="ins-div">
          {activePlayerData.newBSeq.length === 14 &&
          activePlayerData.bseq4.length - 1 === index ? (
            <div className="roll-in-last-card">
              <img
                src={value.img}
                alt=""
                className={`usercarddealPs ${
                  isDropCard !== null &&
                  isDropCard == value.cardId &&
                  `discard14 border-fluorescent`
                } usercard14 shadow usercarddeal1${index + 1}`}
              />
            </div>
          ) : (
            <img
              src={value.img}
              alt=""
              className={`usercarddealPs ${
                isDropCard !== null &&
                isDropCard == value.cardId &&
                `discard${
                  activePlayerData.bseq1.length +
                  activePlayerData.bseq2.length +
                  activePlayerData.bseq3.length +
                  index +
                  1
                } border-fluorescent`
              } shadow usercarddeal1${index + 1}`}
            />
          )}
        </div>
      ))}
  </div>
  <div className="col-auto no-gutters p-1 ps-card-position">
    {activePlayerData.bseq5.length > 0 &&
      activePlayerData.bseq5.map((value, index) => (
        <div className="ins-div">
          {activePlayerData.newBSeq.length === 14 &&
          activePlayerData.bseq5.length - 1 === index ? (
            <div className="roll-in-last-card">
              <img
                src={value.img}
                alt=""
                className={`usercarddealPs ${
                  isDropCard !== null &&
                  isDropCard == value.cardId &&
                  `discard14 border-fluorescent`
                } usercard14 shadow usercarddeal1${index + 1}`}
              />
            </div>
          ) : (
            <img
              src={value.img}
              alt=""
              className={`usercarddealPs ${
                isDropCard !== null &&
                isDropCard == value.cardId &&
                `discard${
                  activePlayerData.bseq1.length +
                  activePlayerData.bseq2.length +
                  activePlayerData.bseq3.length +
                  activePlayerData.bseq4.length +
                  index +
                  1
                } border-fluorescent`
              } shadow usercarddeal1${index + 1}`}
            />
          )}
        </div>
      ))}
  </div>
</div>

                  </>
                )}	

               
{(activePlayerData.playerStatus === "Dropped" || activePlayerData.playerStatus === "Rejected") && <></>}
              </div>
            )}
            {!(showImage || dealShowImage) && (
              <div className="deck-holder-deal delay-load">
                <img src={close_deck} alt="" className="close_deck" />
                <img src={close_deck_back_card} className="close_deck_fixed" />
                <img
                  src={
                    closeCard === null ||
                    closeCard === undefined ||
                    Object.keys(closeCard).length === 0
                      ? close_deck_back_card
                      : closeCard
                  }
                  alt=""
                  className={`${
                    closeCard === null ||
                    closeCard === undefined ||
                    Object.keys(closeCard).length === 0
                      ? "close_deck_back_card"
                      : "blue-highlight closeCard shadow"
                  } ${isCloseCard === true ? "jumpclosecard" : ""}`}
                />
                <img
                  src={open_card_holder}
                  alt=""
                  className="open_card_holder_deal"
                />
                {openCard !== null && openCard !== undefined && (
                  <>
                    {/* {console.log("isopen", isOpenPick)} */}
                    {/* isOpenDrop === "true" ? "animateopencarddrop" : */}
                    <div className="">
                      {/* <img
                                        src={openCard === null ? back_card_min : openCard}
                                        alt=""
                                        className={`open_back_card_holder_deal shadow`}
                                    /> */}
                      <div className="flip-open">
                        <div
                          className={`flip-open-inner ${
                            (activePlayerData.playerStatus === "Declared" ||
                              activePlayerData.playerStatus === "Winner" ||
                              activePlayerData.playerStatus === "autoWinner") &&
                            "flipo"
                          }`}
                        >
                   <div className="flip-open-front ">
                            <img
                              src={openCard === null ? back_card_min : openCard}
                              alt=""
                              className={`oc shadow `}
                            />
                            <img
                              src={
                                curOpenCard === null
                                  ? back_card_min
                                  : curOpenCard
                              }
                              alt=""
                              className={`oc shadow ${
                                isOpenCard === true
                                  ? activePlayerData.bseq2.length === 0
                                    ? "oc2"
                                    : activePlayerData.bseq3.length === 0
                                    ? "oc3"
                                    : activePlayerData.bseq4.length === 0
                                    ? "oc4"
                                    : activePlayerData.bseq5.length === 0
                                    ? "oc5"
                                    : "oc5"
                                  : ""
                              }`}
                            />
                          </div>
                          <div className="flip-open-back">
                            <img
                              src={back_card_min}
                              alt=""
                              style={{ borderRadius: "5px" }}
                              className="bacopen"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {/* <img
                            src={joker_card_holder}
                            alt=""
                            className="joker_card_holder_deal"
                        /> */}
                <img
                  src={jokerCard}
                  alt=""
                  className="joker_card_min_deal shadow"
                />
                {aceJoker !== "true" && aceJoker !== true && (
                  <img
                    src={joker_min_on_card}
                    alt=""
                    className="joker_min_on_card_deal"
                  />
                )}
              </div>
            )}
            {!(showImage || dealShowImage) && (
              <div className="rightsection-deal">
                <div>
                  <img
                    src={levelTopRight}
                    alt=""
                    className="levelTopRight"
                    style={{
                      width: "484px",
                      height: "80px",
                      marginLeft: "-228px",
                      marginBottom: "-50px",
                    }}
                  />
                  <h2
                    style={{
                      marginTop: "-15px",
                      marginLeft: "-145px",
                      display: "flex",
                      position: "absolute",
                      fontFamily: "Roboto",
                      fontSize: "32px",
                      fontWeight: "800",
                      letterSpacing: "2%",
                      color: "transparent", // Set text color to transparent
                      background:
                        "linear-gradient(180deg, #FFFFFF 18.57%, #FFC961 54.51%, #FF9900 87.14%)",
                      WebkitBackgroundClip: "text", // Clip the background to the text
                      MozBackgroundClip: "text",
                      WebkitTextFillColor: "transparent", // Set text fill color to transparent
                    }}
                  >
                    Level {showLevel} &nbsp;
                    <i className="orange_font">({currentBoosterValue}x)</i>
                  </h2>

                  <span
                    style={{
                      marginTop: "-15px",
                      marginLeft: "85px",
                      color: "#fff",
                      fontSize: "30px",
                      fontWeight: "500",
                      display: "flex",
                      position: "absolute",
                      width: "148px",
                      fontFamily: "Roboto",
                    }}
                  >
                    {" "}
                    {showDeal}
                  </span>
                </div>
                {inGame &&
                  inGame.length > 0 &&
                  inGame.map((value, index) => (
                    <>
                      {(value.playerStatus === "Dropped" || value.playerStatus === "Rejected") && (
                        <span className={`dropped-text drop-text-${index + 1}`}>
                          Dropped
                        </span>
                      )}
                      {value.playerStatus === "Eliminated" && (
                        <span className={`dropped-text drop-text-${index + 1}`}>
                          Eliminated
                          {/* {`Eliminated (${eliminatedCount})`} */}
                        </span>
                      )}
                      <div
                        className={`deal-slide ${
                          (value.playerStatus === "Dropped" ||  value.playerStatus === "Rejected" ||
                            value.playerStatus === "Eliminated") &&
                          "deal-slide-dropped"
                        }`}
                      >
                        <div
                          className={`deal-slide${index + 1} ${
                            value.isActive && "deal-user-scale-up"
                          }`}
                        >
                          <div className={`bg${index + 1}`}>
                            <LazyLoad height={"100%"}>
                              <img
                                src={RPBG}
                                alt=""
                                className={`rpbg-deal ${
                                  activePlayerIndex === index + 1 &&
                                  "green_underline"
                                }`}
                              />
                            </LazyLoad>
                            <LazyLoad height={"100%"}>
                              {/* <img
                                                    src={DCBB}
                                                    alt=""
                                                    className="bbg-deal"
                                                /> */}
                            </LazyLoad>
                          </div>
                          <div className={`user${index + 1} user-deal`}>
                            <LazyLoad height={"100%"}>
                              <img
                                src={`${base_url}${value.playerId.shortphoto}`}
                                alt=""
                                className="rightuserimgdeal"
                              />
                            </LazyLoad>
                          </div>
                          {value.playerStatus !== "Eliminated" &&
                            value.playerStatus !== "Dropped" && (
                              <span className={`username user${index + 1}name`}>
                                {value.playerId.name !== undefined &&
                                  value.playerId.name.split(" ")[0]}{" "}
                                {value.playerId.name !== undefined &&
                                  value.playerId.name.split(" ")[1].charAt(0)}
                              </span>
                            )}

                          {index === inGame.length - 1 &&
                            value.dMarker === "true" && (
                              <div>
                                <img
                                  className="slide-in-right"
                                  src={DIMG}
                                  alt=""
                                  style={{
                                    display: "flex",
                                    width: "52px",
                                    height: "52px",
                                    position: "absolute",
                                    left: "-170px",
                                    top: "70px",
                                    zIndex: "1000",
                                    animation: "slideInRight 1s ease-in-out",
                                  }}
                                />
                              </div>
                            )}

                          {index === inGame.length - 2 &&
                            value.dMarker === "true" && (
                              <div>
                                <img
                                  className="slide-in-right"
                                  src={DIMG}
                                  alt=""
                                  style={{
                                    display: "flex",
                                    width: "52px",
                                    height: "52px",
                                    position: "absolute",
                                    left: "-170px",
                                    top: "70px",
                                    zIndex: "1000",
                                    animation: "slideInRight 1s ease-in-out",
                                  }}
                                />
                              </div>
                            )}

                          {index === inGame.length - 3 &&
                            value.dMarker === "true" && (
                              <div>
                                <img
                                  className="slide-in-right"
                                  src={DIMG}
                                  alt=""
                                  style={{
                                    display: "flex",
                                    width: "52px",
                                    height: "52px",
                                    position: "absolute",
                                    left: "-170px",
                                    top: "70px",
                                    zIndex: "1000",
                                    animation: "slideInRight 1s ease-in-out",
                                  }}
                                />
                              </div>
                            )}

                          {index === inGame.length - 4 &&
                            value.dMarker === "true" && (
                              <div>
                                <img
                                  className="slide-in-right"
                                  src={DIMG}
                                  alt=""
                                  style={{
                                    display: "flex",
                                    width: "52px",
                                    height: "52px",
                                    position: "absolute",
                                    left: "-170px",
                                    top: "70px",
                                    zIndex: "1000",
                                    animation: "slideInRight 1s ease-in-out",
                                  }}
                                />
                              </div>
                            )}

                          {index === inGame.length - 5 &&
                            value.dMarker === "true" && (
                              <div>
                                <img
                                  className="slide-in-right"
                                  src={DIMG}
                                  alt=""
                                  style={{
                                    display: "flex",
                                    width: "52px",
                                    height: "52px",
                                    position: "absolute",
                                    left: "-170px",
                                    top: "70px",
                                    zIndex: "1000",
                                    animation: "slideInRight 1s ease-in-out",
                                  }}
                                />
                              </div>
                            )}

                          {index === inGame.length - 6 &&
                            value.dMarker === "true" && (
                              <div>
                                <img
                                  className="slide-in-right"
                                  src={DIMG}
                                  alt=""
                                  style={{
                                    display: "flex",
                                    width: "52px",
                                    height: "52px",
                                    position: "absolute",
                                    left: "-170px",
                                    top: "70px",
                                    zIndex: "1000",
                                    animation: "slideInRight 1s ease-in-out",
                                  }}
                                />
                              </div>
                            )}

                          {/* <img
                                            src={CHIP}
                                            alt=""
                                            className={`chip chip${index+1}`}
                                        /> */}
                          {/* <img
                                            src={STAR}
                                            alt=""
                                            className="stardeal"
                                        /> */}
                          {/* <span className={`userchips user${index+1}chips`}>960</span> */}

{/* Pts (bestPoints and totalPoints )shown on right hand side  */}
                             <span className="userpointsdeal">
            {activePlayerData.playerStatus === "Declared" ? (
              <>
                {/* Conditionally render loader if the player is not Dropped or Eliminated */}
                {value.playerStatus !== "Dropped" &&
                  value.playerStatus !== "Eliminated" && (
                    <div className="loader"></div>
                )}

                {value.isActive
                  ? activePlayerData.bestPoints
                  : value.bestPoints}{" "}
                <span className="pts">Pts</span>
              </>
            ) : activePlayerData.playerStatus === "validDeclaration" ||
              activePlayerData.playerStatus === "Winner" ||
              activePlayerData.playerStatus === "autoWinner" ? (
              <>
                {value.isActive
                  ? activePlayerData.totalPoints
                  : value.totalPoints}{" "}
                <span className="pts">Pts</span>
              </>
            ) : (
              <>
                {value.isActive
                  ? activePlayerData.bestPoints
                  : value.bestPoints}{" "}
                <span className="pts">Pts</span>
              </>
            )}
          </span>
                        </div>
                      </div>
                      {/* {value.dMarker === "true" && (
                                    <img className={`slide-in-right dimgs dimg${index + 1}`}
                                        src={DIMG}
                                        alt=""
                                        style={{
                                        animation: "slideInRight 1s ease-in-out"
                                        
                                        }}
                                    />
                                )} */}
                    </>
                  ))}
              </div>
            )}
            {/* {dealProb && (
                        
                        <>
                            {inGame && inGame.length > 0 && inGame.map((value, index) => (
                                <>
                                    <span className={`probname probname${index + 1}`}>{value.playerId.name.split(' ')[0]}</span>
                                    <img
                                        src={probability[index] === 0 ? DOWN : probability[index] === oldProbability[index] ? UP : probability[index] > oldProbability[index] ? UP : DOWN}
                                        alt=""
                                        className={`deal-sign deal-sign${index + 1}`}
                                    />
                                    <span className={`probc probc${index + 1}`}>{probability[index]}%</span>
                                </>
                            ))}

                          
                            <img
                                src={prob_rect}
                                alt=""
                                className="prob_rect"
                            />

                        </>
                    )} */}
          </div>
        </>
      );
    }
  }
}
