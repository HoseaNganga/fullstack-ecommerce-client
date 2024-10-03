import React, { useContext, useEffect, useState } from "react";
import { Button, Dialog, DialogTitle, Rating, Typography } from "@mui/material";
import { fetchDataFromApi } from "../../utils/api";
import { QuantityBox } from "../../Components";
import DataContext from "../../DataContext/DataContext";
import { format } from "date-fns";

const OrdersPage = () => {
  const { user } = useContext(DataContext);
  const [orderData, setOrderData] = useState([]);
  const [viewProductData, setViewProductData] = useState([]);
  const [open, setOpen] = useState(false);
  const handleClickOpen = async (id) => {
    setOpen(true);
    if (id) {
      const response = await fetchDataFromApi(`/api/orders?orderId=${id}`);
      setViewProductData(response);
    }
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  const handleMinus = () => {};

  const handlePlus = () => {};

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        if (user && user?.id) {
          const response = await fetchDataFromApi(
            `/api/orders?userId=${user?.id}`
          );
          setOrderData(response);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrderData();
  }, [user]);

  console.log(orderData);
  return (
    <>
      <section className="section cartPage">
        <div className="container">
          <Typography
            variant="h5"
            fontWeight={600}
            textTransform={"capitalize"}
            gutterBottom
            color="primary"
          >
            Hello {user?.name}. Welcome to your Order Page.
          </Typography>
          <Typography
            variant="h5"
            fontWeight={600}
            textTransform={"capitalize"}
            gutterBottom
          >
            your orders
          </Typography>
          <Typography variant="body1" gutterBottom>
            There are{" "}
            <b>{orderData?.orderList ? orderData?.orderList?.length : 0}</b>{" "}
            products in your order
          </Typography>
          <div className="row">
            <div className="pr-5">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Order Id</th>
                      <th> Products</th>
                      <th style={{ textAlign: "center" }}>Email</th>
                      <th>userId</th>
                      <th>Payment Status</th>
                      <th>Date Ordered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData?.orderList &&
                      orderData?.orderList.length !== 0 &&
                      orderData?.orderList?.map((order) => (
                        <tr key={order?._id}>
                          <td className="w-100">{order?.orderId}</td>
                          <td
                            className="text-success"
                            onClick={() => handleClickOpen(order?.orderId)}
                          >
                            <Button variant="contained"> view</Button>
                          </td>
                          <td>{user?.email}</td>
                          <td>{order?.userId}</td>
                          <td>
                            <span className="badge-secondary p-1 text-success font-weight-bold">
                              Paid
                            </span>
                          </td>
                          <td className="w-100">
                            {format(new Date(order?.createdAt), "PPpp")}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* <div className="col-md-3">
              <div className="card shadow p-3 cartDetails">
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  textTransform={"uppercase"}
                >
                  order totals
                </Typography>
                <Divider />

                 <div className="d-flex align-items-center mb-3">
                  <span className="font-weight-bold">Status</span>
                  <span
                    className={`ml-auto ${
                      stripeData?.payment_status ? "text-success" : "textdanger"
                    }  font-weight-bold text-uppercase`}
                  >
                    {stripeData ? stripeData?.payment_status : "Unpaid"}
                  </span>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <span className="font-weight-bold">Total</span>
                  <span
                    className={`ml-auto ${
                      stripeData?.total_amount ? "text-success" : "textdanger"
                    }  font-weight-bold`}
                  >
                    $ {stripeData ? stripeData?.total_amount : 0}
                  </span>
                </div> 
              </div>
            </div> */}
          </div>
        </div>
        <Dialog onClose={handleClose} open={open}>
          <DialogTitle>Orders</DialogTitle>
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
                </tr>
              </thead>
              <tbody>
                {viewProductData?.orderList &&
                  viewProductData?.orderList.length !== 0 &&
                  viewProductData.orderList.map((order) =>
                    order.products.map((item) => (
                      <tr key={item._id}>
                        <td>
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
                              <Rating
                                value={parseInt(item?.rating ?? 0)}
                                readOnly
                                size="small"
                              />
                            </div>
                          </div>
                        </td>
                        <td>{item?.price}</td>
                        <td>
                          <QuantityBox
                            quantityNumber={item?.quantity}
                            minusFunc={handleMinus}
                            plusFunc={handlePlus}
                          />
                        </td>
                        <td>{item?.productSize}</td>
                        <td>{item?.productColor}</td>
                        <td>{item?.subtotal}</td>
                      </tr>
                    ))
                  )}
              </tbody>
            </table>
          </div>
        </Dialog>
      </section>
    </>
  );
};

export default OrdersPage;
