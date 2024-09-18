import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./css/HandCardsStrength.css";
import GRC from "../images/grc_logo_new.png";
import TITLEBOX from "../images/titlebox.png";
import RC from "../images/rc.svg";
import DIMG from "../images/d.png";
import DBLACK from "../images/dblack.png";
import LazyLoad from "react-lazyload";
import { base_url } from "../config";
import REDTABLE from "../images/green_table1.png";
import GREENTABLE from "../images/green_table.png";
import PSP from "../images/hand_cards_strength.png";
import hand_cards_holder from "../images/hand_cards_holder.png";
import axios from "axios";
import per1 from "../images/1per.png";
import per5 from "../images/5per.png";
import per10 from "../images/10per.png";
import per20 from "../images/20per.png";
import per30 from "../images/30per.png";
import per40 from "../images/40per.png";
import per50 from "../images/50per.png";
import per60 from "../images/60per.png";
import per70 from "../images/70per.png";
import per80 from "../images/80per.png";
import per90 from "../images/90per.png";
import per100 from "../images/100per.png";
import baseURL from "../baseURL";
import UP from "../images/up.png";
import DOWN from "../images/down.png";

export default function HandCardsStrength(props) {
  const [dealNumberCount, setDealNumberCount] = useState(1);
  const [inGame, setInGame] = useState({});
  const [initialPosition, setInitialPosition] = useState(null);
  const [probability, setProbability] = useState({});
  const [oldProbability, setOldProbability] = useState({});

  const [levelNumber, setLevelNumber] = useState(null);
  const [mergedData, setMergedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inGameData, playersData, playerPositionsData] =
          await Promise.all([
            axios.get(`${baseURL}:8000/api/ingame/getTotalPoints`),
            axios.get(`${baseURL}:8000/api/players/getPlayerTotalChips`),
            axios.get(`${baseURL}:8000/api/table/getPlayerPosition`),
          ]);

        // Map playerId to player position
        const playerPositions = {};
        playerPositionsData.data.forEach((player) => {
          playerPositions[player.playerId] = player.position;
        });

        // Merge player data with position data
        const mergedData = inGameData.data.map((inGameData) => {
          const playerData = playersData.data.find(
            (player) => player._id === inGameData.playerId
          );
          return {
            ...inGameData,
            ...playerData,
            position: playerPositions[inGameData.playerId],
          };
        });

        // Sort merged data by position
        mergedData.sort((a, b) => a.position - b.position);

        setMergedData(mergedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
  }, []);

  return (
    <>
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
          <img src={TITLEBOX} alt="" className="titleboximg" />
          <h4 className="psstitle mb-0">Deal {dealNumberCount}</h4>
        </div> */}
      </div>
      <div className="psmaindiv">
        <div class="psp_out">
          <img src={PSP} alt="" className="psp-hc" />
        </div>
        {/* <div className="dimg_out">
                    <img
                        src={DIMG}
                        alt=""
                        className="dmarker"
                    />
                </div> */}
        {mergedData &&
          mergedData.length > 0 &&
          mergedData.map((value, index) => (
            <>
              <img
                src={`${base_url}${value.shortphoto}`}
                alt=""
                className={`cdu${index + 1}-hc cdu-hc`}
              />
              <div className={`cnums${index + 1}-deal`}>
                <img
                  src={hand_cards_holder}
                  alt=""
                  className={`ppn-hc ppn${index + 1}`}
                />
                {/* Add your probability logic here */}
                <div className="row hcname-row">
                  <div className="col-12 mx-auto text-center">
                    <span className={`ppname-hc`}>
                      {value.name.split(" ")[0]}
                    </span>
                    {/* Add the logic for rendering the dMarker */}
                    {index === 0 && value.dMarker === "true" && (
                      <div className="dimg_out">
                        <img src={DIMG} alt="" className="dmarker" />
                      </div>
                    )}
                    {index === 1 && value.dMarker === "true" && (
                      <div className="dimg_out">
                        <img src={DIMG} alt="" className="dmarker" />
                      </div>
                    )}
                    {index === 2 && value.dMarker === "true" && (
                      <div className="dimg_out">
                        <img src={DIMG} alt="" className="dmarker" />
                      </div>
                    )}
                    {index === 3 && value.dMarker === "true" && (
                      <div className="dimg_out">
                        <img src={DIMG} alt="" className="dmarker" />
                      </div>
                    )}
                    {index === 4 && value.dMarker === "true" && (
                      <div className="dimg_out">
                        <img src={DIMG} alt="" className="dmarker" />
                      </div>
                    )}
                    {index === 5 && value.dMarker === "true" && (
                      <div className="dimg_out">
                        <img src={DIMG} alt="" className="dmarker" />
                      </div>
                    )}
                  </div>
                </div>
                <span className={`ppchips-hc ppchips${index + 1}-hc`}>
                  <span
                    className={`${
                      value.probability < 10
                        ? "ppchipcount1-hc"
                        : "ppchipcount2-hc"
                    } ppchipcount${index + 1}`}
                  >
                    {value.probability}%
                  </span>
                </span>
                {/* Add the logic for rendering the probability image */}
                {value.probability > 0 && (
                  <img
                    src={
                      value.probability >= 100
                        ? per100
                        : value.probability >= 90 && value.probability <= 100
                        ? per90
                        : value.probability >= 80 && value.probability <= 90
                        ? per80
                        : value.probability >= 70 && value.probability <= 80
                        ? per70
                        : value.probability >= 60 && value.probability <= 70
                        ? per60
                        : value.probability >= 50 && value.probability <= 60
                        ? per50
                        : value.probability >= 40 && value.probability <= 50
                        ? per40
                        : value.probability >= 30 && value.probability <= 40
                        ? per30
                        : value.probability >= 20 && value.probability <= 30
                        ? per20
                        : value.probability >= 10 && value.probability <= 20
                        ? per10
                        : value.probability >= 5 && value.probability <= 10
                        ? per5
                        : value.probability >= 1 && value.probability <= 5
                        ? per1
                        : ""
                    }
                    alt=""
                    className={`winperline-hc winperline-hc${index}`}
                    style={{
                      top: "25px",
                      left: "-50px",
                      zIndex: "-10",
                    }}
                  />
                )}
              </div>
            </>
          ))}

        <div className="dblack_out">
          {/* <img
                        src={DBLACK}
                        alt=""
                        className="dblack-hc"
                    /> */}
        </div>
        <img src={GREENTABLE} alt="" className="greentable-hc" />
      </div>
    </>
  );
}
