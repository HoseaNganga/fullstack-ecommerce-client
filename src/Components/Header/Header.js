import React, { useContext } from "react";
import BacolaLogo from "../../ImageAssets/bacolalogo.png";
import { Link } from "react-router-dom";
import { CountryDropDown, NavBar, SearchBox } from "../../Components/index";
import {
  IconButton,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  Avatar,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Logout from "@mui/icons-material/Logout";
import LockResetIcon from "@mui/icons-material/LockReset";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DataContext from "../../DataContext/DataContext";
import GradingIcon from "@mui/icons-material/Grading";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Header = () => {
  const {
    isLoggedIn,
    user,
    open,
    handleClick,
    handleClose,
    handleLogOut,
    anchorEl,
    cartCount,
    cartData,
    handleAccountClose,
    handleOrderClose,
    handlemyAccountClose,
  } = useContext(DataContext);
  return (
    <>
      <div className="headerWrapper">
        <div className="topStrip bgBlue ">
          <div className="container">
            <p className="mb-0 mt-0 text-center">
              Due to high network traffic,orders may be processed with a slow
              delay
            </p>
          </div>
        </div>
        <div className="header">
          <div className="container">
            <div className="row">
              <div className="logoWrapper col-sm-2 d-flex align-items-center  ">
                <Link to={"/"}>
                  <img src={BacolaLogo} alt="BacolaLogo" />
                </Link>
              </div>
              <div className="col-sm-10 d-flex align-items-center part2">
                <CountryDropDown />
                <SearchBox />
                <div className="d-flex align-items-center  part3 ml-auto ">
                  {isLoggedIn ? (
                    <div className="myAccWrapper">
                      <div className="myAcc d-flex align-items-center">
                        <Button
                          endIcon={<KeyboardArrowDownIcon />}
                          className="userInfo"
                          onClick={handleClick}
                          aria-controls={open ? "account-menu" : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                        >
                          <div className="userImg">
                            <span
                              className="rounded-circle"
                              style={{ color: "grey" }}
                            >
                              {user?.name?.charAt(0)}
                            </span>
                          </div>
                          <Typography
                            variant="subtitle2"
                            fontSize={"12px"}
                            color={"grey"}
                            textTransform={"lowercase"}
                          >
                            {user?.email.slice(0, 10)}..
                          </Typography>
                        </Button>

                        <Menu
                          anchorEl={anchorEl}
                          id="account-menu"
                          open={open}
                          onClose={handleClose}
                          onClick={handleClose}
                          PaperProps={{
                            elevation: 0,
                            sx: {
                              overflow: "visible",
                              filter:
                                "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                              mt: 1.5,
                              "& .MuiAvatar-root": {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                              },
                              "&::before": {
                                content: '""',
                                display: "block",
                                position: "absolute",
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: "background.paper",
                                transform: "translateY(-50%) rotate(45deg)",
                                zIndex: 0,
                              },
                            },
                          }}
                          transformOrigin={{
                            horizontal: "right",
                            vertical: "top",
                          }}
                          anchorOrigin={{
                            horizontal: "right",
                            vertical: "bottom",
                          }}
                        >
                          <MenuItem onClick={handlemyAccountClose}>
                            <Avatar /> My account
                          </MenuItem>
                          <MenuItem onClick={handleAccountClose}>
                            <ListItemIcon>
                              <FavoriteIcon />
                            </ListItemIcon>
                            My WishList
                          </MenuItem>

                          <MenuItem onClick={handleOrderClose}>
                            <ListItemIcon>
                              <GradingIcon />
                            </ListItemIcon>
                            My Orders
                          </MenuItem>

                          <MenuItem onClick={handleClose}>
                            <ListItemIcon>
                              <LockResetIcon color="error" />
                            </ListItemIcon>
                            Reset Password
                          </MenuItem>

                          <MenuItem onClick={handleLogOut}>
                            <ListItemIcon>
                              <Logout fontSize="small" />
                            </ListItemIcon>
                            Logout
                          </MenuItem>
                        </Menu>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="contained"
                      className=""
                      sx={{
                        borderRadius: "30px",
                        "&:hover": {
                          color: "#fff",
                        },
                      }}
                      href="/signin"
                    >
                      Sign In
                    </Button>
                  )}

                  <div className="ml-auto cartTab d-flex align-items-center ">
                    <span className="price" style={{ color: "purple" }}>
                      $
                      {cartData?.cartList
                        ? cartData.cartList.reduce(
                            (acc, item) => acc + item.subtotal,
                            0
                          )
                        : 0}
                    </span>
                    <div className="position-relative ml-2">
                      <IconButton className="" href="/cart">
                        <ShoppingCartIcon color="secondary" />
                      </IconButton>
                      <span className="count d-flex align-items-center justify-content-center">
                        {cartCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <NavBar />
      </div>
    </>
  );
};

export default Header;
