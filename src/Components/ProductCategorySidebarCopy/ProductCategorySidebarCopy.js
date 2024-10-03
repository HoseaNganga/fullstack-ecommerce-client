import { Radio, RadioGroup, Rating, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import categorysidebarbanner from "../../ImageAssets/categorysidebar-banner.gif";
import DataContext from "../../DataContext/DataContext";
import { fetchDataFromApi } from "../../utils/api";
import debounce from "lodash/debounce";

const ProductCategorySidebarCopy = () => {
  const {
    setProductSubCategoryId,
    productSubCategoryId,
    setFilteredPriceData,
    setFilteredRatingData,
    allSubcategoriesData,
  } = useContext(DataContext);
  const [value, setValue] = useState([0, 6000]);
  const [subcatId, setSubCatId] = useState("");
  const handleChange = (e) => {
    setProductSubCategoryId(e.target.value);
    setSubCatId(e.target.value);
  };
  const filterByRating = async (rating) => {
    try {
      const resp = await fetchDataFromApi(
        `/api/products?rating=${rating}&subcategoryId=${subcatId}`
      );
      setFilteredRatingData(resp);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPriceFilteredData = async (minPrice, maxPrice) => {
    try {
      const response = await fetchDataFromApi(
        `/api/products?minPrice=${minPrice}&maxPrice=${maxPrice}&subcategoryId=${subcatId}`
      );
      setFilteredPriceData(response);
    } catch (error) {
      console.error("Error fetching price-filtered data:", error);
    }
  };

  // Remove useCallback and debounce directly
  const debouncedFetchData = debounce((minPrice, maxPrice, categoryId) => {
    fetchPriceFilteredData(minPrice, maxPrice, categoryId);
  }, 1000);

  const handleSliderChange = (event) => {
    setValue([event[0], event[1]]);
    debouncedFetchData(event[0], event[1], subcatId); // Trigger debounced fetch
  };
  return (
    <>
      <div className="productCategorySidebar">
        <div className="sticky">
          <div className="filterBox">
            <Typography
              variant="subtitle2"
              fontWeight={600}
              textTransform={"uppercase"}
              gutterBottom
            >
              product sub-categories
            </Typography>
            <div className="scrollCategories">
              <RadioGroup
                name="radio-buttons-group"
                aria-labelledby="demo-radio-buttons-group-label"
                value={productSubCategoryId}
                onChange={handleChange}
              >
                {allSubcategoriesData &&
                  allSubcategoriesData?.subCategoryList?.length !== 0 &&
                  allSubcategoriesData &&
                  allSubcategoriesData?.subCategoryList?.map((subcat) => (
                    <FormControlLabel
                      key={subcat?._id}
                      control={
                        <Radio
                          size="small"
                          color="secondary"
                          value={subcat?._id}
                        />
                      }
                      label={subcat?.subcategory}
                    />
                  ))}
              </RadioGroup>
            </div>
          </div>
          <div className="filterBox">
            <Typography
              variant="subtitle2"
              fontWeight={600}
              textTransform={"uppercase"}
              gutterBottom
              marginBottom={2}
            >
              filter by price
            </Typography>
            <RangeSlider
              value={value}
              onInput={handleSliderChange}
              min={0}
              max={6000}
              step={5}
            />
            <div className="d-flex pt-2 pb-2 priceRange">
              <Typography variant="caption" fontWeight={600}>
                From: ${value[0]}{" "}
              </Typography>
              <Typography
                variant="caption"
                fontWeight={600}
                className="ml-auto"
              >
                To: ${value[1]}
              </Typography>
            </div>
          </div>
          <div className="filterBox">
            <Typography
              variant="subtitle2"
              fontWeight={600}
              textTransform={"uppercase"}
              gutterBottom
            >
              product status
            </Typography>
            <div className="scrollCategories">
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox size="small" color="secondary" />}
                  label="In Stock"
                />
                <FormControlLabel
                  control={<Checkbox size="small" color="secondary" />}
                  label="On Sale"
                />
              </FormGroup>
            </div>
          </div>
          <div className="filterBox">
            <Typography
              variant="subtitle2"
              fontWeight={600}
              textTransform={"uppercase"}
              gutterBottom
            >
              Filter By Rating
            </Typography>
            <div className="scrollCategories p-0">
              <ul>
                <li onClick={() => filterByRating(5)}>
                  <Rating value={5} readOnly name="readonly" size="small" />
                </li>
                <li onClick={() => filterByRating(4)}>
                  <Rating value={4} readOnly name="readonly" size="small" />
                </li>
                <li onClick={() => filterByRating(3)}>
                  <Rating value={3} readOnly name="readonly" size="small" />
                </li>
                <li onClick={() => filterByRating(2)}>
                  <Rating value={2} readOnly name="readonly" size="small" />
                </li>
                <li onClick={() => filterByRating(1)}>
                  <Rating value={1} readOnly name="readonly" size="small" />
                </li>
              </ul>
            </div>
          </div>
          <br />
          <div className="categorySideBanner">
            <img
              src={categorysidebarbanner}
              alt="categorysidebarbanner"
              className="w-100"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCategorySidebarCopy;
