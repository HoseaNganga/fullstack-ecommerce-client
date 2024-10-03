import React, { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Button, IconButton, TextField, Typography } from "@mui/material";
import { LazyLoadImage } from "react-lazy-load-image-component";
import DeleteIcon from "@mui/icons-material/Delete";
import { postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const TestPage = () => {
  const navigate = useNavigate();
  const [productFormFields, setProductFormFields] = useState({
    productName: "",
    description: "",
    images: [],
  });
  const [productImages, setProductImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleInputChange = (e) => {
    setProductFormFields(() => ({
      ...productFormFields,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Get the selected files
    const newImagePreviews = files.map((file) => URL.createObjectURL(file));

    setProductImages((prevImages) => [...prevImages, ...files]); // Add new images to existing ones
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newImagePreviews]); // Add new previews to existing ones

    e.target.value = ""; //
  };

  // Remove selected image
  const handleRemoveImage = (index) => {
    const updatedImages = [...productImages];
    const updatedPreviews = [...imagePreviews];

    updatedImages.splice(index, 1); // Remove image at the selected index
    updatedPreviews.splice(index, 1); // Remove the corresponding preview

    setProductImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", productFormFields?.productName);
    formData.append("description", productFormFields?.description);
    productImages.forEach((image, index) => {
      formData.append("images[]", image); // Use the key 'images[]' to indicate it's an array
    });

    const createProductPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await postData("/api/test/create", formData);
        if (response.success) {
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
    toast.promise(createProductPromise, {
      loading: "Product is being Created and Images Being Uploaded",
      success: "Product Successfully Created and Associated Images",
      error: "An error occured while creating the product",
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
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

        <Button
          startIcon={<CloudUploadIcon />}
          variant="contained"
          className="w-100"
          type="submit"
        >
          PUBLISH & VIEW
        </Button>
      </form>
    </>
  );
};

export default TestPage;
