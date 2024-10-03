import React, { useContext } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { TextField, InputAdornment } from "@mui/material";
import DataContext from "../../DataContext/DataContext";
import { fetchDataFromApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, setSearchResultData } =
    useContext(DataContext);
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchDataFromApi(`/api/search?q=${searchTerm}`);
      if (response.success) {
        setSearchResultData(response);
        navigate("/search");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form className="headerSearch" onSubmit={handleSearch}>
      <TextField
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        placeholder="Search for Products..."
        size="small"
        variant="outlined"
        sx={{
          fontSize: "16px",
          padding: "0px 20px",
        }}
      />
    </form>
  );
};

export default SearchBox;
