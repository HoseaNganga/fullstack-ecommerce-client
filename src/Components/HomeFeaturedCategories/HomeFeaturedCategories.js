import React from "react";
import Slider from "react-slick";
import { Typography } from "@mui/material";
import noCategory from "../../ImageAssets/nocategory.png";

const HomeFeaturedCategories = ({ categoryData }) => {
  const catSliderOptions = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
  };

  return (
    <section className="featuredHomeCategories">
      <div className="container">
        <Typography
          variant="h5"
          textTransform={"capitalize"}
          className="mb-2"
          fontWeight={"600"}
        >
          featured categories:
        </Typography>
        {categoryData?.categoryList?.length === 0 && (
          <div className="d-flex align-items-center justify-content-center">
            <img
              src={noCategory}
              alt="NoData "
              height={"250px"}
              style={{
                objectFit: "contain",
              }}
            />
          </div>
        )}

        <Slider {...catSliderOptions}>
          {categoryData?.length !== 0 &&
            categoryData?.categoryList?.length !== 0 &&
            categoryData?.categoryList?.map((category) => (
              <div
                className="item mr-4 "
                style={{ "--dynamic-color": category?.color }}
                key={category?._id}
              >
                <img
                  src={category?.images[0]}
                  alt={category?.name}
                  height={"100px"}
                />
                <Typography
                  variant="subtitle2"
                  textTransform={"capitalize"}
                  fontWeight={"600"}
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {category?.name}
                </Typography>
              </div>
            ))}
        </Slider>
      </div>
    </section>
  );
};

export default HomeFeaturedCategories;
