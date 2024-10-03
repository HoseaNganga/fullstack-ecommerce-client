import axios from "axios";

// Fetch data from the API
export const fetchDataFromApi = async (url) => {
  try {
    const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}${url}`);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
  }
};

// Post data to the API
export const postData = async (url, formData) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}${url}`,
      formData
    );
    console.log("Response from post:", response.data);

    // Check if the response indicates success or failure
    if (response.data.success === false) {
      throw new Error(response.data.error || "An error occurred");
    }

    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    return {
      success: false,
      error: error.response?.data?.message || "An error occurred",
    };
  }
};

export const modifyData = async (url, formData) => {
  try {
    const { data } = await axios.patch(
      `${process.env.REACT_APP_BASE_URL}${url}`,
      formData
    );
    return data;
  } catch (error) {
    console.error("Error modifying data:", error);
    return { success: false, error: error.message || "An error occurred" };
  }
};

//DELETE DATA

export const deleteData = async (url) => {
  try {
    const { data } = await axios.delete(
      `${process.env.REACT_APP_BASE_URL}${url}`
    );
    return data;
  } catch (error) {
    console.error("Error deleting data:", error);
    return { success: false, error: error.message || "An error occurred" };
  }
};
