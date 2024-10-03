import React from "react";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DiscountIcon from "@mui/icons-material/Discount";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="topInfo row">
          <div className="col d-flex align-items-center">
            <span>
              <LocalGroceryStoreIcon fontSize="50px" />
            </span>
            <span className="ml-2">Everyday fresh products</span>
          </div>
          <div className="col d-flex align-items-center">
            <span>
              <LocalShippingIcon fontSize="50px" />
            </span>
            <span className="ml-2">Free delivery for orders above $70</span>
          </div>
          <div className="col d-flex align-items-center">
            <span>
              <DiscountIcon fontSize="50px" />
            </span>
            <span className="ml-2">Daily Mega Discounts</span>
          </div>
          <div className="col d-flex align-items-center">
            <span>
              <MonetizationOnIcon fontSize="50px" />
            </span>
            <span className="ml-2">Best Price in the market</span>
          </div>
        </div>
        <div className="row mt-4 linksWrap">
          <div className="col">
            <Typography
              variant="subtitle1"
              textTransform="uppercase"
              fontWeight={600}
              gutterBottom
            >
              Fruits & vegetables
            </Typography>
            <ul>
              <li>
                <Link to={""}>Fresh Vegetables</Link>
              </li>
              <li>
                <Link to={""}>Herbs & Seasonings</Link>
              </li>
              <li>
                <Link to={""}>Fresh Fruits</Link>
              </li>
              <li>
                <Link to={""}>Cuts & Sprouts</Link>
              </li>
              <li>
                <Link to={""}>Exotic Fruits & Veggies</Link>
              </li>
              <li>
                <Link to={""}>Packaged Produce</Link>
              </li>
              <li>
                <Link to={""}>Party Trays</Link>
              </li>
            </ul>
          </div>
          <div className="col linksWrap">
            <Typography
              variant="subtitle1"
              textTransform="uppercase"
              fontWeight={600}
              gutterBottom
            >
              breakfast & dairy
            </Typography>
            <ul>
              <li>
                <Link to={""}>Fresh Vegetables</Link>
              </li>
              <li>
                <Link to={""}>Herbs & Seasonings</Link>
              </li>
              <li>
                <Link to={""}>Fresh Fruits</Link>
              </li>
              <li>
                <Link to={""}>Cuts & Sprouts</Link>
              </li>
              <li>
                <Link to={""}>Exotic Fruits & Veggies</Link>
              </li>
              <li>
                <Link to={""}>Packaged Produce</Link>
              </li>
              <li>
                <Link to={""}>Party Trays</Link>
              </li>
            </ul>
          </div>
          <div className="col linksWrap">
            <Typography
              variant="subtitle1"
              textTransform="uppercase"
              fontWeight={600}
              gutterBottom
            >
              meat & seafood
            </Typography>
            <ul>
              <li>
                <Link to={""}>Fresh Vegetables</Link>
              </li>
              <li>
                <Link to={""}>Herbs & Seasonings</Link>
              </li>
              <li>
                <Link to={""}>Fresh Fruits</Link>
              </li>
              <li>
                <Link to={""}>Cuts & Sprouts</Link>
              </li>
              <li>
                <Link to={""}>Exotic Fruits & Veggies</Link>
              </li>
              <li>
                <Link to={""}>Packaged Produce</Link>
              </li>
              <li>
                <Link to={""}>Party Trays</Link>
              </li>
            </ul>
          </div>
          <div className="col linksWrap">
            <Typography
              variant="subtitle1"
              textTransform="uppercase"
              fontWeight={600}
              gutterBottom
            >
              beverages
            </Typography>
            <ul>
              <li>
                <Link to={""}>Fresh Vegetables</Link>
              </li>
              <li>
                <Link to={""}>Herbs & Seasonings</Link>
              </li>
              <li>
                <Link to={""}>Fresh Fruits</Link>
              </li>
              <li>
                <Link to={""}>Cuts & Sprouts</Link>
              </li>
              <li>
                <Link to={""}>Exotic Fruits & Veggies</Link>
              </li>
              <li>
                <Link to={""}>Packaged Produce</Link>
              </li>
              <li>
                <Link to={""}>Party Trays</Link>
              </li>
            </ul>
          </div>
          <div className="col linksWrap">
            <Typography
              variant="subtitle1"
              textTransform="uppercase"
              fontWeight={600}
              gutterBottom
            >
              bread & bakery
            </Typography>
            <ul>
              <li>
                <Link to={""}>Fresh Vegetables</Link>
              </li>
              <li>
                <Link to={""}>Herbs & Seasonings</Link>
              </li>
              <li>
                <Link to={""}>Fresh Fruits</Link>
              </li>
              <li>
                <Link to={""}>Cuts & Sprouts</Link>
              </li>
              <li>
                <Link to={""}>Exotic Fruits & Veggies</Link>
              </li>
              <li>
                <Link to={""}>Packaged Produce</Link>
              </li>
              <li>
                <Link to={""}>Party Trays</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="copyright mt-5 pt-3 pb-3 d-flex ">
          <Typography variant="body1" className="mb-0" sx={{color:'rgba(0,0,0,0.6)'}} >
            Copyright 2024 © Material UI Theme. All rights reserved. Powered by
            Material UI.
          </Typography>
          <ul className="list list-inline ml-auto">
            <li className="list-inline-item">
              <Link to={""}>
                <XIcon />
              </Link>
            </li>
            <li className="list-inline-item">
              <Link to={""}>
                <InstagramIcon />
              </Link>
            </li>
            <li className="list-inline-item">
              <Link to={""}>
                <FacebookIcon />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
