import { Typography, Rating, Button, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { ProductZoom, QuantityBox, RelatedProducts } from "../../Components";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useParams } from "react-router-dom";
import { fetchDataFromApi, postData } from "../../utils/api";
import DataContext from "../../DataContext/DataContext";
import toast from "react-hot-toast";
import { format } from "date-fns";

const ProductDetailPage = () => {
  const { user, setCartCount, setWishListCount } = useContext(DataContext);
  const { id } = useParams();
  const [quantityNumber, setQuantityNumber] = useState(1);
  const [viewProductData, setViewProductData] = useState({});
  const [activeSize, setActiveSize] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeColor, setActiveColor] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [activeTabs, setActiveTabs] = useState(0);
  const [productData, setProductData] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewFormFields, setReviewFormFields] = useState({
    productId: productData ? productData._id : "",
    customerId: user ? user?.id : "",
    customerName: "",
    rating: "",
    review: "",
  });
  const [reviewData, setReviewData] = useState([]);

  const changeInputFields = (e) => {
    setReviewFormFields({
      ...reviewFormFields,
      [e.target.name]: e.target.value,
    });
  };

  const minusFunc = () => {
    if (quantityNumber > 1) {
      setQuantityNumber(quantityNumber - 1);
    }
  };

  const plusFunc = () => {
    setQuantityNumber(quantityNumber + 1);
  };

  const sizeActive = ({ index, size }) => {
    setActiveSize(index);
    setSelectedSize(size?.productsize);
  };

  const colorActive = ({ index, color }) => {
    setActiveColor(index);
    setSelectedColor(color);
  };

  const handleAddToCart = async (productData) => {
    // Check if productData is valid
    if (!productData) {
      console.error("No product data provided");
      toast.error("Product data is required to add to cart.");
      return; // Exit early if no product data
    }

    if (!user || !user.id || !user.name || !user.email) {
      return toast.error("Please log in to add items to Cart");
    }

    // Create the cart item object directly
    const cartItem = {
      productName: productData?.name,
      rating: productData?.rating,
      price: productData?.newprice,
      productId: productData?._id,
      userId: user?.id, // Assuming user is from context
      quantity: quantityNumber, // Assuming this is defined elsewhere
      subtotal: parseInt(productData?.newprice * quantityNumber),
      images: [productData?.images[0]], // Assuming first image is used
    };

    if (selectedSize !== "") {
      cartItem.productSize = selectedSize;
    }
    if (selectedColor !== "") {
      cartItem.productColor = selectedColor;
    }
    // Promise for async operation with toast feedback
    const addToCartPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await postData("/api/cart/add", cartItem);
        console.log(response);

        if (response.success) {
          // After successfully adding item, fetch the updated cart count
          const updatedCartCount = await fetchDataFromApi(
            `/api/cart/get/count?userId=${user?.id}`
          );
          setCartCount(updatedCartCount?.cartCount); // Update cart count
          resolve();
        } else {
          reject(new Error(response.error || "An error occurred"));
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });

    // Show loading/success/error feedback with toast
    toast.promise(addToCartPromise, {
      loading: "Cart Item is being Created...",
      success: "Item added to Cart Successfully",
      error: (err) => `${err?.message || "An unexpected error occurred"}`,
    });
  };
  const handleAddToWishList = async (productData) => {
    // Check if productData is valid
    if (!productData) {
      console.error("No product data provided");
      toast.error("Product data is required to add to cart.");
      return; // Exit early if no product data
    }

    if (!user || !user.id || !user.name || !user.email) {
      return toast.error("Please log in to add items to your wishlist");
    }

    // Create the cart item object directly
    const wishListItem = {
      productName: productData?.name,
      rating: productData?.rating,
      price: productData?.newprice,
      productId: productData?._id,
      userId: user?.id, // Assuming user is from context
      quantity: quantityNumber, // Assuming this is defined elsewhere
      subtotal: parseInt(productData?.newprice * quantityNumber),
      images: [productData?.images[0]], // Assuming first image is used
    };

    if (selectedSize !== "") {
      wishListItem.productSize = selectedSize;
    }
    if (selectedColor !== "") {
      wishListItem.productColor = selectedColor;
    }
    // Promise for async operation with toast feedback
    const addToWishListPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await postData("/api/mywishlist/add", wishListItem);

        if (response.success) {
          // After successfully adding item, fetch the updated cart count
          const updatedWishListCount = await fetchDataFromApi(
            `/api/mywishlist/get/count`
          );
          setWishListCount(updatedWishListCount?.wishListCount); // Update cart count
          resolve();
        } else {
          reject(new Error(response.error || "An error occurred"));
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });

    // Show loading/success/error feedback with toast
    toast.promise(addToWishListPromise, {
      loading: "Wish Item is being Created...",
      success: "Wish Item added Successfully",
      error: (err) => `${err?.message || "An unexpected error occurred"}`,
    });
  };

  useEffect(() => {
    if (productData) {
      setReviewFormFields((prevFields) => ({
        ...prevFields,
        productId: productData._id, // Set the productId when productData is available
      }));
    }

    if (user) {
      setReviewFormFields((prevFields) => ({
        ...prevFields,
        customerId: user.id, // Set the customerId when user is available
      }));
    }
  }, [productData, user]);

  const handleAddReview = async (e) => {
    e.preventDefault();

    const addReviewPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await postData(`/api/reviews/add`, reviewFormFields);
        if (response.success) {
          resolve();
          setReviewFormFields({
            customerId: "",
            productId: "",
            rating: 0,
            customerName: "",
            review: "",
          });
          window.location.reload();
          const reviews = await fetchDataFromApi(
            `/api/reviews?productId=${id}`
          );
          setReviewData(reviews);
        } else {
          reject(new Error(response.error || "An error occured"));
        }
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
    // Show loading/success/error feedback with toast
    toast.promise(addReviewPromise, {
      loading: "Review is being Created...",
      success: "Review Successfully created",
      error: (err) => `${err?.message || "An unexpected error occurred"}`,
    });
  };

  useEffect(() => {
    if (productData) {
      setReviewFormFields((prevFields) => ({
        ...prevFields,
        productId: productData._id, // Set the productId when productData is available
      }));
    }

    if (user) {
      setReviewFormFields((prevFields) => ({
        ...prevFields,
        customerId: user.id, // Set the customerId when user is available
      }));
    }
  }, [productData, user]);

  useEffect(() => {
    const scrollToTop = () => window.scrollTo(0, 0);

    // Adding a slight delay to ensure content is loaded
    const delayScroll = () => setTimeout(scrollToTop, 100); // 100ms delay

    delayScroll();
    const fetchData = async () => {
      try {
        const fetchProductData = await fetchDataFromApi(`/api/products/${id}`);
        setProductData(fetchProductData ? fetchProductData?.productItem : {});
        setViewProductData(fetchProductData);
        const fetchSubcategories = await fetchDataFromApi(
          `/api/subcategories?categoryId=${fetchProductData?.productItem?.category?._id}`
        );

        // Assuming fetchSubcategories returns an array of subcategories
        const subcategories = fetchSubcategories;
        const productSubCategory = subcategories?.subCategoryList?.find(
          (subcat) =>
            subcat?._id === fetchProductData?.productItem?.subcategory?._id
        );
        if (productSubCategory) {
          // Fetch related products in the same subcategory
          const fetchRelatedProducts = await fetchDataFromApi(
            `/api/products?subcategoryId=${productSubCategory?._id}`
          );

          // Filter out the current product
          const filteredProducts = fetchRelatedProducts?.productList?.filter(
            (product) => product._id !== fetchProductData._id
          );

          setRelatedProducts(filteredProducts);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataFromApi(`/api/reviews?productId=${id}`);
        setReviewData(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <>
      <section className="productDetails section">
        <div className="container">
          <div className="row">
            <div className="col-md-5">
              <ProductZoom viewProductData={viewProductData} />
            </div>
            <div className="col-md-7">
              <Typography
                variant="h5"
                textTransform={"capitalize"}
                fontWeight={"600"}
                className="mb-0"
              >
                {" "}
                {productData?.name}
              </Typography>
              <ul className="list list-inline d-flex align-items-center">
                <li className="list-inline-item">
                  <div className="d-flex align-items-center">
                    <span className="text">Brand:</span>
                    <span className="ml-2">{productData?.brand}</span>
                  </div>
                </li>
                <li className="list-inline-item  ">
                  <div className="d-flex align-items-center">
                    <Rating
                      size="small"
                      name="read-only"
                      readOnly
                      value={productData?.rating ?? 0}
                      className="mt-2 mb-2"
                    />
                    <span className="ml-2" style={{ color: "71778e" }}>
                      1 Review
                    </span>
                  </div>
                </li>
              </ul>
              <div className="d-flex align-items-center mb-3">
                <span className="oldPrice">${productData?.oldprice} </span>
                <span className="newPrice text-danger ml-2">
                  ${productData?.newprice}{" "}
                </span>
              </div>
              <span className="badge badge-success">IN STOCK</span>
              <Typography variant="body1" className="mt-4">
                {productData?.description}
              </Typography>

              {productData?.productsize &&
                productData?.productsize?.length !== 0 && (
                  <div className="d-flex align-items-center productSize mt-3">
                    <span>Size:</span>
                    <ul className="list list-inline-item mb-0 pl-4">
                      {productData?.productsize &&
                        productData?.productsize?.length !== 0 &&
                        productData?.productsize?.map((size, index) => (
                          <li className="list-inline-item" key={size._id}>
                            <span
                              className={`tag ${
                                activeSize === index ? "active" : ""
                              }`}
                              onClick={() => sizeActive({ index, size })}
                            >
                              {size?.productsize}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

              {productData?.color && productData?.color?.length !== 0 && (
                <div className="d-flex align-items-center productColor mt-3">
                  <span>Colors:</span>
                  <ul className="list list-inline-item mb-0 pl-4">
                    {productData?.color &&
                      productData?.color?.length !== 0 &&
                      productData?.color?.map((color, index) => (
                        <li
                          className="list-inline-item"
                          key={index}
                          style={{
                            background:
                              activeColor === index ? "purple" : color,
                          }}
                        >
                          <span
                            className={`tag ${
                              activeColor === index ? "active" : ""
                            }`}
                            onClick={() => colorActive({ index, color })}
                            style={{ color: "gold", cursor: "pointer" }}
                          >
                            {color}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              <div className="d-flex align-items-center mt-3">
                <div>Weight:</div>
                <div className="ml-3">{productData?.productWeight} grams</div>
              </div>

              <div className="d-flex align-items-center">
                <QuantityBox
                  quantityNumber={quantityNumber}
                  minusFunc={minusFunc}
                  plusFunc={plusFunc}
                />

                <Button
                  onClick={() => handleAddToCart(productData)}
                  variant="contained"
                  sx={{ borderRadius: "30px" }}
                  size="medium"
                  className="ml-3"
                  startIcon={<ShoppingCartIcon />}
                >
                  ADD TO CART
                </Button>
              </div>
              <div className="d-flex align-items-center mt-3">
                <Button
                  onClick={() => handleAddToWishList(productData)}
                  variant="outlined"
                  startIcon={<FavoriteIcon />}
                  sx={{ color: "gray", borderRadius: "30px" }}
                  size="small"
                >
                  Add to WishList
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CompareArrowsIcon />}
                  sx={{ color: "gray", borderRadius: "28px" }}
                  size="small"
                  className="ml-3"
                >
                  Compare
                </Button>
              </div>
            </div>
          </div>
          <br />
          <div className="card mt-5 p-5 detailsPageTabs">
            <div className="customTabs">
              <ul className="list list-inline-item">
                <li className="list-inline-item">
                  <Button
                    className={`${activeTabs === 0 && "active"}`}
                    onClick={() => setActiveTabs(0)}
                  >
                    Description
                  </Button>
                </li>
                <li className="list-inline-item">
                  <Button
                    className={`${activeTabs === 1 && "active"}`}
                    onClick={() => setActiveTabs(1)}
                  >
                    Additional Info
                  </Button>
                </li>
                <li className="list-inline-item">
                  <Button
                    className={`${activeTabs === 2 && "active"}`}
                    onClick={() => setActiveTabs(2)}
                  >
                    Reviews
                  </Button>
                </li>
              </ul>
              <br />
              {activeTabs === 0 && (
                <div className="tabContent">{productData?.description}</div>
              )}
              {activeTabs === 1 && (
                <div className="tabContent">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <tbody>
                        <tr className="stand-up">
                          <th>Stand Up</th>
                          <td>
                            <p>35"L x 37-45"H(front to back wheel)</p>
                          </td>
                        </tr>
                        <tr className="folded-wo-wheels">
                          <th>Folded (w/0 wheels)</th>
                          <td>
                            <p>35"L x 18.5"x 16.5"H(front to back wheel)</p>
                          </td>
                        </tr>
                        <tr className="folded-w-wheels">
                          <th>Folded (w/ wheels)</th>
                          <td>
                            <p>35"L x 24"Wx 18.5"H(front to back wheel)</p>
                          </td>
                        </tr>
                        <tr className="door-pass-through">
                          <th>Door Pass Through</th>
                          <td>
                            <p>24</p>
                          </td>
                        </tr>
                        <tr className="frame">
                          <th>Frame</th>
                          <td>
                            <p>Aluminium</p>
                          </td>
                        </tr>
                        <tr className="weight-wo-wheels">
                          <th>Weight(w/0 wheels)</th>
                          <td>
                            <p>20LBS</p>
                          </td>
                        </tr>
                        <tr className="weight-capacity">
                          <th>Weight(w/0 wheels)</th>
                          <td>
                            <p>60LBS</p>
                          </td>
                        </tr>
                        <tr className="width">
                          <th>Width</th>
                          <td>
                            <p>24"</p>
                          </td>
                        </tr>
                        <tr className="handle-height-ground-to-handle">
                          <th>Handle height (ground to handle)</th>
                          <td>
                            <p>37-45"</p>
                          </td>
                        </tr>
                        <tr className="wheels">
                          <th>Wheels</th>
                          <td>
                            <p>12" air / wie track slick tread</p>
                          </td>
                        </tr>
                        <tr className="seat-back-height">
                          <th>Seat back height</th>
                          <td>
                            <p>21.5"</p>
                          </td>
                        </tr>
                        <tr className="head-room-inside-canopy">
                          <th>Head room (inside canopy)</th>
                          <td>
                            <p>25"</p>
                          </td>
                        </tr>
                        <tr className="pa_color">
                          <th>Color</th>
                          <td>
                            <p>Black,Blue,Red,White</p>
                          </td>
                        </tr>
                        <tr className="pa_size">
                          <th>Size</th>
                          <td>
                            <p>M,S</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {activeTabs === 2 && (
                <div className="tabContent">
                  <div className="row">
                    <div className="col-md-8">
                      <Typography variant="h6" fontWeight={600}>
                        Customer Questions & answers
                      </Typography>
                      <br />
                      {reviewData &&
                        reviewData?.productReviews &&
                        reviewData?.productReviews?.length !== 0 &&
                        reviewData?.productReviews?.map((review) => (
                          <div
                            className="card p-4 reviewsCard flex-row"
                            key={review?._id}
                          >
                            <div className="userImg">
                              <span
                                className="rounded-circle"
                                style={{
                                  color: "grey",
                                  border: "1px solid #233a95",
                                }}
                              >
                                {review ? review?.customerName.charAt(0) : ""}
                              </span>
                            </div>

                            <div className="info pl-5">
                              <div className="d-flex align-items-center w-100">
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={"600"}
                                >
                                  {format(new Date(review?.updatedAt), "PPpp")}
                                </Typography>
                                <div className="ml-auto">
                                  <Rating
                                    size="small"
                                    name="read-only"
                                    value={parseInt(review?.rating ?? 0)}
                                    readOnly
                                  />
                                </div>
                              </div>
                              <p>{review?.review}</p>
                            </div>
                          </div>
                        ))}

                      <br className="res-hide" />
                      <br className="res-hide" />
                      <form className="reviewForm" onSubmit={handleAddReview}>
                        <Typography variant="h6" fontWeight={600}>
                          Add a review:
                        </Typography>
                        <div className="form-group">
                          <textarea
                            name="review"
                            className="form-control"
                            placeholder="Write a Review"
                            value={reviewFormFields?.review}
                            onChange={changeInputFields}
                          ></textarea>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <TextField
                                type="text"
                                label="Name"
                                variant="outlined"
                                className="w-100"
                                name="customerName"
                                onChange={changeInputFields}
                                value={reviewFormFields?.customerName}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <Rating
                              name="rating"
                              value={parseInt(reviewFormFields?.rating ?? 0)}
                              onChange={(event, newValue) => {
                                setReviewFormFields({
                                  ...reviewFormFields,
                                  rating: newValue, // Directly set the new rating value
                                });
                              }}
                            />
                          </div>
                        </div>
                        <br />
                        <div className="form-group">
                          <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                          >
                            Submit Review
                          </Button>
                        </div>
                      </form>
                    </div>
                    <br />
                    <div className="col-md-4 pl-5 reviewBox">
                      <Typography variant="h5">Customer Reviews</Typography>
                      <div className="d-flex align-items-center mt-2">
                        <Rating name="rating-read" defaultValue={4} readOnly />
                        <strong className="ml-3">4.8 out of 5</strong>
                      </div>
                      <br />
                      <div className="progressBarBox d-flex align-items-center">
                        <span className="mr-3">5 Star</span>
                        <div
                          className="progress"
                          style={{ width: "78%", height: "20px" }}
                        >
                          <div
                            className="progress-bar bg-success"
                            style={{ width: "75%", height: "20px" }}
                          >
                            75%
                          </div>
                        </div>
                      </div>
                      <div className="progressBarBox d-flex align-items-center">
                        <span className="mr-3">4 Star</span>
                        <div
                          className="progress"
                          style={{ width: "78%", height: "20px" }}
                        >
                          <div
                            className="progress-bar bg-success"
                            style={{ width: "50%", height: "20px" }}
                          >
                            50%
                          </div>
                        </div>
                      </div>
                      <div className="progressBarBox d-flex align-items-center">
                        <span className="mr-3">3 Star</span>
                        <div
                          className="progress"
                          style={{ width: "78%", height: "20px" }}
                        >
                          <div
                            className="progress-bar bg-success"
                            style={{ width: "55%", height: "20px" }}
                          >
                            55%
                          </div>
                        </div>
                      </div>
                      <div className="progressBarBox d-flex align-items-center">
                        <span className="mr-3">2 Star</span>
                        <div
                          className="progress"
                          style={{ width: "78%", height: "20px" }}
                        >
                          <div
                            className="progress-bar bg-success"
                            style={{ width: "35%", height: "20px" }}
                          >
                            35%
                          </div>
                        </div>
                      </div>
                      <div className="progressBarBox d-flex align-items-center">
                        <span className="mr-3">1 Star</span>
                        <div
                          className="progress"
                          style={{ width: "85%", height: "20px" }}
                        >
                          <div
                            className="progress-bar bg-success"
                            style={{ width: "25%", height: "20px" }}
                          >
                            25%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <br />
          <RelatedProducts relatedProducts={relatedProducts} />
        </div>
      </section>
    </>
  );
};

export default ProductDetailPage;
