import React, { useContext, useState } from "react";
import {
  Button,
  Dialog,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  TextField,
  InputAdornment,
  Slide,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import DataContext from "../../DataContext/DataContext";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CountryDropDown = () => {
  const { countryList, selectedCountryValue, setSelectedCountryValue } =
    useContext(DataContext);
  const CountryArr = countryList.map((country) => country.country);
  const [open, setOpen] = useState(false);
  const [searchCountryValue, setSearchCountryValue] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = (value) => {
    if (value !== selectedCountryValue) {
      // Only update if the value has changed
      setSelectedCountryValue(value);
    }
    setOpen(false);
  };

  const handleListItemClick = (value) => {
    handleClose(value);
  };
  const filteredArray = CountryArr.filter((country) =>
    country.toLowerCase().includes(searchCountryValue.toLowerCase())
  );

  return (
    <>
      <Button
        sx={{
          width: "150px",
          height: "auto",
          minWidth: "150px",
          border: "1px solid rgba(0,0,0,0.3)",
        }}
        className="countryDropDown"
        size="small"
        onClick={handleClickOpen}
      >
        <div className="info d-flex flex-column ">
          <span className="label">Your Location</span>
          <span className="name">
            {selectedCountryValue !== ""
              ? selectedCountryValue.substr(0, 10)
              : "Select Location"}
          </span>
        </div>
        <span className="ml-auto">
          <KeyboardArrowDownIcon />
        </span>
      </Button>
      <Dialog
        onClose={() => handleClose(selectedCountryValue)}
        open={open}
        p={2}
        selectedvalue={selectedCountryValue}
        className="locationModal"
        TransitionComponent={Transition}
      >
        <Typography variant="h6" fontWeight={700}>
          Select Your Country:
        </Typography>
        <Typography variant="body2" gutterBottom color="gray">
          Enter your address and we will specify the offer for your area
        </Typography>
        <TextField
          type="text"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          value={searchCountryValue}
          onChange={(e) => setSearchCountryValue(e.target.value)}
          placeholder="Search your Area..."
          variant="outlined"
          p={3}
          size="small"
        />
        <List>
          {filteredArray.map((country, index) => (
            <ListItem disableGutters key={index}>
              <ListItemButton onClick={() => handleListItemClick(country)}>
                <ListItemText primary={country} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Dialog>
    </>
  );
};

export default CountryDropDown;
