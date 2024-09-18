import React from "react";
import styled, { keyframes } from 'styled-components';
import { swing, fadeIn } from 'react-animations';

import "./css/IntroBannerCss.css";
// import LOGO_BACKDROP from "../images/logobgglow.png";
// import GRC from "../images/svg/grcb.svg";
// import RC from "../images/svg/rcb.svg";
import LOGO from "../images/logo_group.png";
import LazyLoad from "react-lazyload";
const bounceAnimation = keyframes`${swing}`;

const BouncyDiv = styled.div`
  animation: 1s ${bounceAnimation};
  position: absolute;
  top: 49.4%;
  right: 4.69%;
  bottom: 21.53%;
  width: 30%;
`;

export default function IntroBanner() {

  return (
    <>
      <div className="maindiv">
        <div className="text-center mx-auto backdrop">
          <div className="fade-in-banner">
            <div className="fade-out-banner">
              {/* <LazyLoad height={"100%"}>
                <img
                  src={LOGO_BACKDROP}
                  alt=""
                  className="intro_logo_backdrop"
                />
              </LazyLoad >
              <LazyLoad height={"100%"}>
                <img
                  src={RC}
                  alt=""
                  className="introrc"
                />
              </LazyLoad > */}
              <LazyLoad height={"100%"}>
                <img
                  src={LOGO}
                  alt=""
                  className="introgrc"
                />
              </LazyLoad >
            </div>
          </div>
        </div>
      </div>
    </>
  );
}