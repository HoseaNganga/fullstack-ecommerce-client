import React from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";

const QuantityBox = ({ quantityNumber, minusFunc, plusFunc }) => {
  return (
    <>
      <div className="quantityDrop d-flex align-items-center">
        <IconButton sx={{ background: "#edeef5" }} onClick={() => minusFunc()}>
          <RemoveIcon />
        </IconButton>
        <span style={{ padding: "20px", fontWeight: "600" }}>
          {quantityNumber}
        </span>
        <IconButton sx={{ background: "#edeef5" }} onClick={() => plusFunc()}>
          <AddIcon />
        </IconButton>
      </div>
    </>
  );
};

export default QuantityBox;
