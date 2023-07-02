import React, { useEffect, useState } from "react";
import { Form, Input, Button, Switch, Upload, message, Select } from "antd";
import { connect } from "react-redux";
import { Editor } from "@tinymce/tinymce-react";

//Components
import PageTitle from "../../../../Components/PageTitle";
import { InboxOutlined } from "@ant-design/icons";
import Loader from "../../../../Components/Generals/Loader";

//Actions
import { tinymceAddPhoto } from "../../../../redux/actions/imageActions";

import * as actions from "../../../../redux/actions/adsBannerActions";

// Lib
import base from "../../../../base";
import axios from "../../../../axios-base";
import { toastControl } from "src/lib/toasControl";
import { convertFromdata } from "../../../../lib/handleFunction";

const requiredRule = {
  required: true,
  message: "Тус талбарыг заавал бөглөнө үү",
};

const { Dragger } = Upload;

const Edit = (props) => {
  const [form] = Form.useForm();
  const [picture, setPicture] = useState({});
  const [bigPicture, setBigPicture] = useState({});
  const [type, setType] = useState("home");
  const [selectedStatus, setSelectedStatus] = useState(true);
  const [setProgress] = useState(0);
  const [loading, setLoading] = useState({
    visible: false,
    message: "",
  });

  // FUNCTIONS
  const init = () => {
    props.getBanner(props.match.params.id);
    form.setFieldsValue({ type: "home" });
  };

  const clear = () => {
    props.clear();
    form.resetFields();
    setPicture({});
    setBigPicture({});
    setLoading(false);
  };

  // -- TREE FUNCTIONS

  const handleAdd = (values, status = null) => {
    values.status = selectedStatus;
    if (status == "draft") values.status = false;
    if (picture.name) values.picture = picture.name;

    if (type === "home" && bigPicture.name) {
      values.bigPicture = bigPicture.name;
    }

    const data = {
      ...values,
    };

    console.log(values);

    if (
      (!picture.name && !bigPicture.name && type == "home") ||
      (!picture.name && type == "side")
    ) {
      toastControl("error", "Баннер оруулна уу");
    } else {
      const sendData = convertFromdata(data);
      props.updateBanner(props.match.params.id, sendData);
    }
  };

  const handleRemove = (stType, file) => {
    if (stType == "bigPicture") setBigPicture({});
    if (stType == "picture") setPicture({});

    axios
      .delete("/imgupload", { data: { file: file.name } })
      .then((succ) => {
        toastControl("success", "Амжилттай файл устгагдлаа");
      })
      .catch((error) =>
        toastControl("error", "Файл устгах явцад алдаа гарлаа")
      );
  };

  // CONFIGS

  const uploadImage = async (options, type) => {
    const { onSuccess, onError, file, onProgress } = options;
    const fmData = new FormData();
    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (event) => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        setProgress(percent);
        if (percent === 100) {
          setTimeout(() => setProgress(0), 1000);
        }
        onProgress({ percent: (event.loaded / event.total) * 100 });
      },
    };

    fmData.append("file", file);
    try {
      let url = "/imgupload";

      const res = await axios.post(url, fmData, config);
      const img = {
        name: res.data.data,
        url: `${base.cdnUrl}${res.data.data}`,
      };

      if (type == "picture") setPicture(img);
      if (type == "bigPicture") setBigPicture(img);
      onSuccess("Ok");
      message.success(res.data.data + " Хуулагдлаа");
      return img;
    } catch (err) {
      toastControl("error", err);
      onError({ err });
      return false;
    }
  };

  const pictureOptions = {
    onRemove: (file) => handleRemove("picture", file),
    fileList: picture && picture.name && [picture],
    customRequest: (options) => uploadImage(options, "picture"),
    accept: "image/*",
    name: "picture",
    listType: "picture",
    maxCount: 1,
  };

  const bigPictureOptions = {
    onRemove: (file) => handleRemove("bigPicture", file),
    fileList: bigPicture && bigPicture.name && [picture],
    customRequest: (options) => uploadImage(options, "bigPicture"),
    accept: "image/*",
    name: "bigPicture",
    listType: "picture",
    maxCount: 1,
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
      setTimeout(() => props.history.replace("/web_settings/adsbanners"), 2000);
    }
  }, [props.success]);

  useEffect(() => {
    if (props.adsBanner) {
      form.setFieldsValue({ ...props.adsBanner });
      setType(props.adsBanner.type);
      if (props.adsBanner.bigPicture)
        setBigPicture({
          name: props.adsBanner.bigPicture,
          url: `${base.cdnUrl}${props.adsBanner.bigPicture}`,
        });
      if (props.adsBanner.picture)
        setPicture({
          name: props.adsBanner.picture,
          url: `${base.cdnUrl}${props.adsBanner.picture}`,
        });
      setSelectedStatus(props.adsBanner.status);
    }
  }, [props.adsBanner]);

  return (
    <>
      <div className="content-wrapper">
        <PageTitle name="Баннер нэмэх" />
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
                            label="Төрөл"
                            name="type"
                            rules={[requiredRule]}
                            hasFeedback
                          >
                            <Select
                              showSearch
                              placeholder="Төрлөөс сонгох"
                              onChange={(value) => setType(value)}
                              options={[
                                {
                                  value: "home",
                                  label: "Нүүр хуудсанд",
                                },
                                {
                                  value: "side",
                                  label: "Хуудсанд",
                                },
                              ]}
                            />
                          </Form.Item>
                        </div>
                        <div className="col-12">
                          <Form.Item label="Линк" name="link" hasFeedback>
                            <Input placeholder="Холбох линкээ оруулна уу" />
                          </Form.Item>
                        </div>
                        <div className="col-6">
                          <div className="card">
                            <div class="card-header">
                              <h3 class="card-title">Зураг оруулах</h3>
                            </div>
                            <div className="card-body">
                              <Dragger
                                {...pictureOptions}
                                className="upload-list-inline"
                              >
                                <p className="ant-upload-drag-icon">
                                  <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">
                                  Зургаа энэ хэсэг рүү чирч оруулна уу
                                </p>
                                <p className="ant-upload-hint">
                                  Нэг болон түүнээс дээш файл хуулах боломжтой
                                </p>
                              </Dragger>
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div
                            className="card"
                            style={{
                              display: type == "home" ? "flex" : "none",
                            }}
                          >
                            <div class="card-header">
                              <h3 class="card-title">Том зураг оруулах</h3>
                            </div>
                            <div className="card-body">
                              <Dragger
                                {...bigPictureOptions}
                                className="upload-list-inline"
                              >
                                <p className="ant-upload-drag-icon">
                                  <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">
                                  Зургаа энэ хэсэг рүү чирч оруулна уу
                                </p>
                                <p className="ant-upload-hint">
                                  Нэг болон түүнээс дээш файл хуулах боломжтой
                                </p>
                              </Dragger>
                            </div>
                          </div>
                        </div>{" "}
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
                        <div className="col-6">
                          <Form.Item
                            label="Идэвхтэй эсэх"
                            name="status"
                            hasFeedback
                          >
                            <Switch
                              checkedChildren="Идэвхтэй"
                              unCheckedChildren="Идэвхгүй"
                              size="medium"
                              checked={selectedStatus}
                              onChange={(value) => setSelectedStatus(value)}
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
                          Нэмэх
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
    adsBanner: state.adsBannerReducer.adsBanner,
    success: state.adsBannerReducer.success,
    error: state.adsBannerReducer.error,
    loading: state.adsBannerReducer.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    tinymceAddPhoto: (file) => dispatch(tinymceAddPhoto(file)),
    getBanner: (id) => dispatch(actions.getAdsBanner(id)),
    updateBanner: (id, data) => dispatch(actions.updateAdsBanner(id, data)),
    clear: () => dispatch(actions.clear()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
