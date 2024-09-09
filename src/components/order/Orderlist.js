import React, { useState, useEffect } from "react";
import { Edit, Eye, MoreVertical, Trash } from "react-feather";
import ReactPaginate from "react-paginate";
import { useShopifyOrdersQuery } from "../../service";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Input,
  Label,
  Row,
  Table,
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import OrderView from "./OrderView";
import { getOrder } from "../../redux/orderSlice";
import { useDispatch, useSelector } from "react-redux";
function Orderlist() {
  const navigate = useNavigate();
  const orderList = useSelector((state) => state.orderState.orderList);
  const resorders = useShopifyOrdersQuery();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFields, setSearchFields] = useState("");
  const [viewData, setViewData] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  useEffect(() => {
    if (resorders?.isSuccess) {
      dispatch(getOrder(resorders?.data?.orders));
      setPageCount(resorders?.data?.orders?.totalPages);
    }
  }, [resorders]);
  console.log("orderList",resorders);
  const vendorData = {}; // Initialize as an empty object, not an array

  const vendorValues = (line_items) => {
    line_items.forEach((item) => {
      const { vendor, title, price, quantity } = item;
      if (vendorData[vendor]) {
        vendorData[vendor].totalQuantity += quantity;
        vendorData[vendor].totalPrice += parseFloat(price);
        vendorData[vendor].Order_Info.push({ vendor, title, price });
      } else {
        vendorData[vendor] = {
          totalQuantity: quantity,
          totalPrice: parseFloat(price),
          Order_Info: [{ vendor, title, price }],
        };
      }
    });
  };
  // Call vendorValues to aggregate data
  orderList.forEach((cs) => {
    vendorValues(cs.line_items);
  });

  const onViewAction = (e, st) => {
    console.log("vendor order's", st);
    e.preventDefault();
    setViewData(st);
    setModal(true);
  };

  const handleSearchField = (e) => {
    setSearchFields(e.target.value);
    setCurrentPage(1)
  };

  const handlePagination = (page) => {
    setCurrentPage(page?.selected + 1);
  };
  return (
    <>
      <div className="app-user-list">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle tag="h4">Order List</CardTitle>
          </CardHeader>
          <CardBody>
          <Row>
              <Col md="6" className="d-flex">
                <div className="w-50 me-1">
                  <Label for="status-select">Search</Label>
                  <Input
                    id="search-invoice"
                    type="text"
                    onChange={(e) => handleSearchField(e)}
                  />
                </div>
                {/* <div className="w-50">
                  <Label for="status-select">Status</Label>
                  <Select
                    isClearable
                    options={[
                      { label: "Active", value: "Active" },
                      { label: "In Active", value: "Inactive" },
                    ]}
                    className="react-select"
                    classNamePrefix="select"
                    value={searchByStatus}
                    onChange={(val) => handleSearchStatus(val)}
                  />
                </div> */}
              </Col>
              <Col md="6" className="d-flex justify-content-end">
                {/* <div className="w-30 me-1">
                  <UncontrolledDropdown
                    className="mt-2"
                    onClick={(e) => downloadCSV(e)}
                  >
                    <DropdownToggle color="secondary" outline>
                      <Download className="font-small-4 me-50" />
                      <span className="align-middle">Excel</span>
                    </DropdownToggle>
                  </UncontrolledDropdown>
                </div> */}
                <div className="w-30">
                  <Button
                    color="primary"
                    onClick={(e) => navigate("/order-form")}
                    className="mt-2"
                  >
                    Add City
                  </Button>
                </div>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md="12">
                <Table>
                  <thead>
                    <tr>
                      <th>Vendor Name</th>
                      <th>Total Orders</th>
                      <th>Total Price</th>
                      <th>View Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(vendorData).map((vendor, index) => (
                      <tr key={index}>
                        <td>{vendor}</td>
                        <td>{vendorData[vendor].totalQuantity}</td>
                        <td>{vendorData[vendor].totalPrice.toFixed(2)}</td>
                        <td>
                          <UncontrolledDropdown>
                            <DropdownToggle
                              className="icon-btn hide-arrow"
                              color="transparent"
                              size="sm"
                              caret
                            >
                              <MoreVertical size={15} />
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem
                                href="#!"
                                onClick={(e) =>
                                  onViewAction(e, vendorData[vendor])
                                }
                              >
                                <Eye className="me-50" size={15} />{" "}
                                <span className="align-middle">View</span>
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))}
                    {Object.keys(vendorData).length === 0 && (
                      <tr>
                        <td className="text-center" colSpan={3}>
                          No Data Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </CardBody>
          <ReactPaginate
            breakLabel={"..."}
            previousLabel={""}
            nextLabel={""}
            pageCount={pageCount}
            forcePage={currentPage !== 0 ? currentPage - 1 : 0}
            activeClassName="active"
            onPageChange={(page) => handlePagination(page)}
            pageClassName={"page-item"}
            nextLinkClassName={"page-link"}
            nextClassName={"page-item next"}
            previousClassName={"page-item prev"}
            previousLinkClassName={"page-link"}
            pageLinkClassName={"page-link"}
            containerClassName={`pagination ${
              pageCount > 0 ? "" : "hidden"
            } react-paginate justify-content-end my-2 pe-1`}
          />
        </Card>
      </div>
      <OrderView modal={modal} setModal={setModal} viewData={viewData} />
    </>
  );
}

export default Orderlist;
