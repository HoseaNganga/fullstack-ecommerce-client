import React, { useContext } from "react";
import {
  BestSeller,
  HomeBanner,
  HomeFeaturedCategories,
  NewsLetter,
} from "../../Components";
import DataContext from "../../DataContext/DataContext";

const Home = () => {
  const {
    categoryData,
    productFeaturedData,
    productData,
    setSelectedCategory,
    filteredByCategoryData,
  } = useContext(DataContext);
  return (
    <>
      <HomeBanner />
      <HomeFeaturedCategories categoryData={categoryData} />
      <BestSeller
        productFeaturedData={productFeaturedData}
        productData={productData}
        categoryData={categoryData}
        setSelectedCategory={setSelectedCategory}
        filteredByCategoryData={filteredByCategoryData}
      />
      <NewsLetter />
    </>
  );
};

export default Home;
