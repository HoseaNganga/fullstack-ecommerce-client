import { Button, InputAdornment, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import newsletterbanner from "../../ImageAssets/newsletterbanner.png";
import EmailIcon from "@mui/icons-material/Email";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const handleNewsLetterSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      return;
    }
  };
  return (
    <>
      <section className="newsLetterSection mt-3 mb-3 d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <Typography variant="body1" className="text-white" gutterBottom>
                $20 discount for your first order
              </Typography>
              <Typography
                variant="h6"
                className="text-white"
                fontWeight={600}
                gutterBottom
              >
                Join Our newsletter and get...
              </Typography>
              <Typography variant="body2" className="text-light">
                Join our email subscription
                <br /> now to get updates on promotions and coupons
              </Typography>
              <form onSubmit={handleNewsLetterSubmit}>
                <TextField
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button type="submit" variant="contained">
                          Subscribe
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    background: "white",
                  }}
                />
              </form>
            </div>
            <div className="col-md-6">
              <img src={newsletterbanner} alt="newsletterbanner" />
            </div>
          </div>
        </div>
      </section>
      <br />
      <br />
    </>
  );
};

export default NewsLetter;
