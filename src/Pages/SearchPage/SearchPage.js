import React, { useContext, useEffect, useState } from "react";
import { ProductCategorySidebarCopy, ProductItem } from "../../Components";
import categorybanner2 from "../../ImageAssets/categorybanner2.PNG";
import MenuIcon from "@mui/icons-material/Menu";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import CasinoIcon from "@mui/icons-material/Casino";
import { Button, ButtonGroup, Menu, MenuItem, Pagination } from "@mui/material";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import DataContext from "../../DataContext/DataContext";

const SearchPage = () => {
  const {
    productDataBySubCategoryId,
    filteredPriceData,
    filteredRatingData,
    setFilteredPriceData,
    setFilteredRatingData,
    setProductDataBySubCategoryId,
    searchResultData,
  } = useContext(DataContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [displayProductData, setDisplayProductData] = useState([]);
  const [listValue, setListValue] = useState("");
  const [productView, setProductView] = useState("four");
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e) => {
    setListValue(e.target.innerText);
    setAnchorEl(null);
  };

  useEffect(() => {
    // Reset all filters when searchResultData changes
    if (searchResultData) {
      setFilteredRatingData({});
      setFilteredPriceData({});
      setProductDataBySubCategoryId({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResultData]);

  useEffect(() => {
    // Display filtered data when available
    if (filteredRatingData && filteredRatingData?.productList?.length > 0) {
      setDisplayProductData(filteredRatingData?.productList);
    } else if (
      filteredPriceData &&
      filteredPriceData?.productList?.length > 0
    ) {
      setDisplayProductData(filteredPriceData?.productList);
    } else if (
      productDataBySubCategoryId &&
      productDataBySubCategoryId?.productList?.length > 0
    ) {
      setDisplayProductData(productDataBySubCategoryId.productList);
    }
  }, [filteredRatingData, filteredPriceData, productDataBySubCategoryId]);

  useEffect(() => {
    // If no filters are applied, display the category data
    if (
      (!filteredRatingData?.productList ||
        filteredRatingData.productList.length === 0) &&
      (!filteredPriceData?.productList ||
        filteredPriceData.productList.length === 0) &&
      (!productDataBySubCategoryId?.productList ||
        productDataBySubCategoryId.productList.length === 0) &&
      searchResultData?.productList?.length > 0
    ) {
      setDisplayProductData(searchResultData?.productList);
    }
  }, [
    filteredRatingData,
    filteredPriceData,
    productDataBySubCategoryId,
    searchResultData,
  ]);

  return (
    <>
      <section className="productListingPage">
        <div className="container">
          <div className="productListing d-flex">
            <ProductCategorySidebarCopy />
            <div className="contentRight">
              <img
                src={categorybanner2}
                alt="Category banner2"
                className="w-100"
              />
              <div className="showBy mt-3 mb-3 d-flex align-items-center">
                <ButtonGroup color="secondary" variant="filled">
                  <Button onClick={() => setProductView("one")}>
                    <MenuIcon sx={{ color: "gray" }} />
                  </Button>
                  <Button onClick={() => setProductView("two")}>
                    <CasinoIcon sx={{ color: "gray" }} />
                  </Button>
                  <Button onClick={() => setProductView("three")}>
                    <GridViewIcon sx={{ color: "gray" }} />
                  </Button>
                  <Button onClick={() => setProductView("four")}>
                    <ViewCompactIcon sx={{ color: "gray" }} />
                  </Button>
                </ButtonGroup>
                <div className="ml-auto">
                  <Button
                    sx={{ color: "gray" }}
                    endIcon={<KeyboardArrowDown />}
                    variant="outlined"
                    id="basic-button"
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                  >
                    Show {listValue === "" ? "9" : listValue}
                  </Button>
                  <Menu
                    id="basic-menu"
                    className="w-100"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem onClick={handleClose}>12</MenuItem>
                    <MenuItem onClick={handleClose}>14</MenuItem>
                    <MenuItem onClick={handleClose}>18</MenuItem>
                  </Menu>
                </div>
              </div>
              <div className="categoryItemList d-flex">
                {displayProductData?.map((featured, index) => (
                  <ProductItem
                    itemView={productView}
                    featured={featured}
                    key={index}
                  />
                ))}
              </div>
              <br />
              <div className="d-flex align-items-center justify-content-center mt-5">
                <Pagination count={10} color="primary" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SearchPage;
