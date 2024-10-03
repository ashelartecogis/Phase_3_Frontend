import React, { useEffect, useState } from "react";
import "./css/CardDeal.css";
import GRC from "../images/grc_logo_new.png";
import TITLEBOX from "../images/titlebox.png";
import RC from "../images/rc.svg";
import DEALCOUNT from "../images/dealcount.png";
import CHIP from "../images/chip.svg";
import CARDDEALBG from "../images/carddealbgnew.png";
import CARDDEALBGBLACK from "../images/carddealbgblacknew2.png";
import dealing_cards from "../images/dealing_cards.png";
import maskGroup from "../images/maskGroup.png";
import cardback from "../images/cardback.png";
import levelsIntro from "../images/levelIntro.png";
import LazyLoad from "react-lazyload";
import { base_url } from "../config";
import axios from "axios";
import baseURL from "../baseURL";
import eliminatedBg from "../images/EliminatedBg.png";
import {
  levelNumber as levelNumberEndpoint,
  getPlayerTotalChips,
  getLatestDealNumber,
  getLastIngame,
  getDeals
} from "../server/Api";
export default function CardDeal(props) {
  const [showLevelsIntro, setShowLevelsIntro] = useState(true);
  const [playerPosition, setPlayerPosition] = useState([]);
  const [dealNumberCount, setDealNumberCount] = useState(1);
  const [dealPlayerCount, setDealPlayerCount] = useState(0);
  const [dealCardCount, setDealCardCount] = useState(0);
  const [levelNumber, setLevelNumber] = useState(null);
  const [latestDealNumber, setLatestDealNumber] = useState("");
  const [booster, setBooster] = useState(0);
  const [currentBoosterValue, setCurrentBoosterValue] = useState(0);
  const [playerIds, setPlayerIds] = useState([]);
  const [data, setData] = useState([]);
  const [playerData, setPlayerData] = useState([]);
  const [playerStatus, setPlayerStatus] = useState("");
  const [rankings, setRankings] = useState([]);
  const [inGame, setInGame] = useState({});
  const boosterEndpoint = "http://192.168.9.245:8000/api/levels/boosters";
  const levelNumberEndpoint = "http://192.168.9.245:8000/api/levels/levelNumber";
  const dealNumberEndpoint = "http://192.168.9.245:8000/api/table/getLatestDealNumber";
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
  }, []); // Add socket as a dependency


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

  }, []);

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
    const fetchPlayerData = async () => {
      try {
        const response = await axios.get('http://192.168.9.245:8000/api/players/getPlayerTotalChips');
        const data = response.data.map(player => ({
          playerId: player._id,
          totalChips: player.totalChips
        }));
        setPlayerData(data);
      } catch (error) {
        console.error('Error fetching player data:', error);
      }
    };
    fetchPlayerData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://192.168.9.245:8000/api/ingame/getPlayerIdAndStatus");
        if (response.data && response.data.length > 0) {
          const fetchedPlayerIds = response.data.map(player => player.playerId);
          setPlayerIds(fetchedPlayerIds);
          const fetchedPlayerStatus = response.data[0].playerStatus;
          setPlayerStatus(fetchedPlayerStatus);
        }
      } catch (error) {
        console.error("Error fetching player data:", error);
      }
    };
    fetchData();
  }, []);

  async function calculateBoosterValue() {
    try {
      const [boostersResponse, levelNumberResponse, dealNumberResponse] = await Promise.all([
        axios.get(boosterEndpoint),
        axios.get(levelNumberEndpoint),
        axios.get(dealNumberEndpoint),
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
        boosterIndex = dealNumber <= 3 ? 0 : dealNumber <= 6 ? 1 : dealNumber <= 9 ? 2 : 3;
      } else if (levelNumber === 6) {
        boosterIndex = dealNumber <= 2 ? 0 : dealNumber <= 4 ? 1 : dealNumber <= 6 ? 2 : dealNumber <= 8 ? 3 : dealNumber <= 10 ? 4 : 5;
      } else if (levelNumber === 12) {
        boosterIndex = Math.min(dealNumber - 1, 11);
      }

      const currentBoosterValue = boostersData[boosterIndex];
      setCurrentBoosterValue(currentBoosterValue);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  useEffect(() => {
    calculateBoosterValue();
  }, [latestDealNumber]);

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
    const fetchLevelNumber = async () => {
      try {
        const levelResponse = await axios.get(levelNumberEndpoint);
        setLevelNumber(levelResponse.data);
      } catch (error) {
        console.error("Error fetching level number:", error);
      }
    };
    fetchLevelNumber();
  }, []);

  useEffect(() => {
    axios.get(boosterEndpoint)
      .then((response) => {
        setBooster(response.data[0]);
      })
      .catch((error) => {
        console.error("Error fetching booster:", error);
      });
  }, []);

  useEffect(() => {
    setPlayerPosition(props.playerPosition);
    if (props.dealtCards.length > 0) {
      setPlayerPosition(props.dealtCards);
    }
    let localDealPlayerCount = localStorage.getItem("dealPlayerCount");
    let localDealCardCount = localStorage.getItem("dealCardCount");

    if (localDealPlayerCount !== undefined && localDealPlayerCount !== null && !isNaN(localDealPlayerCount)) {
      setDealPlayerCount(localDealPlayerCount);
    }

    if (localDealCardCount !== undefined && localDealCardCount !== null && !isNaN(localDealCardCount)) {
      setDealCardCount(localDealCardCount);
    }
  }, [props]);

  useEffect(() => {
    let localDealNo = localStorage.getItem("dealNumberCount");
    if (localDealNo !== undefined && localDealNo !== null) {
      setDealNumberCount(localDealNo);
    } else {
      setDealNumberCount(props.dealNumberCount);
    }

    const timer = setTimeout(() => {
      setShowLevelsIntro(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [props.dealNumberCount]);

  function displayLevelAndDeal() {
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

    return (
      <>
        <div className="levelintro-top">
          <span
            style={{
              position: "relative",
              left: "-90px",
              background: "linear-gradient(180deg, #FFFFFF 18.57%, #FFC961 54.51%, #FF9900 87.14%)",
              WebkitBackgroundClip: "text",
              color: "transparent",
              fontWeight: "500",
            }}
          >
            Level {showLevel} ({currentBoosterValue}x)
          </span>
          <span>{showDeal}</span>
        </div>
        <div className="levelintro-bottom">
          <span>Max Points {currentBoosterValue * 80} &nbsp;|&nbsp;&nbsp;</span>
          <span>First Drop {(currentBoosterValue * 80) / 4}</span>
        </div>
      </>
    );
  }

  return (
    <>
      {showLevelsIntro && (
        <div>
          <img src={levelsIntro} alt="" className="levelintrobg" />
          {displayLevelAndDeal()}
        </div>
      )}
      {!showLevelsIntro && (
        <>
          <img
            src={dealing_cards}
            alt=""
            className="dealing_cards"
            style={{
              display: "flex",
              position: "relative",
              width: "540px",
              height: "320px",
              left: "-2%",
              top: "-715px",
            }}
          />
          <div className="fade-in-intro">
            <div className="logodiv">
              <LazyLoad height={"100%"}>
                <img src={GRC} alt="" className="grc" />
              </LazyLoad>
            </div>
            <div className="titlebox">
              {/* <img src={TITLEBOX} alt="" className="titleboximg" />
              <h4 className="psstitle mb-0">Deal {dealNumberCount}</h4> */}
            </div>
          </div>
          <div className="maindiv">
            {/* <span className="dealcount">Dealing <span className="dealcounttop">({dealCardCount} of 13)</span></span> */}
            <img src={DEALCOUNT} alt="" className="dealcountimg" />
            {playerPosition &&
              playerPosition.length > 0 &&
              playerPosition.map((value, index) => {
                const player = playerData.find(p => p.playerId === value.playerId._id);
                return (
                  <div className={`cardan cardan${index + 1}`} key={index}>
                    <div className="userdetail">
                      <img src={CARDDEALBG} alt="" className="carddealbgimgdeal" />
                      <img
                        src={`${base_url}${value && value.playerId && value.playerId.shortphoto ? value.playerId.shortphoto : value.photo}`}
                        alt=""
                        className="cduser"
                      />
                      <span className="cdusername">
                        {value && value.playerId && value.playerId.name ? value.playerId.name.split(" ")[0] : value.name.split(" ")[0]}
                      </span>
                      <span className="cdchips">
                        <img src={CHIP} alt="" className="cdchip" />
                        {player ? player.totalChips : value.playerId.totalChips}
                      </span>
                      {playerIds && playerIds.includes(value.playerId._id) ? (
                        <span className={`res-drop-text eliminated-drop-cd res-drop-text-${index + 1}`}>
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
                      ) : null}
                    </div>
                    <div className={`allcards`}>
                      <div className="cardline1">
                        {Array.from({ length: 13 }, (_, i) => (
                          <img
                            src={cardback}
                            alt=""
                            className={`cl${i + 1}`}
                            key={i}
                          />
                        ))}
                      </div>
                      <div className="dcard">
                        {value &&
                          value.cards &&
                          value.cards.map((cval, cindex) => (
                            <div
                              key={cindex}
                              className={`flip-card-inner bor${index + 1} shadow shadow-dark ${value.tossCard !== "" ? `flipnew` : ``}`}
                            >
                              <div className="flip-card-front">
                                <img src={cardback} alt="" />
                              </div>
                              <div className="flip-card-back">
                                <img
                                  src={cval}
                                  alt=""
                                  className={`cdcard${index + 1} cdcard${index + 1}${cindex + 1}`}
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </>
  );
}
