import React from "react";
import { Typography, Button } from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import Slider from "react-slick";
import BestSellerItem from "../ProductItem/ProductItem";

const RelatedProducts = ({ relatedProducts }) => {
  const productSliderOptions = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
  };
  return (
    <>
      <div className="d-flex align-items-center justify-content-between ">
        <div className="info w-75 mb-2 ">
          <Typography
            variant="h5"
            sx={{ textTransform: "uppercase" }}
            className="mb-0"
            fontWeight={"600"}
          >
            related products
          </Typography>
          <Typography variant="body2" color={"gray"} className="mb-0">
            Do not miss the current offers until the end of August
          </Typography>
        </div>
        <Button
          endIcon={<ArrowRightAltIcon />}
          variant="outlined"
          color="secondary"
          sx={{
            color: "black",
            fontSize: "12px",
            width: "120px",
            height: "auto",
            borderRadius: "30px",
          }}
          size="small"
        >
          View All
        </Button>
      </div>
      <div className=" w-100  ">
        <Slider {...productSliderOptions}>
          {relatedProducts &&
            relatedProducts?.length > 0 &&
            relatedProducts?.map((featured, index) => (
              <BestSellerItem featured={featured} key={index} />
            ))}
        </Slider>
      </div>
    </>
  );
};

export default RelatedProducts;
