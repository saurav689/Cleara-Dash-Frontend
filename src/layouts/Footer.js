import React from "react";
import { Heart } from "react-feather";

function Footer() {
  return (
    <footer className={"footer footer-light footer-static"}>
      <p className="clearfix mb-0">
        <span className="float-md-start d-block d-md-inline-block mt-25">
          COPYRIGHT © {new Date().getFullYear()} MACDATA
          <span className="d-none d-sm-inline-block">
            , All rights Reserved
          </span>
        </span>
        {/* <span className="float-md-end d-none d-md-block">
          Hand-crafted & Made with
          <Heart size={14} />
        </span> */}
      </p>
    </footer>
  );
}

export default Footer;
