import React from "react";
import "./css/IntroBannerCss.css";
// import LOGO_BACKDROP from "../images/logobgglow.png";
// import GRC from "../images/svg/grcb.svg";
// import RC from "../images/svg/rcb.svg";
import LOGO from "../images/winner_banner.png";
import LazyLoad from "react-lazyload";

export default function WinnerBanner() {

  return (
    <>
      <div className="maindiv">
        <div className="text-center mx-auto backdropw">
          <div className="fade-in-banner">
              {/* <LazyLoad height={"100%"}> */}
                <img
                  src={LOGO}
                  alt=""
                  className="winnerimgbanner"
                />
              {/* </LazyLoad > */}
          </div>
        </div>
      </div>
    </>
  );
}
