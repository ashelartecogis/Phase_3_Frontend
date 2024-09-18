import React, { useEffect, useState, useRef, useContext, useCallback } from "react";
import "./css/Deal.css";
import GRC from "../images/grc_logo_new.png";
import TITLEBOX from "../images/titlebox.png";
import RC from "../images/rc.svg";
import JOKER from "../images/joker.png";
import JOKERTITLE from "../images/jokertitle.png";
import RAYS from "../images/rays.png";
import back_card_min from "../images/back_card_min.png";
import joker_card_min from "../images/cards/1h-min.png";
import joker_card_holder from "../images/joker_card_holder.png";
import open_card_holder from "../images/open_card_holder.png";
import close_deck from "../images/close_deck.png";
import close_deck_back_card from "../images/close_deck_back_card.png";
import joker_min_on_card from "../images/joker-min-on-card.png";
import BACKCARD from "../images/cards/back_card_single_row.png";
import valid_declaration from "../images/valid_declaration.png";
import validation_under_progress from "../images/validation_under_progress.png";
import invalid_declaration from "../images/invalid_declaration.png";

import per10 from "../images/10per.png";
import per20 from "../images/20per.png";
import per50 from "../images/50per.png";
import per60 from "../images/60per.png";
import perbg from "../images/perbg.png";
import win_meter from "../images/win_meter.png";

import UP from "../images/up.png";
import DOWN from "../images/down.png";
import RPBG from "../images/rightplayerbg.svg";
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

import { base_url } from "../config";
import { SocketContext } from "../services/socket";

let pickSocket;

export default function Deal(props) {
    const socket = useContext(SocketContext);
    const [dealNumberCount, setDealNumberCount] = useState(1);
    const [animateOnce, setAnimateOnce] = useState(true);
    const [imgCount, setImgCount] = useState(1);
    const [isPick, setIsPick] = useState(false);
    const [activePlayerIndex, setActivePlayerIndex] = useState(1);
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

    function isJokerCard(cardId){
        let jokerNumber = localStorage.getItem("jokerNumber");
        let jokerCard = Cards.find(o => o.cardUuid == jokerNumber);
        // console.log("jokerNumber", jokerNumber);
        // console.log("jokerCard", jokerCard);
        let ogCard = Cards.find(o => o.cardUuid == cardId);
      
        if(ogCard !== undefined && ogCard !== null){
            if (ogCard.Value === 'J') {
                ogCard.Value = 11;
            }
            else if (ogCard.Value === 'Q') {
                ogCard.Value = 12;
            }
            else if (ogCard.Value === 'K') {
                ogCard.Value = 13;
            }
            else if (ogCard.Value === 'A') {
                ogCard.Value = 1;
            }
        }
        
        if(jokerCard !== undefined && jokerCard !== null){
            if (jokerCard.Value === 'J') {
                jokerCard.Value = 11;
              }
              else if (jokerCard.Value === 'Q') {
                jokerCard.Value = 12;
              }
              else if (jokerCard.Value === 'K') {
                jokerCard.Value = 13;
              }
              else if (jokerCard.Value === 'A') {
                jokerCard.Value = 1;
              }
            if(jokerCard.Type !== 'Joker'){
                // console.log("jokerNumber out", ogCard.Value , jokerCard.Value);
                if (ogCard.Value === jokerCard.Value) {
                    // console.log("jokerNumber", ogCard.Value , jokerCard.Value);
                    // console.log("in");
                return true;
                }
                else {
                    // console.log("out");
                return false;
                }
            }
            else{
                if (ogCard.Value === 1) {
                // console.log("og com", ogCard.Value);
                return true;
                }
                else {
                return false;
                }
            }
        }
    }

    let setCardSequence = useCallback((data) => {
        console.log("cs", data);

        let reqdata = data.InGameRes;
        let screenNo = localStorage.getItem('screenNo');
        // console.log(data);
        if (reqdata !== undefined) {

            let seq1 = reqdata.cardSequence1.cards.map((pval, pin) => {
                let picked = Cards.find(o => o.cardUuid == pval.cardId);
                let isJoker = isJokerCard(pval.cardId);
                    if(isJoker){
                      return {img: picked.imageURI2, cardId: pval.cardId};
                    }
                    else{
                      return {img: picked.imageURI, cardId: pval.cardId};
                    }
            })

            let seq2 = reqdata.cardSequence2.cards.map((pval, pin) => {
                let picked = Cards.find(o => o.cardUuid == pval.cardId);
                let isJoker = isJokerCard(pval.cardId);
                    if(isJoker){
                      return {img: picked.imageURI2, cardId: pval.cardId};
                    }
                    else{
                      return {img: picked.imageURI, cardId: pval.cardId};
                    }
            })

            let seq3 = reqdata.cardSequence3.cards.map((pval, pin) => {
                let picked = Cards.find(o => o.cardUuid == pval.cardId);
                let isJoker = isJokerCard(pval.cardId);
                    if(isJoker){
                      return {img: picked.imageURI2, cardId: pval.cardId};
                    }
                    else{
                      return {img: picked.imageURI, cardId: pval.cardId};
                    }
            })

            let seq4 = reqdata.cardSequence4.cards.map((pval, pin) => {
                let picked = Cards.find(o => o.cardUuid == pval.cardId);
                let isJoker = isJokerCard(pval.cardId);
                    if(isJoker){
                      return {img: picked.imageURI2, cardId: pval.cardId};
                    }
                    else{
                      return {img: picked.imageURI, cardId: pval.cardId};
                    }
            })

            let seq5 = reqdata.cardSequence5.cards.map((pval, pin) => {
                let picked = Cards.find(o => o.cardUuid == pval.cardId);
                let isJoker = isJokerCard(pval.cardId);
                    if(isJoker){
                      return {img: picked.imageURI2, cardId: pval.cardId};
                    }
                    else{
                      return {img: picked.imageURI, cardId: pval.cardId};
                    }
            })

            let seq6 = reqdata.cardSequence6.cards.map((pval, pin) => {
                let picked = Cards.find(o => o.cardUuid == pval.cardId);
                let isJoker = isJokerCard(pval.cardId);
                    if(isJoker){
                      return {img: picked.imageURI2, cardId: pval.cardId};
                    }
                    else{
                      return {img: picked.imageURI, cardId: pval.cardId};
                    }
            })

            let newSeq = [...seq1, ...seq2, ...seq3, ...seq4, ...seq5, ...seq6]

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
            
            let newBestSeq = [];
            let newBestSeq1 = [];
            let newBestSeq2 = [];
            let newBestSeq3 = [];
            let newBestSeq4 = [];
            let newBestSeq5 = [];
            if (bestSeq1 !== undefined) {
                newBestSeq.push(...bestSeq1);
                newBestSeq1 = bestSeq1.map((val, index) => {
                    let picked = Cards.find(o => o.cardUuid == val.cardId);
                    let isJoker = isJokerCard(val.cardId);
                    if(isJoker){
                      return picked.imageURI2;
                    }
                    else{
                      return picked.imageURI;
                    }
                });
            }
            if (bestSeq2 !== undefined) {
                newBestSeq.push(...bestSeq2);
                newBestSeq2 = bestSeq2.map((val, index) => {
                    let picked = Cards.find(o => o.cardUuid == val.cardId);
                    let isJoker = isJokerCard(val.cardId);
                    if(isJoker){
                      return picked.imageURI2;
                    }
                    else{
                      return picked.imageURI;
                    }
                });
            }
            if (bestSeq3 !== undefined) {
                newBestSeq.push(...bestSeq3);
                newBestSeq3 = bestSeq3.map((val, index) => {
                    let picked = Cards.find(o => o.cardUuid == val.cardId);
                    let isJoker = isJokerCard(val.cardId);
                    if(isJoker){
                      return picked.imageURI2;
                    }
                    else{
                      return picked.imageURI;
                    }
                });
            }
            if (bestSeq4 !== undefined) {
                newBestSeq.push(...bestSeq4);
                newBestSeq4 = bestSeq4.map((val, index) => {
                    let picked = Cards.find(o => o.cardUuid == val.cardId);
                    let isJoker = isJokerCard(val.cardId);
                    if(isJoker){
                      return picked.imageURI2;
                    }
                    else{
                      return picked.imageURI;
                    }
                });
            }
            if (bestSeq5 !== undefined) {
                newBestSeq.push(...bestSeq5);
                newBestSeq5 = bestSeq5.map((val, index) => {
                    let picked = Cards.find(o => o.cardUuid == val.cardId);
                    let isJoker = isJokerCard(val.cardId);
                    if(isJoker){
                      return picked.imageURI2;
                    }
                    else{
                      return picked.imageURI;
                    }
                });
            }
            // console.log("best", newBestSeq1);
            // newBestSeq = bestSeq1 !== undefined || bestSeq2 !== undefined || bestSeq3 !== undefined || bestSeq4!== undefined ? [...bestSeq1, ...bestSeq2, ...bestSeq3, ...bestSeq4] : []
            let newBestCards = newBestSeq.map((val, index) => {
                let picked = Cards.find(o => o.cardUuid == val.cardId);
                return picked.imageURI
            });

            let oldInGame = JSON.parse(localStorage.getItem('InGame'));
            let newInGame = oldInGame.map((val, index) => {
                // console.log("ids", val._id , reqdata._id);
                if (val._id === reqdata._id) {
                    // console.log("in");
                    let localindex = localStorage.getItem("activePlayerIndex");
                    if(localindex === undefined || localindex === null){
                        localindex = 1;
                    }
                    console.log("screen",localindex, index + 1);
                    if (parseInt(localindex) === parseInt(index + 1) || parseInt(index + 1) === parseInt(screenNo)) {
                        // console.log(true)
                        console.log("set seq");
                        if(data.type === 'drop'){
                            setIsDropCard(data.cardId);
                            console.log(data.cardId);
                            localStorage.setItem("isDropCard", data.cardId);
                            let oldseq = [...val.cardSequence1.cards, ...val.cardSequence2.cards, ...val.cardSequence3.cards, ...val.cardSequence4.cards, ...val.cardSequence5.cards, ...val.cardSequence6.cards]
                            let dropIndex = 0;
                            oldseq.forEach((oldValue, oldIndex) => {
                                if(oldValue.cardId == data.cardId){
                                    dropIndex = oldIndex + 1
                                }
                            });
                            // setTimeout(() => {
                            //     let openCard = localStorage.getItem("openCard");
                            //     setOpenCard(openCard);    
                            //     let curOpenCard = localStorage.getItem("curOpenCard");
                            //     setCurOpenCard(curOpenCard);
                            // }, dropIndex < 5 ? );
                            setTimeout(() => {
                                setActivePlayerData({ ...reqdata.playerId, totalPoints: reqdata.totalPoints, playerStatus: reqdata.playerStatus, seq1, seq2, seq3, seq4, seq5, seq6, newSeq, bestseq: newBestCards, newBestSeq1, newBestSeq2, newBestSeq3, newBestSeq4, newBestSeq5, bestPoints: reqdata.bestPoints, isbestSeq1, isbestSeq2, isbestSeq3, isbestSeq4, isbestSeq5 });
                                localStorage.setItem('ActivePlayer', JSON.stringify({ ...reqdata.playerId, totalPoints: reqdata.totalPoints, playerStatus: reqdata.playerStatus, seq1, seq2, seq3, seq4, seq5, seq6, newSeq, bestseq: newBestCards, newBestSeq1, newBestSeq2, newBestSeq3, newBestSeq4, newBestSeq5, bestPoints: reqdata.bestPoints, isbestSeq1, isbestSeq2, isbestSeq3, isbestSeq4, isbestSeq5 }));
                            }, 500);
                        }
                        else{
                            setActivePlayerData({ ...reqdata.playerId, totalPoints: reqdata.totalPoints, playerStatus: reqdata.playerStatus, seq1, seq2, seq3, seq4, seq5, seq6, newSeq, bestseq: newBestCards, newBestSeq1, newBestSeq2, newBestSeq3, newBestSeq4, newBestSeq5, bestPoints: reqdata.bestPoints, isbestSeq1, isbestSeq2, isbestSeq3, isbestSeq4, isbestSeq5 });
                            localStorage.setItem('ActivePlayer', JSON.stringify({ ...reqdata.playerId, totalPoints: reqdata.totalPoints, playerStatus: reqdata.playerStatus, seq1, seq2, seq3, seq4, seq5, seq6, newSeq, bestseq: newBestCards, newBestSeq1, newBestSeq2, newBestSeq3, newBestSeq4, newBestSeq5, bestPoints: reqdata.bestPoints, isbestSeq1, isbestSeq2, isbestSeq3, isbestSeq4, isbestSeq5 }));
                        }
                        
                    }
                    if(parseInt(localindex) === index + 1){
                        return { ...reqdata, isActive: 1 }
                    }
                    else{
                        return { ...reqdata, isActive: 0 }
                    }
                }
                else {
                    // console.log("out");
                    if (val._id === reqdata._id) {
                        return { ...reqdata, isActive: 0 }
                    }
                    else{
                        return { ...val, isActive: 0 }                    
                    }
                }
            });
            // console.log("newInGame", newInGame);
            localStorage.setItem("InGame", JSON.stringify(newInGame));
            setInGame(newInGame)
            let oldActivePlayer = JSON.parse(localStorage.getItem('ActivePlayer'));
            // console.log("oldActivePlayer", oldActivePlayer);
        }
    }, [])


    let setPicked = useCallback((datas) => {
        // console.log("datas");
        let data = datas.inGame;
        if (data !== undefined && data !== null) {
            let oldInGame = JSON.parse(localStorage.getItem('InGame'));
            let scrNo = localStorage.getItem("screenNo");
            let newInGame = oldInGame.map((val, index) => {
                // console.log(data,"inside-pick")
                if (val._id.toString() === data._id.toString()) {
                    //   console.log('in pick');

                    if (scrNo >= 1 && scrNo <= 6) {
                        setIsPick(true);
                        localStorage.setItem("isPick", true)
                        localStorage.setItem("activePlayerIndex", parseInt(index) + 1);
                        setActivePlayerIndex(parseInt(index) + 1)
                        clearTimeout(pickSocket)
                        // console.log("in pick", scrNo);
                        // let localindex = localStorage.getItem("activePlayerIndex");
                        // localStorage.setItem("activePlayerIndex", parseInt(index) + 1);
                        // setActivePlayerIndex(parseInt(index) + 1)
                        // clearTimeout(pickSocket)
                        let seq1 = data.cardSequence1.cards.map((pval, pin) => {
                            let picked = Cards.find(o => o.cardUuid == pval.cardId);
                            let isJoker = isJokerCard(pval.cardId);
                            if(isJoker){
                                return {img: picked.imageURI2, cardId: pval.cardId};
                            }
                            else{
                                return {img: picked.imageURI, cardId: pval.cardId};
                            }
                        })
                        // let popped = seq1.pop();
                        // console.log(seq1.length);
                        let seq2 = data.cardSequence2.cards.map((pval, pin) => {
                            let picked = Cards.find(o => o.cardUuid == pval.cardId);
                            let isJoker = isJokerCard(pval.cardId);
                            if(isJoker){
                                return {img: picked.imageURI2, cardId: pval.cardId};
                            }
                            else{
                                return {img: picked.imageURI, cardId: pval.cardId};
                            }
                        })

                        let seq3 = data.cardSequence3.cards.map((pval, pin) => {
                            let picked = Cards.find(o => o.cardUuid == pval.cardId);
                            let isJoker = isJokerCard(pval.cardId);
                            if(isJoker){
                                return {img: picked.imageURI2, cardId: pval.cardId};
                            }
                            else{
                                return {img: picked.imageURI, cardId: pval.cardId};
                            }
                        })

                        let seq4 = data.cardSequence4.cards.map((pval, pin) => {
                            let picked = Cards.find(o => o.cardUuid == pval.cardId);
                            let isJoker = isJokerCard(pval.cardId);
                            if(isJoker){
                                return {img: picked.imageURI2, cardId: pval.cardId};
                            }
                            else{
                                return {img: picked.imageURI, cardId: pval.cardId};
                            }
                        })

                        let seq5 = data.cardSequence5.cards.map((pval, pin) => {
                            let picked = Cards.find(o => o.cardUuid == pval.cardId);
                            let isJoker = isJokerCard(pval.cardId);
                            if(isJoker){
                                return {img: picked.imageURI2, cardId: pval.cardId};
                            }
                            else{
                                return {img: picked.imageURI, cardId: pval.cardId};
                            }
                        })

                        let seq6 = data.cardSequence6.cards.map((pval, pin) => {
                            let picked = Cards.find(o => o.cardUuid == pval.cardId);
                            let isJoker = isJokerCard(pval.cardId);
                            if(isJoker){
                                return {img: picked.imageURI2, cardId: pval.cardId};
                            }
                            else{
                                return {img: picked.imageURI, cardId: pval.cardId};
                            }
                        })

                        // if(seq2.length === 0){
                        //   seq1.push(popped);
                        // }
                        // else if(seq3.length === 0){
                        //   seq2.push(popped);
                        // }
                        // else if(seq4.length === 0){
                        //   seq3.push(popped);
                        // }
                        // else{
                        //   seq4.push(popped);
                        // }

                        let newSeq = [...seq1, ...seq2, ...seq3, ...seq4, ...seq5, ...seq6]
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
                        let newBestSeq = [];
                        let newBestSeq1 = [];
                        let newBestSeq2 = [];
                        let newBestSeq3 = [];
                        let newBestSeq4 = [];
                        let newBestSeq5 = [];
                        if (bestSeq1 !== undefined) {
                            newBestSeq.push(...bestSeq1);
                            newBestSeq1 = bestSeq1.map((val, index) => {
                                let picked = Cards.find(o => o.cardUuid == val.cardId);
                                let isJoker = isJokerCard(val.cardId);
                                if(isJoker){
                                    return picked.imageURI2;
                                }
                                else{
                                    return picked.imageURI;
                                }
                            });
                        }
                        if (bestSeq2 !== undefined) {
                            newBestSeq.push(...bestSeq2);
                            newBestSeq2 = bestSeq2.map((val, index) => {
                                let picked = Cards.find(o => o.cardUuid == val.cardId);
                                let isJoker = isJokerCard(val.cardId);
                                if(isJoker){
                                    return picked.imageURI2;
                                }
                                else{
                                    return picked.imageURI;
                                }
                            });
                        }
                        if (bestSeq3 !== undefined) {
                            newBestSeq.push(...bestSeq3);
                            newBestSeq3 = bestSeq3.map((val, index) => {
                                let picked = Cards.find(o => o.cardUuid == val.cardId);
                                let isJoker = isJokerCard(val.cardId);
                                if(isJoker){
                                    return picked.imageURI2;
                                }
                                else{
                                    return picked.imageURI;
                                }
                            });
                        }
                        if (bestSeq4 !== undefined) {
                            newBestSeq.push(...bestSeq4);
                            newBestSeq4 = bestSeq4.map((val, index) => {
                                let picked = Cards.find(o => o.cardUuid == val.cardId);
                                let isJoker = isJokerCard(val.cardId);
                                if(isJoker){
                                    return picked.imageURI2;
                                }
                                else{
                                    return picked.imageURI;
                                }
                            });
                        }
                        if (bestSeq5 !== undefined) {
                            newBestSeq.push(...bestSeq5);
                            newBestSeq5 = bestSeq5.map((val, index) => {
                                let picked = Cards.find(o => o.cardUuid == val.cardId);
                                let isJoker = isJokerCard(val.cardId);
                                if(isJoker){
                                    return picked.imageURI2;
                                }
                                else{
                                    return picked.imageURI;
                                }
                            });
                        }

                        // newBestSeq = bestSeq1 !== undefined || bestSeq2 !== undefined || bestSeq3 !== undefined || bestSeq4!== undefined ? [...bestSeq1, ...bestSeq2, ...bestSeq3, ...bestSeq4] : []
                        let newBestCards = newBestSeq.map((val, index) => {
                            let picked = Cards.find(o => o.cardUuid == val.cardId);
                            return picked.imageURI
                        });
                        setTimeout(() => {
                            setActivePlayerData({ ...data.playerId, totalPoints: data.totalPoints, playerStatus: data.playerStatus, seq1, seq2, seq3, seq4, seq5, seq6, newSeq, bestseq: newBestCards, newBestSeq1, newBestSeq2, newBestSeq3, newBestSeq4, newBestSeq5, bestPoints: data.bestPoints, isbestSeq1, isbestSeq2, isbestSeq3, isbestSeq4, isbestSeq5 });
                            localStorage.setItem('ActivePlayer', JSON.stringify({ ...data.playerId, totalPoints: data.totalPoints, playerStatus: data.playerStatus, seq1, seq2, seq3, seq4, seq5, seq6, newSeq, bestseq: newBestCards, newBestSeq1, newBestSeq2, newBestSeq3, newBestSeq4, newBestSeq5, bestPoints: data.bestPoints, isbestSeq1, isbestSeq2, isbestSeq3, isbestSeq4, isbestSeq5 }));
                        }, 500);
                        
                        // console.log('active player', activePlayerData);
                    }

                    return { ...data, isActive: 1, bestPoints: data.bestPoints }
                }
                else {
                    return { ...val, isActive: 0 }
                }
            });
            // let currentActive = 1;
            // let localActivePlayerIndex = localStorage.getItem("activePlayerIndex");
            // newInGame.forEach((val, index) => {
            //     if (val._id.toString() === data._id.toString() && parseInt(localActivePlayerIndex) === parseInt(index) + 1) {
            //         currentActive = index + 1;
            //         if(val !== undefined && val.playerStatus === 'Dropped'){
            //             // console.log('d1');
            //             val = newInGame[index + 1];
            //             currentActive = index + 1;
            //             if(val !== undefined && val.playerStatus === 'Dropped'){
            //                 // console.log('d2');
            //                 val = newInGame[index + 2];
            //                 currentActive = index + 2;
            //                 if(val !== undefined && val.playerStatus === 'Dropped'){
            //                     // console.log('d3');
            //                     val = newInGame[index + 3];
            //                     currentActive = index + 3;
            //                     if(val !== undefined && val.playerStatus === 'Dropped'){
            //                         // console.log('d4');
            //                         val = newInGame[index + 4];
            //                         currentActive = index + 4;
            //                     }
            //                 }
            //             }
            //         }
            //         if(val === undefined){
            //             currentActive = 0;
            //             val = newInGame[currentActive];
            //             if(val.playerId._id.toString() !== data._id.toString()){
            //                 if(val !== undefined && val.playerStatus === 'Dropped'){
            //                     currentActive = 1;
            //                     val = newInGame[currentActive];
            //                     if(val.playerId._id.toString() !== data._id.toString()){
            //                         if(val !== undefined && val.playerStatus === 'Dropped'){
            //                             currentActive = 2;
            //                             val = newInGame[currentActive];
            //                             if(val.playerId._id.toString() !== data._id.toString()){
            //                                 if(val !== undefined && val.playerStatus === 'Dropped'){
            //                                     currentActive = 3;
            //                                     val = newInGame[currentActive];
            //                                     if(val.playerId._id.toString() !== data._id.toString()){
            //                                         if(val !== undefined && val.playerStatus === 'Dropped'){
            //                                             currentActive = 4;
            //                                             val = newInGame[currentActive];
            //                                             if(val.playerId._id.toString() !== data._id.toString()){
            //                                                 if(val !== undefined && val.playerStatus === 'Dropped'){
            //                                                     currentActive = 5;
            //                                                     val = newInGame[currentActive];
            //                                                 }
            //                                             }
            //                                         }
            //                                     }
            //                                 }
            //                             }
            //                         }
            //                     }
            //                 }
            //             }
            //         }
            //         if(val !== undefined && val.playerStatus === 'Active'){
            //             if(currentActive === 6){
            //                 // console.log('set to 0');
            //                 currentActive = 0;
            //             }
            //             // console.log("currentActive",currentActive);
            //             localStorage.setItem("activePlayerIndex", parseInt(currentActive) + 1);
            //             setActivePlayerIndex(parseInt(currentActive) + 1)
            //         }
            //     }
            // })
            // setTimeout(() => {
            //     setIsOpenCard(true);
            //     localStorage.setItem("isOpenCard", true);
            // }, 1000);
            localStorage.setItem("InGame", JSON.stringify(newInGame));
            setInGame(newInGame);
            
            // console.log("pick in game", newInGame);
        }

    }, [])


    let showOpenCard = useCallback((datas) => {
        // console.log("openc", datas);
        let data = datas.updateDealOpenCard;
        // console.log("data.openCard", data.openCard);
        
            if (datas.status === 'pick') {
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
            }
            else if (datas.status === 'drop') {
                // console.log("show drop");
                setIsOpenPick(false);
                localStorage.setItem("isOpenPick", false);
                setIsOpenCard(false);
                localStorage.setItem("isOpenCard", false);
                setIsCloseCard(false);
                localStorage.setItem("isCloseCard", false);
                setIsPick(false);
                localStorage.setItem("isPick", false)
                let LocalScreen = localStorage.getItem("screenNo");
                // let LocalActivePlayer = localStorage.getItem("ActivePlayer");
                // console.log("out open card drop", LocalScreen);
                if (LocalScreen >= 1 && LocalScreen <= 6) {
                    // console.log("in open card drop", LocalScreen);
                    let currentPlayerId = datas.playerId;
                    let InGame = JSON.parse(localStorage.getItem("InGame"));
                    InGame.forEach((val, index) => {
                        if(val.playerStatus === 'Active'){
                            if (val.playerId._id.toString() === currentPlayerId.toString()) {
                                // let oldActivePlayer = JSON.parse(localStorage.getItem('ActivePlayer'));
                                // console.log("oldActivePlayer", oldActivePlayer);
                                // setActivePlayerData(oldActivePlayer);
                                // localStorage.setItem("ActivePlayer", JSON.stringify(oldActivePlayer));
                                let seq1 = val.cardSequence1.cards.map((pval, pin) => {
                                    let picked = Cards.find(o => o.cardUuid == pval.cardId);
                                    let isJoker = isJokerCard(pval.cardId);
                                    if(isJoker){
                                        return {img: picked.imageURI2, cardId: pval.cardId};
                                    }
                                    else{
                                        return {img: picked.imageURI, cardId: pval.cardId};
                                    }
                                })
                                // let popped = seq1.pop();
                                let seq2 = val.cardSequence2.cards.map((pval, pin) => {
                                    let picked = Cards.find(o => o.cardUuid == pval.cardId);
                                    let isJoker = isJokerCard(pval.cardId);
                                    if(isJoker){
                                        return {img: picked.imageURI2, cardId: pval.cardId};
                                    }
                                    else{
                                        return {img: picked.imageURI, cardId: pval.cardId};
                                    }
                                })
        
                                let seq3 = val.cardSequence3.cards.map((pval, pin) => {
                                    let picked = Cards.find(o => o.cardUuid == pval.cardId);
                                    let isJoker = isJokerCard(pval.cardId);
                                    if(isJoker){
                                        return {img: picked.imageURI2, cardId: pval.cardId};
                                    }
                                    else{
                                        return {img: picked.imageURI, cardId: pval.cardId};
                                    }
                                })
        
                                let seq4 = val.cardSequence4.cards.map((pval, pin) => {
                                    let picked = Cards.find(o => o.cardUuid == pval.cardId);
                                    let isJoker = isJokerCard(pval.cardId);
                                    if(isJoker){
                                        return {img: picked.imageURI2, cardId: pval.cardId};
                                    }
                                    else{
                                        return {img: picked.imageURI, cardId: pval.cardId};
                                    }
                                })
        
                                let seq5 = val.cardSequence5.cards.map((pval, pin) => {
                                    let picked = Cards.find(o => o.cardUuid == pval.cardId);
                                    let isJoker = isJokerCard(pval.cardId);
                                    if(isJoker){
                                        return {img: picked.imageURI2, cardId: pval.cardId};
                                    }
                                    else{
                                        return {img: picked.imageURI, cardId: pval.cardId};
                                    }
                                })
        
                                let seq6 = val.cardSequence6.cards.map((pval, pin) => {
                                    let picked = Cards.find(o => o.cardUuid == pval.cardId);
                                    let isJoker = isJokerCard(pval.cardId);
                                    if(isJoker){
                                        return {img: picked.imageURI2, cardId: pval.cardId};
                                    }
                                    else{
                                        return {img: picked.imageURI, cardId: pval.cardId};
                                    }
                                })
        
                                let newSeq = [...seq1, ...seq2, ...seq3, ...seq4, ...seq5, ...seq6]
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
                                let newBestSeq = [];
                                let newBestSeq1 = [];
                                let newBestSeq2 = [];
                                let newBestSeq3 = [];
                                let newBestSeq4 = [];
                                let newBestSeq5 = [];
                                if (bestSeq1 !== undefined) {
                                    newBestSeq.push(...bestSeq1);
                                    newBestSeq1 = bestSeq1.map((val, index) => {
                                        let picked = Cards.find(o => o.cardUuid == val.cardId);
                                        let isJoker = isJokerCard(val.cardId);
                                        if(isJoker){
                                            return picked.imageURI2;
                                        }
                                        else{
                                            return picked.imageURI;
                                        }
                                    });
                                }
                                if (bestSeq2 !== undefined) {
                                    newBestSeq.push(...bestSeq2);
                                    newBestSeq2 = bestSeq2.map((val, index) => {
                                        let picked = Cards.find(o => o.cardUuid == val.cardId);
                                        let isJoker = isJokerCard(val.cardId);
                                        if(isJoker){
                                            return picked.imageURI2;
                                        }
                                        else{
                                            return picked.imageURI;
                                        }
                                    });
                                }
                                if (bestSeq3 !== undefined) {
                                    newBestSeq.push(...bestSeq3);
                                    newBestSeq3 = bestSeq3.map((val, index) => {
                                        let picked = Cards.find(o => o.cardUuid == val.cardId);
                                        let isJoker = isJokerCard(val.cardId);
                                        if(isJoker){
                                            return picked.imageURI2;
                                        }
                                        else{
                                            return picked.imageURI;
                                        }
                                    });
                                }
                                if (bestSeq4 !== undefined) {
                                    newBestSeq.push(...bestSeq4);
                                    newBestSeq4 = bestSeq4.map((val, index) => {
                                        let picked = Cards.find(o => o.cardUuid == val.cardId);
                                        let isJoker = isJokerCard(val.cardId);
                                        if(isJoker){
                                            return picked.imageURI2;
                                        }
                                        else{
                                            return picked.imageURI;
                                        }
                                    });
                                }
                                if (bestSeq5 !== undefined) {
                                    newBestSeq.push(...bestSeq5);
                                    newBestSeq5 = bestSeq5.map((val, index) => {
                                        let picked = Cards.find(o => o.cardUuid == val.cardId);
                                        let isJoker = isJokerCard(val.cardId);
                                        if(isJoker){
                                            return picked.imageURI2;
                                        }
                                        else{
                                            return picked.imageURI;
                                        }
                                    });
                                }
                                let newBestCards = newBestSeq.map((val, index) => {
                                    let picked = Cards.find(o => o.cardUuid == val.cardId);
                                    return picked.imageURI
                                });
                                setTimeout(() => {
                                    // console.log("done drop");
                                    setActivePlayerData({ ...val.playerId, totalPoints: val.totalPoints, playerStatus: val.playerStatus, seq1, seq2, seq3, seq4, seq5, seq6, newSeq, bestseq: newBestCards, newBestSeq1, newBestSeq2, newBestSeq3, newBestSeq4, newBestSeq5, bestPoints: val.bestPoints, isbestSeq1, isbestSeq2, isbestSeq3, isbestSeq4, isbestSeq5 })
                                    localStorage.setItem("ActivePlayer", JSON.stringify({ ...val.playerId, totalPoints: val.totalPoints, playerStatus: val.playerStatus, seq1, seq2, seq3, seq4, seq5, seq6, newSeq, bestseq: newBestCards, newBestSeq1, newBestSeq2, newBestSeq3, newBestSeq4, newBestSeq5, bestPoints: val.bestPoints, isbestSeq1, isbestSeq2, isbestSeq3, isbestSeq4, isbestSeq5 }));
                                }, 500);
                            }
                        }
                    });
                    
                    let LocalActivePlayer = JSON.parse(localStorage.getItem("ActivePlayer"));
                    // console.log("LocalActivePlayer", LocalActivePlayer);
                    // console.log("currentPlayerId", currentPlayerId);
                    let newInGame = InGame.map((val, index) => {
                        if (val.playerId._id.toString() === LocalActivePlayer._id.toString()) {
                            if(val.playerStatus === 'Active'){
                                return { ...val, isActive: 1 }
                            }
                            else {
                                return { ...val, isActive: 0 }
                            }
                        }
                        else {
                            return { ...val, isActive: 0 }
                        }
                    });
                    localStorage.setItem("InGame", JSON.stringify(newInGame));
                    setInGame(newInGame);
                }


            }
            else {
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
            let picked = Cards.find(o => o.cardUuid == data.openCard[data.openCard.length - 1].cardId);
            // console.log("picked", picked)
            setOpenCard(picked.imageURI);
            localStorage.setItem("openCard", picked.imageURI);
            if (datas.status === 'pick') {
                setTimeout(() => {
                    setCurOpenCard(picked.imageURI);
                    localStorage.setItem("curOpenCard", picked.imageURI);
                }, 500);
            }
            else if (datas.status === 'drop') {
                setCurOpenCard(picked.imageURI);
                localStorage.setItem("curOpenCard", picked.imageURI);
            }
            
            // setScreen(2);
            

            //   }, 1000);

        }
        else {
            // console.log('empty');
            setTimeout(() => {
                setOpenCard(null);
                localStorage.removeItem("openCard");
            }, 500);
            
        }

    }, [])

    let setClosedCard = useCallback((datas) => {
        let data1 = datas.closeResult;
        // console.log("in close")
        // if(datas !== undefined){
        if (datas.closeResult !== 0) {
            let newcardId = Cards.find(o => o.cardUuid == datas.closeResult);
            setCloseCard(newcardId.imageURI);
            localStorage.setItem("closeCard", JSON.stringify(newcardId.imageURI));
            setIsPick(true);
            localStorage.setItem("isPick", true)
            setIsCloseCard(true);
            localStorage.setItem("isCloseCard", true);
            setTimeout(() => {
                setCloseCard(null);
                localStorage.removeItem("closeCard");
            }, 500);
        }
        else {
            setCloseCard(null);
            localStorage.removeItem("closeCard");
        }
        // console.log("cc:", closeCard);
    }, [])

    let setPlayerStatus = useCallback((data) => {
        if (data !== undefined) {
            
            // console.log("in active status", data);
            let oldInGame = JSON.parse(localStorage.getItem('InGame'));
            console.log("old in game", oldInGame)
            let screenNo = localStorage.getItem('screenNo');
            let newInGame = oldInGame.map((val, index) => {
                if (val._id.toString() === data._id.toString()) {
                    // console.log("in active status 2", data.playerStatus);
                    
                    let localActivePlayerIndex = localStorage.getItem("activePlayerIndex");
                    // console.log("dec", parseInt(screenNo) , index + 1);
                    if (data.playerId._id.toString() === val.playerId._id.toString()) {
                        // console.log("in active status 3", data.playerStatus);
                        // || data.playerStatus === 'Declared'
                        let oldActive = JSON.parse(localStorage.getItem('ActivePlayer'));
                        let newActive = { ...oldActive, playerStatus: data.playerStatus, totalPoints: data.totalPoints }
                        setActivePlayerData(newActive)
                        localStorage.setItem("ActivePlayer", JSON.stringify(newActive));
                        //   console.log(newActive,"plat-stat-2")
                    }

                    return { ...data }
                }
                else {
                    return { ...val }
                }
            });
            console.log("newInGame", newInGame)
            localStorage.setItem("InGame", JSON.stringify(newInGame));
            setInGame(newInGame);


            if (data.playerStatus === 'Winner') {
                localStorage.setItem("winner", JSON.stringify(data));
                //   setTimeout(() => {
                // localStorage.setItem('screenNo', 9);
                // setScreenNo(9);
                //   }, 3000);
                //   setWinner(data);
            }
            else if(data.playerStatus === 'Declared'){
                clearTimeout(pickSocket);
            }
        }
    }, [])

    let setProbabilityScore = useCallback((data) => {
        if (data !== undefined) {
            setProbability(data.InGameRes);
            localStorage.setItem("probability", JSON.stringify(data.InGameRes));
        }
        setOldProbability(probability);
        let LocalProbability = JSON.parse(localStorage.getItem('probability'));
        let screenNO = localStorage.getItem('screenNo')
        let localindex = localStorage.getItem("activePlayerIndex");
        localindex = parseInt(localindex);
        if (LocalProbability !== undefined) {
            setProbability(LocalProbability);
        }
        else {
            setProbability(props.probability);
        }
        let LocalScreen = localStorage.getItem("screenNo");
        if (LocalScreen !== undefined) {
            setScreenNo(LocalScreen);
        }
        else {
            setScreenNo(screenNO)
        }
        // console.log("pro", LocalProbability);
        // console.log('scr p', LocalProbability[localindex - 1], localindex)
        if (LocalProbability[localindex] !== undefined) {
            setActiveWinProb(LocalProbability[localindex]);
            

        }
    }, [])

    let setPlayerChips = useCallback((data) => {
        // setTimeout(() => {
            localStorage.setItem('NewInGame', JSON.stringify(data));
        // }, 23000);
        // setInGame(data);
    }, []);

    let setCurrentActivePlayer = useCallback((data) => {
        let screenNo = localStorage.getItem('screenNo');
        
        if (screenNo >= 1 || screenNo <= 6) {
            
            console.log('active index', data);
            pickSocket = setTimeout(() => {
                let InGame = JSON.parse(localStorage.getItem('InGame'));
                // console.log('after active', screenNo);
                let currentPlayerId = data.playerId;
                let currentActive = 1;
                InGame.forEach((val, index) => {
                    if (val.playerId._id.toString() === currentPlayerId.toString()) {
                        val = InGame[0];
                        if (index < 5) {
                            val = InGame[index + 1];
                        }
                        currentActive = index + 1;
                        if(val !== undefined && val.playerStatus === 'Dropped'){
                            // console.log('d1');
                            val = InGame[index + 1];
                            currentActive = index + 1;
                            if(val !== undefined && val.playerStatus === 'Dropped'){
                                // console.log('d2');
                                val = InGame[index + 2];
                                currentActive = index + 2;
                                if(val !== undefined && val.playerStatus === 'Dropped'){
                                    // console.log('d3');
                                    val = InGame[index + 3];
                                    currentActive = index + 3;
                                    if(val !== undefined && val.playerStatus === 'Dropped'){
                                        // console.log('d4');
                                        val = InGame[index + 4];
                                        currentActive = index + 4;
                                    }
                                }
                            }
                        }
                        if(val === undefined){
                            currentActive = 0;
                            val = InGame[currentActive];
                            if(val.playerId._id.toString() !== currentPlayerId.toString()){
                                if(val !== undefined && val.playerStatus === 'Dropped'){
                                    currentActive = 1;
                                    val = InGame[currentActive];
                                    if(val.playerId._id.toString() !== currentPlayerId.toString()){
                                        if(val !== undefined && val.playerStatus === 'Dropped'){
                                            currentActive = 2;
                                            val = InGame[currentActive];
                                            if(val.playerId._id.toString() !== currentPlayerId.toString()){
                                                if(val !== undefined && val.playerStatus === 'Dropped'){
                                                    currentActive = 3;
                                                    val = InGame[currentActive];
                                                    if(val.playerId._id.toString() !== currentPlayerId.toString()){
                                                        if(val !== undefined && val.playerStatus === 'Dropped'){
                                                            currentActive = 4;
                                                            val = InGame[currentActive];
                                                            if(val.playerId._id.toString() !== currentPlayerId.toString()){
                                                                if(val !== undefined && val.playerStatus === 'Dropped'){
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
                        if(val !== undefined && (val.playerStatus === 'Active' || val.playerStatus === 'Winner')){
                            // console.log('in active d');
                            
                            
                            if(currentActive === 6){
                                // console.log('set to 0');
                                currentActive = 0;
                            }
                            // console.log("currentActive",currentActive);
                            localStorage.setItem("activePlayerIndex", parseInt(currentActive) + 1);
                            setActivePlayerIndex(parseInt(currentActive) + 1)
                            // console.log("activePlayerIndex", activePlayerIndex);
                            // console.log("after val", val)
                            let seq1 = val.cardSequence1.cards.map((pval, pin) => {
                                let picked = Cards.find(o => o.cardUuid == pval.cardId);
                                let isJoker = isJokerCard(pval.cardId);
                                if(isJoker){
                                    return {img: picked.imageURI2, cardId: pval.cardId};
                                }
                                else{
                                    return {img: picked.imageURI, cardId: pval.cardId};
                                }
                            })
                            // let popped = seq1.pop();
                            let seq2 = val.cardSequence2.cards.map((pval, pin) => {
                                let picked = Cards.find(o => o.cardUuid == pval.cardId);
                                let isJoker = isJokerCard(pval.cardId);
                                if(isJoker){
                                    return {img: picked.imageURI2, cardId: pval.cardId};
                                }
                                else{
                                    return {img: picked.imageURI, cardId: pval.cardId};
                                }
                            })

                            let seq3 = val.cardSequence3.cards.map((pval, pin) => {
                                let picked = Cards.find(o => o.cardUuid == pval.cardId);
                                let isJoker = isJokerCard(pval.cardId);
                                if(isJoker){
                                    return {img: picked.imageURI2, cardId: pval.cardId};
                                }
                                else{
                                    return {img: picked.imageURI, cardId: pval.cardId};
                                }
                            })

                            let seq4 = val.cardSequence4.cards.map((pval, pin) => {
                                let picked = Cards.find(o => o.cardUuid == pval.cardId);
                                let isJoker = isJokerCard(pval.cardId);
                                if(isJoker){
                                    return {img: picked.imageURI2, cardId: pval.cardId};
                                }
                                else{
                                    return {img: picked.imageURI, cardId: pval.cardId};
                                }
                            })

                            let seq5 = val.cardSequence5.cards.map((pval, pin) => {
                                let picked = Cards.find(o => o.cardUuid == pval.cardId);
                                let isJoker = isJokerCard(pval.cardId);
                                if(isJoker){
                                    return {img: picked.imageURI2, cardId: pval.cardId};
                                }
                                else{
                                    return {img: picked.imageURI, cardId: pval.cardId};
                                }
                            })

                            let seq6 = val.cardSequence6.cards.map((pval, pin) => {
                                let picked = Cards.find(o => o.cardUuid == pval.cardId);
                                let isJoker = isJokerCard(pval.cardId);
                                if(isJoker){
                                    return {img: picked.imageURI2, cardId: pval.cardId};
                                }
                                else{
                                    return {img: picked.imageURI, cardId: pval.cardId};
                                }
                            })

                            let newSeq = [...seq1, ...seq2, ...seq3, ...seq4, ...seq5, ...seq6]
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
                            let newBestSeq = [];
                            let newBestSeq1 = [];
                            let newBestSeq2 = [];
                            let newBestSeq3 = [];
                            let newBestSeq4 = [];
                            let newBestSeq5 = [];
                            if (bestSeq1 !== undefined) {
                                newBestSeq.push(...bestSeq1);
                                newBestSeq1 = bestSeq1.map((val, index) => {
                                    let picked = Cards.find(o => o.cardUuid == val.cardId);
                                    let isJoker = isJokerCard(val.cardId);
                                    if(isJoker){
                                        return picked.imageURI2;
                                    }
                                    else{
                                        return picked.imageURI;
                                    }
                                });
                            }
                            if (bestSeq2 !== undefined) {
                                newBestSeq.push(...bestSeq2);
                                newBestSeq2 = bestSeq2.map((val, index) => {
                                    let picked = Cards.find(o => o.cardUuid == val.cardId);
                                    let isJoker = isJokerCard(val.cardId);
                                    if(isJoker){
                                        return picked.imageURI2;
                                    }
                                    else{
                                        return picked.imageURI;
                                    }
                                });
                            }
                            if (bestSeq3 !== undefined) {
                                newBestSeq.push(...bestSeq3);
                                newBestSeq3 = bestSeq3.map((val, index) => {
                                    let picked = Cards.find(o => o.cardUuid == val.cardId);
                                    let isJoker = isJokerCard(val.cardId);
                                    if(isJoker){
                                        return picked.imageURI2;
                                    }
                                    else{
                                        return picked.imageURI;
                                    }
                                });
                            }
                            if (bestSeq4 !== undefined) {
                                newBestSeq.push(...bestSeq4);
                                newBestSeq4 = bestSeq4.map((val, index) => {
                                    let picked = Cards.find(o => o.cardUuid == val.cardId);
                                    let isJoker = isJokerCard(val.cardId);
                                    if(isJoker){
                                        return picked.imageURI2;
                                    }
                                    else{
                                        return picked.imageURI;
                                    }
                                });
                            }
                            if (bestSeq5 !== undefined) {
                                newBestSeq.push(...bestSeq5);
                                newBestSeq5 = bestSeq5.map((val, index) => {
                                    let picked = Cards.find(o => o.cardUuid == val.cardId);
                                    let isJoker = isJokerCard(val.cardId);
                                    if(isJoker){
                                        return picked.imageURI2;
                                    }
                                    else{
                                        return picked.imageURI;
                                    }
                                });
                            }
                            let newBestCards = newBestSeq.map((val, index) => {
                                let picked = Cards.find(o => o.cardUuid == val.cardId);
                                return picked.imageURI
                            });
                            console.log("act");
                            setActivePlayerData({ ...val.playerId, totalPoints: val.totalPoints, playerStatus: val.playerStatus, seq1, seq2, seq3, seq4, seq5, seq6, newSeq, bestseq: newBestCards, newBestSeq1, newBestSeq2, newBestSeq3, newBestSeq4, newBestSeq5, bestPoints: val.bestPoints, isbestSeq1, isbestSeq2, isbestSeq3, isbestSeq4, isbestSeq5 })
                            localStorage.setItem("ActivePlayer", JSON.stringify({ ...val.playerId, totalPoints: val.totalPoints, playerStatus: val.playerStatus, seq1, seq2, seq3, seq4, seq5, seq6, newSeq, bestseq: newBestCards, newBestSeq1, newBestSeq2, newBestSeq3, newBestSeq4, newBestSeq5, bestPoints: val.bestPoints, isbestSeq1, isbestSeq2, isbestSeq3, isbestSeq4, isbestSeq5 }));
                        }
                        // return {...val}
                    }
                });
                // console.log("Active InGame", InGame);
                let LocalActivePlayer = JSON.parse(localStorage.getItem("ActivePlayer"));
                let newInGame = InGame.map((val, index) => {
                    if (val.playerId._id.toString() === LocalActivePlayer._id.toString()) {
                        return { ...val, isActive: 1 }
                    }
                    else {
                        return { ...val, isActive: 0 }
                    }
                });
                
                localStorage.setItem("InGame", JSON.stringify(newInGame));
                setInGame(newInGame);
                // console.log('active after', newInGame);
                let localindex = localStorage.getItem("activePlayerIndex");
                let LocalProbability = JSON.parse(localStorage.getItem('probability'));
                setProbability(LocalProbability);
                if(parseInt(screenNo) === 6){
                    localStorage.setItem('screenNo', 1)
                }
                else{
                    localStorage.setItem('screenNo', parseInt(screenNo) + 1)
                }
                // console.log("a pro", LocalProbability);
                if (LocalProbability[localindex - 1] !== undefined) {
                    setActiveWinProb(LocalProbability[localindex - 1]);
                    // console.log("scr a", LocalProbability[localindex - 1], localindex);
                }
                // InGame.forEach((val, index) => {
                //     if(localindex == 6){
                //         if(InGame[index].playerStatus === "Active"){
                //             localStorage.setItem("activePlayerIndex", (parseInt(index + 1)));
                //             setActivePlayerIndex((parseInt(index + 1)))
                //             return;
                //         }
                //     }
                //     else if(index + 1 > parseInt(localindex)){
                //         if(InGame[index].playerStatus === "Active"){
                //             localStorage.setItem("activePlayerIndex", (parseInt(index + 1)));
                //             setActivePlayerIndex((parseInt(index + 1)))
                //             return;
                //         }
                //     }
                // });

                // if(localindex !== undefined && localindex !== null){
                //     if(parseInt(localindex) === 6){
                //         localindex = 1;
                //     }
                //     else{
                //         localindex = parseInt(localindex) + 1;
                //     }
                //     localStorage.setItem("activePlayerIndex", localindex);
                //     setActivePlayerIndex(localindex)
                // }
                // else{
                //     localStorage.setItem("activePlayerIndex", 1);
                // }
                
                
            }, 3000);
        }
    }, []);

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
                let newBestSeq = [];
                let newBestSeq1 = [];
                let newBestSeq2 = [];
                let newBestSeq3 = [];
                let newBestSeq4 = [];
                let newBestSeq5 = [];
                if (bestSeq1 !== undefined) {
                  newBestSeq.push(...bestSeq1);
                  newBestSeq1 = bestSeq1.map((val, index) => {
                    let picked = Cards.find((o) => o.cardUuid == val.cardId);
                    let isJoker = isJokerCard(val.cardId);
                    if(isJoker){
                        return picked.imageURI2;
                    }
                    else{
                        return picked.imageURI;
                    }
                  });
                }
                if (bestSeq2 !== undefined) {
                  newBestSeq.push(...bestSeq2);
                  newBestSeq2 = bestSeq2.map((val, index) => {
                    let picked = Cards.find((o) => o.cardUuid == val.cardId);
                    let isJoker = isJokerCard(val.cardId);
                    if(isJoker){
                        return picked.imageURI2;
                    }
                    else{
                        return picked.imageURI;
                    }
                  });
                }
                if (bestSeq3 !== undefined) {
                  newBestSeq.push(...bestSeq3);
                  newBestSeq3 = bestSeq3.map((val, index) => {
                    let picked = Cards.find((o) => o.cardUuid == val.cardId);
                    let isJoker = isJokerCard(val.cardId);
                    if(isJoker){
                        return picked.imageURI2;
                    }
                    else{
                        return picked.imageURI;
                    }
                  });
                }
                if (bestSeq4 !== undefined) {
                  newBestSeq.push(...bestSeq4);
                  newBestSeq4 = bestSeq4.map((val, index) => {
                    let picked = Cards.find((o) => o.cardUuid == val.cardId);
                    let isJoker = isJokerCard(val.cardId);
                    if(isJoker){
                        return picked.imageURI2;
                    }
                    else{
                        return picked.imageURI;
                    }
                  });
                }
                if (bestSeq5 !== undefined) {
                  newBestSeq.push(...bestSeq5);
                  newBestSeq5 = bestSeq5.map((val, index) => {
                    let picked = Cards.find((o) => o.cardUuid == val.cardId);
                    let isJoker = isJokerCard(val.cardId);
                    if(isJoker){
                        return picked.imageURI2;
                    }
                    else{
                        return picked.imageURI;
                    }
                  });
                }
                
                if (val._id === data.InGameRes._id) {
                    console.log("id:", data.InGameRes._id, val._id)
                  if (scrNo >= 1 && scrNo <= 6) {
                    console.log("best seq ui:", scrNo)
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
                      isbestSeq1, isbestSeq2, isbestSeq3, isbestSeq4, isbestSeq5
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
                        isbestSeq1, isbestSeq2, isbestSeq3, isbestSeq4, isbestSeq5
                      })
                    );
                    return {
                        ...data.InGameRes
                    };
                  }
                  return {
                    ...val
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
        if (animateOnce) {
          setAnimateOnce(false);
        }
      }, [animateOnce]);

    useEffect(() => {
        let localIsPick = localStorage.getItem("isPick");
        if(localIsPick !== undefined && localIsPick !== null){
            setIsPick(localIsPick);
        }

        let localDealNo = localStorage.getItem('dealNumberCount')
        if(localDealNo !== undefined && localDealNo !== null){
            setDealNumberCount(localDealNo)
        }
        else{
            setDealNumberCount(props.dealNumberCount)
        }

        localStorage.removeItem('aceJoker');

    }, []);

    useEffect(() => {
        let localindex = localStorage.getItem("activePlayerIndex");
        if(localindex !== undefined && localindex !== null){
            setActivePlayerIndex(parseInt(localindex));
        }
    }, []);

    useEffect(() => {
        if (socket !== undefined) {
            //   console.log(socket,"socket-1")
            socket.on("setCardSequence", setCardSequence);
            socket.on("setPickCard", setPicked);
            socket.on("showOpenCard", showOpenCard)
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

    }, [socket])

    useEffect(() => {
        let LocalAceJoker = localStorage.getItem("aceJoker");
        if (LocalAceJoker !== undefined) {
            setAceJoker(LocalAceJoker);
        }
        else {
            setAceJoker(props.aceJoker);
        }

    }, [props.aceJoker]);

    useEffect(() => {

        setOldProbability(probability);
        let LocalProbability = JSON.parse(localStorage.getItem('probability'));
        if (LocalProbability !== undefined) {
            setProbability(LocalProbability);
        }
        else {
            setProbability(props.probability);
        }
        let LocalScreen = localStorage.getItem("screenNo");
        if (LocalScreen !== undefined) {
            setScreenNo(LocalScreen);
        }
        else {
            setScreenNo(props.screenNo)
        }
        if (probability[screenNo - 1] !== undefined) {
            setActiveWinProb(probability[screenNo - 1]);
            // console.log('screen',probability[screenNo - 1], screenNo)
        }
    }, [props]);
    //On screen click use Effect
    useEffect(() => {
        let ActivePlayer = JSON.parse(localStorage.getItem('ActivePlayer'));
        if (ActivePlayer !== undefined) {
            setActivePlayerData(ActivePlayer);
            if (ActivePlayer.bestseq !== undefined) {
                setBestSeq(ActivePlayer.bestseq)
                localStorage.setItem("bestSeq", JSON.stringify(ActivePlayer));
            }
        }
        else {
            setActivePlayerData(props.activePlayer);
        }
    }, [props.activePlayer]);

    useEffect(() => {
        let LocalInGame = JSON.parse(localStorage.getItem('InGame'));
        if (LocalInGame !== undefined) {
            setInGame(LocalInGame);
        }
        else {
            setInGame(props.inGame);
        }
    }, [props.inGame]);

    // useEffect(() => {
    //     if (props.closeCard === undefined || Object.keys(props.closeCard).length === 0) {
    //         setCloseCard(JSON.parse(localStorage.getItem('closeCard')));
    //     }
    //     else {
    //         setCloseCard(props.closeCard);
    //     }
    // }, [props.closeCard]);

    useEffect(() => {
        let LocalProb = JSON.parse(localStorage.getItem('setDealProb'));
        if (LocalProb !== undefined) {
            setDealProb(LocalProb);
        }
        else {
            setDealProb(props.dealProb);
        }
    }, [props.dealProb]);

    useEffect(() => {

        // setOldProbability(probability);
        // let LocalProbability = JSON.parse(localStorage.getItem('probability'));
        // if (LocalProbability !== undefined) {
        //     setProbability(LocalProbability);
        // }
        // else {
        //     setProbability(props.probability);
        // }

        // console.log("pro",probability[screenNo - 1]);
        // if(props.bestSeq === undefined || props.bestSeq.length === 0){
        //     setBestSeq(JSON.parse(localStorage.getItem('bestSeq')));
        // }
        // else{
        //     setBestSeq(props.bestSeq);
        // }
        // let LocalProb = JSON.parse(localStorage.getItem('setDealProb'));
        // if (LocalProb !== undefined) {
        //     setDealProb(LocalProb);
        // }
        // else {
        //     setDealProb(props.dealProb);
        // }

        setplayerPosition(props.playerPosition);
        // let LocalInGame = JSON.parse(localStorage.getItem('InGame'));
        // if (LocalInGame !== undefined) {
        //     setInGame(LocalInGame);
        // }
        // else {
        //     setInGame(props.inGame);
        // }

        // let ActivePlayer = JSON.parse(localStorage.getItem('ActivePlayer'));
        // if (ActivePlayer !== undefined) {
        //     setActivePlayerData(ActivePlayer);
        //     if (ActivePlayer.bestseq !== undefined) {
        //         setBestSeq(ActivePlayer.bestseq)
        //         localStorage.setItem("bestSeq", JSON.stringify(ActivePlayer));
        //     }
        // }
        // else {
        //     setActivePlayerData(props.activePlayer);
        // }



        // if (props.closeCard === undefined || Object.keys(props.closeCard).length === 0) {
        //     setCloseCard(JSON.parse(localStorage.getItem('closeCard')));
        // }
        // else {
        //     setCloseCard(props.closeCard);
        // }

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
        }
        else {
            setIsOpenPick(props.isOpenPick);
        }
        // console.log("is pick", isOpenPick);
    }, [props.isOpenPick]);

    // useEffect(() => {
    //     let LocalisDropCard = localStorage.getItem("isDropCard");
    //     if (LocalisDropCard !== undefined) {
    //         setIsDropCard(LocalisDropCard);
    //     }
    //     else {
    //         setIsDropCard(null);
    //     }
    //     // console.log("is pick", isOpenPick);
    // }, [isDropCard]);

    useEffect(() => {
        let LocalIsOpenCard = localStorage.getItem("isOpenCard");
        if (LocalIsOpenCard !== undefined) {
            setIsOpenCard(LocalIsOpenCard);
        }
        else {
            setIsOpenCard(false);
        }
        console.log("LocalIsOpenCard", LocalIsOpenCard);
    }, []);

    useEffect(() => {
        let LocalIsOpenDrop = localStorage.getItem("isOpenDrop");
        if (LocalIsOpenDrop !== undefined) {
            setIsOpenDrop(LocalIsOpenDrop);
        }
        else {
            setIsOpenDrop(props.isOpenDrop);
        }
        // console.log("is Drop", isOpenDrop);
    }, [props.isOpenDrop]);

    const setImgCounter = () => {
        setImgCount((prevCounter) => prevCounter + 1);
    }

    if (activePlayerData && activePlayerData.name && activePlayerData.shortphoto) {
        // console.log("cc2:", closeCard)
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
                        {(bestSeq.length > 0 && activePlayerData.playerStatus === 'Active' && dealProb != true) && (
                            <>
                                <span className="pstext">Perfect Sort</span>
                                {(isPick === "false" || isPick === false) && (<span className="best-points-deal">{activePlayerData.bestPoints}<span className="tracking-in-contract-chips-deal-pts">Pts</span></span>)}
                            </>
                        )}
                        {(activePlayerData.playerStatus === 'Active' && dealProb != true) && (
                            <>
                                <div className="perfect_sort_cards">
                                    <div className="row">
                                        <div className={`col-auto no-gutters p-1 ${parseInt(activePlayerData.isbestSeq2) > 0 && ""}`}>
                                            {activePlayerData.newBestSeq1 !== undefined && activePlayerData.newBestSeq1.length > 0 && activePlayerData.newBestSeq1.map((bval, bindex) => (
                                                <div className="ins-div">
                                                    <img
                                                        src={bval}
                                                        alt=""
                                                        className={`bestimg shadow bestimg${bindex + 1}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className={`col-auto no-gutters p-1 ${parseInt(activePlayerData.isbestSeq2) > 0 && ""}`}>
                                            {activePlayerData.newBestSeq2 !== undefined && activePlayerData.newBestSeq2.length > 0 && activePlayerData.newBestSeq2.map((bval, bindex) => (
                                                <div className="ins-div">
                                                    <img
                                                        src={bval}
                                                        alt=""
                                                        className={`bestimg shadow bestimg${bindex + 1}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className={`col-auto no-gutters p-1 ${parseInt(activePlayerData.isbestSeq3) > 0 && ""}`}>
                                            {activePlayerData.newBestSeq3 !== undefined && activePlayerData.newBestSeq3.length > 0 && activePlayerData.newBestSeq3.map((bval, bindex) => (
                                                <div className="ins-div">
                                                    <img
                                                        src={bval}
                                                        alt=""
                                                        className={`bestimg shadow bestimg${bindex + 1}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className={`col-auto no-gutters p-1 ${parseInt(activePlayerData.isbestSeq4) > 0 && ""}`}>
                                            {activePlayerData.newBestSeq4 !== undefined && activePlayerData.newBestSeq4.length > 0 && activePlayerData.newBestSeq4.map((bval, bindex) => (
                                                <div className="ins-div">
                                                    <img
                                                        src={bval}
                                                        alt=""
                                                        className={`bestimg shadow bestimg${bindex + 1}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className={`col-auto no-gutters p-1 ${parseInt(activePlayerData.isbestSeq5) > 0 && ""}`}>
                                            {activePlayerData.newBestSeq5 !== undefined && activePlayerData.newBestSeq5.length > 0 && activePlayerData.newBestSeq5.map((bval, bindex) => (
                                                <div className="ins-div">
                                                    <img
                                                        src={bval}
                                                        alt=""
                                                        className={`bestimg shadow bestimg${bindex + 1}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
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
                        {(activePlayerData.playerStatus === 'Active' || activePlayerData.playerStatus === 'Declared') && <span className="plstext">Player's Sort</span>}
                        <div className="dealdiv">
                            <LazyLoad height={"100%"}>
                                <img
                                    src={DEALBG}
                                    alt=""
                                    className="rotate-vert-center-deal-new"
                                />
                            </LazyLoad >
                            <span className="tracking-in-contract-username">{activePlayerData.name.split(' ')[0]}</span>
                            {(activePlayerData.playerStatus === 'Active' || activePlayerData.playerStatus === 'Dropped') && (<span className="tracking-in-contract-chips-deal">{activePlayerData.totalPoints}<span className="tracking-in-contract-chips-deal-pts">Pts</span></span>)}
                            {(activePlayerData.playerStatus === 'Declared' || activePlayerData.playerStatus === 'Rejected' || activePlayerData.playerStatus === 'Winner') && (<span className="tracking-in-contract-chips-deal-dec">Declared</span>)}
                            {activePlayerData.playerStatus === 'Declared' && (
                                <img
                                    src={validation_under_progress}
                                    alt=""
                                    className="validation_div"
                                />
                            )}
                            {activePlayerData.playerStatus === 'Rejected' && (
                                <img
                                    src={invalid_declaration}
                                    alt=""
                                    className="validation_div"
                                />
                            )}
                            {activePlayerData.playerStatus === 'Winner' && (
                                <img
                                    src={valid_declaration}
                                    alt=""
                                    className="validation_div"
                                />
                            )}
                        </div>
                        <div className="bgdivdealdeal">
                            <LazyLoad height={"100%"}>
                                <img
                                    src={DEALBGIMG}
                                    alt=""
                                    className="slide-in-left-deal-bg-img-deal"
                                />
                            </LazyLoad >
                        </div>

                    </div>
                    {activePlayerData.playerStatus === 'Dropped' && (<span className="slide-in-left-deal-bg-text-drop">{activePlayerData.name.split(' ')[0]} has dropped</span>)}
                    <div className={`usercardsdiv ${(activePlayerData.playerStatus === 'Dropped' || activePlayerData.playerStatus === 'Rejected') && 'usercardsdiv-dropped'}`}>
                        {activePlayerData.playerStatus !== 'Dropped' && (
                            <>
                                <div className="row">
                                    <div className="col-auto no-gutters p-1">
                                        {activePlayerData.seq1.length > 0 && activePlayerData.seq1.map((value, index) => (
                                            <div className="ins-div">
                                                {(activePlayerData.seq2.length === 0 && activePlayerData.newSeq.length === 14 && activePlayerData.seq1.length - 1 == index) ? (
                                                    <div className="roll-in-last-card">
                                                        <img
                                                            src={value.img}
                                                            alt=""
                                                            className={`usercarddeal ${(isDropCard !== null && isDropCard == value.cardId) && `discard14` } usercard14 shadow usercarddeal1${index + 1}`}
                                                        />
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={value.img}
                                                        alt=""
                                                        className={`usercarddeal ${(isDropCard !== null && isDropCard == value.cardId) && `discard${index + 1}` } ${animateOnce && `usercard${index + 1}`} shadow usercarddeal1${index + 1}`}
                                                    />
                                                )}
                                            </div>
                                            
                                        ))}
                                    </div>
                                    <div className="col-auto no-gutters p-1">
                                        {activePlayerData.seq2.length > 0 && activePlayerData.seq2.map((value, index) => (
                                            <div className="ins-div">
                                                {(activePlayerData.seq3.length === 0 && activePlayerData.newSeq.length === 14 && activePlayerData.seq2.length - 1 == index) ? (
                                                    <div className="roll-in-last-card">
                                                        <img
                                                            src={value.img}
                                                            alt=""
                                                            className={`usercarddeal ${(isDropCard !== null && isDropCard == value.cardId) && `discard14` } usercard14 shadow usercarddeal1${index + 1}`}
                                                        />
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={value.img}
                                                        alt=""
                                                        className={`usercarddeal ${(isDropCard !== null && isDropCard == value.cardId) && `discard${activePlayerData.seq1.length + index + 1}` } ${animateOnce && `usercard${activePlayerData.seq1.length + index + 1}`} shadow usercarddeal1${index + 1}`}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="col-auto no-gutters p-1">
                                        {activePlayerData.seq3.length > 0 && activePlayerData.seq3.map((value, index) => (
                                            <div className="ins-div">
                                                {(activePlayerData.seq4.length === 0 && activePlayerData.newSeq.length === 14 && activePlayerData.seq3.length - 1 == index) ? (
                                                    <div className="roll-in-last-card">
                                                        <img
                                                            src={value.img}
                                                            alt=""
                                                            className={`usercarddeal ${(isDropCard !== null && isDropCard == value.cardId) && `discard14` } usercard14 shadow usercarddeal1${index + 1}`}
                                                        />
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={value.img}
                                                        alt=""
                                                        className={`usercarddeal ${(isDropCard !== null && isDropCard == value.cardId) && `discard${activePlayerData.seq1.length + activePlayerData.seq2.length + index + 1}` } ${animateOnce && `usercard${activePlayerData.seq1.length + activePlayerData.seq2.length + index + 1}`} shadow usercarddeal1${index + 1}`}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="col-auto no-gutters p-1">
                                        {activePlayerData.seq4.length > 0 && activePlayerData.seq4.map((value, index) => (
                                            <div className="ins-div">
                                                {(activePlayerData.newSeq.length === 14 && activePlayerData.seq4.length - 1 == index) ? (
                                                    <div className="roll-in-last-card">
                                                        <img
                                                            src={value.img}
                                                            alt=""
                                                            className={`usercarddeal ${(isDropCard !== null && isDropCard == value.cardId) && `discard14` } usercard14 shadow usercarddeal1${index + 1}`}
                                                        />
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={value.img}
                                                        alt=""
                                                        className={`usercarddeal ${(isDropCard !== null && isDropCard == value.cardId) && `discard${activePlayerData.seq1.length + activePlayerData.seq2.length + activePlayerData.seq3.length + index + 1}` } ${animateOnce && `usercard${activePlayerData.seq1.length + activePlayerData.seq2.length + activePlayerData.seq3.length + index + 1}`} shadow usercarddeal1${index + 1}`}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="col-auto no-gutters p-1">
                                        {activePlayerData.seq5.length > 0 && activePlayerData.seq5.map((value, index) => (
                                            <div className="ins-div">
                                                {(activePlayerData.newSeq.length === 14 && activePlayerData.seq5.length - 1 == index) ? (
                                                    <div className="roll-in-last-card">
                                                        <img
                                                            src={value.img}
                                                            alt=""
                                                            className={`usercarddeal ${(isDropCard !== null && isDropCard == value.cardId) && `discard14` } usercard14 shadow usercarddeal1${index + 1}`}
                                                        />
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={value.img}
                                                        alt=""
                                                        className={`usercarddeal ${(isDropCard !== null && isDropCard == value.cardId) && `discard${activePlayerData.seq1.length + activePlayerData.seq2.length + activePlayerData.seq3.length + activePlayerData.seq4.length + index + 1}` } ${animateOnce && `usercard${activePlayerData.seq1.length + activePlayerData.seq2.length + activePlayerData.seq3.length + activePlayerData.seq4.length + index + 1}`} shadow usercarddeal1${index + 1}`}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="col-auto no-gutters p-1">
                                        {activePlayerData.seq6.length > 0 && activePlayerData.seq6.map((value, index) => (
                                            <div className="ins-div">
                                                {(activePlayerData.newSeq.length === 14 && activePlayerData.seq6.length - 1 == index) ? (
                                                    
                                                    <div className="roll-in-last-card">
                                                        {console.log("isDropCard", isDropCard , value.cardId)}
                                                        <img
                                                            src={value.img}
                                                            alt=""
                                                            className={`usercarddeal ${(isDropCard !== null && isDropCard == value.cardId) && `discard14` } usercard14 shadow usercarddeal1${index + 1}`}
                                                        />
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={value.img}
                                                        alt=""
                                                        className={`usercarddeal ${(isDropCard !== null && isDropCard == value.cardId) && `discard${activePlayerData.seq1.length + activePlayerData.seq2.length + activePlayerData.seq3.length + activePlayerData.seq4.length + activePlayerData.seq5.length + index + 1}` } ${animateOnce && `usercard${activePlayerData.seq1.length + activePlayerData.seq2.length + activePlayerData.seq3.length + activePlayerData.seq4.length + activePlayerData.seq5.length + index + 1}`} shadow usercarddeal1${index + 1}`}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                        {activePlayerData.playerStatus === 'Dropped' && (
                            <>
                                <div className="row mb-1">
                                    <div className="col-auto">
                                        <img
                                            src={back_card_min}
                                            alt=""
                                            className="usercarddealdrop usercarddrop1"
                                        />
                                        <img
                                            src={back_card_min}
                                            alt=""
                                            className="usercarddealdrop usercarddrop2"
                                        />
                                        <img
                                            src={back_card_min}
                                            alt=""
                                            className="usercarddealdrop usercarddrop3"
                                        />
                                        <img
                                            src={back_card_min}
                                            alt=""
                                            className="usercarddealdrop usercarddrop4"
                                        />
                                        <img
                                            src={back_card_min}
                                            alt=""
                                            className="usercarddealdrop usercarddrop5"
                                        />
                                        <img
                                            src={back_card_min}
                                            alt=""
                                            className="usercarddealdrop usercarddrop6"
                                        />
                                        <img
                                            src={back_card_min}
                                            alt=""
                                            className="usercarddealdrop usercarddrop7"
                                        />
                                        <img
                                            src={back_card_min}
                                            alt=""
                                            className="usercarddealdrop usercarddrop8"
                                        />
                                        <img
                                            src={back_card_min}
                                            alt=""
                                            className="usercarddealdrop usercarddrop9"
                                        />
                                        <img
                                            src={back_card_min}
                                            alt=""
                                            className="usercarddealdrop usercarddrop10"
                                        />
                                        <img
                                            src={back_card_min}
                                            alt=""
                                            className="usercarddealdrop usercarddrop11"
                                        />
                                        <img
                                            src={back_card_min}
                                            alt=""
                                            className="usercarddealdrop usercarddrop12"
                                        />
                                        <img
                                            src={back_card_min}
                                            alt=""
                                            className="usercarddealdrop usercarddrop13"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="deck-holder-deal">
                        <img
                            src={close_deck}
                            alt=""
                            className="close_deck"
                        />
                        <img
                            src={(closeCard === null || closeCard === undefined || Object.keys(closeCard).length === 0) ? close_deck_back_card : closeCard}
                            alt=""
                            className={`${(closeCard === null || closeCard === undefined || Object.keys(closeCard).length === 0) ? "close_deck_back_card" : "closeCard shadow"} ${isCloseCard === true ? "jumpclosecard" : ""}`}
                        />
                        <img
                            src={open_card_holder}
                            alt=""
                            className="open_card_holder_deal"
                        />
                        {(openCard !== null && openCard !== undefined) && (
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
                                        <div className={`flip-open-inner ${(activePlayerData.playerStatus === 'Declared' || activePlayerData.playerStatus === 'Winner') && "flipo"}`}>
                                            <div className="flip-open-front">
                                                <img
                                                    src={openCard === null ? back_card_min : openCard}
                                                    alt=""
                                                    className={`oc shadow`}
                                                />
                                                <img
                                                    src={curOpenCard === null ? back_card_min : curOpenCard}
                                                    alt=""
                                                    className={`oc shadow ${isOpenCard === true ? activePlayerData.seq2.length === 0 ? "oc2" : activePlayerData.seq3.length === 0 ? "oc3" : activePlayerData.seq4.length === 0 ? "oc4" : activePlayerData.seq5.length === 0 ? "oc5" : activePlayerData.seq6.length === 0 ? "oc6" : "oc6" : ""}`}
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
                        <img
                            src={joker_card_holder}
                            alt=""
                            className="joker_card_holder_deal"
                        />
                        <img
                            src={jokerCard}
                            alt=""
                            className="joker_card_min_deal shadow"
                        />
                        {(aceJoker !== "true" && aceJoker !== true) && (
                            <img
                                src={joker_min_on_card}
                                alt=""
                                className="joker_min_on_card_deal"
                            />
                        )}
                    </div>

                    <div className="rightsection-deal">
                        {!dealProb && inGame && inGame.length > 0 && inGame.map((value, index) => (
                            <>
                                {value.playerStatus === 'Dropped' && <span className={`dropped-text drop-text-${index + 1}`}>Dropped</span>}
                                <div className={`deal-slide ${value.playerStatus === 'Dropped' && "deal-slide-dropped"}`}>
                                    <div className={`deal-slide${index + 1} ${value.isActive && 'deal-user-scale-up'}`}>
                                        <div className={`bg${index + 1}`}>
                                            <LazyLoad height={"100%"}>
                                                <img
                                                    src={RPBG}
                                                    alt=""
                                                    className={`rpbg-deal ${activePlayerIndex === index + 1 && "green_underline"}`}
                                                />
                                            </LazyLoad >
                                            <LazyLoad height={"100%"}>
                                                <img
                                                    src={DCBB}
                                                    alt=""
                                                    className="bbg-deal"
                                                />
                                            </LazyLoad >
                                        </div>
                                        <div className={`user${index + 1} user-deal`}>
                                            <LazyLoad height={"100%"}>
                                                <img
                                                    src={`${base_url}${value.playerId.shortphoto}`}
                                                    alt=""
                                                    className="rightuserimgdeal"
                                                />
                                            </LazyLoad >
                                        </div>
                                        <span className={`username user${index + 1}name`}>{value.playerId.name !== undefined && value.playerId.name.split(' ')[0]} {value.playerId.name !== undefined && value.playerId.name.split(' ')[1].charAt(0)}</span>
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
                                        <span className="userpointsdeal">{value.isActive ? activePlayerData.totalPoints : value.totalPoints} <span className="pts">Pts</span></span>
                                    </div>
                                </div>
                            </>
                        ))}

                    </div>

                    {dealProb && (
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

                            {/* <img
                                src={probability[index] === 0 ? strength_10 : probability[index] === oldProbability[index] ? strength_50 : probability[index] > oldProbability[index] ? strength_50 : strength_20}
                                alt=""
                                className={`ppn-hc ppn${index+1}`}
                            /> */}
                            <img
                                src={prob_rect}
                                alt=""
                                className="prob_rect"
                            />

                        </>
                    )}

                </div>
            </>
        );
    }
}