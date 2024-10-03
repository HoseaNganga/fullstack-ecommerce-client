import React from "react";
import Slider from "react-slick";
/* import slider1 from "../../ImageAssets/slider1.jpg";
import slider2 from "../../ImageAssets/slider2.jpg";
import slider3 from "../../ImageAssets/slider3.png"; */
import { useContext } from "react";
import DataContext from "../../DataContext/DataContext";
const HomeBanner = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrow: true,
    autoplay: true,
  };

  const { bannerData } = useContext(DataContext);
  return (
    <div className="homeBannerSection">
      <Slider {...settings}>
        {bannerData &&
          bannerData?.bannerList &&
          bannerData?.bannerList?.length !== 0 &&
          bannerData?.bannerList?.map((banner) => (
            <div className="item" key={banner?._id}>
              <img src={banner?.image} alt="slider1" className="w-100" />
            </div>
          ))}
      </Slider>

      {/*    <Slider {...settings}>
        <div className="item">
          <img src={slider1} alt="slider1" className="w-100" />
        </div>
        <div className="item">
          <img src={slider2} alt="slider2" className="w-100" />
        </div>
        <div className="item">
          <img src={slider3} alt="slider3" className="w-100" />
        </div>
      </Slider> */}
    </div>
  );
};

export default HomeBanner;
