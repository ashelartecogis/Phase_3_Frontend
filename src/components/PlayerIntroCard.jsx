import React, { useContext, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { swing } from "react-animations";
import "./css/PlayerIntroCard.css";
import PC from "../images/platinum_club.png";
import GRC from "../images/grc_logo_new.png";
import INTROBG from "../images/player_intro_red_bg.png";
import INTROEC from "../images/introeclips.png";
import TITLEBOX from "../images/titlebox.png";
import LazyLoad from "react-lazyload";
import { base_url } from "../config";
import deal_set_2 from "../images/deal_set_2.png";
import deal_set_3 from "../images/deal_set_3.png";
import deal_set_4 from "../images/deal_set_4.png";
import deal_set_6 from "../images/deal_set_6.png";
import maxPoints_FirstDrop from "../images/maxPoints_firstDrop.png";
import levels_tab_1 from "../images/levels_tab_1.png";
import levels_tab_2_1 from "../images/levels_tab_2.png";
import levels_tab_2_2 from "../images/levels_tab_2.2.png";
import levels_tab_3_1 from "../images/levels_tab_3.1.png";
import levels_tab_3_2 from "../images/levels_tab_3.2.png";
import levels_tab_3_3 from "../images/levels_tab_3.3.png";
import levels_tab_4_1 from "../images/levels_tab_4.1.png";
import levels_tab_4_2 from "../images/levels_tab_4.2.png";
import levels_tab_4_3 from "../images/levels_tab_4.3.png";
import levels_tab_4_4 from "../images/levels_tab_4.4.png";
import levels_tab_6_1 from "../images/levels_tab_6.1.png";
import levels_tab_6_2 from "../images/levels_tab_6.2.png";
import levels_tab_6_3 from "../images/levels_tab_6.3.png";
import levels_tab_6_4 from "../images/levels_tab_6.4.png";
import levels_tab_6_5 from "../images/levels_tab_6.5.png";
import levels_tab_6_6 from "../images/levels_tab_6.6.png";
import levels_tab_12 from "../images/levels_tab_12.png";
import levels_tab_12_1 from "../images/deal1-levels.png";
import levels_tab_12_2 from "../images/deal2-levels.png";
import levels_tab_12_3 from "../images/deal3-levels.png";
import levels_tab_12_4 from "../images/deal4-levels.png";
import levels_tab_12_5 from "../images/deal5-levels.png";
import levels_tab_12_6 from "../images/deal6-levels.png";
import levels_tab_12_7 from "../images/deal7-levels.png";
import levels_tab_12_8 from "../images/deal8-levels.png";
import levels_tab_12_9 from "../images/deal9-levels.png";
import levels_tab_12_10 from "../images/deal10-levels.png";
import levels_tab_12_11 from "../images/deal11-levels.png";
import levels_tab_12_12 from "../images/deal12-levels.png";
import levels_tab_12_divider from "../images/level12-divider.png";
import round_structure from "../images/round_structure.png";
import levels_totalChips from "../images/levels_totalChips.png";
import { SocketContext } from "../services/socket";
import axios from "axios";
import baseURL from "../baseURL";
const bounceAnimation = keyframes`${swing}`;

const BouncyDiv = styled.div`
  position: absolute;
  top: 49.4%;
  right: 4.69%;
  bottom: 21.53%;
  width: 30%;
`;

export default function PlayerIntroCard({ name, State, club, photo }) {
  const socket = useContext(SocketContext);
  const [calculatedChips, setCalculatedChips] = useState(null);
  const [receivedData1, setReceivedData1] = useState(null);
  const [receivedData2, setReceivedData2] = useState(null);
  const [receivedData3, setReceivedData3] = useState(null);
  const [receivedData4, setReceivedData4] = useState(null);
  const [receivedData5, setReceivedData5] = useState(null);
  const [receivedData6, setReceivedData6] = useState(null);

  const [boosterData, setBoosterData] = useState(null);
  const [firstDropData, setFirstDropData] = useState(null);
  const [eliminationData, setEliminationData] = useState(null);

  useEffect(() => {
    const fetchCalculatedChips = async () => {
      try {
        const response = await axios.get(
          `${baseURL}:8000/api/levels/calculatedChips`
        );
        const chips = response.data[0]; // Assuming the response is an array with a single value
        setCalculatedChips(chips);
      } catch (error) {
        console.error("Error fetching calculated chips:", error);
      }
    };

    fetchCalculatedChips();

    // Clean-up function
    return () => {
      // Any clean-up code here (if needed)
    };
  }, []);

  useEffect(() => {
    const handlers = {
      receive_levels_intro_1: setReceivedData1,
      receive_levels_intro_2: setReceivedData2,
      receive_levels_intro_3: setReceivedData3,
      receive_levels_intro_4: setReceivedData4,
      receive_levels_intro_5: setReceivedData5,
      receive_levels_intro_6: setReceivedData6,
    };

    for (const [eventName, setData] of Object.entries(handlers)) {
      socket.on(eventName, (data) => {
        console.log(`Received data from ${eventName}:`, data.message);
        setData(data.message);

        // Reset other states
        for (const [otherEventName, otherSetData] of Object.entries(handlers)) {
          if (eventName !== otherEventName) {
            otherSetData(null);
          }
        }
      });
    }

    // Clean up the socket listeners when component unmounts
    return () => {
      for (const eventName of Object.keys(handlers)) {
        socket.off(eventName);
      }
    };
  }, [socket]);

  useEffect(() => {
    // Fetch levelNumber from the endpoint
    axios
      .get(`${baseURL}:8000/api/levels/levelNumber`)
      .then((response) => {
        const levelNumber = response.data; // Extract levelNumber from the response

        // Calculate maxDealIndex based on the fetched levelNumber
        const maxDealIndex = levelNumber - 1;

        // Iterate over each dealIndex up to maxDealIndex
        for (let dealIndex = 0; dealIndex <= maxDealIndex; dealIndex++) {
          // Fetch data for booster
          axios
            .get(`${baseURL}:8000/api/levels/boosters`)
            .then((response) => {
              setBoosterData((prevData) => ({
                ...prevData,
                [dealIndex]: response.data,
              }));
            })
            .catch((error) => {
              console.error("Error fetching booster data:", error);
              setBoosterData((prevData) => ({
                ...prevData,
                [dealIndex]: "Data not found",
              }));
            });

          // Fetch data for firstDrop
          axios
            .get(`${baseURL}:8000/api/levels/firstDrop`)
            .then((response) => {
              setFirstDropData((prevData) => ({
                ...prevData,
                [dealIndex]: response.data,
              }));
            })
            .catch((error) => {
              console.error("Error fetching firstDrop data:", error);
              setFirstDropData((prevData) => ({
                ...prevData,
                [dealIndex]: "Data not found",
              }));
            });

          // Fetch data for elimination
          axios
            .get(`${baseURL}:8000/api/levels/elimination`)
            .then((response) => {
              setEliminationData((prevData) => ({
                ...prevData,
                [dealIndex]: response.data,
              }));
            })
            .catch((error) => {
              console.error("Error fetching elimination data:", error);
              setEliminationData((prevData) => ({
                ...prevData,
                [dealIndex]: "Data not found",
              }));
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching levelNumber:", error);
      });
  }, []);

  let curphoto = photo.replace(/\\/g, "/");

  return (
    <>
      <div className="fade-in-intro pic-logo">
        <div className="logodiv">
          <LazyLoad height={"100%"}>
            <img src={GRC} />
          </LazyLoad>
        </div>
      </div>

      {receivedData1 && (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 999,
          }}
        >
          <img
            src={maxPoints_FirstDrop}
            style={{
              display: "flex",
              position: "absolute",
              marginTop: "452px",
              marginLeft: "1117px",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              position: "absolute",
              color: "#fff",
            }}
          >
            {Object.keys(boosterData).map((dealIndex, index) => {
              // Get the index of each array based on the dynamically iterated index
              const boosterIndex =
                boosterData[dealIndex] &&
                boosterData[dealIndex][index] !== undefined
                  ? boosterData[dealIndex][index]
                  : null;
              const eliminationIndex =
                eliminationData[dealIndex] &&
                eliminationData[dealIndex][index] !== undefined
                  ? eliminationData[dealIndex][index]
                  : null;
              const adjustedBoosterIndex =
                boosterIndex !== null ? boosterIndex / 4 : null;

              return (
                <div
                  className="leveltxt level1 ltor-animation-child"
                  key={dealIndex}
                >
                  <h2>
                    {boosterIndex !== null ? boosterIndex * 80 : "Loading..."}
                  </h2>
                  <h2>
                    {adjustedBoosterIndex !== null
                      ? adjustedBoosterIndex * 80
                      : "Loading..."}
                  </h2>
                  <h2>
                    {eliminationIndex !== null
                      ? `${eliminationIndex} - Elimination`
                      : "Loading..."}
                  </h2>
                </div>
              );
            })}
          </div>
          <div className="level1-bg"></div>
          <div>
            <img
              src={levels_totalChips}
              alt=""
              className="levels_tp"
              style={{
                display: "flex",
                position: "absolute",
                right: "0px",
                bottom: "40px",
              }}
            />
            <h2
              style={{
                display: "flex",
                position: "absolute",
                fontSize: "30.79",
                fontWeight: 600,
                right: "35px",
                bottom: "42px",
                color: "#FFB951",
              }}
            >
              Total Chips - {calculatedChips}
            </h2>
          </div>
          <img
            src={levels_tab_1}
            className="left-to-right-animation-1"
            alt="levels_tab_1_1"
            style={{
              marginLeft: "217px",
              marginTop: "517px",
            }}
          />
        </div>
      )}
      {receivedData2 && (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 999,
          }}
        >
          <img
            src={maxPoints_FirstDrop}
            style={{
              display: "flex",
              position: "absolute",
              marginTop: "390px",
              marginLeft: "1071px",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              position: "absolute",
              color: "#fff",
            }}
          >
            {Object.keys(boosterData).map((dealIndex, index) => {
              // Get the index of each array based on the dynamically iterated index
              const boosterIndex =
                boosterData[dealIndex] &&
                boosterData[dealIndex][index] !== undefined
                  ? boosterData[dealIndex][index]
                  : null;
              const eliminationIndex =
                eliminationData[dealIndex] &&
                eliminationData[dealIndex][index] !== undefined
                  ? eliminationData[dealIndex][index]
                  : null;
              const adjustedBoosterIndex =
                boosterIndex !== null ? boosterIndex / 4 : null;

              return (
                <div
                  className="leveltxt level2 ltor-animation-child"
                  key={dealIndex}
                >
                  <h2>
                    {boosterIndex !== null ? boosterIndex * 80 : "Loading..."}
                  </h2>
                  <h2>
                    {adjustedBoosterIndex !== null
                      ? adjustedBoosterIndex * 80
                      : "Loading..."}
                  </h2>
                  <h2>
                    {eliminationIndex !== null
                      ? `${eliminationIndex}-Elimination`
                      : "Loading..."}
                  </h2>
                </div>
              );
            })}
          </div>

          <img
            src={deal_set_2}
            style={{
              display: "flex",
              position: "absolute",
              marginTop: "493px",
              marginLeft: "189px",
            }}
          />
          <div className="level2-bg"></div>
          <div>
            <img
              src={levels_totalChips}
              alt=""
              className="levels_tp"
              style={{
                display: "flex",
                position: "absolute",
                right: "0px",
                bottom: "40px",
              }}
            />
            <h2
              style={{
                display: "flex",
                position: "absolute",
                fontSize: "30.79",
                fontWeight: 600,
                right: "40px",
                bottom: "42px",
                color: "#FFB951",
              }}
            >
              Total Chips - {calculatedChips}
            </h2>
          </div>

          <img
            src={levels_tab_2_1}
            className="left-to-right-animation-1"
            alt=""
            style={{
              display: "flex",
              position: "absolute",
              marginLeft: "432px",
              marginTop: "457px",
            }}
          />
          <img
            src={levels_tab_2_2}
            className="left-to-right-animation-2"
            alt=""
            style={{
              // position:"relative",
              // display:"flex",
              marginLeft: "432px",
              marginTop: "632px",
            }}
          />
        </div>
      )}
      {receivedData3 && (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 999,
          }}
        >
          <img
            src={round_structure}
            style={{
              display: "flex",
              position: "absolute",
              marginTop: "228px",
              marginLeft: "453px",
            }}
          />
          <img
            src={maxPoints_FirstDrop}
            style={{
              display: "flex",
              position: "absolute",
              marginTop: "296px",
              marginLeft: "1092px",
            }}
          />

          <div
            style={{
              display: "flex",
              position: "absolute",
              color: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                position: "absolute",
                color: "#fff",
              }}
            >
              {Object.keys(boosterData).map((dealIndex, index) => {
                // Get the index of each array based on the dynamically iterated index
                const boosterIndex =
                  boosterData[dealIndex] &&
                  boosterData[dealIndex][index] !== undefined
                    ? boosterData[dealIndex][index]
                    : null;
                const eliminationIndex =
                  eliminationData[dealIndex] &&
                  eliminationData[dealIndex][index] !== undefined
                    ? eliminationData[dealIndex][index]
                    : null;
                const adjustedBoosterIndex =
                  boosterIndex !== null ? boosterIndex / 4 : null;

                return (
                  <div
                    className="leveltxt level3 ltor-animation-child"
                    key={dealIndex}
                  >
                    <h2>
                      {boosterIndex !== null ? boosterIndex * 80 : "Loading..."}
                    </h2>
                    <h2>
                      {adjustedBoosterIndex !== null
                        ? adjustedBoosterIndex * 80
                        : "Loading..."}
                    </h2>
                    <h2>
                      {eliminationIndex !== null
                        ? `${eliminationIndex}-Elimination`
                        : "Loading..."}
                    </h2>
                  </div>
                );
              })}
            </div>
          </div>

          <img
            src={deal_set_3}
            style={{
              display: "flex",
              position: "absolute",
              marginTop: "390.5px",
              marginLeft: "201px",
            }}
          />
          <div className="level3-bg"></div>
          <div>
            <img
              src={levels_totalChips}
              alt=""
              className="levels_tp"
              style={{
                display: "flex",
                position: "absolute",
                right: "0px",
                bottom: "40px",
              }}
            />
            <h2
              style={{
                display: "flex",
                position: "absolute",
                fontSize: "30.79",
                fontWeight: 600,
                right: "40px",
                bottom: "42px",
                color: "#FFB951",
              }}
            >
              Total Chips - {calculatedChips}
            </h2>
          </div>
          <img
            src={levels_tab_3_1}
            className="left-to-right-animation-1"
            alt=""
            style={{
              display: "flex",
              position: "absolute",
              marginLeft: "453px",
              marginTop: "363px",
            }}
          />
          <img
            src={levels_tab_3_2}
            className="left-to-right-animation-2"
            alt=""
            style={{
              display: "flex",
              position: "absolute",
              marginLeft: "453px",
              marginTop: "530px",
            }}
          />
          <img
            src={levels_tab_3_3}
            className="left-to-right-animation-3"
            alt=""
            style={{
              display: "flex",
              position: "absolute",
              marginLeft: "453px",
              marginTop: "680px",
            }}
          />
        </div>
      )}
      {receivedData4 && (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "fixed",
            top: 0,
            left: "95px",
            zIndex: 999,
          }}
        >
          <img
            src={round_structure}
            style={{
              display: "flex",
              position: "absolute",
              marginTop: "128px",
              marginLeft: "406px",
            }}
          />
          <img
            src={maxPoints_FirstDrop}
            style={{
              display: "flex",
              position: "absolute",
              marginTop: "196px",
              marginLeft: "1045px",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              position: "absolute",
              color: "#fff",
            }}
          >
            {Object.keys(boosterData).map((dealIndex, index) => {
              // Get the index of each array based on the dynamically iterated index
              const boosterIndex =
                boosterData[dealIndex] &&
                boosterData[dealIndex][index] !== undefined
                  ? boosterData[dealIndex][index]
                  : null;
              const eliminationIndex =
                eliminationData[dealIndex] &&
                eliminationData[dealIndex][index] !== undefined
                  ? eliminationData[dealIndex][index]
                  : null;
              const adjustedBoosterIndex =
                boosterIndex !== null ? boosterIndex / 4 : null;

              return (
                <div
                  className="leveltxt level4 ltor-animation-child"
                  key={dealIndex}
                >
                  <h2>
                    {boosterIndex !== null ? boosterIndex * 80 : "Loading..."}
                  </h2>
                  <h2>
                    {adjustedBoosterIndex !== null
                      ? adjustedBoosterIndex * 80
                      : "Loading..."}
                  </h2>
                  <h2>
                    {eliminationIndex !== null
                      ? `${eliminationIndex}-Elimination`
                      : "Loading..."}
                  </h2>
                </div>
              );
            })}
          </div>

          <div className="level4-bg"></div>
          <div>
            <img
              src={levels_totalChips}
              alt=""
              className="levels_tp"
              style={{
                display: "flex",
                position: "absolute",
                right: "80px",
                bottom: "40px",
              }}
            />
            <h2
              style={{
                display: "flex",
                position: "absolute",
                fontSize: "30.79",
                fontWeight: 600,
                right: "130px",
                bottom: "42px",
                color: "#FFB951",
              }}
            >
              Total Chips - {calculatedChips}
            </h2>
          </div>

          <img
            src={deal_set_4}
            style={{
              display: "flex",
              position: "absolute",
              marginTop: "302.5px",
              marginLeft: "154px",
            }}
          />
          <img
            src={levels_tab_4_1}
            className="left-to-right-animation-1"
            alt=""
            style={{
              display: "flex",
              position: "absolute",
              marginLeft: "406px",
              marginTop: "263px",
            }}
          />
          <img
            src={levels_tab_4_2}
            className="left-to-right-animation-2"
            alt=""
            style={{
              display: "flex",
              position: "absolute",
              marginLeft: "406px",
              marginTop: "454px",
            }}
          />
          <img
            src={levels_tab_4_3}
            className="left-to-right-animation-3"
            alt=""
            style={{
              display: "flex",
              position: "absolute",
              marginLeft: "406px",
              marginTop: "645px",
            }}
          />
          <img
            src={levels_tab_4_4}
            className="left-to-right-animation-4"
            alt=""
            style={{
              display: "flex",
              position: "absolute",
              marginLeft: "406px",
              marginTop: "820px",
            }}
          />
        </div>
      )}
      {receivedData5 && (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 999,
          }}
        >
          <img
            src={round_structure}
            style={{
              display: "flex",
              position: "absolute",
              marginTop: "128px",
              marginLeft: "406px",
            }}
          />
          <img
            src={maxPoints_FirstDrop}
            style={{
              display: "flex",
              position: "absolute",
              marginTop: "196px",
              marginLeft: "1045px",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              position: "absolute",
              color: "#fff",
            }}
          >
            {Object.keys(boosterData).map((dealIndex, index) => {
              // Get the index of each array based on the dynamically iterated index
              const boosterIndex =
                boosterData[dealIndex] &&
                boosterData[dealIndex][index] !== undefined
                  ? boosterData[dealIndex][index]
                  : null;
              const eliminationIndex =
                eliminationData[dealIndex] &&
                eliminationData[dealIndex][index] !== undefined
                  ? eliminationData[dealIndex][index]
                  : null;
              const adjustedBoosterIndex =
                boosterIndex !== null ? boosterIndex / 4 : null;

              return (
                <div
                  className="leveltxt level6 ltor-animation-child"
                  key={dealIndex}
                >
                  <h2>
                    {boosterIndex !== null ? boosterIndex * 80 : "Loading..."}
                  </h2>
                  <h2>
                    {adjustedBoosterIndex !== null
                      ? adjustedBoosterIndex * 80
                      : "Loading..."}
                  </h2>
                  <h2>
                    {eliminationIndex !== null
                      ? `${eliminationIndex}-Elimination`
                      : "Loading..."}
                  </h2>
                </div>
              );
            })}
          </div>
          <div className="level6-bg"></div>
          <div>
            <img
              src={levels_totalChips}
              alt=""
              className="levels_tp"
              style={{
                display: "flex",
                position: "absolute",
                right: "0px",
                bottom: "40px",
              }}
            />
            <h2
              style={{
                display: "flex",
                position: "absolute",
                fontSize: "30.79",
                fontWeight: 600,
                right: "40px",
                bottom: "42px",
                color: "#FFB951",
              }}
            >
              Total Chips - {calculatedChips}
            </h2>
          </div>

          <img
            src={deal_set_6}
            style={{
              display: "flex",
              position: "absolute",
              marginTop: "302px",
              marginLeft: "154px",
            }}
          />

          <img
            src={levels_tab_6_1}
            className="left-to-right-animation-1"
            alt=""
            style={{
              display: "flex",
              position: "absolute",
              marginLeft: "406px",
              marginTop: "263px",
            }}
          />
          <img
            src={levels_tab_6_2}
            className="left-to-right-animation-2"
            alt=""
            style={{
              display: "flex",
              position: "absolute",
              marginLeft: "406px",
              marginTop: "387px",
            }}
          />
          <img
            src={levels_tab_6_3}
            className="left-to-right-animation-3"
            alt=""
            style={{
              display: "flex",
              position: "absolute",
              marginLeft: "406px",
              marginTop: "511px",
            }}
          />
          <img
            src={levels_tab_6_4}
            className="left-to-right-animation-4"
            alt=""
            style={{
              display: "flex",
              position: "absolute",
              marginLeft: "406px",
              marginTop: "635px",
            }}
          />
          <img
            src={levels_tab_6_5}
            className="left-to-right-animation-5"
            alt=""
            style={{
              display: "flex",
              position: "absolute",
              marginLeft: "406px",
              marginTop: "759px",
            }}
          />
          <img
            src={levels_tab_6_6}
            className="left-to-right-animation-6"
            alt=""
            style={{
              display: "flex",
              position: "absolute",
              marginLeft: "406px",
              marginTop: "870px",
            }}
          />
        </div>
      )}
      {receivedData6 && (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 999,
          }}
        >
          <img
            src={round_structure}
            style={{
              display: "flex",
              position: "absolute",
              marginTop: "98px",
              marginLeft: "739px",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              position: "absolute",
              color: "#fff",
            }}
          >
            {Object.keys(boosterData).map((dealIndex, index) => {
              // Get the index of each array based on the dynamically iterated index
              const boosterIndex =
                boosterData[dealIndex] &&
                boosterData[dealIndex][index] !== undefined
                  ? boosterData[dealIndex][index]
                  : null;
              const eliminationIndex =
                eliminationData[dealIndex] &&
                eliminationData[dealIndex][index] !== undefined
                  ? eliminationData[dealIndex][index]
                  : null;
              const adjustedBoosterIndex =
                boosterIndex !== null ? boosterIndex / 4 : null;

              return (
                <div
                  key={dealIndex}
                  className="level12intro-main level12intro sbuser-animation"
                >
                  <h2>
                    {boosterIndex !== null ? boosterIndex * 80 : "Loading..."}
                  </h2>
                  <h2>
                    {adjustedBoosterIndex !== null
                      ? adjustedBoosterIndex * 80
                      : "Loading..."}
                  </h2>
                  <h2>
                    {eliminationIndex !== null
                      ? `${eliminationIndex}-Elimination`
                      : "Loading..."}
                  </h2>
                </div>
              );
            })}
          </div>
          <div className="level12-bg"></div>
          <div>
            <img
              src={levels_totalChips}
              alt=""
              className="levels_tp"
              style={{
                display: "flex",
                position: "absolute",
                right: "0px",
                bottom: "40px",
              }}
            />
            <h2
              style={{
                display: "flex",
                position: "absolute",
                fontSize: "30.79",
                fontWeight: 600,
                right: "40px",
                bottom: "42px",
                color: "#FFB951",
              }}
            >
              Total Chips - {calculatedChips}
            </h2>
          </div>

          <h4 className="maxpointtxt1 left-to-right-animation-1">
            Max Points | First Drop
          </h4>
          <h4 className="maxpointtxt2 left-to-right-animation-1">
            Max Points | First Drop
          </h4>

          <img
            src={levels_tab_12_1}
            alt=""
            className="level12intro-img level12intro-img-1 left-to-right-animation-1"
          />
          <img
            src={levels_tab_12_2}
            alt=""
            className="level12intro-img level12intro-img-2 left-to-right-animation-2"
          />
          <img
            src={levels_tab_12_3}
            alt=""
            className="level12intro-img level12intro-img-3 left-to-right-animation-3"
          />
          <img
            src={levels_tab_12_4}
            alt=""
            className="level12intro-img level12intro-img-4 left-to-right-animation-4"
          />
          <img
            src={levels_tab_12_5}
            alt=""
            className="level12intro-img level12intro-img-5 left-to-right-animation-5"
          />
          <img
            src={levels_tab_12_6}
            alt=""
            className="level12intro-img level12intro-img-6 left-to-right-animation-6"
          />

          <img
            src={levels_tab_12_divider}
            alt=""
            className="level12-divider sbuser-animation"
          />

          <img
            src={levels_tab_12_7}
            alt=""
            className="level12intro-img level12intro-img-7 left-to-right-animation-1"
          />
          <img
            src={levels_tab_12_8}
            alt=""
            className="level12intro-img level12intro-img-8 left-to-right-animation-2"
          />
          <img
            src={levels_tab_12_9}
            alt=""
            className="level12intro-img level12intro-img-9 left-to-right-animation-3"
          />
          <img
            src={levels_tab_12_10}
            alt=""
            className="level12intro-img level12intro-img-10 left-to-right-animation-4"
          />
          <img
            src={levels_tab_12_11}
            alt=""
            className="level12intro-img level12intro-img-11 left-to-right-animation-5"
          />
          <img
            src={levels_tab_12_12}
            alt=""
            className="level12intro-img level12intro-img-12 left-to-right-animation-6"
          />

          {/* <img 
            src={levels_tab_12} 
            alt=""
            style={{
              marginLeft:"211px",
              marginTop:"196px"
            }}
          /> */}
        </div>
      )}

      {!receivedData1 &&
        !receivedData2 &&
        !receivedData3 &&
        !receivedData4 &&
        !receivedData5 &&
        !receivedData6 && (
          <div className="maindiv" key={name}>
            <BouncyDiv>
              <div className="">
                <LazyLoad height={"100%"}>
                  <img
                    src={INTROEC}
                    alt=""
                    width="100%"
                    height="100%"
                    className="player-backdrop fade-in-drop"
                    style={{ position: "absolute", bottom: "0%", right: "0%" }}
                  />
                </LazyLoad>
                <div className="">
                  <LazyLoad height={"100%"}>
                    <img
                      src={`${base_url}${curphoto}`}
                      alt=""
                      className="slide-in-bottom-iu"
                    />
                  </LazyLoad>
                </div>
                <div className="">
                  <img
                    src={INTROBG}
                    alt=""
                    className="boximg swing-in-bottom-fwd"
                  />
                </div>
                <div className="imagediv">
                  <div className="nameblock fade-in-text-1">
                    <span className="NameStyle">
                      {name ? name : "Ramesh Subramanyam"}
                    </span>
                  </div>
                  <div className="stateblock fade-in-text-2">
                    <span className="stateStyle">
                      {State ? State : "Bangalore"}
                    </span>
                  </div>
                  <div className="clubbox fade-in-text-3">
                    <span className="clubText">
                      <img
                        src={PC}
                        alt=""
                        className="platimg"
                        style={{
                          marginRight: "10px",
                          marginBottom: "10px",
                          height: "38px",
                          width: "41.4px",
                        }}
                      />
                      {club ? `${club} Club` : "Platinum Club"}
                    </span>
                  </div>
                </div>
              </div>
            </BouncyDiv>
          </div>
        )}
    </>
  );
}
