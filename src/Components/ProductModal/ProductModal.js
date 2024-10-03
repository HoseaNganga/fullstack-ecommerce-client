import React, { useContext, useState } from "react";
import {
  Dialog,
  Typography,
  Slide,
  IconButton,
  DialogTitle,
  Rating,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { ProductZoom, QuantityBox } from "../index";
import { fetchDataFromApi, postData } from "../../utils/api";
import toast from "react-hot-toast";
import DataContext from "../../DataContext/DataContext";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProductModal = ({ open, setOpen, handleClose, viewProductData }) => {
  const { user, setCartCount, setWishListCount } = useContext(DataContext);
  const [quantityNumber, setQuantityNumber] = useState(1);
  const [activeSize, setActiveSize] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeColor, setActiveColor] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
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
      return toast.error("Please log in to add Items to your Cart");
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
        console.log(response);

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

  return (
    <>
      {viewProductData && viewProductData?.productItem?.length !== 0 && (
        <Dialog
          onClose={handleClose}
          open={open}
          p={2}
          TransitionComponent={Transition}
          className="productModal"
          key={viewProductData?.productItem?._id}
        >
          <IconButton
            sx={{ position: "absolute", top: "10px", right: "10px" }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          <DialogTitle
            textTransform={"capitalize"}
            fontWeight={"600"}
            className="mb-0"
          >
            {viewProductData?.productItem?.name}
          </DialogTitle>

          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center mr-4">
              <span>Brand:</span>
              <span className="ml-2">
                {viewProductData?.productItem?.brand}
              </span>
            </div>
            <Rating
              size="small"
              name="read-only"
              value={parseInt(viewProductData?.productItem?.rating ?? 0)}
              readOnly
              className="mt-2 mb-2"
            />
          </div>
          <hr />
          <div className="row mt-2 productDetailModel">
            <div className="col-md-5">
              <ProductZoom viewProductData={viewProductData} />
            </div>
            <div className="col-md-7">
              <div className="d-flex align-items-center mb-3">
                <span className="oldPrice">
                  ${viewProductData?.productItem?.oldprice}{" "}
                </span>
                <span className="newPrice text-danger ml-2">
                  ${viewProductData?.productItem?.newprice}{" "}
                </span>
              </div>
              <span className="badge badge-success">IN STOCK</span>
              <Typography variant="body2" className="mt-3">
                {viewProductData?.productItem?.description}
              </Typography>

              {viewProductData?.productItem?.productsize &&
                viewProductData?.productItem?.productsize?.length !== 0 && (
                  <div className="d-flex align-items-center productSize mt-3">
                    <span>Size:</span>
                    <ul className="list list-inline-item mb-0 pl-4">
                      {viewProductData?.productItem?.productsize &&
                        viewProductData?.productItem?.productsize?.length !==
                          0 &&
                        viewProductData?.productItem?.productsize?.map(
                          (size, index) => (
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
                          )
                        )}
                    </ul>
                  </div>
                )}

              {viewProductData?.productItem?.color &&
                viewProductData?.productItem?.color?.length !== 0 && (
                  <div className="d-flex align-items-center productColor mt-3">
                    <span>Colors:</span>
                    <ul className="list list-inline-item mb-0 pl-4">
                      {viewProductData?.productItem?.color &&
                        viewProductData?.productItem?.color?.length !== 0 &&
                        viewProductData?.productItem?.color?.map(
                          (color, index) => (
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
                          )
                        )}
                    </ul>
                  </div>
                )}

              <div className="d-flex align-items-center mt-3">
                <QuantityBox
                  quantityNumber={quantityNumber}
                  minusFunc={minusFunc}
                  plusFunc={plusFunc}
                />

                <Button
                  variant="contained"
                  sx={{ borderRadius: "30px" }}
                  size="medium"
                  className="ml-3"
                  onClick={() => handleAddToCart(viewProductData?.productItem)}
                >
                  ADD TO CART
                </Button>
              </div>
              <div className="d-flex align-items-center mt-3">
                <Button
                  variant="outlined"
                  startIcon={<FavoriteIcon />}
                  sx={{ color: "gray", borderRadius: "30px" }}
                  size="small"
                  onClick={() =>
                    handleAddToWishList(viewProductData?.productItem)
                  }
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
        </Dialog>
      )}
    </>
  );
};

export default ProductModal;
