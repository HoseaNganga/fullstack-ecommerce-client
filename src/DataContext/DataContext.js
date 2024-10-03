import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { fetchDataFromApi } from "../utils/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    id: "",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [cartCount, setCartCount] = useState(0);
  const [wishListCount, setWishListCount] = useState(0);
  const [wishListData, setWishListData] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [selectedCountryValue, setSelectedCountryValue] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [headerFooterShow, setHeaderFooterShow] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [productFeaturedData, setProductFeaturedData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [filteredByCategoryData, setFilteredByCategoryData] = useState([]);
  const [
    subCategoriesFilteredByCategoryData,
    setSubCategoriesFilteredByCategoryData,
  ] = useState([]);
  const [productCategoryId, setProductCategoryId] = useState("");
  const [productDataByCategoryId, setProductDataByCategoryId] = useState([]);
  const [productSubCategoryId, setProductSubCategoryId] = useState("");
  const [productDataBySubCategoryId, setProductDataBySubCategoryId] = useState(
    []
  );
  const [filteredPriceData, setFilteredPriceData] = useState({});
  const [filteredRatingData, setFilteredRatingData] = useState({});
  let [cartFields, setCartFields] = useState({
    productName: "",
    rating: "",
    price: 0,
    productId: "",
    userId: "",
    subtotal: 0,
    images: [],
    quantity: 0,
  });
  const [cartData, setCartData] = useState([]);
  const [bannerData, setBannerData] = useState([]);
  const [allSubcategoriesData, setAllSubcategoriesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResultData, setSearchResultData] = useState({});
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleAccountClose = () => {
    navigate("/mywishlist");
    setAnchorEl(null);
  };

  const handleOrderClose = () => {
    navigate(`/myorders`);
    setAnchorEl(null);
  };

  const handlemyAccountClose = () => {
    navigate(`/account/${user?.id}`);
    setAnchorEl(null);
  };
  const handleLogOut = () => {
    localStorage.clear();
    setAnchorEl(null);
    navigate("/");
    window.location.reload();
    toast.success("Successfully Logged Out..Please Log in ");
  };
  const getCountry = async (url) => {
    await axios.get(url).then((response) => setCountryList(response.data.data));
  };

  //1. Use Effect for necessary data, categoryData,productData and featuredData, Only run on Page Load

  useEffect(() => {
    const scrollToTop = () => window.scrollTo(0, 0);

    // Adding a slight delay to ensure content is loaded
    const delayScroll = () => setTimeout(scrollToTop, 100); // 100ms delay

    delayScroll();

    let isMounted = true; // Track component mount status
    const fetchData = async () => {
      try {
        // Fetch all necessary data
        const fetchCategoryData = await fetchDataFromApi("/api/categories");
        const fetchProductData = await fetchDataFromApi("/api/products");
        const fetchFeaturedProductData = await fetchDataFromApi(
          `/api/products/featured`
        );
        if (isMounted) {
          setCategoryData(fetchCategoryData);
          setProductFeaturedData(fetchFeaturedProductData);
          setProductData(fetchProductData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  //2. useEffect to fetch categoryData if productCategoryId changes

  useEffect(() => {
    const scrollToTop = () => window.scrollTo(0, 0);

    // Adding a slight delay to ensure content is loaded
    const delayScroll = () => setTimeout(scrollToTop, 100); // 100ms delay

    delayScroll();

    let isMounted = true; // Track component mount status

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      if (!productCategoryId) return; // Exit if no categoryId selected

      try {
        const fetchProductsByCategoryId = await fetchDataFromApi(
          `/api/products?categoryId=${productCategoryId}`,
          { signal }
        );
        if (isMounted) {
          setProductDataByCategoryId(fetchProductsByCategoryId);
        }
      } catch (error) {
        if (signal.aborted) {
          console.log("Product fetch aborted");
        } else {
          console.error("Error fetching products by subcategory:", error);
        }
      }
    };
    fetchData();
  }, [productCategoryId]);

  useEffect(() => {
    const scrollToTop = () => window.scrollTo(0, 0);

    // Adding a slight delay to ensure content is loaded
    const delayScroll = () => setTimeout(scrollToTop, 100); // 100ms delay

    delayScroll();

    // Skip the API call if selectedCategoryId is undefined or null
    if (selectedCategoryId === undefined || !selectedCategoryId) {
      console.warn(
        "Skipping API call: selectedCategoryId is undefined or null."
      );
      return; // Exit early if selectedCategoryId is invalid
    }

    const fetchData = async () => {
      try {
        // Fetch data based on the selected category
        const fetchSubCategoriesFilteredByCategory = await fetchDataFromApi(
          `/api/subcategories?categoryId=${selectedCategoryId}`
        );

        setSubCategoriesFilteredByCategoryData(
          fetchSubCategoriesFilteredByCategory
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedCategoryId]); // Only trigger the effect when selectedCategoryId changes

  /* useEffect(() => {
    const scrollToTop = () => window.scrollTo(0, 0);

    // Adding a slight delay to ensure content is loaded
    const delayScroll = () => setTimeout(scrollToTop, 100); // 100ms delay

    delayScroll();

    let isMounted = true; // Track component mount status

    const fetchData = async () => {
      try {
        // Fetch data based on the selected category
        const fetchSubCategoriesFilteredByCategory = selectedCategoryId
          ? await fetchDataFromApi(
              `/api/subcategories?categoryId=${selectedCategoryId}`
            )
          : null;

        // Only update state if component is still mounted
        if (isMounted) {
          setSubCategoriesFilteredByCategoryData(
            fetchSubCategoriesFilteredByCategory
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup to prevent updating state on unmounted component
    };
  }, [selectedCategoryId]); */

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProducts = async () => {
      if (!productSubCategoryId) return; // Exit if no subcategory selected

      try {
        const fetchProductsBySubCategoryId = await fetchDataFromApi(
          `/api/products?subcategoryId=${productSubCategoryId}`,
          { signal }
        );

        setProductDataBySubCategoryId(fetchProductsBySubCategoryId);
      } catch (error) {
        if (signal.aborted) {
          console.log("Product fetch aborted");
        } else {
          console.error("Error fetching products by subcategory:", error);
        }
      }
    };

    fetchProducts();

    return () => {
      controller.abort(); // Cleanup to abort the request if needed
    };
  }, [productSubCategoryId]);
  useEffect(() => {
    window.scrollTo(800, 800);
    const fetchData = async () => {
      try {
        const fetchFilteredByCategoryProductData = await fetchDataFromApi(
          `/api/products?catName=${selectedCategory}`
        );
        setFilteredByCategoryData(fetchFilteredByCategoryProductData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [selectedCategory]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null && token !== "" && token !== undefined) {
      setIsLoggedIn(true);
      const userObjParsed = JSON.parse(localStorage.getItem("user"));
      setUser({
        name: userObjParsed?.name,
        email: userObjParsed?.email,
        id: userObjParsed?.userId,
      });
    } else {
      setIsLoggedIn(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          const fetchCartCount = await fetchDataFromApi(
            `/api/cart/get/count?userId=${user?.id}`
          );
          setCartCount(fetchCartCount?.cartCount);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [cartCount, user?.id]);
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const bannerData = await fetchDataFromApi(`/api/banner`);
        setBannerData(bannerData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBannerData();
  }, []);
  useEffect(() => {
    const fetchAllSubcategories = async () => {
      try {
        const fetchSubCategoriesData = await fetchDataFromApi(
          `/api/subcategories`
        );
        setAllSubcategoriesData(fetchSubCategoriesData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllSubcategories();
  }, []);

  useEffect(() => {
    getCountry("https://countriesnow.space/api/v0.1/countries");
  }, []);

  return (
    <DataContext.Provider
      value={{
        countryList,
        headerFooterShow,
        setHeaderFooterShow,
        isLoggedIn,
        setIsLoggedIn,
        categoryData,
        setCategoryData,
        productFeaturedData,
        setProductFeaturedData,
        productData,
        setProductData,
        selectedCategory,
        setSelectedCategory,
        filteredByCategoryData,
        setFilteredByCategoryData,
        setSelectedCategoryId,
        selectedCategoryId,
        subCategoriesFilteredByCategoryData,
        setSubCategoriesFilteredByCategoryData,
        setProductCategoryId,
        productDataByCategoryId,
        setProductSubCategoryId,
        productDataBySubCategoryId,
        setProductDataBySubCategoryId,
        filteredPriceData,
        setFilteredPriceData,
        filteredRatingData,
        setFilteredRatingData,
        setProductDataByCategoryId,
        user,
        handleClick,
        handleClose,
        handleLogOut,
        open,
        anchorEl,
        cartFields,
        setCartFields,
        cartCount,
        setCartCount,
        cartData,
        setCartData,
        wishListCount,
        setWishListCount,
        wishListData,
        setWishListData,
        handleAccountClose,
        selectedCountryValue,
        setSelectedCountryValue,
        handleOrderClose,
        bannerData,
        allSubcategoriesData,
        searchTerm,
        setSearchTerm,
        searchResultData,
        setSearchResultData,
        handlemyAccountClose,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
