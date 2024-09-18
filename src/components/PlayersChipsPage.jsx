import React, { useEffect, useState } from "react";
import "./css/PlayersChipsPage.css";
import CHIP from "../images/chip.svg";
import GRC from "../images/grc_logo_new.png";
import TITLEBOX from "../images/titlebox.png";
import RC from "../images/rc.svg";
import DEALBG from "../images/dealbg.svg";
import DEALBGIMG from "../images/dealbgimg.png";
import FIRST from "../images/first.svg";
import SECOND from "../images/second.svg";
import THIRD from "../images/third.svg";
//import levelTopRight from "../images/levelTopRight.png";
import levelTopRight from "../images/levelTopRight2.png";
import RPBG from "../images/rightplayerbg.png";
import levelIntro from "../images/levelIntro.png";
import DIMG from "../images/d.png";
import axios from "axios";
import DCBB from "../images/dealchipblackbg.png";
import STAR from "../images/star.png";
import LazyLoad from "react-lazyload";
import { base_url } from "../config";
import baseURL from "../baseURL";

export default function PlayersChipsPage(props) {
  const [dealNumberCount, setDealNumberCount] = useState(1);
  const [playerPosition, setPlayerPosition] = useState([]);
  const [showIntro, setShowIntro] = useState(true);
  const [levelNumber, setLevelNumber] = useState(null);
  const [dealText, setDealText] = useState("");
  const [boosters, setBoosters] = useState([]);
  const [calculation, setCalculation] = useState(0);

  useEffect(() => {
    const fetchLevelNumber = async () => {
      try {
        const levelResponse = await axios.get(
          `${baseURL}:8000/api/levels/levelNumber`
        );
        setLevelNumber(levelResponse.data);
      } catch (error) {
        console.error("Error fetching level number:", error);
      }
    };

    const fetchBoosters = async () => {
      try {
        const boosterResponse = await axios.get(
          `${baseURL}:8000/api/levels/boosters`
        );
        setBoosters(boosterResponse.data);
      } catch (error) {
        console.error("Error fetching boosters:", error);
      }
    };

    fetchLevelNumber();
    fetchBoosters();
  }, []);

  useEffect(() => {
    if (levelNumber !== null && boosters.length > 0) {
      let total = 0;
      for (let i = 0; i < levelNumber; i++) {
        total += 80 * (12 / levelNumber) * boosters[i];
      }
      setCalculation(total);
    }
  }, [levelNumber, boosters]);

  useEffect(() => {
    if (calculation !== 0) {
      updateTotalChipsInDatabase(calculation);
    }
  }, [calculation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}:8000/api/levels/boxContent`
        );
        const deals = response.data;
        if (deals.length > 0) {
          const firstDeal = deals[0];
          const [deal, numbers] = firstDeal.split(" ");
          const [start, end] = numbers.split("-");
          setDealText(`${deal} ${start}/12`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const updateTotalChipsInDatabase = async (calculationValue) => {
    try {
      // Get all player IDs
      const response = await axios.get(
        `${baseURL}:8000/api/players/getAllPlayersIds`
      );
      const playerIds = response.data;

      // Iterate through each player ID and update total chips
      for (const playerIdObj of playerIds) {
        const playerId = playerIdObj._id;
        await axios.post(
          `http://192.168.9.245:8000/api/players/updateTotalChips`,
          {
            id: playerId,
            totalChips: calculationValue,
          }
        );
        console.log(
          `Total chips updated successfully for player with ID ${playerId}`
        );
      }

      console.log("Total chips updated for all players");
    } catch (error) {
      console.error("Error updating total chips:", error);
    }
  };

  useEffect(() => {
    setPlayerPosition(props.playerPosition);
  }, [props]);

  useEffect(() => {
    let localDealNo = localStorage.getItem("dealNumberCount");
    if (localDealNo !== undefined && localDealNo !== null) {
      setDealNumberCount(localDealNo);
    } else {
      setDealNumberCount(props.dealNumberCount);
    }
  }, []);

  useEffect(() => {
    const introTimeout = setTimeout(() => {
      setShowIntro(false);
    }, 4000); // Set timeout for 4 seconds (4000 milliseconds)

    return () => {
      clearTimeout(introTimeout); // Clear the timeout when the component unmounts
    };
  }, []);

  if (showIntro) {
    return (
      <div>
        <img
          src={levelIntro}
          alt="levelIntro"
          style={{
            width: "1920px",
            height: "201px",
            flexShrink: "0",
            bottom: "10%",
            marginLeft: "10px",
            marginTop: "-640px",
            display: "block",
            zIndex: 100,
          }}
        />
        <h1
          style={{
            marginTop: "-179px",
            marginLeft: "31%",
            display: "flex",
            position: "absolute",
            fontFamily: "Roboto",
            fontSize: "66px",
            fontWeight: "700",
            letterSpacing: "2%",
            color: "transparent", // Set text color to transparent
            background: `
              linear-gradient(180deg, rgba(255, 255, 255, 0.8) 11.54%, rgba(255, 255, 255, 0) 38.46%),
              linear-gradient(215.22deg, rgba(240, 240, 240, 0.2) 28.46%, rgba(255, 236, 214, 0) 47.02%),
              linear-gradient(180deg, #FFC961 38.46%, #FF9900 59.83%)`,
            WebkitBackgroundClip: "text", // Clip the background to the text
            MozBackgroundClip: "text",
            WebkitTextFillColor: "transparent", // Set text fill color to transparent
          }}
        >
          {" "}
          Level 1 ({boosters[0]}x)
        </h1>
        {/* level {levelNumber !== null ? ` ${levelNumber}` : ''}</h1> */}
        <span
          style={{
            marginTop: "-185px",
            marginLeft: "53%",
            display: "flex",
            color: "#fff",
            position: "absolute",
            fontFamily: "Roboto",
            fontSize: "66px",
            fontWeight: "500",
            letterSpacing: "2%",
          }}
        >
          {dealText}
        </span>
        <h1
          h1
          style={{
            color: "#fff",
            marginLeft: "35.8%",
            marginTop: "-59px",
          }}
        >
          First Drop {(boosters[0] * 80) / 4}
        </h1>
        <h1
          h1
          style={{
            color: "#fff",
            display: "flex",
            position: "absolute",
            marginLeft: "52%",
            marginTop: "-59px",
          }}
        >
          Max Points {boosters[0] * 80}
        </h1>
      </div>
    );
  }

  return (
    <div className="fade-in-intro">
      <div className="logodiv">
        {/* <LazyLoad height={"100%"}>
          <img
            src={RC}
            alt=""
            className="rc"
          />
        </LazyLoad > */}
        <LazyLoad height={"100%"}>
          <img src={GRC} alt="" className="grc" />
        </LazyLoad>
      </div>
      {/* <div className="titlebox">
        <img
          src={TITLEBOX}
          alt=""
          className="titleboximg"
        />
        <h4 className="dealtitle mb-0">Deal {dealNumberCount}</h4>
      </div> */}

      <div className="maindiv">
        <div className="leftsection">
          <div className="slide-out-bottom-first">
            <LazyLoad height={"100%"}>
              <img src={FIRST} alt="" className="slide-in-bottom-first" />
            </LazyLoad>
          </div>
          <div className="slide-out-bottom-second">
            <LazyLoad height={"100%"}>
              <img src={SECOND} alt="" className="slide-in-bottom-second " />
            </LazyLoad>
          </div>
          <div className="slide-out-bottom-third">
            <LazyLoad height={"100%"}>
              <img src={THIRD} alt="" className="slide-in-bottom-third" />
            </LazyLoad>
          </div>
          <div className="dealno">
            <div className="rotate-vert-center-opp">
              <LazyLoad height={"100%"}>
                <img
                  src={DEALBG}
                  alt=""
                  className="rotate-vert-center"
                  style={{
                    width: "409.31px",
                    height: "150px !important",
                    marginTop: "-65px",
                    marginLeft: "-20px",
                  }}
                />
              </LazyLoad>
            </div>
            <div className="tracking-in-contract-opp">
              <span className="tracking-in-contract-chips">
                Level 1
                {/* level {levelNumber !== null ? ` ${levelNumber}` : ''} */}
              </span>
            </div>
          </div>
          <div className="dealbgdiv">
            <div className="slide-in-left-deal-bg-img-opp">
              <LazyLoad height={"100%"}>
                <img
                  src={DEALBGIMG}
                  alt=""
                  className="slide-in-left-deal-bg-img"
                />
              </LazyLoad>
            </div>
            <div className="slide-in-left-deal-bg-text-opp">
              <div
                className="slide-in-left-deal-bg-text"
                style={{
                  fontSize: "42.68px",
                  fontWeight: "500",
                  marginLeft: "-450px",
                  paddingBottom: "5px",
                }}
              >
                {dealText}
              </div>
            </div>
          </div>
        </div>
        <div className="rightsection">
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
                position: "absolute",
                top: "-22px",
              }}
            />
            <h2
              style={{
                marginTop: "-7px",
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
              Level 1 ({boosters[0]}x)
            </h2>
            {/* level {levelNumber !== null ? ` ${levelNumber}` : ''}</h2> */}

            <span
              style={{
                marginTop: "-10px",
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
              {dealText}
            </span>
          </div>

          <img
            className="slide-in-right"
            src={DIMG}
            alt=""
            style={{
              display: "flex",
              width: "52px",
              height: "52px",
              position: "relative",
              left: "-170px",
              top: "690px",
              zIndex: "1000",
              animation: "fade-in 0.5s ease-in 2s both",
            }}
          />

          {playerPosition &&
            playerPosition.length > 0 &&
            playerPosition.map((value, index) => (
              <>
                <div className={`slide-in-right${index + 1}`}>
                  <div></div>
                  <div className={`bg${index + 1}`}>
                    <LazyLoad height={"100%"}>
                      <img src={RPBG} alt="" className="rpbg" />
                    </LazyLoad>
                    {/* <LazyLoad height={"100%"}>
                      <img
                        src={DCBB}
                        alt=""
                        className="bbg"
                      />
                    </LazyLoad > */}
                  </div>
                  <div className={`user${index + 1} user`}>
                    <LazyLoad height={"100%"}>
                      <img
                        src={`${base_url}${value.playerId.shortphoto}`}
                        alt=""
                        className="rightuserimg"
                      />
                    </LazyLoad>
                  </div>
                  <span
                    style={{
                      marginTop: "-90px",
                      marginRight: "25px",
                    }}
                    className={`username user${index + 1}name`}
                  >
                    {value.playerId.name.split(" ")[0]}{" "}
                    {value.playerId.name.split(" ")[1].charAt(0)}
                  </span>

                  <img
                    src={CHIP}
                    alt=""
                    className={`chip chip${index + 1}`}
                    style={{
                      marginRight: "12px",
                    }}
                  />
                  {/* <img
                    src={STAR}
                    alt=""
                    className="star"
                  /> */}
                  {/* <span className={`userchips user${index+1}chips`}>960</span>
                   */}
                  <span className={`userchips user${index + 1}chips`}>
                    {calculation}
                  </span>

                  {/* <span className="userpoints">80 <span className="pts">Pts</span></span> */}
                </div>
              </>
            ))}
        </div>
      </div>
    </div>
  );
}
