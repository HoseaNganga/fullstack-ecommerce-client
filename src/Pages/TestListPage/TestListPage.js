import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { deleteData, fetchDataFromApi, modifyData } from "../../utils/api";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  Dialog,
} from "@mui/material";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const TestListPage = () => {
  const navigate = useNavigate();
  const [testData, setTestData] = useState({});
  const [open, setOpen] = React.useState(false);
  const [productImages, setProductImages] = useState([]);
  const [editId, setEditId] = useState("");
  const [productFormFields, setProductFormFields] = useState({
    productName: "",
    description: "",
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const handleInputChange = (e) => {
    setProductFormFields(() => ({
      ...productFormFields,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProductEdit = async (id) => {
    setOpen(true);
    const response = await fetchDataFromApi(`/api/test/${id}`);
    setEditId(id);
    setProductFormFields({
      productName: response?.product?.productName,
      description: response?.product?.description,
    });

    setProductImages(response?.product?.images || []);
    setImagePreviews(response?.product?.images || []);
  };

  const handleRemoveImage = (index) => {
    // Copy the arrays
    const updatedImages = [...productImages];
    const updatedPreviews = [...imagePreviews];

    // Remove the image and preview at the selected index
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);

    // Update the state
    setProductImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Get the selected files
    const newImagePreviews = files.map((file) => URL.createObjectURL(file));

    setProductImages((prevImages) => [...prevImages, ...files]); // Add new images to existing ones
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newImagePreviews]); // Add new previews to existing ones

    e.target.value = ""; //
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const originalProduct = await fetchDataFromApi(`/api/test/${editId}`);
    const originalImages = originalProduct
      ? originalProduct?.product?.images
      : [];

    formData.append("productName", productFormFields?.productName);
    formData.append("description", productFormFields?.description);

    // Function to compare two arrays of images (URLs or file references)
    const arraysAreEqual = (arr1, arr2) => {
      if (arr1.length !== arr2.length) return false;
      // Check if all elements in both arrays are identical
      return arr1.every((img, index) => img === arr2[index]);
    };

    // Check if the images have changed by comparing the contents of the arrays
    const imagesChanged = !arraysAreEqual(productImages, originalImages);

    // If images have changed, append each image to FormData
    if (imagesChanged) {
      productImages.forEach((image, index) => {
        formData.append("images[]", image); // Appending each image with a key like 'images[]'
      });
    }
    const editProductPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await modifyData(`/api/test/${editId}`, formData);
        if (response.success) {
          setProductFormFields({
            productName: "",
            description: "",
          });

          setProductImages([]);
          setImagePreviews([]);
          resolve();
          navigate("/testlist");
        } else {
          reject();
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });
    toast.promise(editProductPromise, {
      loading: "Product is being Edited",
      success: "Product Successfully Edited and Associated Images",
      error: "An error occured while editing the product",
    });
  };

  const handleDelete = (id) => {
    const handleProductDeletePromise = new Promise(async (resolve, reject) => {
      try {
        const response = await deleteData(`/api/test/${id}`);
        if (response.success) {
          const refetchData = await fetchDataFromApi(`/api/test`);
          setTestData(refetchData);
          resolve();
          window.location.reload();
        } else {
          reject();
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });
    toast.promise(handleProductDeletePromise, {
      loading: "Product is being deleted",
      success: "Product Successfully deleted and Associated Images",
      error: "An error occured while deleting the product",
    });
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataFromApi(`/api/test`);
        setTestData(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <div className="row">
        <div className="col-md-9 pr-5">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Product</th>
                  <th> Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {testData &&
                  testData?.productList?.length !== 0 &&
                  testData?.productList?.map((product) => (
                    <tr key={product?._id}>
                      <td>
                        <div className="cartItem">
                          <div className="imgWrapper">
                            <img
                              src={product?.images[0]}
                              alt={product?.productName}
                            />
                          </div>
                          <div className="info">
                            <Typography
                              variant="subtitle1"
                              className="productName"
                            >
                              {product?.productName.slice(0, 11)}...
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td>{product?.description}</td>
                      <td>
                        <div className="actions d-flex align-items-center">
                          <IconButton
                            onClick={() => handleProductEdit(product?._id)}
                          >
                            <EditIcon
                              color="success"
                              sx={{ fontSize: "20px" }}
                            />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(product?._id)}
                          >
                            <DeleteIcon
                              color="error"
                              sx={{ fontSize: "20px" }}
                            />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle>Edit Product:</DialogTitle>
          <DialogContent>
            <form onSubmit={handleEditProduct}>
              <div className="formClass ">
                <div className="card mt-2 ml-3 p-4 w-100 ">
                  <div className="imagesUploadSec">
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      Media And Published
                    </Typography>
                  </div>

                  <div className="d-flex align-items-center">
                    <TextField
                      type="text"
                      label="ProductName"
                      name="productName"
                      className="w-100"
                      value={productFormFields?.productName}
                      onChange={handleInputChange}
                    />
                    <TextField
                      type="text"
                      label="ProductDescription"
                      className="w-100"
                      name="description"
                      value={productFormFields?.description}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="imgUploadBox d-flex align-items-center mt-3">
                    <div className="uploadBox">
                      <TextField
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        multiple
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>
                  <div
                    className="imgUploadBox d-flex align-items-center mt-3"
                    id="productImageGrid"
                  >
                    {imagePreviews?.length !== 0 &&
                      imagePreviews?.map((preview, index) => (
                        <div className="uploadBox" key={index}>
                          <IconButton
                            className="remove"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <DeleteIcon
                              sx={{
                                fontSize: "20px",
                                "&:hover": {
                                  color: "red",
                                },
                              }}
                            />
                          </IconButton>
                          <div className="box">
                            <LazyLoadImage
                              alt={`profilepic`}
                              effect="blur"
                              className="w-100"
                              src={preview}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" onClick={handleClose} autoFocus>
                  Edit
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default TestListPage;
