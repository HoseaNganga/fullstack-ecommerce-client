import React, { useEffect, useState } from "react";
import bestsellerbanner1 from "../../ImageAssets/bestsellerbanner1.PNG";
import bestsellerbanner2 from "../../ImageAssets/bestsellerbanner2.PNG";
import bestsellerbanner3 from "../../ImageAssets/bestsellerbanner3.PNG";
import bestsellerbanner4 from "../../ImageAssets/bestsellerbanner4.PNG";
import { Button, Typography, Tab, Tabs } from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import Slider from "react-slick";
import BestSellerItem from "../ProductItem/ProductItem";
import nodata from "../../ImageAssets/noproduct.jpg";

const BestSeller = ({
  productFeaturedData,
  productData,
  categoryData,
  setSelectedCategory,
  filteredByCategoryData,
}) => {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const selectCategory = (cat) => {
    setSelectedCategory(cat);
  };
  const productSliderOptions = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };
  const productSliderOptions2 = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3, // Adjust based on how many items you want to show per row
    slidesToScroll: 1,
    rows: 2, // Number of rows
    slidesPerRow: 1, // Number of slides per row
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          rows: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          rows: 2,
        },
      },
    ],
  };
  const [displayProducts, setDisplayProducts] = useState([]);

  // UseEffect to set products based on category or featured data
  const handleProductData = () => {
    setDisplayProducts(productFeaturedData?.productList);
  };
  useEffect(() => {
    if (
      filteredByCategoryData?.length !== 0 &&
      filteredByCategoryData?.productList?.length !== 0
    ) {
      setDisplayProducts(filteredByCategoryData?.productList || []);
    } else {
      setDisplayProducts(productFeaturedData?.productList || []);
    }
  }, [filteredByCategoryData, productFeaturedData]);

  return (
    <>
      <section className="bestSeller">
        <div className="container">
          <div className="row ">
            <div className="col-md-3">
              <div className="sticky">
                <div className="banner">
                  <img
                    src={bestsellerbanner1}
                    className="cursor w-100 h-auto"
                    alt=""
                  />
                </div>
                <div className="banner mt-4 ">
                  <img
                    src={bestsellerbanner2}
                    className="cursor w-100 h-auto"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="col-md-9 ">
              <div className="d-flex align-items-center justify-content-between ">
                <div className="info w-100 mb-2 ">
                  <Typography
                    variant="h5"
                    sx={{ textTransform: "uppercase" }}
                    className="mb-0 "
                    fontWeight={"600"}
                  >
                    Featured Products
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
                  onClick={handleProductData}
                >
                  View All
                </Button>
              </div>
              <div className="mb-2 ">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  className="filterTabs"
                  scrollButtons="auto"
                  variant="scrollable"
                >
                  {categoryData?.length !== 0 &&
                    categoryData?.categoryList?.length !== 0 &&
                    categoryData?.categoryList?.map((category) => (
                      <Tab
                        key={category?._id}
                        label={category?.name}
                        onClick={() => selectCategory(category?.name)}
                      />
                    ))}
                </Tabs>
              </div>

              {productData?.productList?.length === 0 && (
                <div className="d-flex align-items-center justify-content-center">
                  <img
                    src={nodata}
                    alt="NoData "
                    height={"250px"}
                    style={{
                      objectFit: "contain",
                    }}
                  />
                </div>
              )}

              <div className=" w-100  ">
                <Slider {...productSliderOptions}>
                  {displayProducts.map((featured, index) => (
                    <BestSellerItem featured={featured} key={index} />
                  ))}
                </Slider>
              </div>
              <div className="d-flex align-items-center justify-content-between mt-4 ">
                <div className="info w-75 mb-2 ">
                  <Typography
                    variant="h5"
                    sx={{ textTransform: "uppercase" }}
                    className="mb-0"
                    fontWeight={"600"}
                  >
                    new products
                  </Typography>
                  <Typography variant="body2" color={"gray"} className="mb-0">
                    New products with updated stocks
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
              {productData?.productList?.length === 0 && (
                <div className="d-flex align-items-center justify-content-center">
                  <img
                    src={nodata}
                    alt="NoData "
                    height={"250px"}
                    style={{
                      objectFit: "contain",
                    }}
                  />
                </div>
              )}

              <div className=" w-100 ">
                <Slider {...productSliderOptions2}>
                  {productData?.length !== 0 &&
                    productData?.productData?.productList?.length !== 0 &&
                    productData?.productList?.map((featured, index) => (
                      <BestSellerItem featured={featured} key={index} />
                    ))}
                </Slider>
              </div>
              <div className="d-flex mt-4 mb-5 lowerBanners">
                <div className="banner">
                  <img src={bestsellerbanner3} alt="banner3" />
                </div>
                <div className="banner ">
                  <img src={bestsellerbanner4} alt="banner4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BestSeller;
