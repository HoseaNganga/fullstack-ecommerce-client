import React, { useContext, useEffect, useState } from "react";
import { Button, Divider, TextField, Typography } from "@mui/material";
import { CountryDropDown } from "../../Components";
import { fetchDataFromApi, postData } from "../../utils/api";
import DataContext from "../../DataContext/DataContext";
import PaymentIcon from "@mui/icons-material/Payment";
import toast from "react-hot-toast";

const CheckOutPage = () => {
  const { user, selectedCountryValue } = useContext(DataContext);
  const shippingRate = 2;
  const [cartCheckoutData, setCartCheckOutData] = useState([]);
  const [checkoutFields, setCheckoutFields] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    streetAddress: "",
    houseNumber: "",
    town: "",
    zipcode: "",
    phone: "",
    email: "",
  });

  const changeInputFields = (e) => {
    setCheckoutFields(() => ({
      ...checkoutFields,
      [e.target.name]: e.target.value,
    }));
  };
  const handleCheckout = (e) => {
    e.preventDefault();
    if (selectedCountryValue !== "") {
      checkoutFields.location = selectedCountryValue;
    }
    if (cartCheckoutData?.length !== 0) {
      checkoutFields.orderProducts = cartCheckoutData?.cartList;
    }
    if (user) {
      checkoutFields.userId = user?.id;
    }
    const addCheckoutPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await postData("/api/orders/create", checkoutFields);
        console.log(response);

        if (response.success) {
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
    toast.promise(addCheckoutPromise, {
      loading: "Order Item is being Created...",
      success: "Order created Successfully",
      error: (err) => `${err?.message || "An unexpected error occurred"}`,
    });

    console.log(checkoutFields);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchCartData = await fetchDataFromApi(
          `/api/cart?userId=${user?.id}`
        );
        setCartCheckOutData(fetchCartData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [user]);
  console.log(cartCheckoutData);
  return (
    <>
      <section className="section">
        <form className="container" onSubmit={handleCheckout}>
          <div className="row">
            <div className="col-md-8">
              <div>
                <div className="card p-4">
                  <Typography variant="h5" className="mb-0" fontWeight={600}>
                    Billing Details
                  </Typography>
                  <div className="formClass mt-4 ">
                    <div className="form-group d-flex ">
                      <TextField
                        sx={{
                          background: "white",
                          borderRadius: "8px",
                        }}
                        type="text"
                        value={checkoutFields?.firstName}
                        placeholder="John"
                        required
                        size="small"
                        variant="outlined"
                        label="First Name"
                        name="firstName"
                        onChange={changeInputFields}
                        className="w-100"
                      />
                      <TextField
                        sx={{
                          background: "white",
                          borderRadius: "8px",
                          marginLeft: "1rem",
                        }}
                        type="text"
                        placeholder="Doe"
                        required
                        value={checkoutFields?.lastName}
                        onChange={changeInputFields}
                        name="lastName"
                        size="small"
                        variant="outlined"
                        label="Last Name"
                        className="w-100"
                      />
                    </div>
                  </div>
                  <div className="form-group mt-2">
                    <TextField
                      sx={{ background: "white", borderRadius: "8px" }}
                      type="text"
                      placeholder="Company"
                      size="small"
                      variant="outlined"
                      label="Company Name"
                      className="w-100"
                      value={checkoutFields?.companyName}
                      name="companyName"
                      onChange={changeInputFields}
                      helperText="Optional"
                    />
                  </div>
                  <div className="d-flex align-items-center w-100">
                    <CountryDropDown />
                  </div>
                  <div className="form-group d-flex mt-3 ">
                    <TextField
                      sx={{ background: "white", borderRadius: "8px" }}
                      type="text"
                      placeholder="673"
                      required
                      size="small"
                      variant="outlined"
                      label="Street Address"
                      className="w-100"
                      value={checkoutFields?.streetAddress}
                      name="streetAddress"
                      onChange={changeInputFields}
                    />
                    <TextField
                      sx={{
                        background: "white",
                        borderRadius: "8px",
                        marginLeft: "2rem",
                      }}
                      type="text"
                      placeholder="101"
                      required
                      size="small"
                      variant="outlined"
                      label="House Number"
                      className="w-100"
                      value={checkoutFields?.houseNumber}
                      name="houseNumber"
                      onChange={changeInputFields}
                    />
                  </div>
                  <div className="form-group d-flex mt-3">
                    <TextField
                      sx={{ background: "white", borderRadius: "8px" }}
                      type="text"
                      placeholder="Nairobi"
                      required
                      size="small"
                      variant="outlined"
                      label="Town/City"
                      className="w-100"
                      value={checkoutFields?.town}
                      name="town"
                      onChange={changeInputFields}
                    />
                    <TextField
                      sx={{
                        background: "white",
                        borderRadius: "8px",
                        marginLeft: "2rem",
                      }}
                      type="text"
                      placeholder="01000"
                      required
                      size="small"
                      variant="outlined"
                      label="ZipCode"
                      className="w-100"
                      value={checkoutFields?.zipcode}
                      name="zipcode"
                      onChange={changeInputFields}
                    />
                  </div>
                  <div className="form-group d-flex mt-3">
                    <TextField
                      sx={{ background: "white", borderRadius: "8px" }}
                      type="number"
                      placeholder="01234567"
                      required
                      size="small"
                      variant="outlined"
                      label="Phone Number"
                      className="w-100"
                      value={checkoutFields?.phone}
                      name="phone"
                      onChange={changeInputFields}
                    />
                    <TextField
                      sx={{
                        background: "white",
                        borderRadius: "8px",
                        marginLeft: "2rem",
                      }}
                      type="email"
                      placeholder="johndoe@gmail.com"
                      required
                      size="small"
                      variant="outlined"
                      label="Email"
                      className="w-100"
                      value={checkoutFields?.email}
                      name="email"
                      onChange={changeInputFields}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow p-3 cartDetails">
                <Typography variant="h5" className="mb-0" fontWeight={600}>
                  Your Order
                </Typography>
                <div className="mt-3">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th> SubTotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartCheckoutData?.cartList &&
                          cartCheckoutData?.cartList?.length !== 0 &&
                          cartCheckoutData?.cartList?.map((item) => (
                            <tr key={item?._id}>
                              <td>
                                <Typography
                                  variant="subtitle1"
                                  className="productName"
                                >
                                  {item?.productName.slice(0, 30)}... X
                                  {item?.quantity}
                                </Typography>
                              </td>

                              <td>{item?.subtotal}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <Divider />
                <div className="d-flex align-items-center mb-3 mt-2">
                  <span>Shipping</span>
                  <span className="ml-auto text-success ">
                    {" "}
                    <b>${shippingRate} </b>{" "}
                  </span>
                </div>

                <Divider />

                <div className="d-flex align-items-center mb-3">
                  <span>Total</span>
                  <span className="ml-auto text-success  font-weight-bold">
                    $
                    {cartCheckoutData?.cartList
                      ? cartCheckoutData.cartList.reduce(
                          (acc, item) => acc + item.subtotal,
                          0
                        ) + shippingRate // Add the shipping fee here
                      : 0}
                  </span>
                </div>

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PaymentIcon />} // Using the Payment icon
                  sx={{ mt: 2 }}
                  type="submit"
                >
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default CheckOutPage;
