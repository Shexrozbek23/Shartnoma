import React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Loader } from '../vibe';
const MyTable = ({ columns, data, onRowClick, searchBarParam }) => {
  const [cameData, setCameData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  return (
    <>
      <Loader type="spin" />
    </>
  );
};
MyTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  dataUrl: PropTypes.string,
  searchBarParam: PropTypes.string,
  onRowClick: PropTypes.func,
};
MyTable.defaultProps = {
  searchBarParam: '',
};
export default MyTable;
