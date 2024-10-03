import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import { Header, Footer } from "./Components";
import DataContext from "./DataContext/DataContext";
import ListingPage from "./Pages/ListingPage/ListingPage";
import ProductDetailPage from "./Pages/ProductDetailPage/ProductDetailPage";
import CartPage from "./Pages/CartPage/CartPage";
import SignIn from "./Pages/SignIn/SignIn";
import { useContext } from "react";
import SignUp from "./Pages/SignUp/SignUp";
import WishListPage from "./Pages/WishListPage/WishListPage";
import CheckOutPage from "./Pages/CheckoutPage/CheckOutPage";
import PaymentCompletePage from "./Pages/PaymentCompletePage/PaymentCompletePage";
import OrdersPage from "./Pages/OrdersPage/OrdersPage";
import SearchPage from "./Pages/SearchPage/SearchPage";
import TestPage from "./Pages/TestPage/TestPage";
import TestListPage from "./Pages/TestListPage/TestListPage";
import AccountPage from "./Pages/AccountPage/AccountPage";

function App() {
  const { headerFooterShow } = useContext(DataContext);

  return (
    <div className="App">
      {headerFooterShow === true && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cat/:id" element={<ListingPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/mywishlist" element={<WishListPage />} />
        <Route path="/myorders" element={<OrdersPage />} />
        <Route path="/checkout" element={<CheckOutPage />} />
        <Route path="/payment/complete/:id" element={<PaymentCompletePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/testlist" element={<TestListPage />} />
        <Route path="/account/:id" element={<AccountPage />} />
      </Routes>
      {headerFooterShow === true && <Footer />}
    </div>
  );
}

export default App;
