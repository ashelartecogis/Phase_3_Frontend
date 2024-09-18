import React, { useEffect, useState, useRef } from "react";
import "./css/Declare.css";
import GRC from "../images/grc.svg";
import RC from "../images/rc.svg";
import UIMG1 from "../images/cduser1.png";
import LazyLoad from "react-lazyload";
import FIRST from "../images/first.svg";
import SECOND from "../images/second.svg";
import THIRD from "../images/third.svg";
import DEALBG from "../images/dealbgplayerdetails.png";
import DEALBGIMG from "../images/dealbgimg.png";
import valid_declaration from "../images/valid_declaration.png";
import validation_under_progress from "../images/validation_under_progress.png";
import invalid_declaration from "../images/invalid_declaration.png";
import CARD1 from "../images/cards/1s-min.png";
import CARD2 from "../images/cards/3s-min.png";
import CARD3 from "../images/cards/6h-min.png";
import CARD4 from "../images/cards/9d-min.png";
import CARD5 from "../images/cards/4s-min.png";
import CARD6 from "../images/cards/9s-min.png";
import CARD7 from "../images/cards/12d-min.png";
import CARD8 from "../images/cards/j-min.png";
import CARD9 from "../images/cards/13s-min.png";
import CARD10 from "../images/cards/5h-min.png";
import CARD11 from "../images/cards/8s-min.png";
import CARD12 from "../images/cards/4h-min.png";
import CARD13 from "../images/cards/3c-min.png";
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
                        src={UIMG1}
                        alt=""
                        className="drop-user-img"
                    />
                    <div className="dealdiv">
                        <LazyLoad height={"100%"}>
                            <img
                            src={DEALBG}
                            alt=""
                            className="rotate-vert-center-deal-new"
                            />
                        </LazyLoad >
                        <span className="tracking-in-contract-username">Ramesh</span>
                        <span className="tracking-in-contract-chips-deal-dec">Declared</span>
                        <img
                            src={validation_under_progress}
                            alt=""
                            className="validation_div"
                        />
                    </div>
                    <div className="bgdivdeal">
                        <LazyLoad height={"100%"}>
                            <img
                            src={DEALBGIMG}
                            alt=""
                            className="slide-in-left-deal-bg-img-deal"
                            />
                        </LazyLoad >
                        <div className="usercardsdivdec">
                            <img
                            src={CARD1}
                            alt=""
                            className="usercard usercard1"
                            />
                            <img
                            src={CARD2}
                            alt=""
                            className="usercard usercard2"
                            />
                            <img
                            src={CARD3}
                            alt=""
                            className="usercard usercard3"
                            />
                            <img
                            src={CARD4}
                            alt=""
                            className="usercard usercard4"
                            />
                            <img
                            src={CARD5}
                            alt=""
                            className="usercard usercard5"
                            />
                            <img
                            src={CARD6}
                            alt=""
                            className="usercard usercard6"
                            />
                            <img
                            src={CARD7}
                            alt=""
                            className="usercard usercard7"
                            />
                            <img
                            src={CARD8}
                            alt=""
                            className="usercard usercard8"
                            />
                            <img
                            src={CARD9}
                            alt=""
                            className="usercard usercard9"
                            />
                            <img
                            src={CARD10}
                            alt=""
                            className="usercard usercard10"
                            />
                            <img
                            src={CARD11}
                            alt=""
                            className="usercard usercard11"
                            />
                            <img
                            src={CARD12}
                            alt=""
                            className="usercard usercard12"
                            />
                            <img
                            src={CARD13}
                            alt=""
                            className="usercard usercard13"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}