import React, { useEffect, useState } from "react";
import "./css/PlayerSittingPositions.css";
import GRC from "../images/grc_logo_new.png";
import TITLEBOX from "../images/titlebox.png";
import RC from "../images/rc.svg";
import DIMG from "../images/d.png";
import DBLACK from "../images/dblack.png";
import LazyLoad from "react-lazyload";
import { base_url } from "../config";
import REDTABLE from "../images/green_table_new.png";
import GREENTABLE from "../images/green_table.png";
import PSP from "../images/player_sitting_position.png";
import PPN from "../images/playerpositionname.png";
import PPC from "../images/playerpositionchips.png";
import C1 from "../images/1.png";
import C2 from "../images/2.png";
import C3 from "../images/3.png";
import C4 from "../images/4.png";
import C5 from "../images/5.png";
import C6 from "../images/6.png";
import CHIP from "../images/chip.png";
export default function PlayerSittingPositions(props) {
    const [dealNumberCount, setDealNumberCount] = useState(1);
    const [playerPosition, setplayerPosition] = useState([]);
    useEffect(() => {
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
    // let countImgs = [C1, C2, C3, C4, C5, C6];
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
                    {/* <img
                        src={TITLEBOX}
                        alt=""
                        className="titleboximg"
                        /> */}
                    {/* <h4 className="psstitle mb-0">Deal {dealNumberCount}</h4> */}
                </div>
            </div>
            <div className="psmaindiv">
                <div class="psp_out">
                    <img
                        src={PSP}
                        alt=""
                        className="psp"
                    />
                </div>
                <div className="dimg_out dimg-psp">
                    <img
                        src={DIMG}
                        alt=""
                        className="dimg"
                    />
                </div>
                {playerPosition && playerPosition.length > 0 && playerPosition.map((value, index) => (
                    <>
                        <img
                            src={`${base_url}${value.playerId.shortphoto}`}
                            alt=""
                            className={`cdu${index + 1} cdu`}
                        />
                        <div className={`cnums_global cnums${index + 1}`}>
                            {/* <img
                                src={`${countImgs[index]}`}
                                alt=""
                                className={`c${index + 1}`}
                            /> */}
                            <img
                                src={PPN}
                                alt=""
                                className={`ppn ppn${index + 1}`}
                            />
                            <span className={`ppname ppname${index + 1}`}>{value.playerId.name.split(' ')[0]}</span>
                            {/* <span className={`ppchips ppchips${index + 1}`}>
                                <img
                                    src={CHIP}
                                    alt=""
                                    className={`pschip pschip${index + 1}`}
                                />
                                <span className={`ppchipcount ppchipcount${index + 1}`}>960</span></span> */}
                            {/* <img
                                src={PPC}
                                alt=""
                                className={`ppc ppc${index + 1}`}
                            /> */}
                        </div>
                    </>
                ))}
                {/* <div className="dblack_out">
                    <img
                        src={DBLACK}
                        alt=""
                        className="dblack"
                    />
                </div> */}
                {<div class="flip-table">
                    <div class="inner">
                        <div class="front">
                            <img
                                src={REDTABLE}
                                alt=""
                                className="redtablesitting"
                            />
                        </div>
                        <div class="back">
                            <img
                                src={GREENTABLE}
                                alt=""
                                className="greentablesitting"
                                style={{
                                    marginTop:"100px",
                                }}
                            />
                        </div>
                    </div>
                </div>}
            </div>
        </>
    );
}