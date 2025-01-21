import React, { useEffect, useState } from "react";
import { getCarouselRes } from "../helper/index";
import '../styles/Carousel.css'


export default function Carousel(){

    const [carousel, setCarousel] = useState({});
    
        async function getCarouselInfo() {
            await getCarouselRes().then(res => {
                setCarousel(res);
            }).catch(err => {
                console.log(err);
            })
        }
    
        useEffect(() => {
            getCarouselInfo();
        }, [])

        const ImgURL = carousel?.image?.url;

  
        return (
       
            <div
              className="carousel-image"
              style={{
                backgroundImage: `url(${ImgURL})`,
              }}
            >
              <h2 className="carousel-title">{carousel?.title}</h2>
      
            <ul className="carousel-features">
              {carousel?.features?.map((item, index) => (
                <li key={index} className="carousel-feature">
                  <img src={item?.image?.url} alt="" />
                  <p>{item?.text}</p>
                </li>
              ))}
            </ul>
          </div>
        );
}


    
  