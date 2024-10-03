import React, { useRef } from "react";
import Slider from "react-slick";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";

const ProductZoom = ({ viewProductData }) => {
  const zoomSliderBig = useRef(null);
  const zoomSlider = useRef(null);
  const settings3 = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: false,
    arrows: true,
  };
  const settings2 = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    fade: false,
    arrows: true,
  };
  const goto = (index) => {
    zoomSlider.current.slickGoTo(index);
    zoomSliderBig.current.slickGoTo(index);
  };
  return (
    <>
      <div className="productZoom position-relative">
        <div className="badge badge-primary ml-1 ">
          {viewProductData?.productItem?.discount}%
        </div>
        <Slider {...settings3} className="zoomSliderBig" ref={zoomSliderBig}>
          {viewProductData &&
            viewProductData?.productItem?.length !== 0 &&
            viewProductData?.productItem?.images?.length !== 0 &&
            viewProductData?.productItem?.images?.map((image, index) => (
              <div className="item" key={index}>
                <InnerImageZoom
                  zoomType="hover"
                  zoomScale={1}
                  src={image}
                  className="w-100  "
                />
              </div>
            ))}
        </Slider>
      </div>
      <Slider {...settings2} className="zoomSlider" ref={zoomSlider}>
        {viewProductData &&
          viewProductData?.productItem?.length !== 0 &&
          viewProductData?.productItem?.images?.length !== 0 &&
          viewProductData?.productItem?.images?.map((image, index) => (
            <div className="item" key={index}>
              <img
                src={image}
                className="w-100"
                alt=""
                onClick={() => goto(index)}
              />
            </div>
          ))}
      </Slider>
    </>
  );
};

export default ProductZoom;
