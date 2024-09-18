import React from 'react'
import User from "../SVG/user.svg";
import LazyLoad from "react-lazyload";
import Chip from "../images/chip.png";
import { base_url } from '../config';

export default function PlayerCard({left, top, right, id, htop, hleft, hid, hdata, playername, photo}) {
  return (
    <div className="" id={id} style={{width: "150px", border: "1px solid #FE2020", borderRadius: "5%", position: "absolute", left: left, top: top, right: right, zIndex: "1000"}}>
      <div className="" style={{backgroundColor: "transparent", boxShadow: "inset 0 0 0 1000px rgba(0,0,0,.7)"}}>
        <LazyLoad height={"100%"}>
          <h1 className='mb-0 text-white' id={hid} style={{zIndex: "10000", position: "absolute", fontWeight: "bold", top: htop, left: hleft}}>{hdata}</h1>
          <img
            src={`${base_url}${photo}`}
            alt=""
            className='w-100'
          />
        </LazyLoad>
        <div className="cf pt-1 pb-1 text-center">
        <p className='mb-0 text-white'>{playername}</p>
        <p className='mb-0 text-white'><img
            src={Chip}
            alt=""
            className='my-auto'
          />960</p>
      </div>
      </div>
    </div >
  )
}