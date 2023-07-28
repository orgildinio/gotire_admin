import React, { useEffect, useState } from "react";
import { Form, Input, Button, Switch, Upload, message } from "antd";
import { connect } from "react-redux";
import { Editor } from "@tinymce/tinymce-react";

//Components
import PageTitle from "../../../Components/PageTitle";
import { InboxOutlined } from "@ant-design/icons";
import Loader from "../../../Components/Generals/Loader";

//Actions
import { tinymceAddPhoto } from "../../../redux/actions/imageActions";

import * as actions from "../../../redux/actions/orderActions";

// Lib
import base from "../../../base";
import axios from "../../../axios-base";
import { toastControl } from "src/lib/toasControl";
import { convertFromdata } from "../../../lib/handleFunction";
import moment from "moment";

const requiredRule = {
  required: true,
  message: "Тус талбарыг заавал бөглөнө үү",
};

const { Dragger } = Upload;

const Views = (props) => {
  // FUNCTIONS
  const [data, setData] = useState({});
  const init = () => {
    props.getOrder(props.match.params.id);
  };

  const clear = () => {
    props.clear();
  };

  // -- TREE FUNCTIONS

  const handleAdd = (values, status = null) => {};

  // USEEFFECT
  useEffect(() => {
    init();
    return () => clear();
  }, []);

  const handlePay = () => {
    const data = {
      paid: true,
      status: true,
      paidType: "bankaccount",
    };
    props.updateOrder(props.match.params.id, data);
  };
  const handleCancel = () => {
    const data = {
      status: false,
    };
    props.updateOrder(props.match.params.id, data);
  };

  useEffect(() => {
    setData(props.order);
  }, [props.order]);

  // Ямар нэгэн алдаа эсвэл амжилттай үйлдэл хийгдвэл энд useEffect барьж аваад TOAST харуулна
  useEffect(() => {
    toastControl("error", props.error);
  }, [props.error]);

  useEffect(() => {
    if (props.success) {
      toastControl("success", props.success);
      setTimeout(() => props.history.replace("/order"), 2000);
    }
  }, [props.success]);

  let type = "";
  const currentDate = new Date().toJSON().slice(0, 10);
  let createAt =
    data.createAt &&
    moment(data.createAt).utcOffset("+0800").format("YYYY-MM-DD");

  if (data.paid === true) {
    type = "Захиалга амжилттай";
  } else if (data.paid === false && createAt >= currentDate) {
    type = "Төлбөр хүлээгдэж байна";
  } else if (data.paid === false && createAt < currentDate) {
    type = "Захиалга хүчингүй болсон";
  } else if (data.paid === false) {
    type = "Төлбөр хүлээгдэж байна";
  } else {
    type = "Төлбөр төлөгдөөгүй";
  }

  if (data.status === false && data.paid === false) {
    type = "Захиалга цуцлагдсан";
  }

  return (
    <>
      <div className="content-wrapper">
        <PageTitle name="Захиалгын мэдээлэл" />
        <div className="page-sub-menu"></div>
        <div className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-8">
                <div className="pro-box">
                  <div className="page_detials_header">
                    <div className="page_header_left">
                      <h5>Захиалгын мэдээлэл</h5>
                    </div>
                    <div className="page_header_right">
                      <span>Төлбөр төлөх хугацаа</span>
                      <p> {data.createAt && data.createAt.slice(0, 10)} </p>
                    </div>
                  </div>
                  <div className="divider-dashed" role="separator"></div>
                  <div className="order-bill-status">
                    <h4>{type}</h4>
                    <div className="alert alert-warning">
                      Төлбөр төлөгдсөний дараа таны захиалга баталгаажихыг
                      анхаарна уу! Дээрх хугацаанд төлбөрөө төлөөгүй тохиолдолд
                      таны захиалга автоматаар цуцлагдана.
                    </div>
                  </div>
                </div>

                <div className="pro-box">
                  <div className="page_detials_header">
                    <div className="page_header_left col-flex">
                      <span>Захиалгын дугаар</span>
                      <h5> {data.orderNumber} </h5>
                    </div>
                    <div className="page_header_right">
                      <span>Захиалга хийсэн огноо</span>
                      <p>
                        {" "}
                        {data.createAt &&
                          moment(data.createAt)
                            .utcOffset("+0800")
                            .format("YYYY-MM-DD HH:mm:ss")}
                      </p>
                    </div>
                  </div>
                  <div className="divider-dashed" role="separator"></div>
                  <div className="order-bill-invoice">
                    <li>
                      Барааны дүн:
                      <span>{new Intl.NumberFormat().format(data.total)}₮</span>
                    </li>

                    <li>
                      Хүргэлт:
                      <span>
                        {data.delivery === true
                          ? "Хүргэлтээр авна"
                          : "Хүргүүлэхгүй"}
                      </span>
                    </li>
                    <li>
                      Угсралт:
                      <span>
                        {data.increase === true
                          ? "Угсралт хийлгэнэ"
                          : "Угсралтгүй"}
                      </span>
                    </li>
                  </div>
                </div>
                <div className="pro-box">
                  <div className="page_detials_header">
                    <div className="page_header_left col-flex">
                      <h5> Барааны мэдээллүүд</h5>
                    </div>
                  </div>
                  <div className="divider-dashed" role="separator"></div>
                  <div className="product-bill-list">
                    {data.carts &&
                      data.carts.map((cart) => (
                        <div className="product-bill-item">
                          <div className="product-bill-left">
                            <div className="product-bill-picture">
                              <img src={cart.picture} />
                            </div>
                            <div className="product-bill-dtls">
                              <span>
                                {cart.type === "tire" && "Дугуй"}
                                {cart.type === "wheel" && "Обуд"}
                                {cart.type === "setProduct" && "Дугуй, Обуд"}
                                {cart.type === "product" && "Сэлбэг"}{" "}
                                {cart.code}
                              </span>
                              <h6> {cart.name}</h6>
                              {cart.type !== "product" ? (
                                <span className="qty">
                                  Тоо ширхэг: {cart.total}
                                </span>
                              ) : (
                                <span className="qty">
                                  {" "}
                                  Үлдэгдэл: {cart.total}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="product-bill-right">
                            {cart.type !== "product" &&
                            cart.isDiscount === false ? (
                              <h5>
                                {new Intl.NumberFormat().format(cart.price)}₮
                              </h5>
                            ) : (
                              cart.type !== "product" && (
                                <>
                                  <span className="cart-discount">
                                    {new Intl.NumberFormat().format(cart.price)}
                                    ₮
                                  </span>
                                  <h5>
                                    {new Intl.NumberFormat().format(
                                      cart.discount
                                    )}
                                    ₮
                                  </h5>
                                </>
                              )
                            )}

                            {cart.type == "product" &&
                            cart.isDiscount === false ? (
                              <h5>
                                {cart.qty} *{" "}
                                {new Intl.NumberFormat().format(
                                  cart.price * cart.qty
                                )}
                                ₮
                              </h5>
                            ) : (
                              cart.type == "product" && (
                                <>
                                  <span className="cart-discount">
                                    {cart.qty} *{" "}
                                    {new Intl.NumberFormat().format(
                                      cart.price * cart.qty
                                    )}
                                    ₮
                                  </span>
                                  <h5>
                                    {cart.qty} *{" "}
                                    {new Intl.NumberFormat().format(
                                      cart.discount * cart.qty
                                    )}
                                    ₮
                                  </h5>
                                </>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="pro-box">
                  <div className="page_detials_header">
                    <div className="page_header_left col-flex">
                      <h5> Захиалагчийн мэдээлэл</h5>
                    </div>
                  </div>
                  <div className="divider-dashed" role="separator"></div>
                  <div className="bill-contacts row">
                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                      <div className="bill-contact-item">
                        <span>Овог</span>
                        <p>{data.lastName}</p>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                      <div className="bill-contact-item">
                        <span>Нэр</span>
                        <p>{data.firstName}</p>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                      <div className="bill-contact-item">
                        <span>Утас</span>
                        <p>{data.phoneNumber}</p>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                      <div className="bill-contact-item">
                        <span>Цахим хаяг</span>
                        <p>{data.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pro-box">
                  <div className="page_detials_header">
                    <div className="page_header_left col-flex">
                      <h5> Захиалагчийн мэдээлэл</h5>
                    </div>
                  </div>
                  <div className="divider-dashed" role="separator"></div>
                  <p className="bill-address">{data.address}</p>
                </div>
              </div>
              <div className="col-4">
                <div className="card">
                  <div className="card-footer">
                    <div className="control-bottons">
                      <Button
                        className="add-button"
                        loading={props.loading}
                        onClick={() => handlePay()}
                      >
                        Төлбөр төлсөн
                      </Button>

                      <Button
                        className="add-button"
                        loading={props.loading}
                        onClick={() => handleCancel()}
                      >
                        Цуцлах
                      </Button>

                      <Button onClick={() => props.history.goBack()}>
                        Буцах
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    success: state.orderReducer.success,
    error: state.orderReducer.error,
    loading: state.orderReducer.loading,
    order: state.orderReducer.order,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    tinymceAddPhoto: (file) => dispatch(tinymceAddPhoto(file)),
    updateOrder: (id, data) => dispatch(actions.updateOrder(id, data)),
    getOrder: (id) => dispatch(actions.getOrder(id)),
    clear: () => dispatch(actions.clear()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Views);
