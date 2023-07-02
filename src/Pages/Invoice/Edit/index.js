import React, { useEffect, useState, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Switch,
  Upload,
  message,
  Tag,
  Tooltip,
  Select,
  InputNumber,
  DatePicker,
} from "antd";
import { connect } from "react-redux";
import dayjs from 'dayjs';

//Components
import PageTitle from "../../../Components/PageTitle";
import Loader from "../../../Components/Generals/Loader";
import { PlusOutlined } from "@ant-design/icons";

//Actions
import { tinymceAddPhoto } from "../../../redux/actions/imageActions";
import * as actions from "../../../redux/actions/bookingActions";
import { getExcelData as getUsers } from "../../../redux/actions/userActions";
import { getExcelData as getServices } from "src/redux/actions/serviceActions";

// Lib
import base from "../../../base";
import axios from "../../../axios-base";
import { toastControl } from "src/lib/toasControl";
import { convertFromdata } from "../../../lib/handleFunction";

const requiredRule = {
  required: true,
  message: "Тус талбарыг заавал бөглөнө үү",
};

const Add = (props) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [choiseDate, setChoiseDate] = useState();
  const [choiseTime, setChoiseTime] = useState();
  const [choiseUser, setChoiseUser] = useState();
  const [choiseService, setChoiseService] = useState();
  
  // Tags
  const [tags, setTags] = useState([]);
  const [services, setServices] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [users, setUsers] = useState([]);
  const inputRef = useRef(null);
  const editInputRef = useRef(null);

  const [loading, setLoading] = useState({
    visible: false,
    message: "",
  });

  // FUNCTIONS
  const init = () => {
    setTags([]);
    props.getBooking(props.match.params.id)
    props.getServices();
    props.getUsers();
  };

  const clear = () => {
    props.clear();
    form.resetFields();
    setChoiseDate();
    setChoiseTime();
    setTags([]);
    setLoading(false);
  };

  // -- TREE FUNCTIONS

  const handleDate = (date, dateString) => {
    setChoiseDate(dateString);
  };

  const handleAdd = (values, status = null) => {
    if (!values.status) values.status = true;
    if (status == "draft") values.status = false;
    if (!values.paid) values.paid = false;
    if (!values.userId) delete values.userId;
    if (choiseUser) values.userId = choiseUser;

    values.date = choiseDate;

    const data = {
      ...values,
    };

    // console.log(values);

    const sendData = convertFromdata(data);
    props.updateBooking(props.match.params.id, sendData);
  };

  const handleUser = (value) => {
    setChoiseUser(value);
  };

  // USEEFFECT
  useEffect(() => {
    init();
    return () => clear();
  }, []);

  // Ямар нэгэн алдаа эсвэл амжилттай үйлдэл хийгдвэл энд useEffect барьж аваад TOAST харуулна
  useEffect(() => {
    toastControl("error", props.error);
  }, [props.error]);

  useEffect(() => {
    if (props.success) {
      toastControl("success", props.success);
      setTimeout(() => props.history.replace("/booking"), 2000);
    }
  }, [props.success]);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [inputValue]);

  useEffect(() => {
    if (props.services) {
      setServices(
        props.services.map((el) => {
          return {
            label: el.name,
            value: el._id,
          };
        })
      );
    }
  }, [props.services]);

  useEffect(() => {
    if (props.users) {
      setUsers(
        props.users.map((el) => {
          return {
            label: el.firstName,
            value: el._id,
          };
        })
      );
    }
  }, [props.users]);


  useEffect(() => {
    if(props.booking){
      
      setChoiseDate(props.booking.date)
      if(props.booking.service){
        props.booking.service = props.booking.service._id;
      }

      if(props.booking.date){
        setChoiseDate(props.booking.date.slice(0, 10))
        props.booking.date = props.booking.date.slice(0, 10)
      }

      if(props.booking.userId){
        setUsers(props.booking.userId._id);
        props.booking.userid = props.booking.userId._id
      }


      form.setFieldsValue({...props.booking})
    }
  }, [props.booking])
 

  // Functios



  const paidType = [
    {
      label: "Qpay",
      value: "qpay",
    },
    {
      label: "Банкаар шилжүүлсэн",
      value: "bankaccount",
    },
  ];

  const choiseTimes = () => {
    const time = [];
    for (let i = 1; i <= 12; i++) {
      time.push({
        label: i + ":00",
        value: i + ":00",
      });
    }
    return time;
  };

  return (
    <>
      <div className="content-wrapper">
        <PageTitle name="Түгээмэл асуулт хариулт нэмэх" />
        <div className="page-sub-menu"></div>
        <div className="content">
          <Loader show={loading.visible}> {loading.message} </Loader>
          <div className="container-fluid">
            <Form layout="vertical" form={form}>
              <div className="row">
                <div className="col-8">
                  <div className="card card-primary">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <Form.Item
                            label="Үйлчилгээ"
                            name="service"
                            rules={[requiredRule]}
                          >
                            <Select
                              showSearch
                              optionFilterProp="children"
                              options={services}
                              filterOption={(input, option) =>
                                (option?.label ?? "").includes(input)
                              }
                              placeholder="Үйлчилгээнүүдээс сонгоно уу"
                              
                            />
                          </Form.Item>
                        </div>

                        <div className="col-6">
                          <Form.Item label="Өдөр сонгох" >
                            <DatePicker
                              style={{ width: "100%" }}
                              onChange={handleDate}
                              defaultValue={dayjs(choiseDate)}
                            />
                          </Form.Item>
                        </div>

                        <div className="col-6">
                          <Form.Item
                            label="Цаг сонгох"
                            name="time"
                            rules={[requiredRule]}
                          >
                            <Select options={choiseTimes()}></Select>
                          </Form.Item>
                        </div>

                        <div className="col-6">
                          <Form.Item
                            label="Төлбөр төлөх хэрэгсэл"
                            name="paidType"
                          >
                            <Select
                              options={paidType}
                              placeholder="Төрлөөс сонгоно уу"
                            />
                          </Form.Item>
                        </div>
                        <div className="col-6">
                          <Form.Item
                            name="paidAdvance"
                            label="Урьдчилгаа төлбөр"
                          >
                            <InputNumber
                              style={{ width: "100%" }}
                              placeholder="Урьдчилгаа төлбөр хийсэн бол энд оруулна уу"
                            />
                          </Form.Item>
                        </div>
                        <div className="col-12">
                          <Form.Item
                            name="bookingMsg"
                            label="Захиалгын нэмэлт тайлбар"
                            rules={[requiredRule]}
                          >
                            <TextArea
                              rows={4}
                              placeholder="Захиалгын нэмэлт тайлбар"
                              maxLength={6}
                            />
                          </Form.Item>
                        </div>
                        <div className="col-12">
                          <Form.Item name="userId" label="Хэрэглэгчээс сонгох">
                            <Select
                              showSearch
                              optionFilterProp="children"
                              options={users}
                              filterOption={(input, option) =>
                                (option?.label ?? "").includes(input)
                              }
                              onChange={handleUser}
                              placeholder="Хэрэглэгчдээс сонгоно уу"
                            />
                          </Form.Item>
                        </div>
                        {!choiseUser && (
                          <>
                            <div className="col-6">
                              <Form.Item
                                name="firstName"
                                label="Нэр"
                                rules={[requiredRule]}
                              >
                                <Input
                                  placeholder="Нэрээ оруулна уу"
                                  style={{ width: "100%" }}
                                />
                              </Form.Item>
                            </div>
                            <div className="col-6">
                              <Form.Item
                                name="lastName"
                                label="Овог нэр"
                                rules={[requiredRule]}
                              >
                                <Input placeholder="Имэйл хаягыг оруулна уу" />
                              </Form.Item>
                            </div>
                            <div className="col-6">
                              <Form.Item
                                label="Утасны дугаар"
                                name="phoneNumber"
                                rules={[requiredRule]}
                              >
                                <InputNumber
                                  style={{ width: "100%" }}
                                  placeholder="Утасны дугаараа оруулна уу"
                                />
                              </Form.Item>
                            </div>
                            <div className="col-6">
                              <Form.Item
                                label="Имэйл"
                                name="email"
                                rules={[
                                  {
                                    required: true,
                                    message: "Тус талбарыг заавал бөглөнө үү",
                                  },
                                  {
                                    type: "email",
                                    message: "Имэйл хаяг буруу байна!",
                                  },
                                ]}
                              >
                                <Input placeholder="Имэйл хаягаа оруулна уу" />
                              </Form.Item>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="card">
                    <div class="card-header">
                      <h3 class="card-title">ТОХИРГОО</h3>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <Form.Item label="Идэвхтэй эсэх" name="status">
                            <Switch
                              checkedChildren="Идэвхтэй"
                              unCheckedChildren="Идэвхгүй"
                              size="medium"
                              defaultChecked
                            />
                          </Form.Item>
                        </div>
                        <div className="col-12">
                          <Form.Item label="Төлбөрөө төлсөн эсэх" name="paid">
                            <Switch
                              checkedChildren="Төлсөн"
                              unCheckedChildren="Төлөөгүй"
                              size="medium"
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <div className="control-bottons">
                        <Button
                          key="submit"
                          htmlType="submit"
                          className="add-button"
                          loading={props.loading}
                          onClick={() => {
                            form
                              .validateFields()
                              .then((values) => {
                                handleAdd(values);
                              })
                              .catch((info) => {
                                // console.log(info);
                              });
                          }}
                        >
                          Хадгалах
                        </Button>
                        <Button
                          key="draft"
                          type="primary"
                          onClick={() => {
                            form
                              .validateFields()
                              .then((values) => {
                                handleAdd(values, "draft");
                              })
                              .catch((info) => {
                                // console.log(info);
                              });
                          }}
                        >
                          Ноороглох
                        </Button>
                        <Button onClick={() => props.history.goBack()}>
                          Буцах
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    success: state.bookingReducer.success,
    error: state.bookingReducer.error,
    loading: state.bookingReducer.loading,
    users: state.userReducer.excelData,
    services: state.serviceReducer.excelData,
    bookings: state.bookingReducer.bookings,
    booking: state.bookingReducer.booking
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    tinymceAddPhoto: (file) => dispatch(tinymceAddPhoto(file)),
    updateBooking: (id, data) => dispatch(actions.updateBooking(id, data)),
    getBooking: (id) => dispatch(actions.getBooking(id)),
    getUsers: (query) => dispatch(getUsers(query)),
    getServices: (query) => dispatch(getServices(query)),
    getBookings: (query) => dispatch(actions.loadBooking(query)),
    clear: () => dispatch(actions.clear()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Add);
