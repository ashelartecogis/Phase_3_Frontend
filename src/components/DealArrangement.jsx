// import React, { useEffect, useState, useRef, useContext, useCallback } from "react";
// import "./css/DealResult.css";
// import GRC from "../images/grc_logo_new.png";
// import TITLEBOX from "../images/titlebox.png";
// import RC from "../images/rc.svg";
// import CHIP from "../images/chip.svg";
// import CARDDEALBG from "../images/deal_cards_bg.png";
// import CARDDEALTITLEBG from "../images/deal_cards_title_bg.png";
// import CARDDEALBGBLACK from "../images/carddealbgblacknew2.png";
// import BCM from "../images/back_card_min.png";
// import { Cards } from "../constants";
// import LazyLoad from "react-lazyload";
// import { base_url } from "../config";
// import { SocketContext } from "../services/socket";
// export default function DealArrangement(props) {
//     const socket = useContext(SocketContext);
//     const [inGame, setInGame] = useState({});
//     const [allCards, setAllCards] = useState([]);
//     const [width, setWidth] = useState();
//     const [height, setHeight] = useState();
//     const [left1, setLeft1] = useState();
//     const [left2, setLeft2] = useState();
//     const [left3, setLeft3] = useState();
  
//     const [playerPoint1, setPlayerPoint1] = useState(null);
//     const [playerPoint2, setPlayerPoint2] = useState(null);
//     const [playerPoint3, setPlayerPoint3] = useState(null);
//     const [playerPoint4, setPlayerPoint4] = useState(null);
//     const [playerPoint5, setPlayerPoint5] = useState(null);
//     const [playerPoint6, setPlayerPoint6] = useState(null);

//     const [playerChips1, setPlayerChips1] = useState(null);
//     const [playerChips2, setPlayerChips2] = useState(null);
//     const [playerChips3, setPlayerChips3] = useState(null);
//     const [playerChips4, setPlayerChips4] = useState(null);
//     const [playerChips5, setPlayerChips5] = useState(null);
//     const [playerChips6, setPlayerChips6] = useState(null);

//     const [hideChips, setHideChips] = useState(false);

//     const [winningChips, setWinningChips] = useState(0);
//     const [losingChips, setLosingChips] = useState([]);

//     const [scoreCount, setScoreCount] = useState(false);
//     const [playerArrangement, setPlayerArrangement] = useState(false);
//     const [allPlayersPoints, setAllPlayersPoints] = useState([
//         {totalPoints: playerPoint1, totalChips: playerChips1, isWinner: false},
//         {totalPoints: playerPoint2, totalChips: playerChips2, isWinner: false},
//         {totalPoints: playerPoint3, totalChips: playerChips3, isWinner: false},
//         {totalPoints: playerPoint4, totalChips: playerChips4, isWinner: false},
//         {totalPoints: playerPoint5, totalChips: playerChips5, isWinner: false},
//         {totalPoints: playerPoint6, totalChips: playerChips6, isWinner: false},
//     ]);

//     let setScreenTypeCallBack = useCallback((data) => {
//         if(data.playerarrangement === true){
//             setPlayerArrangement(data.playerarrangement);
//             localStorage.setItem("playerArrangement", data.playerarrangement);
//         }
//     }, []);

//     useEffect(() => {
//         if (socket !== undefined) {
//             socket.on("screenType", setScreenTypeCallBack);
//         }
//         return () => {
//             if (socket) {
//               socket.off("screenType", setScreenTypeCallBack);
//             }
//         };

//     }, [socket])

//     function isJokerCard(cardId){
//         let jokerNumber = localStorage.getItem("jokerNumber");
//         let jokerCard = Cards.find(o => o.cardUuid == jokerNumber);
//         // console.log("jokerNumber", jokerNumber);
//         // console.log("jokerCard", jokerCard);
//         let ogCard = Cards.find(o => o.cardUuid == cardId);
        
//         if (ogCard.Value === 'J') {
//             ogCard.Value = 11;
//           }
//           else if (ogCard.Value === 'Q') {
//             ogCard.Value = 12;
//           }
//           else if (ogCard.Value === 'K') {
//             ogCard.Value = 13;
//           }
//           else if (ogCard.Value === 'A') {
//             ogCard.Value = 1;
//           }
      
//           if (jokerCard.Value === 'J') {
//             jokerCard.Value = 11;
//           }
//           else if (jokerCard.Value === 'Q') {
//             jokerCard.Value = 12;
//           }
//           else if (jokerCard.Value === 'K') {
//             jokerCard.Value = 13;
//           }
//           else if (jokerCard.Value === 'A') {
//             jokerCard.Value = 1;
//           }
//         if(jokerCard !== undefined && jokerCard !== null){
//             if(jokerCard.Type !== 'Joker'){
//                 if (ogCard.Value === jokerCard.Value) {
//                 return true;
//                 }
//                 else {
//                 return false;
//                 }
//             }
//             else{
//                 if (ogCard.Value === 1) {
//                 // console.log("og com", ogCard.Value);
//                 return true;
//                 }
//                 else {
//                 return false;
//                 }
//             }
//         }
//     }

//     // useEffect(() => {
//     //     console.log("in use effect");
//     //     if(playerPoint1 !== undefined && playerPoint1 !== null){
//     //         setInterval(() => {
//     //             console.log("in set int");
//     //             setPlayerPoint1(playerPoint1 - 1);
//     //         }, 500);
//     //     }
//     // }, []);

//     useEffect(() => {
//         // let LocalPlayerArrangement = localStorage.getItem('playerArrangement');
//         // localStorage.removeItem('playerArrangement');
//         // if (LocalPlayerArrangement !== undefined) {
//         //     setPlayerArrangement(LocalPlayerArrangement);
//         // }
//         // else {
//         //     setPlayerArrangement(props.playerArrangement);
//         // }
//         if(playerArrangement !== undefined){
//             if(playerArrangement){
//                 let OldInGame = JSON.parse(localStorage.getItem("InGame"));
//                 let NewInGame = OldInGame.sort((a, b) => parseInt(b.playerId.totalChips) - parseInt(a.playerId.totalChips));
//                 setAllPlayersPoints(prevData => {
//                     console.log("prevData", prevData);
//                     const sortedArray = prevData.slice().sort((a, b) => b.totalChips - a.totalChips);
//                     console.log("sortedArray", sortedArray);
//                     return sortedArray;
//                 });
//                 // console.log("setAllPlayersPoints",allPlayersPoints);
//                 cardsDeck(NewInGame)
//             }
//         }

//     }, [playerArrangement]);

//     useEffect(() => {
//         // localStorage.setItem("scoreCount", false);
//         // localStorage.setItem("playerArrangement", false);
        
//         let LocalPlayerArrangement = JSON.parse(localStorage.getItem('playerArrangement'));
//         let LocalScoreCount = JSON.parse(localStorage.getItem('scoreCount'));
//         let LocalInGame = JSON.parse(localStorage.getItem('InGame'));
//         if (LocalInGame !== undefined) {
//             setInGame(LocalInGame);
//         }
//         else {
//             setInGame(props.inGame);
//         }
        
//         if (LocalInGame.length > 0) {
//             let newArrayIngame = LocalInGame.map((val, index) => {
//                 return val.totalPoints
//             });
//             let winnerChips = 0;
//             let chipsArrayIngame = LocalInGame.map((val, index) => {
//                 if(val.playerStatus === 'Winner'){
//                     winnerChips = val.playerId.totalChips
//                 }
//                 return val.playerId.totalChips
//             });
//             // console.log("allplayers referes 2", newArrayIngame)    
//             setPlayerPoint1(newArrayIngame[0]);
//             setPlayerPoint2(newArrayIngame[1]);
//             setPlayerPoint3(newArrayIngame[2]);
//             setPlayerPoint4(newArrayIngame[3]);
//             setPlayerPoint5(newArrayIngame[4]);
//             setPlayerPoint6(newArrayIngame[5]);

//             setPlayerChips1(chipsArrayIngame[0]);
//             setPlayerChips2(chipsArrayIngame[1]);
//             setPlayerChips3(chipsArrayIngame[2]);
//             setPlayerChips4(chipsArrayIngame[3]);
//             setPlayerChips5(chipsArrayIngame[4]);
//             setPlayerChips6(chipsArrayIngame[5]);

//             setAllPlayersPoints([
//                 {totalPoints: newArrayIngame[0], totalChips: chipsArrayIngame[0], isWinner: newArrayIngame[0] == 0 ? true : false},
//                 {totalPoints: newArrayIngame[1], totalChips: chipsArrayIngame[1], isWinner: newArrayIngame[1] == 0 ? true : false},
//                 {totalPoints: newArrayIngame[2], totalChips: chipsArrayIngame[2], isWinner: newArrayIngame[2] == 0 ? true : false},
//                 {totalPoints: newArrayIngame[3], totalChips: chipsArrayIngame[3], isWinner: newArrayIngame[3] == 0 ? true : false},
//                 {totalPoints: newArrayIngame[4], totalChips: chipsArrayIngame[4], isWinner: newArrayIngame[4] == 0 ? true : false},
//                 {totalPoints: newArrayIngame[5], totalChips: chipsArrayIngame[5], isWinner: newArrayIngame[5] == 0 ? true : false},
//             ]);
//             let allChips = parseInt(newArrayIngame[0]) + parseInt(newArrayIngame[1]) + parseInt(newArrayIngame[2]) + parseInt(newArrayIngame[3]) + parseInt(newArrayIngame[4]) + parseInt(newArrayIngame[5]); 
//             setWinningChips(parseInt(allChips) + parseInt(winnerChips));
//             let losingArr = [parseInt(chipsArrayIngame[0]) - newArrayIngame[0], parseInt(chipsArrayIngame[1]) - newArrayIngame[1], parseInt(chipsArrayIngame[2]) - newArrayIngame[2], parseInt(chipsArrayIngame[3]) - newArrayIngame[3], parseInt(chipsArrayIngame[4]) - newArrayIngame[4], parseInt(chipsArrayIngame[5]) - newArrayIngame[5]];
//             setLosingChips(losingArr);
            
//             cardsDeck(LocalInGame)
//         }
        
//     }, []);
//     useEffect(() => {
//         let LocalInGame = JSON.parse(localStorage.getItem('InGame'));
//         if (LocalInGame !== undefined) {
//             setInGame(LocalInGame);
//         }
//         else {
//             setInGame(props.inGame);
//         }
//         // console.log("inGame",inGame)
//         // console.log("localinGame",LocalInGame)
//         if (LocalInGame.length > 0) {
//             // console.log("inGame",inGame)
//             cardsDeck(LocalInGame)
//             // let newInGame = inGame.map((val, index) => {
//             //     return {playerId: val.playerId, cards: [...val.cardSequence1.cards, ...val.cardSequence2.cards, ...val.cardSequence3.cards, ...val.cardSequence4.cards, ...val.cardSequence5.cards]}
//             // });
//             // let newData = newInGame.map((val, index) => {
//             //     return val.cards.map((cval, cindex) => {
//             //         let picked = Cards.find(o => o.cardUuid == cval.cardId);
//             //         return picked.imageURI
//             //     });
//             // });
//             // setAllCards(newData);  
//             // localStorage.setItem('allCards', JSON.stringify(newData));
//             // allCards.map((val, ind) => {
//             //     console.log(val[0]);
//             // });
//             // console.log(allCards[5]);
//         }
//     }, []);
//     const cardsDeck = (inGame) => {
//         let newInGame = inGame.map((val) => {
//             return {
//                 ...val,
//                 seq1: val.cardSequence1.cards.map((cval, cindex) => {
//                     let picked = Cards.find((o) => o.cardUuid == cval.cardId);
//                     let isJoker = isJokerCard(cval.cardId);
//                     if(isJoker){
//                       return picked.imageURI2;
//                     }
//                     else{
//                       return picked.imageURI;
//                     }
//                 }),
//                 seq2: val.cardSequence2.cards.map((cval, cindex) => {
//                     let picked = Cards.find((o) => o.cardUuid == cval.cardId);
//                     let isJoker = isJokerCard(cval.cardId);
//                     if(isJoker){
//                       return picked.imageURI2;
//                     }
//                     else{
//                       return picked.imageURI;
//                     }
//                 }),
//                 seq3: val.cardSequence3.cards.map((cval, cindex) => {
//                     let picked = Cards.find((o) => o.cardUuid == cval.cardId);
//                     let isJoker = isJokerCard(cval.cardId);
//                     if(isJoker){
//                       return picked.imageURI2;
//                     }
//                     else{
//                       return picked.imageURI;
//                     }
//                 }),
//                 seq4: val.cardSequence4.cards.map((cval, cindex) => {
//                     let picked = Cards.find((o) => o.cardUuid == cval.cardId);
//                     let isJoker = isJokerCard(cval.cardId);
//                     if(isJoker){
//                       return picked.imageURI2;
//                     }
//                     else{
//                       return picked.imageURI;
//                     }
//                 }),
//                 seq5: val.cardSequence5.cards.map((cval, cindex) => {
//                     let picked = Cards.find((o) => o.cardUuid == cval.cardId);
//                     let isJoker = isJokerCard(cval.cardId);
//                     if(isJoker){
//                       return picked.imageURI2;
//                     }
//                     else{
//                       return picked.imageURI;
//                     }
//                 }),
//                 seq6: val.cardSequence6.cards.map((cval, cindex) => {
//                     let picked = Cards.find((o) => o.cardUuid == cval.cardId);
//                     let isJoker = isJokerCard(cval.cardId);
//                     if(isJoker){
//                       return picked.imageURI2;
//                     }
//                     else{
//                       return picked.imageURI;
//                     }
//                 }),
//             };
//         });
//         setInGame(newInGame);
//         localStorage.setItem("InGame", JSON.stringify(newInGame));
//     };

    

//     // useEffect(() => {
//     //     let LocalActivePlayer = JSON.parse(localStorage.getItem("ActivePlayer"));
//     //     if(LocalActivePlayer !== undefined && LocalActivePlayer !== null){
//     //         if(LocalActivePlayer.playerStatus === 'Winner'){
//     //             setTimeout(() => {
//     //                 let OldInGame = JSON.parse(localStorage.getItem("NewInGame"));
//     //                 if(OldInGame !== null && OldInGame !== undefined){
//     //                     let NewInGame = OldInGame.map((val, index) => {
//     //                         return {...val, totalPoints: 0}
//     //                     });
//     //                     cardsDeck(NewInGame)
//     //                     setTimeout(() => {
//     //                         let OldInGame = JSON.parse(localStorage.getItem("InGame"));
//     //                         let NewInGame = OldInGame.sort((a, b) => parseInt(b.playerId.totalChips) - parseInt(a.playerId.totalChips));
//     //                         cardsDeck(NewInGame)
//     //                     }, 15000);
//     //                 }
//     //             }, 15000);
//     //         }
//     //     }
//     // }, []);
//     return (
//         <>
//             <div className="fade-in-intro">
//                 <div className="logodiv">
//                     {/* <LazyLoad height={"100%"}>
//                         <img
//                             src={RC}
//                             alt=""
//                             className="rc"
//                         />
//                     </LazyLoad > */}
//                     <LazyLoad height={"100%"}>
//                         <img
//                             src={GRC}
//                             alt=""
//                             className="grc"
//                         />
//                     </LazyLoad >

//                 </div>
//                 <div className="titlebox">
//                     <img
//                         src={TITLEBOX}
//                         alt=""
//                         className="titleboximg"
//                         />
//                     <h4 className="psstitle mb-0">Deal 1</h4>
//                 </div>
//             </div>
//             <div className="maindiv">
//                 <img
//                     src={CARDDEALBGBLACK}
//                     alt=""
//                     className="carddealbgblack"
//                 />
//                 <img
//                     src={CARDDEALTITLEBG}
//                     alt=""
//                     className="carddealtitlebg"
//                 />
//                 <span className="carddealtitle">Deal 1 Results</span>
//                 {inGame && inGame.length > 0 && inGame.map((value, index) => (
//                     <>
//                     {/* {console.log("all", allPlayersPoints)} */}
//                         {value.playerStatus === 'Dropped' && <span className={`res-drop-text res-drop-text-${index + 1}`}>Dropped</span>}
//                         <div className={`cardanres cardanres${index + 1} ${value.playerStatus === 'Dropped' && 'dropped-cardanres dropped-cardanres' + index}`}>
//                             <img
//                                 src={`${base_url}${value.playerId.shortphoto}`}
//                                 alt=""
//                                 className="cduser-res"
//                             />
//                             <span className="cdusername-res">{value.playerId.name.split(' ')[0]}</span>
//                             <span className="cdchips-res"><img
//                                 src={CHIP}
//                                 alt=""
//                                 className="cdchip-res"
//                             />{props.playerArrangement ? value.playerId.totalChips : allPlayersPoints[index].totalChips}</span>






//                             <img
//                                 src={CARDDEALBG}
//                                 alt=""
//                                 className="carddealbgimgres"
//                             />
//                             {/* {!hideChips && <span className="res-pts">{allPlayersPoints[index].totalPoints} <span className="res-pts-key">Pts</span></span>} */}
//                             {/* <div className={`allcards`}> */}
//                             {value.playerStatus === 'Dropped' && (
//                                 <div className="allcards">
//                                     <img
//                                         src={BCM}
//                                         alt=""
//                                         className={`cdcardres6 cdcardres61`}
//                                     />
//                                     <img
//                                         src={BCM}
//                                         alt=""
//                                         className={`cdcardres6 cdcardres62`}
//                                     />
//                                     <img
//                                         src={BCM}
//                                         alt=""
//                                         className={`cdcardres6 cdcardres63`}
//                                     />
//                                     <img
//                                         src={BCM}
//                                         alt=""
//                                         className={`cdcardres6 cdcardres64`}
//                                     />
//                                     <img
//                                         src={BCM}
//                                         alt=""
//                                         className={`cdcardres6 cdcardres65`}
//                                     />
//                                     <img
//                                         src={BCM}
//                                         alt=""
//                                         className={`cdcardres6 cdcardres66`}
//                                     />
//                                     <img
//                                         src={BCM}
//                                         alt=""
//                                         className={`cdcardres6 cdcardres67`}
//                                     />
//                                     <img
//                                         src={BCM}
//                                         alt=""
//                                         className={`cdcardres6 cdcardres68`}
//                                     />
//                                     <img
//                                         src={BCM}
//                                         alt=""
//                                         className={`cdcardres6 cdcardres69`}
//                                     />
//                                     <img
//                                         src={BCM}
//                                         alt=""
//                                         className={`cdcardres6 cdcardres610`}
//                                     />
//                                     <img
//                                         src={BCM}
//                                         alt=""
//                                         className={`cdcardres6 cdcardres611`}
//                                     />
//                                     <img
//                                         src={BCM}
//                                         alt=""
//                                         className={`cdcardres6 cdcardres612`}
//                                     />
//                                     <img
//                                         src={BCM}
//                                         alt=""
//                                         className={`cdcardres6 cdcardres613`}
//                                     />
//                                 </div>
//                             )}
//                             {value.playerStatus !== 'Dropped' && (
//                                 <div className="allcardsbestseq">
//                                     <div className="row">
//                                         <div className="col-auto no-gutters p-1">
//                                             {value.seq1 != undefined && value.seq1.length > 0 && value.seq1.map((value2, vindex) => (
//                                                 <div className="ins-div">
//                                                     <img
//                                                         src={value2}
//                                                         alt=""
//                                                         className={`bestlistimg shadow bestimg${vindex + 1}`}
//                                                     />

//                                                 </div>
//                                             ))}
//                                         </div>
//                                         <div className="col-auto no-gutters p-1">
//                                             {value.seq2 != undefined && value.seq2.length > 0 && value.seq2.map((value2, vindex) => (
//                                                 <div className="ins-div">
//                                                     <img
//                                                         src={value2}
//                                                         alt=""
//                                                         className={`bestlistimg shadow bestimg${vindex + 1}`}
//                                                     />

//                                                 </div>
//                                             ))}
//                                         </div>
//                                         <div className="col-auto no-gutters p-1">
//                                             {value.seq3 != undefined && value.seq3.length > 0 && value.seq3.map((value2, vindex) => (
//                                                 <div className="ins-div">
//                                                     <img
//                                                         src={value2}
//                                                         alt=""
//                                                         className={`bestlistimg shadow bestimg${vindex + 1}`}
//                                                     />

//                                                 </div>
//                                             ))}
//                                         </div>
//                                         <div className="col-auto no-gutters p-1">
//                                             {value.seq4 != undefined && value.seq4.length > 0 && value.seq4.map((value2, vindex) => (
//                                                 <div className="ins-div">
//                                                     <img
//                                                         src={value2}
//                                                         alt=""
//                                                         className={`bestlistimg shadow bestimg${vindex + 1}`}
//                                                     />
//                                                 </div>
//                                             ))}
//                                         </div>
//                                         <div className="col-auto no-gutters p-1">
//                                             {value.seq5 != undefined && value.seq5.length > 0 && value.seq5.map((value2, vindex) => (
//                                                 <div className="ins-div">
//                                                     <img
//                                                         src={value2}
//                                                         alt=""
//                                                         className={`bestlistimg shadow bestimg${vindex + 1}`}
//                                                     />
//                                                 </div>
//                                             ))}
//                                         </div>
//                                         <div className="col-auto no-gutters p-1">
//                                             {value.seq6 != undefined && value.seq6.length > 0 && value.seq6.map((value2, vindex) => (
//                                                 <div className="ins-div">
//                                                     <img
//                                                         src={value2}
//                                                         alt=""
//                                                         className={`bestlistimg shadow bestimg${vindex + 1}`}
//                                                     />
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* </div> */}
//                         </div>
//                     </>
//                 ))}

//             </div>
//         </>
//     );
// }