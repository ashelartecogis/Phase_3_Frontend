import React, { useEffect, useState } from "react";
import "./css/TossDealCss.css";
import GRC from "../images/grc_logo_new.png";
import RC from "../images/rc.svg";
import DEALBG from "../images/dealbg.svg";
import DEALBGIMG from "../images/dealbgimg.png";
import FIRST from "../images/first.svg";
import SECOND from "../images/second.svg";
import THIRD from "../images/third.svg";
import TossCardsBg from "../images/tosscardsbgnew.png";
import BACKCARD from "../images/cards/back_card_single_row.png";
import TITLEBOX from "../images/titlebox.png";
import { base_url } from "../config";
import WG from "../images/cards/winnerglow.png";
import CG from "../images/cards/cardglow.png";
import WGB from "../images/wgb.png";
import tossWinnerRectangle from "../images/tossWinnerRectangle.png";
import theToss from "../images/theToss.png";
import toss from "../images/toss.png";
import LazyLoad from "react-lazyload";
import lodash from "lodash";

export default function TossDeal(props) {
  const [winnerStatus, setWinnerStatus] = useState(false);
  const [allPlayers, setallPlayers] = useState([]);
  const [updatedAllPlayers, setupdatedAllPlayers] = useState([]);
  const [winnerPlayer, setwinnerPlayer] = useState(null);
  const [showToss, setShowToss] = useState(true);
  const [loadContent, setLoadContent] = useState(false);

  useEffect(() => {
    let status = localStorage.getItem("winnerStatus");
    if (!status && status !== undefined) {
      setWinnerStatus(status);
    }
  }, []);

  useEffect(() => {
    let playersJson = localStorage.getItem("AllPlayers");
    if (playersJson) {
      let players = JSON.parse(playersJson);
      setallPlayers(players);
    }
  }, [props]);

  useEffect(() => {
    let finalPositionJson = localStorage.getItem("finalPosition");
    if (finalPositionJson) {
      let finalPosition = JSON.parse(finalPositionJson);
      let newPlayer = allPlayers.map((value, index) => {
        var picked = lodash.filter(finalPosition, (x) => x.playerId._id === value._id);
        if (picked[0].position == 1) {
          let replaced = value.photo.replace(/\\/g, "/");
          setwinnerPlayer({ ...value, photo: replaced });
          console.log("winn", winnerPlayer);
          return {
            ...value,
            position: 1,
          };
        } else {
          return {
            ...value,
            position: picked[0].position,
          };
        }
      });
      setupdatedAllPlayers(newPlayer);
    }
  }, [props]);

  useEffect(() => {
    const tossTimeout = setTimeout(() => {
      setShowToss(false);
      setLoadContent(true);
    }, 3000);

    return () => clearTimeout(tossTimeout);
  }, []);

  return (
    <>
      {showToss && (
        <div>
          <img
            src={theToss}
            alt="theToss"
            style={{
              width: "1900px",
              height: "184px",
              border:"2px",
              flexShrink: "0",
              bottom: "10%",
              marginLeft: "30px",
              marginTop: "-630px",
              display: "block",
              zIndex: 100,
            }}
          />
        </div>
      )}

      {loadContent && (
        <>
          {!showToss && (
            <div className="fade-in-intro">
              <div className="logodiv">
                <LazyLoad height={"100%"}>
                  <img src={GRC} alt="" className="grc" />
                </LazyLoad>
              </div>
              <div className="titlebox">
                {/* <img src={TITLEBOX} alt="" className="titleboximg" /> */}
                {/* <h4 className="tosstitle mb-0">Toss</h4> */}
              </div>
            </div>
          )}

          {!showToss && !winnerPlayer && (
            <div>
              <h4 className="tosstitle mb-0">
                <img
                  src={toss}
                  alt="toss"
                  style={{
                    width: "661.01px",
                    height: "60px",
                    bottom: "10%",
                    marginLeft: "-16px",
                    marginTop: "20px",
                    display: "block",
                    zIndex: 100,
                  }}
                />
              </h4>
            </div>
          )}

          <div className="maindiv">
            <div className={`${winnerPlayer !== null && "scale-up-tosscardsbg"}`}>
              <img
                src={TossCardsBg}
                alt=""
                className={`slide-in-left-tosscardsbg tosscardsbg`}
              />
            </div>
            <>
              {winnerPlayer !== null && (
                <>
                  <div className="animatedborder-out2">
                    {/* <img src={CG} alt="" className="animatedborder2" /> */}
                  </div>
                  <div className="wgb-out">
                    <img src={WGB} alt="" className="winnerglowbig2" />
                  </div>
                  <div className="winuser-out">
                    <img
                      src={`${base_url}${winnerPlayer.shortphoto}`}
                      alt=""
                      className="winuser2"
                    />
                  </div>

                  <div className="winusertext-out">
                    <span className="winusertext2" style={{ position: 'absolute' }}>
                      <img
                        src={tossWinnerRectangle}
                        alt="tossWinnerRectangle"
                        style={{ width: '690.91px', height: '85px',marginTop:"40px", zIndex: 100 }}
                      />
                      <span
                        className="winusername"
                        style={{ position: 'absolute', top: '69px', left: '20%', zIndex: 200, textAlign: 'center',alignItems:"center" }}
                      >
                        {winnerPlayer && winnerPlayer.name}
                      </span>
                      <span />
                      <span style={{ fontSize: "45px", fontWeight: "500", marginTop: '-10px', display: 'block', textAlign: 'center' }}>
                        <br /> Has won the toss and will play first
                      </span>
                    </span>
                  </div>
                </>
              )}

              {allPlayers && allPlayers.length > 0 && allPlayers.map((value, index) => (
                <div className={`card${index + 1}`}>
                  <div>
                    <div className={winnerPlayer !== null && winnerPlayer._id !== value._id ? `backcard-out` : ``}>
                      <div className={winnerPlayer !== null && winnerPlayer._id === value._id ? `flip-card backcard${index + 1}` : ``}>
                        <div className={winnerPlayer !== null && winnerPlayer._id === value._id ? `winflip winflip${index + 1}` : `flip-card backcard${index + 1} backcard${index + 1}an`}>
                          <div className={`flip-card-inner bor${index + 1} shadow shadow-dark ${value.tossCard !== "" ? `flip${index + 1}` : ``}`}>
                            <div className="flip-card-front">
                              <img
                                src={BACKCARD}
                                alt=""
                                style={{ borderRadius: "5px", height:"263px" ,width:"159px"}}
                                
                              />
                            </div>
                            <div className="flip-card-back">
                              <img
                                src={value.tossCard === 0 ? BACKCARD : value.tossCard}
                                alt=""
                                style={{ borderRadius: "5px", height:"263px" ,width:"159px"}}

                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {winnerPlayer !== null && winnerPlayer._id === value._id &&
                      (
                        <>
                          <div className="winnerglow-out">
                            <img
                              src={WG}
                              alt=""
                              className={`winnerglow winnerglow${index + 1}`}
                              
                            />
                          </div>
                          <div className="winnerborder-out">
                            {/* <img
                              src={CG}
                              alt=""
                              className={`winnerborder winnerborder${index + 1}`}
                            /> */}
                          </div>
                        </>
                      )}
                  </div>

                  {winnerPlayer !== null ?
                    (<><div className={`tossuser-out`}>
                      <span className={`tossuser tossuser${index + 1}`}>{value.name}</span>
                    </div>
                    </>)
                    :
                    (<div>
                      <span className={`tossuser tossuser${index + 1}`}>{value.name}</span>
                    </div>)
                  }
                </div>
              ))}
            </>

            <div className="leftsection">
              <div className="slide-out-bottom-first">
                <LazyLoad height={"100%"}>
                  <img
                    src={FIRST}
                    alt=""
                    className="slide-in-bottom-first"
                  />
                </LazyLoad>
              </div>
              <div className="slide-out-bottom-second">
                <LazyLoad height={"100%"}>
                  <img
                    src={SECOND}
                    alt=""
                    className="slide-in-bottom-second"
                  />
                </LazyLoad>
              </div>
              <div className="slide-out-bottom-third">
                <LazyLoad height={"100%"}>
                  <img
                    src={THIRD}
                    alt=""
                    className="slide-in-bottom-third"
                  />
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
                      marginTop:"-65px",
                      marginLeft:"-20px"
                      }}
                    />
                  </LazyLoad>
                </div>
                <div className="tracking-in-contract-opp">
                  <div className="tracking-in-contract" style={{
                    marginBottom:"25px",
                    marginLeft:"-5px"
                  }}
                  >Toss</div>
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
                  <div className="slide-in-left-deal-bg-text"
                      style={{
                        fontSize:"42.68px",
                        fontWeight:"500",
                        marginLeft:"-210px", 
                     marginBottom:"7px"

                      }}
                    >Dealing cards for Toss</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}