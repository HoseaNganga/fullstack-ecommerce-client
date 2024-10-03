import React, { useContext, useState } from "react";
import { Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { Link } from "react-router-dom";
import DataContext from "../../DataContext/DataContext";

const NavBar = () => {
  const { categoryData } = useContext(DataContext);
  const [openSideBar, setOpenSideBar] = useState(false);

  const handleOpenSideBar = () => {
    setOpenSideBar(!openSideBar);
  };

  return (
    <nav>
      <div className="container">
        <div className="row">
          <div className="col-sm-2 navPart1">
            <div className="categoriesWrapper">
              <Button
                onClick={handleOpenSideBar}
                className="allCategroiesTab"
                sx={{
                  background: "#2bbef9",
                  color: "#fff",
                  padding: "8px 20px",
                  borderRadius: "30px",
                }}
                variant="contained"
                disableElevation
                startIcon={<MenuIcon />}
                endIcon={<KeyboardArrowDown />}
              >
                <span className="text">ALL CATEGORIES</span>
              </Button>
              <div
                className={`sidebarNav shadow ${openSideBar ? "open" : ""} `}
              >
                <ul>
                  {categoryData &&
                    categoryData?.categoryList?.length !== 0 &&
                    categoryData?.categoryList?.map((category) => (
                      <li
                        className="list-inline-item"
                        onClick={() => setOpenSideBar(false)}
                        key={category?._id}
                      >
                        <Link to={`/cat/${category?._id}`}>
                          {category?.name}
                        </Link>
                      </li>
                    ))}
                  {categoryData?.categoryList?.length === 0 && (
                    <li
                      className="list-inline-item"
                      onClick={() => setOpenSideBar(false)}
                    >
                      <Link to="/">Home</Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-sm-10 navPart2 d-flex align-items-center ">
            <ul className="list list-inline ml-auto">
              <li className="list-inline-item">
                <Link to={"/"}>Home</Link>
              </li>
              {categoryData?.length !== 0 &&
                categoryData?.categoryList?.length !== 0 &&
                categoryData?.categoryList?.map((category) => (
                  <li className="list-inline-item" key={category?._id}>
                    <Link
                      to={`/cat/${category?._id}`}
                      /*  onMouseEnter={() => selectCategoryId(category?._id)} */
                    >
                      {category?.name}
                    </Link>
                    {/*   <div className="submenu shadow">
                      {subCategoriesFilteredByCategoryData?.length !== 0 &&
                        subCategoriesFilteredByCategoryData?.subCategoryList
                          ?.length !== 0 &&
                        subCategoriesFilteredByCategoryData?.subCategoryList?.map(
                          (subcat) => (
                            <Link
                              to={`/cat/${subcat?.subcategory}/${subcat?._id}`}
                              key={subcat?._id}
                            >
                              <Button>{subcat?.subcategory}</Button>
                            </Link>
                          )
                        )}
                    </div> */}
                  </li>
                ))}
              <li className="list-inline-item">
                <Link to={"/"}>Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

/* <div className="submenu shadow">
                      <Link to="">
                        <Button>clothing</Button>
                      </Link>
                      <Link to="">
                        <Button>footwear</Button>
                      </Link>
                      <Link to="">
                        <Button>watches</Button>
                      </Link>
                    </div> 
                    <li
                    className="list-inline-item"
                    onClick={() => setOpenSideBar(false)}
                  >
                    <Link to={"/"}>Home</Link>
                  </li>
                  <li className="list-inline-item">
                    <Link to={"/"}>
                      men{" "}
                      <ChevronRightIcon fontSize="20px" className="ml-auto" />{" "}
                    </Link>
                    <div className="submenu shadow">
                      <Link to="">
                        <Button>clothing</Button>
                      </Link>
                      <Link to="">
                        <Button>footwear</Button>
                      </Link>
                      <Link to="">
                        <Button>watches</Button>
                      </Link>
                    </div>
                  </li>
                  <li className="list-inline-item">
                    <Link to={"/"}>
                      women{" "}
                      <ChevronRightIcon fontSize="20px" className="ml-auto" />
                    </Link>
                    <div className="submenu shadow">
                      <Link to="">
                        <Button>clothing</Button>
                      </Link>
                      <Link to="">
                        <Button>footwear</Button>
                      </Link>
                      <Link to="">
                        <Button>watches</Button>
                      </Link>
                    </div>
                  </li>
                  <li className="list-inline-item">
                    <Link to={"/"}>Beauty</Link>
                  </li>
                  <li className="list-inline-item">
                    <Link to={"/"}>kids</Link>
                  </li>
                  <li className="list-inline-item">
                    <Link to={"/"}>gift</Link>
                  </li>*/
