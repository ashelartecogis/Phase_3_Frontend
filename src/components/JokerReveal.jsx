import React, { useEffect, useState, useRef } from "react";
import "./css/JokerReveal.css";
import GRC from "../images/grc_logo_new.png";
import TITLEBOX from "../images/titlebox.png";
import RC from "../images/rc.svg";
import JOKER from "../images/joker.png";
import JOKERTITLE from "../images/jokertitle.png";
import RAYS from "../images/rays.png";
import back_card_min from "../images/back_card_min.png";
// import joker_card_holder from "../images/joker_card_holder.png";
import open_card_holder from "../images/open_card_holder.png";
import close_card_holder from "../images/close_deck.png";
import joker_min_on_card from "../images/joker-min-on-card.png";
import close_deck_back_card from "../images/close_deck_back_card.png";
import BACKCARD from "../images/cards/back_card_single_row.png";
import JokerAceCard from "../images/cards/back-1s-min-joker.png";
import RPBG from "../images/rightplayerbg.svg";
import DCBB from "../images/dealchipblackbg.png";
import STAR from "../images/star.png";
import CHIP from "../images/chip.svg";
import LazyLoad from "react-lazyload";
import { base_url } from "../config";
import party from "party-js";
export default function JokerReveal(props) {
    const [dealNumberCount, setDealNumberCount] = useState(1);
    const [jokerCard, setJokerCard] = useState(null);
    const rays = useRef(null);
    const [openCard, setOpenCard] = useState(null);
    const [playerPosition, setplayerPosition] = useState([]);
    const [aceJoker, setAceJoker] = useState(false);
    useEffect(() => {
        let jokerCard = localStorage.getItem("jokerCard");
        setJokerCard(jokerCard);
        let openCard = localStorage.getItem("openCard");
        setOpenCard(openCard);

        let LocalAceJoker = localStorage.getItem("aceJoker");
        if(LocalAceJoker !== undefined){
            setAceJoker(LocalAceJoker);
        }
        else{
            setAceJoker(props.aceJoker);   
        }

        setplayerPosition(props.playerPosition);
    }, [props]);

    useEffect(() => {
        let localDealNo = localStorage.getItem('dealNumberCount')
        if(localDealNo !== undefined && localDealNo !== null){
            setDealNumberCount(localDealNo)
        }
        else{
            setDealNumberCount(props.dealNumberCount)
        }
    }, []);

    useEffect(() => {
        const confettiContainer = rays.current;

        if (confettiContainer) {
            setTimeout(() => {
                party.sparkles(confettiContainer, {
                    count: party.variation.range(20, 40),
                    size: party.variation.range(0.8, 1)
                });
            }, 1500);
        }
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
                        <img
                            src={GRC}
                            alt=""
                            className="grc"
                        />
                    </LazyLoad >

                </div>
                <div className="titlebox">
                    <img
                        src={TITLEBOX}
                        alt=""
                        className="titleboximg"
                        />
                    <h4 className="psstitle mb-0">Deal {dealNumberCount}</h4>
                </div>
            </div>
            <div className="maindiv">
                {/* <div class="firework"></div> */}
                <div className="fire" ref={rays}></div>
                <div className="raysout">
                    <div className="rayspin">
                        <img
                            src={RAYS}
                            alt=""
                            className="rays"
                        />
                    </div>
                </div>
                {aceJoker === "true" && (
                    <div className="fade-out-ace">
                        <img
                            src={JokerAceCard}
                            alt=""
                            className="acejoker"
                        />
                    </div>
                )}
                
                <div className="flip-joker">
                    <div className="flip-joker-inner flipj">
                        <div className="flip-joker-front">
                            <img
                                src={BACKCARD}
                                alt=""
                                style={{ borderRadius: "5px" }}
                                className="bac"
                            />
                        </div>
                        <div className="flip-joker-back">
                            <img
                                src={jokerCard}
                                alt=""
                                className="jc"
                            />
                        </div>
                    </div>
                </div>
                <div className="jokerout">
                    <img
                        src={JOKER}
                        alt=""
                        className="joker"
                    />

                </div>
                <div className="jokertitleout">
                    <img
                        src={JOKERTITLE}
                        alt=""
                        className="jokertitle"
                    />
                </div>

                <div className="deck-holder">
                <img
                            src={close_card_holder}
                            alt=""
                            className="close_deck"
                            style={{
                                width:"153.15px",
                                height:"36.47px",
                                left:"1553px",
                              top:"997px"
                            }}
                        />
                        <img
                            src={close_deck_back_card}
                            alt=""
                            className={`close_deck_back_card`}
                            style={{
                                width:"84.13px",
                                height:"139px",
                                marginLeft:"-10px"
                            }}
                        />
                    <img
                        src={open_card_holder}
                        alt=""
                        className="open_card_holder"
                    />
                    {/* <img
                        src={openCard === null ? back_card_min : openCard}
                        alt=""
                        className="open_back_card_holder"
                    /> */}
                    <div className="flip-open" >
                        <div  className={`flip-open-inner ${openCard !== null ? "flipx" : ""}`}>
                            <div className="flip-open-front" >
                                <img
                                    src={openCard === null ? back_card_min : openCard}
                                    alt=""
                                    className="joc"
                                />
                            </div>
                            <div className="flip-open-back"  >
                                <img
                                    src={back_card_min}
                                    alt=""
                                    style={{ borderRadius: "5px" }}
                                    // style={{ borderRadius: "5px", transform: 'rotate(90deg)' }}

                                    className="bacopen"
                                />
                            </div>
                        </div>
                    </div>
                    {/* <img
                        src={joker_card_holder}
                        alt=""
                        className="joker_card_holder"
                    /> */}
                    <div >
                    
                        <img
                            src={jokerCard}
                            alt=""
                            style={{ transform:"rotate(90deg" }}
                            className="joker_card_min_j"
                            
                            />
                            </div>
                    {aceJoker !== "true" && (
                        <img
                            src={joker_min_on_card}
                            alt=""
                            className="joker_min_on_card"
                            //  style={{ transform: 'rotate(90deg)' }}
                            />
                            )}
                </div>

                <div className="rightsection-j">
                    {playerPosition && playerPosition.length > 0 && playerPosition.map((value, index) => (
                        <>
                            <div className={`jslide-in-right${index + 1}`}>
                                <div className={`bg${index + 1}`}>
                                    <LazyLoad height={"100%"}>
                                        {/* <img
                                            src={RPBG}
                                            alt=""
                                            className="rpbg"
                                        /> */}
                                    </LazyLoad >
                                    {/* <LazyLoad height={"100%"}>
                                        <img
                                            src={DCBB}
                                            alt=""
                                            className="jbbg"
                                        />
                                    </LazyLoad > */}
                                </div>
                                <div className={`user${index + 1} user`}>
                                    <LazyLoad height={"100%"}>
                                        {/* <img
                                            src={`${base_url}${value.playerId.shortphoto}`}
                                            alt=""
                                            className="rightuserimg"
                                        /> */}
                                    </LazyLoad >
                                </div>
                                {/* <span className={`jusername user${index + 1}name`}>{value.playerId.name.split(' ')[0]} {value.playerId.name.split(' ')[1].charAt(0)}</span> */}
                                {/* <img
                                    src={CHIP}
                                    alt=""
                                    className={`jchip chip${index + 1}`}
                                />
                                <img
                                    src={STAR}
                                    alt=""
                                    className="jstar"
                                /> */}
                                {/* <span className={`juserchips user${index + 1}chips`}>960</span>
                                <span className="juserpoints">80 <span className="pts">Pts</span></span> */}
                            </div>
                        </>
                    ))}
                </div>

            </div>
        </>
    );
}