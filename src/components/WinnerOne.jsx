import React, { useEffect, useState } from "react";
import "./css/IntroBannerCss.css";
// import LOGO_BACKDROP from "../images/logobgglow.png";
// import GRC from "../images/svg/grcb.svg";
// import RC from "../images/svg/rcb.svg";
import BG from "../images/winner_one_bg.png";
import CUP from "../images/winner_one_cup.png";
import USER1 from "../images/user1.png";
import LazyLoad from "react-lazyload";
import { base_url } from "../config";
import prizeList from "../images/prizeList.png";
export default function WinnerOne(props) {
  const [inGame, setInGame] = useState({});

  useEffect(() => {
    let LocalInGame = JSON.parse(localStorage.getItem("InGame"));
    if (props.inGame !== undefined) {
      setInGame(props.inGame);
    } else {
      setInGame(LocalInGame);
    }
    console.log("ingame", inGame);
  }, []);

  return (
    <>
      <div>
        <img src={prizeList} className="prizelistimg" alt="" />
      </div>
    </>
  );
}
