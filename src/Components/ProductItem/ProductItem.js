import React, { useState, useRef, useContext } from "react";
import { Typography, Rating, IconButton, Button } from "@mui/material";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { ProductModal } from "../index";
import Slider from "react-slick";
import { fetchDataFromApi, postData } from "../../utils/api";
import toast from "react-hot-toast";
import DataContext from "../../DataContext/DataContext";

const ProductItem = (props) => {
  const { user, setWishListCount } = useContext(DataContext);
  const [open, setOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [viewProductData, setViewProductData] = useState([]);
  const handleClose = () => {
    setOpen(false);
  };
  const handleProductView = async (id) => {
    setOpen(true);
    const resp = await fetchDataFromApi(`/api/products/${id}`);
    setViewProductData(resp);
  };
  const sliderRef = useRef();
  const settings = {
    dots: true,
    infinite: true,
    loop: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
    setTimeout(() => {
      if (sliderRef.current) {
        sliderRef.current.slickPlay();
      }
    }, 20);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTimeout(() => {
      if (sliderRef.current) {
        sliderRef.current.slickPause();
      }
    }, 20);
  };

  const handleAddToWishList = async (productData) => {
    // Check if productData is valid
    if (!productData) {
      console.error("No product data provided");
      toast.error("Product data is required to add to cart.");
      return; // Exit early if no product data
    }
    if (!user || !user.id || !user.name || !user.email) {
      return toast.error("Please log in to add items to your WishList");
    }

    // Create the cart item object directly
    const wishListItem = {
      productName: productData?.name,
      rating: productData?.rating,
      price: productData?.newprice,
      productId: productData?._id,
      userId: user?.id, // Assuming user is from context
      quantity: 1, // Assuming this is defined elsewhere
      subtotal: parseInt(productData?.newprice * 1),
      images: [productData?.images[0]], // Assuming first image is used
    };

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
      <div
        className={`item productItem ${props.itemView}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="imgWrapper">
          {isHovered === true ? (
            <Slider {...settings} ref={sliderRef}>
              {props?.featured?.images?.map((image, index) => (
                <div key={index} className="slick-slide">
                  <img src={image} alt="" />
                </div>
              ))}
            </Slider>
          ) : (
            <img
              src={props?.featured?.images[0]}
              alt={props?.featured?.name}
              className="w-100 "
            />
          )}

          <span className="badge badge-primary">25%</span>
          <div className="actions">
            <IconButton
              onClick={() => handleProductView(props?.featured?._id)}
              sx={{ background: "#233a95" }}
            >
              <ZoomOutMapIcon fontSize="14px" sx={{ color: "gray" }} />
            </IconButton>
            <IconButton
              sx={{ background: "#233a95" }}
              onClick={() => handleAddToWishList(props?.featured)}
            >
              <FavoriteIcon fontSize="14px" sx={{ color: "gray" }} />
            </IconButton>
          </div>
        </div>
        <div className="info ">
          <Button
            fontWeight={"600"}
            variant="text"
            sx={{
              textTransform: "capitalize",
              color: "black",
              marginTop: "25px",
            }}
            href={`/product/${props?.featured?._id}`}
          >
            {props?.featured?.name?.substr(0, 30) + "....."}
          </Button>
          <Typography
            variant="content"
            className="text-success d-block"
            textTransform={"uppercase"}
            marginLeft={1}
          >
            in stock
          </Typography>
          <Rating
            name="read-only"
            value={props?.featured?.rating ?? 0}
            readOnly
            className="mt-2 mb-2"
            sx={{
              marginLeft: "6px",
            }}
          />
          <Typography
            variant="body2"
            className="d-flex align-items-center"
            marginLeft={1}
          >
            <span className="oldPrice">${props?.featured?.oldprice}</span>
            <span className="newPrice text-danger ml-2">
              ${props?.featured?.newprice}
            </span>
          </Typography>
        </div>
      </div>

      <ProductModal
        open={open}
        setOpen={setOpen}
        handleClose={handleClose}
        viewProductData={viewProductData}
      />
    </>
  );
};

export default ProductItem;
