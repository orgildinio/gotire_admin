import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Switch,
  Upload,
  message,
  Tag,
  InputNumber,
} from "antd";
import { connect } from "react-redux";
import { Editor } from "@tinymce/tinymce-react";

//Components
import PageTitle from "../../../Components/PageTitle";
import { InboxOutlined } from "@ant-design/icons";
import Loader from "../../../Components/Generals/Loader";

//Actions
import { tinymceAddPhoto } from "../../../redux/actions/imageActions";

import * as actions from "../../../redux/actions/payTypeActions";

// Lib
import base from "../../../base";
import axios from "../../../axios-base";
import { toastControl } from "src/lib/toasControl";
import { convertFromdata } from "../../../lib/handleFunction";

const requiredRule = {
  required: true,
  message: "Тус талбарыг заавал бөглөнө үү",
};

const { Dragger } = Upload;

const Edit = (props) => {
  const [form] = Form.useForm();
  const [cover, setCover] = useState({});
  const [logo, setLogo] = useState({});
  const [setProgress] = useState(0);
  const [deleteFiles, setDeleteFiles] = useState([]);
  const [loading, setLoading] = useState({
    visible: false,
    message: "",
  });
  const [checkedRadio, setCheckedRadio] = useState({
    status: true,
  });

  // FUNCTIONS
  const init = () => {
    props.getPaytype(props.match.params.id);
  };

  const clear = () => {
    props.clear();
    form.resetFields();
    setLogo({});
    setCover({});
    setLoading(false);
  };

  // -- TREE FUNCTIONS

  const handleChange = (event) => {
    form.setFieldsValue({ companyInfo: event });
  };

  const handleAdd = (values, status = null) => {
    if (status == "draft") values.status = false;
    if (logo && logo.name) values.logo = logo.name;
    else {
      values.logo = "";
    }
    if (cover && cover.name) values.cover = cover.name;
    else {
      values.cover = "";
    }

    if (deleteFiles && deleteFiles.length > 0) {
      deleteFiles.map(async (deleteFile) => {
        await axios.delete("/imgupload", { data: { file: deleteFile } });
      });
    }

    const data = {
      ...values,
    };

    const sendData = convertFromdata(data);
    props.updatePaytype(props.match.params.id, sendData);
  };

  const handleRemove = (stType, file) => {
    if (stType === "logo") setLogo({});
    if (stType === "cover") setCover({});

    setDeleteFiles((bf) => [...bf, file.name]);
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
      const res = await axios.post("/imgupload", fmData, config);
      const img = {
        name: res.data.data,
        url: `${base.cdnUrl}${res.data.data}`,
      };
      if (type == "logo") setLogo(img);
      if (type == "cover") setCover(img);
      onSuccess("Ok");
      message.success(res.data.data + " Хуулагдлаа");
      return img;
    } catch (err) {
      toastControl("error", err);
      onError({ err });
      return false;
    }
  };

  const uploadOptions = {
    onRemove: (file) => handleRemove("cover", file),
    fileList: cover && cover.name && [cover],
    customRequest: (options) => uploadImage(options, "cover"),
    accept: "image/*",
    name: "cover",
    listType: "picture",
    maxCount: 1,
  };

  const logoOptions = {
    onRemove: (file) => handleRemove("logo", file),
    fileList: logo && logo.name && [logo],
    customRequest: (options) => uploadImage(options, "logo"),
    accept: "image/*",
    name: "cover",
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
      setTimeout(() => props.history.replace("/paytype"), 2000);
    }
  }, [props.success]);

  useEffect(() => {
    if (props.paytype) {
      form.setFieldsValue({ ...props.paytype });
      props.paytype.cover &&
        setCover({
          name: props.paytype.cover,
          url: `${base.cdnUrl}${props.paytype.cover}`,
        });

      props.paytype.logo &&
        setLogo({
          name: props.paytype.logo,
          url: `${base.cdnUrl}${props.paytype.logo}`,
        });

      setCheckedRadio((bc) => ({
        ...bc,
        status: props.paytype.status,
      }));
    }
  }, [props.paytype]);

  return (
    <>
      <div className="content-wrapper">
        <PageTitle name="Хамтрагчийн мэдээлэл шинчлэх" />
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
                            label="Банкны нэр"
                            name="bankName"
                            rules={[requiredRule]}
                          >
                            <Input placeholder="Банкны нэрийг оруулна уу" />
                          </Form.Item>
                        </div>

                        <div className="col-12">
                          <Form.Item
                            label="Банкны данс"
                            name="bankAccount"
                            rules={[requiredRule]}
                          >
                            <InputNumber
                              style={{ width: "100%" }}
                              placeholder="Банкны данс оруулна уу"
                            />
                          </Form.Item>
                        </div>
                        <div className="col-12">
                          <Form.Item
                            label="Банкны эзэмшигчийн нэр"
                            name="accountName"
                            rules={[requiredRule]}
                          >
                            <Input placeholder="Банкны эзэмшигчийн нэрийг оруулна уу" />
                          </Form.Item>
                        </div>
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
                        <div className="col-6"></div>
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
    success: state.payTypeReducer.success,
    error: state.payTypeReducer.error,
    loading: state.payTypeReducer.loading,
    paytype: state.payTypeReducer.paytype,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    tinymceAddPhoto: (file) => dispatch(tinymceAddPhoto(file)),
    updatePaytype: (id, data) => dispatch(actions.updatePaytype(id, data)),
    getPaytype: (id) => dispatch(actions.getPaytype(id)),
    clear: () => dispatch(actions.clear()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
