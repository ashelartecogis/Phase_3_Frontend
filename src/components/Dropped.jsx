import React, { useEffect, useState, useRef } from "react";
import "./css/Dropped.css";
import GRC from "../images/grc.svg";
import RC from "../images/rc.svg";
import back_card_min from "../images/back_card_min.png";
import UIMG1 from "../images/cduser1.png";
import UIMG2 from "../images/cduser2.png";
import UIMG3 from "../images/cduser3.png";
import UIMG4 from "../images/cduser4.png";
import UIMG5 from "../images/cduser5.png";
import UIMG6 from "../images/cduser6.png";
import RPBG from "../images/rightplayerbg.svg";
import DCBB from "../images/dealchipblackbg.png";
import STAR from "../images/star.png";
import CHIP from "../images/chip.svg";
import LazyLoad from "react-lazyload";
import FIRST from "../images/first.svg";
import SECOND from "../images/second.svg";
import THIRD from "../images/third.svg";
import DEALBG from "../images/dealbgplayerdetails.png";
import DEALBGIMG from "../images/dealbgimg.png";
export default function Dropped() {
    return (
        <>
            <div className="fade-in-intro">
                <div className="logodiv">
                    <LazyLoad height={"100%"}>
                        <img
                            src={RC}
                            alt=""
                            className="rc"
                        />
                    </LazyLoad >
                    <LazyLoad height={"100%"}>
                        <img
                            src={GRC}
                            alt=""
                            className="grc"
                        />
                    </LazyLoad >

                </div>
                <div className="titlebox">
                    <h4 className="psstitle">Deal 1</h4>
                </div>
            </div>
            <div className="maindiv">

                <div className="leftsection">
                    <LazyLoad height={"100%"}>
                    <img
                        src={FIRST}
                        alt=""
                        className="slide-in-bottom-first-deal"
                    />
                    </LazyLoad >
                    <LazyLoad height={"100%"}>
                    <img
                        src={SECOND}
                        alt=""
                        className="slide-in-bottom-second-deal"
                    />
                    </LazyLoad >
                    <LazyLoad height={"100%"}>
                    <img
                        src={THIRD}
                        alt=""
                        className="slide-in-bottom-third-deal"
                    />
                    </LazyLoad >
                    <img
                        src={UIMG6}
                        alt=""
                        className="deal-user-img"
                    />
                    <div className="dealdiv">
                        <LazyLoad height={"100%"}>
                            <img
                            src={DEALBG}
                            alt=""
                            className="rotate-vert-center-deal-new"
                            />
                        </LazyLoad >
                        <span className="tracking-in-contract-username">Naveen</span>
                        <span className="tracking-in-contract-chips-deal">80<span className="tracking-in-contract-chips-deal-pts">Pts</span></span>
                    </div>
                    <div className="bgdivdeal">
                        <LazyLoad height={"100%"}>
                            <img
                            src={DEALBGIMG}
                            alt=""
                            className="slide-in-left-deal-bg-img-deal"
                            />
                        </LazyLoad >
                        <span className="slide-in-left-deal-bg-text-drop">Naveen has dropped</span>
                        <div className="usercardsdiv-dropped">
                            <img
                            src={back_card_min}
                            alt=""
                            className="usercard usercard1"
                            />
                            <img
                            src={back_card_min}
                            alt=""
                            className="usercard usercard2"
                            />
                            <img
                            src={back_card_min}
                            alt=""
                            className="usercard usercard3"
                            />
                            <img
                            src={back_card_min}
                            alt=""
                            className="usercard usercard4"
                            />
                            <img
                            src={back_card_min}
                            alt=""
                            className="usercard usercard5"
                            />
                            <img
                            src={back_card_min}
                            alt=""
                            className="usercard usercard6"
                            />
                            <img
                            src={back_card_min}
                            alt=""
                            className="usercard usercard7"
                            />
                            <img
                            src={back_card_min}
                            alt=""
                            className="usercard usercard8"
                            />
                            <img
                            src={back_card_min}
                            alt=""
                            className="usercard usercard9"
                            />
                            <img
                            src={back_card_min}
                            alt=""
                            className="usercard usercard10"
                            />
                            <img
                            src={back_card_min}
                            alt=""
                            className="usercard usercard11"
                            />
                            <img
                            src={back_card_min}
                            alt=""
                            className="usercard usercard12"
                            />
                            <img
                            src={back_card_min}
                            alt=""
                            className="usercard usercard13"
                            />
                        </div>
                        {/* <span className="slide-in-left-deal-bg-text-deal"></span> */}
                    </div>
                </div>

                <div className="rightsection">
                    <div className={`slide-in-right1`}>
                        <div className={`bg1`}>
                        <LazyLoad height={"100%"}>
                            <img
                            src={RPBG}
                            alt=""
                            className="rpbg"
                            />
                        </LazyLoad >
                        <LazyLoad height={"100%"}>
                            <img
                            src={DCBB}
                            alt=""
                            className="bbg"
                            />
                        </LazyLoad >
                        </div>
                        <div className={`user1 user`}>
                        <LazyLoad height={"100%"}>
                            <img
                            src={UIMG1}
                            alt=""
                            className="rightuserimg"
                            />
                        </LazyLoad >
                        </div>
                        <span className={`username user1name`}>Ramesh S</span>
                        <img
                        src={CHIP}
                        alt=""
                        className={`chip chip1`}
                        />
                        <img
                        src={STAR}
                        alt=""
                        className="star"
                        />
                        <span className={`userchips user1chips`}>960</span>
                        <span className="userpoints">80 <span className="pts">Pts</span></span>
                    </div>

                    <div className={`slide-in-right2`}>
                        <div className={`bg2`}>
                        <LazyLoad height={"100%"}>
                            <img
                            src={RPBG}
                            alt=""
                            className="rpbg"
                            />
                        </LazyLoad >
                        <LazyLoad height={"100%"}>
                            <img
                            src={DCBB}
                            alt=""
                            className="bbg"
                            />
                        </LazyLoad >
                        </div>
                        <div className={`user2 user`}>
                        <LazyLoad height={"100%"}>
                            <img
                            src={UIMG2}
                            alt=""
                            className="rightuserimg"
                            />
                        </LazyLoad >
                        </div>
                        <span className={`username user2name`}>Swapnil M</span>
                        <img
                        src={CHIP}
                        alt=""
                        className={`chip chip2`}
                        />
                        <img
                        src={STAR}
                        alt=""
                        className="star"
                        />
                        <span className={`userchips user2chips`}>960</span>
                        <span className="userpoints">80 <span className="pts">Pts</span></span>
                    </div>

                    <div className={`slide-in-right3`}>
                        <div className={`bg3`}>
                        <LazyLoad height={"100%"}>
                            <img
                            src={RPBG}
                            alt=""
                            className="rpbg"
                            />
                        </LazyLoad >
                        <LazyLoad height={"100%"}>
                            <img
                            src={DCBB}
                            alt=""
                            className="bbg"
                            />
                        </LazyLoad >
                        </div>
                        <div className={`user3 user`}>
                        <LazyLoad height={"100%"}>
                            <img
                            src={UIMG3}
                            alt=""
                            className="rightuserimg"
                            />
                        </LazyLoad >
                        </div>
                        <span className={`username user3name`}>Snehal P</span>
                        <img
                        src={CHIP}
                        alt=""
                        className={`chip chip3`}
                        />
                        <img
                        src={STAR}
                        alt=""
                        className="star"
                        />
                        <span className={`userchips user3chips`}>960</span>
                        <span className="userpoints">80 <span className="pts">Pts</span></span>
                    </div>

                    <div className={`slide-in-right4`}>
                        <div className={`bg4`}>
                        <LazyLoad height={"100%"}>
                            <img
                            src={RPBG}
                            alt=""
                            className="rpbg"
                            />
                        </LazyLoad >
                        <LazyLoad height={"100%"}>
                            <img
                            src={DCBB}
                            alt=""
                            className="bbg"
                            />
                        </LazyLoad >
                        </div>
                        <div className={`user4 user`}>
                        <LazyLoad height={"100%"}>
                            <img
                            src={UIMG4}
                            alt=""
                            className="rightuserimg"
                            />
                        </LazyLoad >
                        </div>
                        <span className={`username user4name`}>Sanket C</span>
                        <img
                        src={CHIP}
                        alt=""
                        className={`chip chip4`}
                        />
                        <img
                        src={STAR}
                        alt=""
                        className="star"
                        />
                        <span className={`userchips user4chips`}>960</span>
                        <span className="userpoints">80 <span className="pts">Pts</span></span>
                    </div>

                    <div className={`slide-in-right5`}>
                        <div className={`bg5`}>
                        <LazyLoad height={"100%"}>
                            <img
                            src={RPBG}
                            alt=""
                            className="rpbg"
                            />
                        </LazyLoad >
                        <LazyLoad height={"100%"}>
                            <img
                            src={DCBB}
                            alt=""
                            className="bbg"
                            />
                        </LazyLoad >
                        </div>
                        <div className={`user5 user`}>
                        <LazyLoad height={"100%"}>
                            <img
                            src={UIMG5}
                            alt=""
                            className="rightuserimg"
                            />
                        </LazyLoad >
                        </div>
                        <span className={`username user5name`}>Rahul M</span>
                        <img
                        src={CHIP}
                        alt=""
                        className={`chip chip5`}
                        />
                        <img
                        src={STAR}
                        alt=""
                        className="star"
                        />
                        <span className={`userchips user5chips`}>960</span>
                        <span className="userpoints">80 <span className="pts">Pts</span></span>
                    </div>
                    <span className="dropped-text">Dropped</span>
                    <div className={`slide-in-right6 deal-slide-dropped`}>
                        <div className={`bg6`}>
                        <LazyLoad height={"100%"}>
                            <img
                            src={RPBG}
                            alt=""
                            className="rpbg"
                            />
                        </LazyLoad >
                        <LazyLoad height={"100%"}>
                            <img
                            src={DCBB}
                            alt=""
                            className="bbg"
                            />
                        </LazyLoad >
                        </div>
                        <div className={`user6 user`}>
                        <LazyLoad height={"100%"}>
                            <img
                            src={UIMG6}
                            alt=""
                            className="rightuserimg"
                            />
                        </LazyLoad >
                        </div>
                        <span className={`username user6name`}>Naveen D</span>
                        <img
                        src={CHIP}
                        alt=""
                        className={`chip chip6`}
                        />
                        <img
                        src={STAR}
                        alt=""
                        className="star"
                        />
                        <span className={`userchips user6chips`}>960</span>
                        <span className="userpoints">80 <span className="pts">Pts</span></span>
                    </div>

                </div>

            </div>
        </>
    );
}