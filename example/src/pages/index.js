import React from 'react';
import { Link } from 'gatsby';

const IndexPage = () => {
  return (
    <>
      <p>Like, index page</p>
      <Link to="/account/">Go to account</Link>
    </>
  );
};

export default IndexPage;
