import { Divider, IconButton, Rating, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { QuantityBox } from "../../Components";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import {
  deleteData,
  fetchDataFromApi,
  modifyData,
  postData,
} from "../../utils/api";
import toast from "react-hot-toast";
import DataContext from "../../DataContext/DataContext";
import { loadStripe } from "@stripe/stripe-js";

const WishListPage = () => {
  const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  );
  const [quantities, setQuantities] = useState({});
  const { setWishListCount, wishListData, setWishListData, user } =
    useContext(DataContext);
  const clearId = user ? user?.id : "";
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const updateQuantityAndSubtotal = async (productId, newQuantity) => {
    const itemToUpdate = wishListData.wishList.find(
      (item) => item.productId === productId
    );
    if (!itemToUpdate) return;

    // Calculate new subtotal
    const newSubtotal = itemToUpdate.price * newQuantity;

    // Create a promise for the update operation
    const updatePromise = new Promise(async (resolve, reject) => {
      try {
        // Update the quantities state
        setQuantities((prevQuantities) => ({
          ...prevQuantities,
          [productId]: newQuantity,
        }));

        // Optionally, send a request to update the server
        await modifyData(`/api/mywishlist/${itemToUpdate._id}`, {
          quantity: newQuantity,
          subtotal: newSubtotal,
        });

        // Update the cartData with new subtotal
        setWishListData((prevWishListData) => ({
          ...prevWishListData,
          wishList: prevWishListData.wishList.map((item) =>
            item.productId === productId
              ? { ...item, subtotal: newSubtotal }
              : item
          ),
        }));

        resolve(); // Resolve promise on success
      } catch (error) {
        console.error("Error updating wish item:", error); // Log the error for debugging
        reject(new Error("Failed to update the quantity and subtotal")); // Reject with an error
      }
    });

    // Show loading/success/error feedback with toast
    toast.promise(updatePromise, {
      loading: "Updating Wish Item...",
      success: "Quantity and subtotal updated successfully!",
      error: (err) => `${err?.message || "An unexpected error occurred"}`,
    });
  };
  const debouncedUpdate = debounce(updateQuantityAndSubtotal, 1000);

  // Update quantity and subtotal

  const handleMinus = (productId) => {
    setQuantities((prevQuantities) => {
      const newQuantity =
        prevQuantities[productId] > 1 ? prevQuantities[productId] - 1 : 1;
      debouncedUpdate(productId, newQuantity);
      return {
        ...prevQuantities,
        [productId]: newQuantity,
      };
    });
  };

  const handlePlus = (productId) => {
    setQuantities((prevQuantities) => {
      const newQuantity = prevQuantities[productId] + 1;
      debouncedUpdate(productId, newQuantity);
      return {
        ...prevQuantities,
        [productId]: newQuantity,
      };
    });
  };

  const handleCartItemDelete = async (id) => {
    const deleteCartItemPromise = new Promise(async (resolve, reject) => {
      try {
        await deleteData(`/api/mywishlist/${id}`);

        const res = await fetchDataFromApi(
          `/api/mywishlist?userId=${user?.id}`
        );
        setWishListData(res);

        // Ensure cartList exists before reducing
        if (res.wishList) {
          const newQuantities = res.wishList.reduce((acc, item) => {
            acc[item.productId] = item.quantity || 1;
            return acc;
          }, {});
          setQuantities(newQuantities);
        } else {
          // Handle case where cartList is undefined or empty
          setQuantities({});
        }
        // After successfully adding item, fetch the updated cart count
        const updatedWishCount = await fetchDataFromApi(
          `/api/mywishlist/get/count`
        );

        setWishListCount(updatedWishCount?.wishListCount); // Update cart count

        resolve();
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(deleteCartItemPromise, {
      loading: "Wish Item is being deleted..",
      success: "Wish Item deleted Successfully",
      error: "Error..Wish Item Not deleted",
    });
  };
  const checkout = async () => {
    const stripe = await stripePromise;
    const addOrderToDatabasePromise = new Promise(async (resolve, reject) => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        const body = {
          userId: userData?.userId,
          products: wishListData?.wishList,
        };
        const response = await postData(`/api/orders/create`, body);

        if (response.success) {
          const orderId = response?.orderList?.orderId;
          const cartProducts = response?.orderList?.products?.map(
            (product) => ({
              productName: product?.productName,
              price: product?.price,
              quantity: product?.quantity,
            })
          );
          const body = {
            orderId: orderId,
            products: cartProducts,
          };

          await deleteData(`/api/mywishlist/clear/${clearId}`);
          const checkoutresponse = await fetch(
            `${process.env.REACT_APP_BASE_URL}/api/checkout/create`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            }
          );

          if (!checkoutresponse.ok) {
            console.error(
              "Error fetching session:",
              checkoutresponse.statusText
            );
            reject(new Error("Failed to create payment session"));
            return;
          }

          const session = await checkoutresponse.json();

          if (session.error) {
            console.error("Session error:", session.error);
            reject(new Error(session.error));
            return;
          }

          const result = await stripe.redirectToCheckout({
            sessionId: session.id,
          });

          if (result.error) {
            console.log(result.error);
            reject(
              new Error(result.error.message || "Error redirecting to payment")
            );
            return;
          }

          resolve();
        } else {
          reject(new Error(response.error || "An error occurred"));
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });

    toast.promise(addOrderToDatabasePromise, {
      loading: "Order is being Created..",
      success: "Order Created Successfully...Redirecting to Payment",
      error: (err) => `${err?.message || "An unexpected error occurred"}`,
    });
  };

  useEffect(() => {
    const fetchWishData = async () => {
      try {
        if (user?.id) {
          const response = await fetchDataFromApi(
            `/api/mywishlist?userId=${user?.id}`
          );
          setWishListData(response);
          // Initialize quantities based on the fetched cart data
          const newQuantities = response.wishList.reduce((acc, item) => {
            acc[item.productId] = item.quantity || 1;
            return acc;
          }, {});
          setQuantities(newQuantities);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchWishData();
    //eslint-disable-next-line
  }, [user]);
  return (
    <>
      <section className="section cartPage">
        <div className="container">
          <Typography
            variant="h5"
            fontWeight={600}
            textTransform={"capitalize"}
            gutterBottom
          >
            your wish-list
          </Typography>
          <Typography variant="body1" gutterBottom>
            There are{" "}
            <b>{wishListData?.wishList ? wishListData?.wishList?.length : 0}</b>{" "}
            products in your cart
          </Typography>
          <div className="row">
            <div className="col-md-9 pr-5">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th> Price</th>
                      <th style={{ textAlign: "center" }}>Quantity</th>
                      <th>Size</th>
                      <th>Color</th>
                      <th>Subtotal</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishListData?.wishList &&
                      wishListData?.wishList?.length !== 0 &&
                      wishListData?.wishList?.map((item) => (
                        <tr key={item?._id}>
                          <td>
                            <Link to={`/product/${item?.productId}`}>
                              <div className="cartItem">
                                <div className="imgWrapper">
                                  <img
                                    src={item?.images[0]}
                                    alt={item?.productName}
                                  />
                                </div>
                                <div className="info">
                                  <Typography
                                    variant="subtitle1"
                                    className="productName"
                                  >
                                    {item?.productName.slice(0, 11)}...
                                  </Typography>
                                  <Rating value={4} readOnly size="small" />
                                </div>
                              </div>
                            </Link>
                          </td>
                          <td>{item?.price}</td>
                          <td>
                            <QuantityBox
                              quantityNumber={quantities[item.productId]}
                              minusFunc={() => handleMinus(item.productId)}
                              plusFunc={() => handlePlus(item.productId)}
                            />
                          </td>
                          <td>{item?.productSize}</td>
                          <td>{item?.productColor}</td>
                          <td>{item?.subtotal}</td>
                          <td>
                            <IconButton
                              onClick={() => handleCartItemDelete(item?._id)}
                            >
                              <CloseIcon />
                            </IconButton>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card shadow p-3 cartDetails">
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  textTransform={"uppercase"}
                >
                  cart totals
                </Typography>
                <Divider />
                <div className="d-flex align-items-center mb-3">
                  <span>Subtotal</span>
                  <span className="ml-auto text-success font-weight-bold">
                    $
                    {wishListData?.wishList
                      ? wishListData.wishList.reduce(
                          (acc, item) => acc + item.subtotal,
                          0
                        )
                      : 0}
                  </span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <span>Shipping</span>
                  <span className="ml-auto ">
                    {" "}
                    <b>Free</b>{" "}
                  </span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <span>Estimate for</span>
                  <span className="ml-auto font-weight-bold ">
                    <b>Kenya</b>
                  </span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <span>Total</span>
                  <span className="ml-auto text-success  font-weight-bold">
                    $
                    {wishListData?.wishList
                      ? wishListData.wishList.reduce(
                          (acc, item) => acc + item.subtotal,
                          0
                        )
                      : 0}
                  </span>
                </div>
                <Button
                  variant="contained"
                  sx={{ borderRadius: "30px" }}
                  size="small"
                  onClick={checkout}
                >
                  Proceed to checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WishListPage;
