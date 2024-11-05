import React from "react";

import { Close as CloseIcon } from "@mui/icons-material";
import PropTypes from "prop-types";

function Tag(props) {
  const { label, onDelete, ...other } = props;
  return (
    <div
      {...other}
      className="flex items-center h-6 m-1 bg-gray-200 border border-gray-300 rounded px-2"
    >
      <span className="overflow-hidden whitespace-nowrap text-ellipsis">
        {label}
      </span>
      <CloseIcon onClick={onDelete} className="text-xs cursor-pointer p-1" />
    </div>
  );
}

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Tag;
