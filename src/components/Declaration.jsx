import React, { useEffect, useState } from "react";

import "./css/Declaration.css";
import GRC from "../images/grc_logo_new.png";
import TITLEBOX from "../images/titlebox.png";
import RC from "../images/rc.svg";
import declaretext from "../images/declaretext.png";

import LazyLoad from "react-lazyload";
import { base_url } from "../config";
export default function Declaration(props) {
  const [dealNumberCount, setDealNumberCount] = useState(1);
  useEffect(() => {
    let localDealNo = localStorage.getItem('dealNumberCount')
    if(localDealNo !== undefined && localDealNo !== null){
        setDealNumberCount(localDealNo)
    }
    else{
        setDealNumberCount(props.dealNumberCount)
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
        <div className="declaretext-out">
          <img
                  src={declaretext}
                  alt=""
                  className="declaretext"
                />
          </div>
        </div>
    </>
  );
}