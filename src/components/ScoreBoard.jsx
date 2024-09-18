import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/ScoreBoard.css";
import "./css/sb_level3.css";
import "./css/sb_level6.css";
import "./css/sb_level12.css";
import "./css/sb_level1.css";
import "./css/sb_level2.css";
import "./css/sb_level4.css";
import "./css/newsb.css";
import "./css/scoreboard-elimanation.css";
import GRC from "../images/grc_logo_new.png";
import sbuserlist from "../images/sbuserlist.png";
import chipsm from "../images/chip.png";
import sbpointbg from "../images/sbpoint-bg.png";
import sbpointbgl3 from "../images/sbpoint-l3-bg.png";
import sbpointbgl6 from "../images/sbpoint-l6-bg.png";
import sbpointbgl12 from "../images/sbpoint-l12-bg.png";
import sbpointbgl1 from "../images/sbpoint-l1-bg.png";
import sbheadsm from "../images/sbheadsm.png";
import sbheadsm_l1 from "../images/sbpoint-l1-bg.png";
import sbeliminated from "../images/sb-eliminated.png";
import green_pointer from "../images/Green_pointer.png";
import baseURL from "../baseURL";
export default function ScoreBoard(props) {
  const [playerData, setPlayerData] = useState([]);
  const [totalPoints, setTotalPoints] = useState([]);
  const [deals, setDeals] = useState([]);
  const [latestDealNumber, setLatestDealNumber] = useState("");
  const [status, setStatus] = useState([]);
  const [showPointsOne, setShowPointsOne] = useState(false);
  const [showPointsTwo, setShowPointsTwo] = useState(false);
  const [showPointsThree, setShowPointsThree] = useState(false);
  const [showPointsFour, setShowPointsFour] = useState(false);
  const [showPointsFive, setShowPointsFive] = useState(false);
  const [showPointsSix, setShowPointsSix] = useState(false);
  const [showPointsSeven, setShowPointsSeven] = useState(false);
  const [showPointsEight, setShowPointsEight] = useState(false);
  const [showPointsNine, setShowPointsNine] = useState(false);
  const [showPointsTen, setShowPointsTen] = useState(false);
  const [showPointsEleven, setShowPointsEleven] = useState(false);
  const [showPointsTwelve, setShowPointsTwelve] = useState(false);
  const [boosters, setBoosters] = useState([]);
  const [level, setLevel] = useState("");

  useEffect(() => {
    const fetchLevel = async () => {
      try {
        const response = await axios.get(
          "http://192.168.9.245:8000/api/levels/levelNumber"
        );
        setLevel(response.data);
      } catch (error) {
        console.error("error fetching level:", error);
      }
    };

    fetchLevel();
  }, []);

  useEffect(() => {
    const fetchBoosters = async () => {
      try {
        const response = await axios.get(`${baseURL}:8000/api/levels/boosters`);
        setBoosters(response.data);
      } catch (error) {
        console.error("Error fetching boosters:", error);
      }
    };

    fetchBoosters();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playerPositionResponse = await axios.get(
          `${baseURL}:8000/api/table/getPlayerPosition`
        );
        const totalChipsResponse = await axios.get(
          `${baseURL}:8000/api/players/getPlayerTotalChips`
        );
        const totalPointsResponse = await axios.get(
          `${baseURL}:8000/api/ingame/getAllTotalPoints`
        );

        const playerPositionData = playerPositionResponse.data;
        const totalChipsData = totalChipsResponse.data;
        const totalPointsData = totalPointsResponse.data;

        // Merge player position data with total chips and total points data
        const mergedData = playerPositionData
          .map((player) => {
            const matchingPlayer = totalChipsData.find(
              (p) => p._id === player.playerId
            );
            const matchingTotalPoints = totalPointsData.find(
              (p) => p.playerId === player.playerId
            );
            console.log(
              "Matching Player for",
              player.playerId,
              ":",
              matchingPlayer
            );
            console.log(
              "Matching Total Points for",
              player.playerId,
              ":",
              matchingTotalPoints
            );
            if (matchingPlayer && matchingTotalPoints) {
              return {
                ...player,
                name: matchingPlayer.name,
                shortPhoto: matchingPlayer.shortphoto,
                totalChips: matchingPlayer.totalChips,
                eliminationLevel: matchingPlayer.eliminationLevel, // Set elimination level
                eliminationPosition: matchingPlayer.eliminationPosition,
                playerStatus: matchingTotalPoints.playerStatus,
              };
            } else {
              return null;
            }
          })
          .filter((player) => player !== null); // Remove null values

        console.log("Merged Data:", mergedData);

        // Filter out non-eliminated players
        const nonEliminatedPlayers = mergedData.filter(
          (player) => player.playerStatus !== "Eliminated"
        );

        // Sort the non-eliminated players based on total chips in descending order
        const sortedNonEliminatedPlayers = nonEliminatedPlayers.sort(
          (a, b) => b.totalChips - a.totalChips
        );

        // Filter out eliminated players
        const eliminatedPlayers = mergedData.filter(
          (player) => player.playerStatus === "Eliminated"
        );

        // Sort the eliminated players based on their elimination position in descending order
        const sortedEliminatedPlayers = eliminatedPlayers.sort(
          (a, b) => b.eliminationPosition - a.eliminationPosition
        );

        // Concatenate the sorted lists of non-eliminated and eliminated players
        const newData = sortedNonEliminatedPlayers.concat(
          sortedEliminatedPlayers
        );

        console.log("New Data with sorted players:", newData);

        setPlayerData(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchTotalPointsAndStatus = async () => {
      try {
        const totalPointsResponse = await axios.get(
          `${baseURL}:8000/api/ingame/getAllTotalPoints`
        );
        const totalPointsData = totalPointsResponse.data;

        // Create maps to store totalPoints and playerStatus arrays for each playerId
        const totalPointsMap = new Map();
        const playerStatusMap = new Map();

        // Populate totalPointsMap and playerStatusMap with data
        totalPointsData.forEach((point) => {
          if (totalPointsMap.has(point.playerId)) {
            totalPointsMap.get(point.playerId).push(point.totalPoints);
            playerStatusMap.get(point.playerId).push(point.playerStatus);
          } else {
            totalPointsMap.set(point.playerId, [point.totalPoints]);
            playerStatusMap.set(point.playerId, [point.playerStatus]);
          }
        });

        // Map the totalPointsMap and playerStatusMap to an array sorted according to the order of playerData
        const sortedTotalPoints = playerData.map((player) => ({
          playerId: player.playerId,
          totalPoints: (totalPointsMap.get(player.playerId) || []).reverse(), // Reverse the array if exists
          playerStatus: (playerStatusMap.get(player.playerId) || []).reverse(), // Reverse the array if exists
        }));

        setTotalPoints(sortedTotalPoints);
      } catch (error) {
        console.error("Error fetching total points and player status:", error);
      }
    };

    fetchTotalPointsAndStatus();
  }, [playerData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}:8000/api/table/getDeals`);
        const data = await response.json();
        setDeals(data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchLatestDealNumber = async () => {
      try {
        const response = await axios.get(
          `${baseURL}:8000/api/table/getLatestDealNumber`
        );
        setLatestDealNumber(response.data);
      } catch (error) {
        console.error("Error fetching latest deal number:", error);
      }
    };

    fetchLatestDealNumber();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}:8000/api/ingame/getAllTotalPoints`);
        const data = await response.json();
        const reversedData = data.reverse(); // Reverse the array
  
        // Array to store deal status checks
        const deals = [
          { start: 0, end: 6, stateSetter: setShowPointsOne },
          { start: 6, end: 12, stateSetter: setShowPointsTwo },
          { start: 12, end: 18, stateSetter: setShowPointsThree },
          { start: 18, end: 24, stateSetter: setShowPointsFour },
          { start: 24, end: 30, stateSetter: setShowPointsFive },
          { start: 30, end: 36, stateSetter: setShowPointsSix },
          { start: 36, end: 42, stateSetter: setShowPointsSeven },
          { start: 42, end: 48, stateSetter: setShowPointsEight },
          { start: 48, end: 54, stateSetter: setShowPointsNine },
          { start: 54, end: 60, stateSetter: setShowPointsTen },
          { start: 60, end: 66, stateSetter: setShowPointsEleven },
          { start: 66, end: 72, stateSetter: setShowPointsTwelve },
        ];
  
        // Variable to store the current deal
        let currentDealIndex = -1;
  
        // Iterate through each deal range to find the latest deal
        for (let i = 0; i < deals.length; i++) {
          const dealData = reversedData.slice(deals[i].start, deals[i].end);
          if (dealData.length > 0) {
            currentDealIndex = i;
          } else {
            break;
          }
        }
  
        // Iterate through each deal to set the state
        for (let i = 0; i <= currentDealIndex; i++) {
          const dealData = reversedData.slice(deals[i].start, deals[i].end);
          if (i === currentDealIndex) {
            // For the current deal, check for "Winner" or "autoWinner"
            const hasWinnerInDeal = dealData.some(player => player.playerStatus === "Winner" || player.playerStatus === "autoWinner");
            deals[i].stateSetter(hasWinnerInDeal);
            if (hasWinnerInDeal) {
              setStatus(reversedData);
            }
          } else {
            // For previous deals, check for "Winner", "autoWinner", or "Eliminated"
            const hasWinnerOrEliminated = dealData.some(player => 
              player.playerStatus === "Winner" || 
              player.playerStatus === "autoWinner" || 
              player.playerStatus === "Eliminated"
            );
            deals[i].stateSetter(hasWinnerOrEliminated);
          }
        }
  
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
    
  

  return (
    <>
      <div className="sb-bg"></div>
      <div className="fade-in-intro">
        <div className="logodiv">
          <img src={GRC} alt="" className="grc" />
        </div>
      </div>
      {/* Level 1 scoreboard */}
      {level === 1 && (
        <div className="maindiv">
          {playerData.map((value, index) => (
            <div className={`newsblist newsblist${index + 1}`} key={index}>
              <img src={sbuserlist} className="newsblist-bg" alt="" />
              <img
                src={`${baseURL}:8000/${value.shortPhoto}`}
                alt=""
                className={`cduser-scoreboard`}
              />
              <span className={`sbusername`}>
                {value.name && value.name.split(" ")[0]}{" "}
                {value.name && value.name.split(" ")[1]?.charAt(0)}
              </span>
              <span className={`sbchips`}>
                <img src={chipsm} className="" />
                {value.totalChips}
              </span>
            </div>
          ))}

          <div className="fsbmain-head sb_level1 fsbmainheadspan">
            <strong className="l1-top-head-1 sbuserrow1">
              Level 1 <i class="orange_font">({boosters[0]}X)</i>
            </strong>

            <img
              src={sbheadsm_l1}
              alt=""
              className="sbheadsm1 sb_level1_head_1 sbuserrow1"
            />
            {/* <img src={sbheadsm} alt="" className="sbheadsm4 sbuserrow4" />  */}
            <div className="sbrowhead1 sbuserrow1">
              <span>D1</span>
              {/* Display totalPoints for first six players */}

              {/* hide totalPoints here  */}
              {showPointsOne && (
                <div className="total-points-container">
                  <div className="total-points-column">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(0, 1).map((points, index) => (
                          <div key={index} className="total-points">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span>D2</span>
              {/* Display totalPoints for next six players */}
              {showPointsTwo && (
                <div className="total-points-container">
                  <div className="total-points-column2">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(1, 2).map((points, index) => (
                          <div key={index} className="total-points2">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span className="d3-l3">D3</span>
              {/* Display totalPoints for next six players */}
              {showPointsThree && (
                <div className="total-points-container">
                  <div className="total-points-column3">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(2, 3).map((points, index) => (
                          <div key={index} className="total-points3">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="sbrowhead2 sbuserrow2">
              <span className="d4-l3">D4</span>

              {showPointsFour && (
                <div className="total-points-container">
                  <div className="total-points-column4">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(3, 4).map((points, index) => (
                          <div key={index} className="total-points4">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
              <span className="d5-l3">D5</span>

              {showPointsFive && (
                <div className="total-points-container">
                  <div className="total-points-column5">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(4, 5).map((points, index) => (
                          <div key={index} className="total-points5">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span className="d6-l3">D6</span>

              {showPointsSix && (
                <div className="total-points-container">
                  <div className="total-points-column6">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(5, 6).map((points, index) => (
                          <div key={index} className="total-points6">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="sbrowhead3 sbuserrow3">
              <span className="d7-l3">D7</span>
              {showPointsSeven && (
                <div className="total-points-container">
                  <div className="total-points-column7">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(6, 7).map((points, index) => (
                          <div key={index} className="total-points7">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span className="d8-l3">D8</span>
              {showPointsEight && (
                <div className="total-points-container">
                  <div className="total-points-column8">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(7, 8).map((points, index) => (
                          <div key={index} className="total-points8">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span className="d9-l3">D9</span>
              {showPointsNine && (
                <div className="total-points-container">
                  <div className="total-points-column9">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(8, 9).map((points, index) => (
                          <div key={index} className="total-points9">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="sbrowhead4 sbuserrow4">
              <span className="d10-l3">D10</span>

              {showPointsTen && (
                <div className="total-points-container">
                  <div className="total-points-column10">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints
                          .slice(9, 10)
                          .map((points, index) => (
                            <div key={index} className="total-points10">
                              <span>{points}</span>
                            </div>
                          ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span className="d11-l3">D11</span>
              {showPointsEleven && (
                <div className="total-points-container">
                  <div className="total-points-column11">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints
                          .slice(10, 11)
                          .map((points, index) => (
                            <div key={index} className="total-points11">
                              <span>{points}</span>
                            </div>
                          ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
              <span className="d12-l3">D12</span>

              {showPointsTwelve && (
                <div className="total-points-container">
                  <div className="total-points-column12">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints
                          .slice(11, 12)
                          .map((points, index) => (
                            <div key={index} className="total-points12">
                              <span>{points}</span>
                            </div>
                          ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="sb_level1 level1bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level1 level2bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level1 level3bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level1 level4bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level1 level5bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level1 level6bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level1 level7bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level1 level8bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level1 level9bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level1 level10bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level1 level11bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level1 level12bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
        </div>
      )}
      {/* Level 2 scoreboard */}
      {level === 2 && (
        <div className="maindiv">
          {playerData.map((value, index) => (
            <div
              className={`newsblist newsblist${index + 1} l2-elemination`}
              key={index}
            >
              <img src={sbuserlist} className="newsblist-bg" alt="" />
              <img
                src={`${baseURL}:8000/${value.shortPhoto}`}
                alt=""
                className={`cduser-scoreboard`}
              />
              <span className={`sbusername`}>
                {value.name && value.name.split(" ")[0]}{" "}
                {value.name && value.name.split(" ")[1]?.charAt(0)}
              </span>
              <span className={`sbchips`}>
                <img src={chipsm} className="" />
                {value.totalChips}
              </span>

              {/* eliminate player deal 1 to 6   */}

              {index === playerData.length - 1 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 1 ||
                  value.eliminationLevel === 2 ||
                  value.eliminationLevel === 3 ||
                  value.eliminationLevel === 4 ||
                  value.eliminationLevel === 5 ||
                  value.eliminationLevel === 6) && (
                  <strong className="level2-sb-1 sbuserrow1">
                    <img src={sbeliminated} alt="" />
                  </strong>
                )}

              {index === playerData.length - 2 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 1 ||
                  value.eliminationLevel === 2 ||
                  value.eliminationLevel === 3 ||
                  value.eliminationLevel === 4 ||
                  value.eliminationLevel === 5 ||
                  value.eliminationLevel === 6) && (
                  <strong className="level2-sb-1 sbuserrow1">
                    <img src={sbeliminated} alt="" />
                  </strong>
                )}

              {index === playerData.length - 3 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 1 ||
                  value.eliminationLevel === 2 ||
                  value.eliminationLevel === 3 ||
                  value.eliminationLevel === 4 ||
                  value.eliminationLevel === 5 ||
                  value.eliminationLevel === 6) && (
                  <strong className="level2-sb-1 sbuserrow1">
                    <img src={sbeliminated} alt="" />
                  </strong>
                )}

              {index === playerData.length - 4 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 1 ||
                  value.eliminationLevel === 2 ||
                  value.eliminationLevel === 3 ||
                  value.eliminationLevel === 4 ||
                  value.eliminationLevel === 5 ||
                  value.eliminationLevel === 6) && (
                  <strong className="level2-sb-1 sbuserrow1">
                    <img src={sbeliminated} alt="" />
                  </strong>
                )}
            </div>
          ))}

          <div className="fsbmain-head sb_level2 fsbmainheadspan">
            <strong className="l2-top-head-1 sbuserrow1">
              Level 1 <i class="orange_font">({boosters[0]}X)</i>
            </strong>

            <strong className="l2-top-head-2 sbuserrow2">
              Level 2 <i class="orange_font">({boosters[1]}X)</i>
            </strong>

            <img
              src={sbheadsm_l1}
              alt=""
              className="sbheadsm1 sb_level2_head_1 sbuserrow1"
            />
            <img
              src={sbheadsm_l1}
              alt=""
              className="sbheadsm1 sb_level2_head_2 sbuserrow1"
            />
            {/* <img src={sbheadsm} alt="" className="sbheadsm4 sbuserrow4" />  */}
            <div className="sbrowhead1 sbuserrow-p">
              <span className="d1-l2">D1</span>
              {/* Display totalPoints for first six players */}

              {/* hide totalPoints here  */}
              {showPointsOne && (
                <div className="total-points-container">
                  <div className="total-points-column">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(0, 1).map((points, index) => (
                          <div key={index} className="total-points">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span className="d2-l2">D2</span>
              {/* Display totalPoints for next six players */}
              {showPointsTwo && (
                <div className="total-points-container">
                  <div className="total-points-column2">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(1, 2).map((points, index) => (
                          <div key={index} className="total-points2">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span className="d3-l2">D3</span>
              {/* Display totalPoints for next six players */}
              {showPointsThree && (
                <div className="total-points-container">
                  <div className="total-points-column3">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(2, 3).map((points, index) => (
                          <div key={index} className="total-points3">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="sbrowhead2 sbuserrow-p">
              <span className="d4-l2">D4</span>

              {showPointsFour && (
                <div className="total-points-container">
                  <div className="total-points-column4">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(3, 4).map((points, index) => (
                          <div key={index} className="total-points4">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
              <span className="d5-l2">D5</span>

              {showPointsFive && (
                <div className="total-points-container">
                  <div className="total-points-column5">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(4, 5).map((points, index) => (
                          <div key={index} className="total-points5">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span className="d6-l2">D6</span>

              {showPointsSix && (
                <div className="total-points-container">
                  <div className="total-points-column6">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(5, 6).map((points, index) => (
                          <div key={index} className="total-points6">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="sbrowhead3 sbuserrow-p">
              <span className="d7-l2">D7</span>
              {showPointsSeven && (
                <div className="total-points-container">
                  <div className="total-points-column7">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(6, 7).map((points, index) => (
                          <div key={index} className="total-points7">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span className="d8-l2">D8</span>
              {showPointsEight && (
                <div className="total-points-container">
                  <div className="total-points-column8">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(7, 8).map((points, index) => (
                          <div key={index} className="total-points8">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span className="d9-l2">D9</span>
              {showPointsNine && (
                <div className="total-points-container">
                  <div className="total-points-column9">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(8, 9).map((points, index) => (
                          <div key={index} className="total-points9">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="sbrowhead4 sbuserrow-p">
              <span className="d10-l2">D10</span>

              {showPointsTen && (
                <div className="total-points-container">
                  <div className="total-points-column10">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints
                          .slice(9, 10)
                          .map((points, index) => (
                            <div key={index} className="total-points10">
                              <span>{points}</span>
                            </div>
                          ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span className="d11-l2">D11</span>
              {showPointsEleven && (
                <div className="total-points-container">
                  <div className="total-points-column11">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints
                          .slice(10, 11)
                          .map((points, index) => (
                            <div key={index} className="total-points11">
                              <span>{points}</span>
                            </div>
                          ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
              <span className="d12-l2">D12</span>

              {showPointsTwelve && (
                <div className="total-points-container">
                  <div className="total-points-column12">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints
                          .slice(11, 12)
                          .map((points, index) => (
                            <div key={index} className="total-points12">
                              <span>{points}</span>
                            </div>
                          ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
              {/* <strong>
              LEVEL 4 <i class="orange_font">({boosters[3]}X)</i>
            </strong> */}
            </div>
          </div>
          <div className="sb_level2 level1bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level2 level2bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level2 level3bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level2 level4bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level2 level5bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level2 level6bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level2 level7bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level2 level8bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level2 level9bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level2 level10bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level2 level11bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level2 level12bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
        </div>
      )}
      {/* Level 3 scoreboard */}
      {level === 3 && (
        <div className="maindiv">
          {playerData.map((value, index) => (
            <div
              className={`newsblist newsblist${index + 1} l3-elemination`}
              key={index}
            >
              <img src={sbuserlist} className="newsblist-bg" alt="" />
              <img
                src={`${baseURL}:8000/${value.shortPhoto}`}
                alt=""
                className={`cduser-scoreboard`}
              />
              <span className={`sbusername`}>
                {value.name && value.name.split(" ")[0]}{" "}
                {value.name && value.name.split(" ")[1]?.charAt(0)}
              </span>
              <span className={`sbchips`}>
                <img src={chipsm} className="" />
                {value.totalChips}
              </span>

              {/* elimination on deaL 1,2,3, or 4  */}

              {index === playerData.length - 1 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 1 ||
                  value.eliminationLevel === 2 ||
                  value.eliminationLevel === 3 ||
                  value.eliminationLevel === 4) && (
                  <div>
                    <strong className="level2-sb-1 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>

                    <strong className="level2-sb-black sbuserrow1"></strong>
                  </div>
                )}

              {index === playerData.length - 2 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 1 ||
                  value.eliminationLevel === 2 ||
                  value.eliminationLevel === 3 ||
                  value.eliminationLevel === 4) && (
                  <div>
                    <strong className="level2-sb-1 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>

                    <strong className="level2-sb-black sbuserrow1"></strong>
                  </div>
                )}

              {index === playerData.length - 3 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 1 ||
                  value.eliminationLevel === 2 ||
                  value.eliminationLevel === 3 ||
                  value.eliminationLevel === 4) && (
                  <div>
                    <strong className="level2-sb-1 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>

                    <strong className="level2-sb-black sbuserrow1"></strong>
                  </div>
                )}

              {index === playerData.length - 4 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 1 ||
                  value.eliminationLevel === 2 ||
                  value.eliminationLevel === 3 ||
                  value.eliminationLevel === 4) && (
                  <div>
                    <strong className="level2-sb-1 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>

                    <strong className="level2-sb-black sbuserrow1"></strong>
                  </div>
                )}

              {/* elimination on deaL 5,6,7, or 8  */}
              {index === playerData.length - 1 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 5 ||
                  value.eliminationLevel === 6 ||
                  value.eliminationLevel === 7 ||
                  value.eliminationLevel === 8) && (
                  <div>
                    <strong className="level2-sb-2 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}

              {index === playerData.length - 2 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 5 ||
                  value.eliminationLevel === 6 ||
                  value.eliminationLevel === 7 ||
                  value.eliminationLevel === 8) && (
                  <div>
                    <strong className="level2-sb-2 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}

              {index === playerData.length - 3 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 5 ||
                  value.eliminationLevel === 6 ||
                  value.eliminationLevel === 7 ||
                  value.eliminationLevel === 8) && (
                  <div>
                    <strong className="level2-sb-2 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}

              {index === playerData.length - 4 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 5 ||
                  value.eliminationLevel === 6 ||
                  value.eliminationLevel === 7 ||
                  value.eliminationLevel === 8) && (
                  <div>
                    <strong className="level2-sb-2 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
            </div>
          ))}

          <div className="fsbmain-head sb_level3 fsbmainheadspan">
            <img
              src={sbheadsm}
              alt=""
              className="sbheadsm1 sb_level3_head sbuserrow1"
            />
            <img
              src={sbheadsm}
              alt=""
              className="sbheadsm2 sb_level3_head sbuserrow2"
            />
            <img
              src={sbheadsm}
              alt=""
              className="sbheadsm3 sb_level3_head sbuserrow3"
            />
            {/* <img src={sbheadsm} alt="" className="sbheadsm4 sbuserrow4" />  */}
            <div className="sbrowhead1 sbuserrow1">
              <span>D1</span>
              {/* Display totalPoints for first six players */}

              {/* hide totalPoints here  */}
              {showPointsOne && (
                <div className="total-points-container">
                  <div className="total-points-column">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(0, 1).map((points, index) => (
                          <div key={index} className="total-points">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span>D2</span>
              {/* Display totalPoints for next six players */}
              {showPointsTwo && (
                <div className="total-points-container">
                  <div className="total-points-column2">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(1, 2).map((points, index) => (
                          <div key={index} className="total-points2">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span>D3</span>
              {/* Display totalPoints for next six players */}
              {showPointsThree && (
                <div className="total-points-container">
                  <div className="total-points-column3">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(2, 3).map((points, index) => (
                          <div key={index} className="total-points3">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
              <strong className="l1-top-head-1">
                LEVEL 1 <i class="orange_font">({boosters[0]}X)</i>
              </strong>
            </div>
            <div className="sbrowhead2 sbuserrow2">
              <span className="d4-l3">D4</span>

              {showPointsFour && (
                <div className="total-points-container">
                  <div className="total-points-column4">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(3, 4).map((points, index) => (
                          <div key={index} className="total-points4">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
              <span>D5</span>

              {showPointsFive && (
                <div className="total-points-container">
                  <div className="total-points-column5">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(4, 5).map((points, index) => (
                          <div key={index} className="total-points5">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span className="d6-l3">D6</span>

              {showPointsSix && (
                <div className="total-points-container">
                  <div className="total-points-column6">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(5, 6).map((points, index) => (
                          <div key={index} className="total-points6">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
              <strong className="l1-top-head-2">
                LEVEL 2 <i class="orange_font">({boosters[1]}X)</i>
              </strong>
            </div>
            <div className="sbrowhead3 sbuserrow3">
              <span>D7</span>
              {showPointsSeven && (
                <div className="total-points-container">
                  <div className="total-points-column7">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(6, 7).map((points, index) => (
                          <div key={index} className="total-points7">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span>D8</span>
              {showPointsEight && (
                <div className="total-points-container">
                  <div className="total-points-column8">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(7, 8).map((points, index) => (
                          <div key={index} className="total-points8">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span className="d9-l3">D9</span>
              {showPointsNine && (
                <div className="total-points-container">
                  <div className="total-points-column9">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(8, 9).map((points, index) => (
                          <div key={index} className="total-points9">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <strong className="l1-top-head-3">
                LEVEL 3 <i class="orange_font">({boosters[2]}X)</i>
              </strong>
            </div>
            <div className="sbrowhead4 sbuserrow4">
              <span>D10</span>

              {showPointsTen && (
                <div className="total-points-container">
                  <div className="total-points-column10">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints
                          .slice(9, 10)
                          .map((points, index) => (
                            <div key={index} className="total-points10">
                              <span>{points}</span>
                            </div>
                          ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span>D11</span>
              {showPointsEleven && (
                <div className="total-points-container">
                  <div className="total-points-column11">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints
                          .slice(10, 11)
                          .map((points, index) => (
                            <div key={index} className="total-points11">
                              <span>{points}</span>
                            </div>
                          ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
              <span>D12</span>

              {showPointsTwelve && (
                <div className="total-points-container">
                  <div className="total-points-column12">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints
                          .slice(11, 12)
                          .map((points, index) => (
                            <div key={index} className="total-points12">
                              <span>{points}</span>
                            </div>
                          ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}        
            </div>
          </div>
          <div className="sb_level3 level1bg">
            <img src={sbpointbgl3} className="sbpointbg" />
            <img src={sbpointbgl3} className="sbpointbg" />
            <img src={sbpointbgl3} className="sbpointbg" />
            <img src={sbpointbgl3} className="sbpointbg" />
            <img src={sbpointbgl3} className="sbpointbg" />
            <img src={sbpointbgl3} className="sbpointbg" />
          </div>
          <div className="sb_level3 level2bg">
            <img src={sbpointbgl3} className="sbpointbg" />
            <img src={sbpointbgl3} className="sbpointbg" />
            <img src={sbpointbgl3} className="sbpointbg" />
            <img src={sbpointbgl3} className="sbpointbg" />
            <img src={sbpointbgl3} className="sbpointbg" />
            <img src={sbpointbgl3} className="sbpointbg" />
          </div>
          <div className="sb_level3 level3bg">
            <img src={sbpointbgl3} className="sbpointbg" />
            <img src={sbpointbgl3} className="sbpointbg" />
            <img src={sbpointbgl3} className="sbpointbg" />
            <img src={sbpointbgl3} className="sbpointbg" />
            <img src={sbpointbgl3} className="sbpointbg" />
            <img src={sbpointbgl3} className="sbpointbg" />
          </div>
          {/* <div className="level4bg">
          <img src={sbpointbg} className="sbpointbg" />
          <img src={sbpointbg} className="sbpointbg" />
          <img src={sbpointbg} className="sbpointbg" />
          <img src={sbpointbg} className="sbpointbg" />
          <img src={sbpointbg} className="sbpointbg" />
          <img src={sbpointbg} className="sbpointbg" />
        </div> */}
        </div>
      )}
      {/* Level 4 scoreboard */}
      {level === 4 && (
        <div className="maindiv">
          {playerData.map((value, index) => (
            <div
              className={`newsblist newsblist${index + 1} l4-elemination`}
              key={index}
            >
              <img src={sbuserlist} className="newsblist-bg" alt="" />
              <img
                src={`${baseURL}:8000/${value.shortPhoto}`}
                alt=""
                className={`cduser-scoreboard`}
              />
              <span className={`sbusername`}>
                {value.name && value.name.split(" ")[0]}{" "}
                {value.name && value.name.split(" ")[1]?.charAt(0)}
              </span>
              <span className={`sbchips`}>
                <img src={chipsm} className="" />
                {value.totalChips}
              </span>
              {/* For eLimination in Deal 1,2 or 3  */}
              {index === playerData.length - 1 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 1 ||
                  value.eliminationLevel === 2 ||
                  value.eliminationLevel === 3) && (
                  <div>
                    <strong className="level2-sb-1 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                    <strong className="level2-sb-black-1 sbuserrow1"></strong>
                    <strong className="level2-sb-black-2 sbuserrow1"></strong>
                  </div>
                )}
              {index === playerData.length - 2 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 1 ||
                  value.eliminationLevel === 2 ||
                  value.eliminationLevel === 3) && (
                  <div>
                    <strong className="level2-sb-1 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                    <strong className="level2-sb-black-1 sbuserrow1"></strong>
                    <strong className="level2-sb-black-2 sbuserrow1"></strong>
                  </div>
                )}
              {index === playerData.length - 3 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 1 ||
                  value.eliminationLevel === 2 ||
                  value.eliminationLevel === 3) && (
                  <div>
                    <strong className="level2-sb-1 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                    <strong className="level2-sb-black-1 sbuserrow1"></strong>
                    <strong className="level2-sb-black-2 sbuserrow1"></strong>
                  </div>
                )}
              {index === playerData.length - 4 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 1 ||
                  value.eliminationLevel === 2 ||
                  value.eliminationLevel === 3) && (
                  <div>
                    <strong className="level2-sb-1 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                    <strong className="level2-sb-black-1 sbuserrow1"></strong>
                    <strong className="level2-sb-black-2 sbuserrow1"></strong>
                  </div>
                )}
              {/* For eLimination in Deal 4,5 or 6  */}
              {index === playerData.length - 1 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 4 ||
                  value.eliminationLevel === 5 ||
                  value.eliminationLevel === 6) && (
                  <div>
                    <strong className="level2-sb-2 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                    <strong className="level2-sb-2-black sbuserrow1"></strong>
                  </div>
                )}
              {index === playerData.length - 2 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 4 ||
                  value.eliminationLevel === 5 ||
                  value.eliminationLevel === 6) && (
                  <div>
                    <strong className="level2-sb-2 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                    <strong className="level2-sb-2-black sbuserrow1"></strong>
                  </div>
                )}
              {index === playerData.length - 3 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 4 ||
                  value.eliminationLevel === 5 ||
                  value.eliminationLevel === 6) && (
                  <div>
                    <strong className="level2-sb-2 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                    <strong className="level2-sb-2-black sbuserrow1"></strong>
                  </div>
                )}
              {index === playerData.length - 4 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 4 ||
                  value.eliminationLevel === 5 ||
                  value.eliminationLevel === 6) && (
                  <div>
                    <strong className="level2-sb-2 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                    <strong className="level2-sb-2-black sbuserrow1"></strong>
                  </div>
                )}
              {/* For eLimination in Deal 7,8 or 9  */}
              {index === playerData.length - 1 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 7 ||
                  value.eliminationLevel === 8 ||
                  value.eliminationLevel === 9) && (
                  <div>
                    <strong className="level2-sb-3 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 2 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 7 ||
                  value.eliminationLevel === 8 ||
                  value.eliminationLevel === 9) && (
                  <div>
                    <strong className="level2-sb-3 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 3 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 7 ||
                  value.eliminationLevel === 8 ||
                  value.eliminationLevel === 9) && (
                  <div>
                    <strong className="level2-sb-3 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 4 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 7 ||
                  value.eliminationLevel === 8 ||
                  value.eliminationLevel === 9) && (
                  <div>
                    <strong className="level2-sb-3 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}{" "}
            </div>
          ))}

          {/* level 4 start */}

          <div className="fsbmain-head fsbmainheadspan">
            <img src={sbheadsm} alt="" className="sbheadsm1 sbuserrow1" />
            <img src={sbheadsm} alt="" className="sbheadsm2 sbuserrow2" />
            <img src={sbheadsm} alt="" className="sbheadsm3 sbuserrow3" />
            <img src={sbheadsm} alt="" className="sbheadsm4 sbuserrow4" />
            <div className="sbrowhead1 sbuserrow-p">
              <span>D1</span>
              {/* Display totalPoints for first six players */}

              {/* hide totalPoints here  */}
              {showPointsOne && (
                <div className="total-points-container">
                  <div className="total-points-column">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(0, 1).map((points, index) => (
                          <div key={index} className="total-points">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span>D2</span>
              {/* Display totalPoints for next six players */}
              {showPointsTwo && (
                <div className="total-points-container">
                  <div className="total-points-column2">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(1, 2).map((points, index) => (
                          <div key={index} className="total-points2">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span>D3</span>
              {/* Display totalPoints for next six players */}
              {showPointsThree && (
                <div className="total-points-container">
                  <div className="total-points-column3">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(2, 3).map((points, index) => (
                          <div key={index} className="total-points3">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
              <strong>
                LEVEL 1 <i class="orange_font">({boosters[0]}X)</i>
              </strong>
            </div>
            <div className="sbrowhead2 sbuserrow-p">
              <span>D4</span>

              {showPointsFour && (
                <div className="total-points-container">
                  <div className="total-points-column4">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(3, 4).map((points, index) => (
                          <div key={index} className="total-points4">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
              <span>D5</span>

              {showPointsFive && (
                <div className="total-points-container">
                  <div className="total-points-column5">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(4, 5).map((points, index) => (
                          <div key={index} className="total-points5">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span>D6</span>

              {showPointsSix && (
                <div className="total-points-container">
                  <div className="total-points-column6">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(5, 6).map((points, index) => (
                          <div key={index} className="total-points6">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
              <strong>
                LEVEL 2 <i class="orange_font">({boosters[1]}X)</i>
              </strong>
            </div>
            <div className="sbrowhead3 sbuserrow-p">
              <span>D7</span>
              {showPointsSeven && (
                <div className="total-points-container">
                  <div className="total-points-column7">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(6, 7).map((points, index) => (
                          <div key={index} className="total-points7">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span>D8</span>
              {showPointsEight && (
                <div className="total-points-container">
                  <div className="total-points-column8">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(7, 8).map((points, index) => (
                          <div key={index} className="total-points8">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span>D9</span>
              {showPointsNine && (
                <div className="total-points-container">
                  <div className="total-points-column9">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(8, 9).map((points, index) => (
                          <div key={index} className="total-points9">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <strong>
                LEVEL 3 <i class="orange_font">({boosters[2]}X)</i>
              </strong>
            </div>
            <div className="sbrowhead4 sbuserrow-p">
              <span>D10</span>

              {showPointsTen && (
                <div className="total-points-container">
                  <div className="total-points-column10">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints
                          .slice(9, 10)
                          .map((points, index) => (
                            <div key={index} className="total-points10">
                              <span>{points}</span>
                            </div>
                          ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span>D11</span>
              {showPointsEleven && (
                <div className="total-points-container">
                  <div className="total-points-column11">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints
                          .slice(10, 11)
                          .map((points, index) => (
                            <div key={index} className="total-points11">
                              <span>{points}</span>
                            </div>
                          ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
              <span>D12</span>

              {showPointsTwelve && (
                <div className="total-points-container">
                  <div className="total-points-column12">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints
                          .slice(11, 12)
                          .map((points, index) => (
                            <div key={index} className="total-points12">
                              <span>{points}</span>
                            </div>
                          ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
              <strong>
                LEVEL 4 <i class="orange_font">({boosters[3]}X)</i>
              </strong>
            </div>
          </div>
          <div className="level1bg">
            <img src={sbpointbg} className="sbpointbg" />
            <img src={sbpointbg} className="sbpointbg" />
            <img src={sbpointbg} className="sbpointbg" />
            <img src={sbpointbg} className="sbpointbg" />
            <img src={sbpointbg} className="sbpointbg" />
            <img src={sbpointbg} className="sbpointbg" />
          </div>
          <div className="level2bg">
            <img src={sbpointbg} className="sbpointbg" />
            <img src={sbpointbg} className="sbpointbg" />
            <img src={sbpointbg} className="sbpointbg" />
            <img src={sbpointbg} className="sbpointbg" />
            <img src={sbpointbg} className="sbpointbg" />
            <img src={sbpointbg} className="sbpointbg" />
          </div>
          <div className="level3bg">
            <img src={sbpointbg} className="sbpointbg" />
            <img src={sbpointbg} className="sbpointbg" />
            <img src={sbpointbg} className="sbpointbg" />
            <img src={sbpointbg} className="sbpointbg" />
            <img src={sbpointbg} className="sbpointbg" />
            <img src={sbpointbg} className="sbpointbg" />
          </div>
          <div className="level4bg">
            <img src={sbpointbg} className="sbpointbg" />
            <img src={sbpointbg} className="sbpointbg" />
            <img src={sbpointbg} className="sbpointbg" />
            <img src={sbpointbg} className="sbpointbg" />
            <img src={sbpointbg} className="sbpointbg" />
            <img src={sbpointbg} className="sbpointbg" />
          </div>
        </div>
      )}
      {/* Level 6 scoreboard */}
      {level === 6 && (
        <div className="maindiv">
          {playerData.map((value, index) => (
            <div
              className={`newsblist newsblist${index + 1} l6-elemination`}
              key={index}
            >
              <img src={sbuserlist} className="newsblist-bg" alt="" />
              <img
                src={`${baseURL}:8000/${value.shortPhoto}`}
                alt=""
                className={`cduser-scoreboard`}
              />
              <span className={`sbusername`}>
                {value.name && value.name.split(" ")[0]}{" "}
                {value.name && value.name.split(" ")[1]?.charAt(0)}
              </span>
              <span className={`sbchips`}>
                <img src={chipsm} className="" />
                {value.totalChips}
              </span>

              {/* elimination on deaL 1 or 2 */}

              {index === playerData.length - 1 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 1 ||
                  value.eliminationLevel === 2) && (
                  <div>
                    <strong className="level2-sb-1 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                    <strong className="level2-sb-black-1 sbuserrow1"></strong>
                    <strong className="level2-sb-black-2 sbuserrow1"></strong>
                    <strong className="level2-sb-black-3 sbuserrow1"></strong>
                    <strong className="level2-sb-black-4 sbuserrow1"></strong>
                  </div>
                )}

              {index === playerData.length - 2 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 1 ||
                  value.eliminationLevel === 2) && (
                  <div>
                    <strong className="level2-sb-1 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                    <strong className="level2-sb-black-1 sbuserrow1"></strong>
                    <strong className="level2-sb-black-2 sbuserrow1"></strong>
                    <strong className="level2-sb-black-3 sbuserrow1"></strong>
                    <strong className="level2-sb-black-4 sbuserrow1"></strong>
                  </div>
                )}

              {index === playerData.length - 3 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 1 ||
                  value.eliminationLevel === 2) && (
                  <div>
                    <strong className="level2-sb-1 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                    <strong className="level2-sb-black-1 sbuserrow1"></strong>
                    <strong className="level2-sb-black-2 sbuserrow1"></strong>
                    <strong className="level2-sb-black-3 sbuserrow1"></strong>
                    <strong className="level2-sb-black-4 sbuserrow1"></strong>
                  </div>
                )}

              {index === playerData.length - 4 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 1 ||
                  value.eliminationLevel === 2) && (
                  <div>
                    <strong className="level2-sb-1 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                    <strong className="level2-sb-black-1 sbuserrow1"></strong>
                    <strong className="level2-sb-black-2 sbuserrow1"></strong>
                    <strong className="level2-sb-black-3 sbuserrow1"></strong>
                    <strong className="level2-sb-black-4 sbuserrow1"></strong>
                  </div>
                )}

              {/* elimination on deaL 3 or 4 */}

              {index === playerData.length - 1 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 3 ||
                  value.eliminationLevel === 4) && (
                  <div>
                    <strong className="level2-sb-2 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                    <strong className="level2-sb-black-2 sbuserrow1"></strong>
                    <strong className="level2-sb-black-3 sbuserrow1"></strong>
                    <strong className="level2-sb-black-4 sbuserrow1"></strong>
                  </div>
                )}

              {index === playerData.length - 2 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 3 ||
                  value.eliminationLevel === 4) && (
                  <div>
                    <strong className="level2-sb-2 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                    <strong className="level2-sb-black-2 sbuserrow1"></strong>
                    <strong className="level2-sb-black-3 sbuserrow1"></strong>
                    <strong className="level2-sb-black-4 sbuserrow1"></strong>
                  </div>
                )}

              {index === playerData.length - 3 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 3 ||
                  value.eliminationLevel === 4) && (
                  <div>
                    <strong className="level2-sb-2 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                    <strong className="level2-sb-black-2 sbuserrow1"></strong>
                    <strong className="level2-sb-black-3 sbuserrow1"></strong>
                    <strong className="level2-sb-black-4 sbuserrow1"></strong>
                  </div>
                )}

              {index === playerData.length - 4 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 3 ||
                  value.eliminationLevel === 4) && (
                  <div>
                    <strong className="level2-sb-2 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                    <strong className="level2-sb-black-2 sbuserrow1"></strong>
                    <strong className="level2-sb-black-3 sbuserrow1"></strong>
                    <strong className="level2-sb-black-4 sbuserrow1"></strong>
                  </div>
                )}

              {/* elimination on deaL 5 or 6 */}

              {index === playerData.length - 1 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 5 ||
                  value.eliminationLevel === 6) && (
                  <div>
                    <strong className="level2-sb-3 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                    <strong className="level2-sb-black-3 sbuserrow1"></strong>
                    <strong className="level2-sb-black-4 sbuserrow1"></strong>
                  </div>
                )}

              {index === playerData.length - 2 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 5 ||
                  value.eliminationLevel === 6) && (
                  <div>
                    <strong className="level2-sb-3 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                    <strong className="level2-sb-black-3 sbuserrow1"></strong>
                    <strong className="level2-sb-black-4 sbuserrow1"></strong>
                  </div>
                )}

              {index === playerData.length - 3 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 5 ||
                  value.eliminationLevel === 6) && (
                  <div>
                    <strong className="level2-sb-3 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                    <strong className="level2-sb-black-3 sbuserrow1"></strong>
                    <strong className="level2-sb-black-4 sbuserrow1"></strong>
                  </div>
                )}

              {index === playerData.length - 4 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 5 ||
                  value.eliminationLevel === 6) && (
                  <div>
                    <strong className="level2-sb-3 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                    <strong className="level2-sb-black-3 sbuserrow1"></strong>
                    <strong className="level2-sb-black-4 sbuserrow1"></strong>
                  </div>
                )}

              {/* elimination on deaL 7 or 8 */}

              {index === playerData.length - 1 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 7 ||
                  value.eliminationLevel === 8) && (
                  <div>
                    <strong className="level2-sb-4 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                    <strong className="level2-sb-black-4 sbuserrow1"></strong>
                  </div>
                )}

              {index === playerData.length - 2 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 7 ||
                  value.eliminationLevel === 8) && (
                  <div>
                    <strong className="level2-sb-4 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                    <strong className="level2-sb-black-4 sbuserrow1"></strong>
                  </div>
                )}

              {index === playerData.length - 3 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 7 ||
                  value.eliminationLevel === 8) && (
                  <div>
                    <strong className="level2-sb-4 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                    <strong className="level2-sb-black-4 sbuserrow1"></strong>
                  </div>
                )}

              {index === playerData.length - 4 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 7 ||
                  value.eliminationLevel === 8) && (
                  <div>
                    <strong className="level2-sb-4 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                    <strong className="level2-sb-black-4 sbuserrow1"></strong>
                  </div>
                )}

              {/* elimination on deaL 9 or 10 */}

              {index === playerData.length - 1 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 9 ||
                  value.eliminationLevel === 10) && (
                  <div>
                    <strong className="level2-sb-5 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}

              {index === playerData.length - 2 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 9 ||
                  value.eliminationLevel === 10) && (
                  <div>
                    <strong className="level2-sb-5 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}

              {index === playerData.length - 3 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 9 ||
                  value.eliminationLevel === 10) && (
                  <div>
                    <strong className="level2-sb-5 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}

              {index === playerData.length - 4 &&
                value.playerStatus === "Eliminated" &&
                (value.eliminationLevel === 9 ||
                  value.eliminationLevel === 10) && (
                  <div>
                    <strong className="level2-sb-5 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
            </div>
          ))}

          <div className="fsbmain-head sb_level6 fsbmainheadspan">
            <strong className="l1-top-head-1 sbuserrow1">
              LEVEL 1 <i class="orange_font">({boosters[0]}X)</i>
            </strong>

            <strong className="l1-top-head-2 sbuserrow2">
              LEVEL 2 <i class="orange_font">({boosters[1]}X)</i>
            </strong>

            <strong className="l1-top-head-3 sbuserrow3">
              LEVEL 3 <i class="orange_font">({boosters[2]}X)</i>
            </strong>

            <strong className="l1-top-head-4 sbuserrow4">
              LEVEL 4 <i class="orange_font">({boosters[3]}X)</i>
            </strong>

            <strong className="l1-top-head-5 sbuserrow5">
              LEVEL 5 <i class="orange_font">({boosters[4]}X)</i>
            </strong>

            <strong className="l1-top-head-6 sbuserrow6">
              LEVEL 6 <i class="orange_font">({boosters[5]}X)</i>
            </strong>

            <img
              src={sbheadsm}
              alt=""
              className="sbheadsm1 sb_level6_head_1 sbuserrow1"
            />
            <img
              src={sbheadsm}
              alt=""
              className="sbheadsm2 sb_level6_head_1 sbuserrow2"
            />
            <img
              src={sbheadsm}
              alt=""
              className="sbheadsm3 sb_level6_head_1 sbuserrow3"
            />
            <img
              src={sbheadsm}
              alt=""
              className="sbheadsm4 sb_level6_head_1 sbuserrow4"
            />
            <img
              src={sbheadsm}
              alt=""
              className="sbheadsm5 sb_level6_head_1 sbuserrow5"
            />
            <img
              src={sbheadsm}
              alt=""
              className="sbheadsm6 sb_level6_head_1 sbuserrow6"
            />
            {/* <img src={sbheadsm} alt="" className="sbheadsm4 sbuserrow4" />  */}
            <div className="sbrowhead1 sbuserrow1">
              <span>D1</span>
              {/* Display totalPoints for first six players */}

              {/* hide totalPoints here  */}
              {showPointsOne && (
                <div className="total-points-container">
                  <div className="total-points-column">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(0, 1).map((points, index) => (
                          <div key={index} className="total-points">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span>D2</span>
              {/* Display totalPoints for next six players */}
              {showPointsTwo && (
                <div className="total-points-container">
                  <div className="total-points-column2">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(1, 2).map((points, index) => (
                          <div key={index} className="total-points2">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span className="d3-l3">D3</span>
              {/* Display totalPoints for next six players */}
              {showPointsThree && (
                <div className="total-points-container">
                  <div className="total-points-column3">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(2, 3).map((points, index) => (
                          <div key={index} className="total-points3">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="sbrowhead2 sbuserrow2">
              <span className="d4-l3">D4</span>

              {showPointsFour && (
                <div className="total-points-container">
                  <div className="total-points-column4">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(3, 4).map((points, index) => (
                          <div key={index} className="total-points4">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
              <span className="d5-l3">D5</span>

              {showPointsFive && (
                <div className="total-points-container">
                  <div className="total-points-column5">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(4, 5).map((points, index) => (
                          <div key={index} className="total-points5">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span className="d6-l3">D6</span>

              {showPointsSix && (
                <div className="total-points-container">
                  <div className="total-points-column6">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(5, 6).map((points, index) => (
                          <div key={index} className="total-points6">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="sbrowhead3 sbuserrow3">
              <span className="d7-l3">D7</span>
              {showPointsSeven && (
                <div className="total-points-container">
                  <div className="total-points-column7">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(6, 7).map((points, index) => (
                          <div key={index} className="total-points7">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span>D8</span>
              {showPointsEight && (
                <div className="total-points-container">
                  <div className="total-points-column8">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(7, 8).map((points, index) => (
                          <div key={index} className="total-points8">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span className="d9-l3">D9</span>
              {showPointsNine && (
                <div className="total-points-container">
                  <div className="total-points-column9">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(8, 9).map((points, index) => (
                          <div key={index} className="total-points9">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="sbrowhead4 sbuserrow4">
              <span>D10</span>

              {showPointsTen && (
                <div className="total-points-container">
                  <div className="total-points-column10">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints
                          .slice(9, 10)
                          .map((points, index) => (
                            <div key={index} className="total-points10">
                              <span>{points}</span>
                            </div>
                          ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span className="d11-l3">D11</span>
              {showPointsEleven && (
                <div className="total-points-container">
                  <div className="total-points-column11">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints
                          .slice(10, 11)
                          .map((points, index) => (
                            <div key={index} className="total-points11">
                              <span>{points}</span>
                            </div>
                          ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
              <span className="d12-l3">D12</span>

              {showPointsTwelve && (
                <div className="total-points-container">
                  <div className="total-points-column12">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints
                          .slice(11, 12)
                          .map((points, index) => (
                            <div key={index} className="total-points12">
                              <span>{points}</span>
                            </div>
                          ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
              {/* <strong>
  LEVEL 4 <i class="orange_font">({boosters[3]}X)</i>
</strong> */}
            </div>
          </div>
          <div className="sb_level6 level1bg">
            <img src={sbpointbgl6} className="sbpointbg" />
            <img src={sbpointbgl6} className="sbpointbg" />
            <img src={sbpointbgl6} className="sbpointbg" />
            <img src={sbpointbgl6} className="sbpointbg" />
            <img src={sbpointbgl6} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl6} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level6 level2bg">
            <img src={sbpointbgl6} className="sbpointbg" />
            <img src={sbpointbgl6} className="sbpointbg" />
            <img src={sbpointbgl6} className="sbpointbg" />
            <img src={sbpointbgl6} className="sbpointbg" />
            <img src={sbpointbgl6} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl6} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level6 level3bg">
            <img src={sbpointbgl6} className="sbpointbg" />
            <img src={sbpointbgl6} className="sbpointbg" />
            <img src={sbpointbgl6} className="sbpointbg" />
            <img src={sbpointbgl6} className="sbpointbg" />
            <img src={sbpointbgl6} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl6} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level6 level4bg">
            <img src={sbpointbgl6} className="sbpointbg" />
            <img src={sbpointbgl6} className="sbpointbg" />
            <img src={sbpointbgl6} className="sbpointbg" />
            <img src={sbpointbgl6} className="sbpointbg" />
            <img src={sbpointbgl6} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl6} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level6 level5bg">
            <img src={sbpointbgl6} className="sbpointbg" />
            <img src={sbpointbgl6} className="sbpointbg" />
            <img src={sbpointbgl6} className="sbpointbg" />
            <img src={sbpointbgl6} className="sbpointbg" />
            <img src={sbpointbgl6} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl6} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level6 level6bg">
            <img src={sbpointbgl6} className="sbpointbg" />
            <img src={sbpointbgl6} className="sbpointbg" />
            <img src={sbpointbgl6} className="sbpointbg" />
            <img src={sbpointbgl6} className="sbpointbg" />
            <img src={sbpointbgl6} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl6} className="sbpointbg sbpointbg-6" />
          </div>
        </div>
      )}
      {/* Level 12 scoreboard */}
      {level === 12 && (
        <div className="maindiv">
          {playerData.map((value, index) => (
            <div
              className={`newsblist newsblist${index + 1} l12-elemination`}
              key={index}
            >
              <img src={sbuserlist} className="newsblist-bg" alt="" />
              <img
                src={`${baseURL}:8000/${value.shortPhoto}`}
                alt=""
                className={`cduser-scoreboard`}
              />
              <span className={`sbusername`}>
                {value.name && value.name.split(" ")[0]}{" "}
                {value.name && value.name.split(" ")[1]?.charAt(0)}
              </span>
              <span className={`sbchips`}>
                <img src={chipsm} className="" />
                {value.totalChips}
              </span>
              {/* elimination on deaL 1 */}
              {index === playerData.length - 1 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 1 && (
                  <div>
                    <strong className="level2-sb-1 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 2 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 1 && (
                  <div>
                    <strong className="level2-sb-1 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 3 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 1 && (
                  <div>
                    <strong className="level2-sb-1 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 4 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 1 && (
                  <div>
                    <strong className="level2-sb-1 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {/* elimination on deaL 2 */}
              {index === playerData.length - 1 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 2 && (
                  <div>
                    <strong className="level2-sb-2 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 2 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 2 && (
                  <div>
                    <strong className="level2-sb-2 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 3 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 2 && (
                  <div>
                    <strong className="level2-sb-2 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 4 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 2 && (
                  <div>
                    <strong className="level2-sb-2 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {/* elimination on deaL 3 */}
              {index === playerData.length - 1 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 3 && (
                  <div>
                    <strong className="level2-sb-3 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 2 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 3 && (
                  <div>
                    <strong className="level2-sb-3 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 3 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 3 && (
                  <div>
                    <strong className="level2-sb-3 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 4 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 3 && (
                  <div>
                    <strong className="level2-sb-3 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
            
              {/* elimination on deaL 4 */}
              {index === playerData.length - 1 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 4 && (
                  <div>
                    <strong className="level2-sb-4 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 2 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 4 && (
                  <div>
                    <strong className="level2-sb-4 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 3 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 4 && (
                  <div>
                    <strong className="level2-sb-4 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 4 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 4 && (
                  <div>
                    <strong className="level2-sb-4 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {/* elimination on deaL 5 */}
              {index === playerData.length - 1 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 5 && (
                  <div>
                    <strong className="level2-sb-5 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 2 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 5 && (
                  <div>
                    <strong className="level2-sb-5 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 3 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 5 && (
                  <div>
                    <strong className="level2-sb-5 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 4 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 5 && (
                  <div>
                    <strong className="level2-sb-5 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {/* elimination on deaL 6 */}
              {index === playerData.length - 1 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 6 && (
                  <div>
                    <strong className="level2-sb-6 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 2 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 6 && (
                  <div>
                    <strong className="level2-sb-6 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 3 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 6 && (
                  <div>
                    <strong className="level2-sb-6 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 4 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 6 && (
                  <div>
                    <strong className="level2-sb-6 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {/* elimination on deaL 7 */}
              {index === playerData.length - 1 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 7 && (
                  <div>
                    <strong className="level2-sb-7 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 2 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 7 && (
                  <div>
                    <strong className="level2-sb-7 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 3 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 7 && (
                  <div>
                    <strong className="level2-sb-7 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 4 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 7 && (
                  <div>
                    <strong className="level2-sb-8 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {/* elimination on deaL 8 */}
              {index === playerData.length - 1 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 8 && (
                  <div>
                    <strong className="level2-sb-8 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 2 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 8 && (
                  <div>
                    <strong className="level2-sb-8 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 3 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 8 && (
                  <div>
                    <strong className="level2-sb-8 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 4 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 8 && (
                  <div>
                    <strong className="level2-sb-8 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {/* elimination on deaL 9 */}
              {index === playerData.length - 1 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 9 && (
                  <div>
                    <strong className="level2-sb-9 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 2 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 9 && (
                  <div>
                    <strong className="level2-sb-9 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 3 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 9 && (
                  <div>
                    <strong className="level2-sb-9 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 4 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 9 && (
                  <div>
                    <strong className="level2-sb-9 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {/* elimination on deaL 10 */}
              {index === playerData.length - 1 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 10 && (
                  <div>
                    <strong className="level2-sb-10 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 2 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 10 && (
                  <div>
                    <strong className="level2-sb-10 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 3 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 10 && (
                  <div>
                    <strong className="level2-sb-10 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 4 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 10 && (
                  <div>
                    <strong className="level2-sb-10 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              .{/* elimination on deaL 11 */}
              {index === playerData.length - 1 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 11 && (
                  <div>
                    <strong className="level2-sb-11 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 2 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 11 && (
                  <div>
                    <strong className="level2-sb-11 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 3 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 11 && (
                  <div>
                    <strong className="level2-sb-11 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
              {index === playerData.length - 4 &&
                value.playerStatus === "Eliminated" &&
                value.eliminationLevel === 12 && (
                  <div>
                    <strong className="level2-sb-11 sbuserrow1">
                      <img src={sbeliminated} alt="" />
                    </strong>
                  </div>
                )}
            </div>
          ))}

          <div className="fsbmain-head sb_level12 fsbmainheadspan l-12">
            <strong className="l1-top-head-1 sbuserrow1">
              L1 <i class="orange_font">({boosters[0]}X)</i>
            </strong>

            <strong className="l1-top-head-2 sbuserrow2">
              L2 <i class="orange_font">({boosters[1]}X)</i>
            </strong>

            <strong className="l1-top-head-3 sbuserrow3">
              L3 <i class="orange_font">({boosters[2]}X)</i>
            </strong>

            <strong className="l1-top-head-4 sbuserrow4">
              L4 <i class="orange_font">({boosters[3]}X)</i>
            </strong>

            <strong className="l1-top-head-5 sbuserrow5">
              L5 <i class="orange_font">({boosters[4]}X)</i>
            </strong>

            <strong className="l1-top-head-6 sbuserrow6">
              L6 <i class="orange_font">({boosters[5]}X)</i>
            </strong>

            <strong className="l1-top-head-7 sbuserrow7">
              L7 <i class="orange_font">({boosters[6]}X)</i>
            </strong>

            <strong className="l1-top-head-8 sbuserrow8">
              L8 <i class="orange_font">({boosters[7]}X)</i>
            </strong>

            <strong className="l1-top-head-9 sbuserrow9">
              L9 <i class="orange_font">({boosters[8]}X)</i>
            </strong>

            <strong className="l1-top-head-10 sbuserrow10">
              L10 <i class="orange_font">({boosters[9]}X)</i>
            </strong>

            <strong className="l1-top-head-11 sbuserrow11">
              L11 <i class="orange_font">({boosters[10]}X)</i>
            </strong>

            <strong className="l1-top-head-12 sbuserrow12">
              L12 <i class="orange_font">({boosters[11]}X)</i>
            </strong>

            <img
              src={sbheadsm}
              alt=""
              className="sbheadsm1 sb_level12_head_1 sbuserrow1"
            />
            <img
              src={sbheadsm}
              alt=""
              className="sbheadsm2 sb_level12_head_1 sbuserrow2"
            />
            <img
              src={sbheadsm}
              alt=""
              className="sbheadsm3 sb_level12_head_1 sbuserrow3"
            />
            <img
              src={sbheadsm}
              alt=""
              className="sbheadsm4 sb_level12_head_1 sbuserrow4"
            />
            <img
              src={sbheadsm}
              alt=""
              className="sbheadsm5 sb_level12_head_1 sbuserrow5"
            />
            <img
              src={sbheadsm}
              alt=""
              className="sbheadsm6 sb_level12_head_1 sbuserrow6"
            />
            <img
              src={sbheadsm}
              alt=""
              className="sbheadsm1 sb_level12_head_1 sbuserrow7"
            />
            <img
              src={sbheadsm}
              alt=""
              className="sbheadsm2 sb_level12_head_1 sbuserrow8"
            />
            <img
              src={sbheadsm}
              alt=""
              className="sbheadsm3 sb_level12_head_1 sbuserrow9"
            />
            <img
              src={sbheadsm}
              alt=""
              className="sbheadsm4 sb_level12_head_1 sbuserrow10"
            />
            <img
              src={sbheadsm}
              alt=""
              className="sbheadsm5 sb_level12_head_1 sbuserrow11"
            />
            <img
              src={sbheadsm}
              alt=""
              className="sbheadsm6 sb_level12_head_1 sbuserrow12"
            />
            {/* <img src={sbheadsm} alt="" className="sbheadsm4 sbuserrow4" />  */}
            <div className="sbrowhead1 sbuserrow1">
              <span className="sbuserrow1">D1</span>
              {/* Display totalPoints for first six players */}

              {/* hide totalPoints here  */}
              {showPointsOne && (
                <div className="total-points-container">
                  <div className="total-points-column">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(0, 1).map((points, index) => (
                          <div key={index} className="total-points">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span className="sbuserrow2">D2</span>
              {/* Display totalPoints for next six players */}
              {showPointsTwo && (
                <div className="total-points-container">
                  <div className="total-points-column2">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(1, 2).map((points, index) => (
                          <div key={index} className="total-points2">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span className="d3-l3 sbuserrow3">D3</span>
              {/* Display totalPoints for next six players */}
              {showPointsThree && (
                <div className="total-points-container">
                  <div className="total-points-column3">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(2, 3).map((points, index) => (
                          <div key={index} className="total-points3">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="sbrowhead2 sbuserrow2">
              <span className="d4-l3 sbuserrow4">D4</span>

              {showPointsFour && (
                <div className="total-points-container">
                  <div className="total-points-column4">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(3, 4).map((points, index) => (
                          <div key={index} className="total-points4">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
              <span className="d5-l3 sbuserrow5">D5</span>

              {showPointsFive && (
                <div className="total-points-container">
                  <div className="total-points-column5">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(4, 5).map((points, index) => (
                          <div key={index} className="total-points5">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span className="d6-l3 sbuserrow6">D6</span>

              {showPointsSix && (
                <div className="total-points-container">
                  <div className="total-points-column6">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(5, 6).map((points, index) => (
                          <div key={index} className="total-points6">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="sbrowhead3 sbuserrow3">
              <span className="d7-l3 sbuserrow7">D7</span>
              {showPointsSeven && (
                <div className="total-points-container">
                  <div className="total-points-column7">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(6, 7).map((points, index) => (
                          <div key={index} className="total-points7">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span className="d8-l3 sbuserrow8">D8</span>
              {showPointsEight && (
                <div className="total-points-container">
                  <div className="total-points-column8">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(7, 8).map((points, index) => (
                          <div key={index} className="total-points8">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span className="d9-l3 sbuserrow9">D9</span>
              {showPointsNine && (
                <div className="total-points-container">
                  <div className="total-points-column9">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints.slice(8, 9).map((points, index) => (
                          <div key={index} className="total-points9">
                            <span>{points}</span>
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="sbrowhead4 sbuserrow4">
              <span className="d10-l3 sbuserrow10">D10</span>

              {showPointsTen && (
                <div className="total-points-container">
                  <div className="total-points-column10">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints
                          .slice(9, 10)
                          .map((points, index) => (
                            <div key={index} className="total-points10">
                              <span>{points}</span>
                            </div>
                          ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <span className="d11-l3 sbuserrow11">D11</span>
              {showPointsEleven && (
                <div className="total-points-container">
                  <div className="total-points-column11">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints
                          .slice(10, 11)
                          .map((points, index) => (
                            <div key={index} className="total-points11">
                              <span>{points}</span>
                            </div>
                          ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
              <span className="d12-l3 sbuserrow12">D12</span>

              {showPointsTwelve && (
                <div className="total-points-container">
                  <div className="total-points-column12">
                    {totalPoints.map((player, playerIndex) => (
                      <React.Fragment key={playerIndex}>
                        {player.totalPoints
                          .slice(11, 12)
                          .map((points, index) => (
                            <div key={index} className="total-points12">
                              <span>{points}</span>
                            </div>
                          ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
              {/* <strong>
  LEVEL 4 <i class="orange_font">({boosters[3]}X)</i>
</strong> */}
            </div>
          </div>
          <div className="sb_level12 level1bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level12 level2bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level12 level3bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level12 level4bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level12 level5bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level12 level6bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level12 level7bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level12 level8bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level12 level9bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level12 level10bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level12 level11bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
          <div className="sb_level12 level12bg">
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-5" />
            <img src={sbpointbgl12} className="sbpointbg sbpointbg-6" />
          </div>
        </div>
      )}
    </>
  );
}
