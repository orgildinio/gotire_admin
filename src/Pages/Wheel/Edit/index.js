import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Switch,
  Tree,
  Upload,
  Space,
  Radio,
  message,
  InputNumber,
  AutoComplete,
} from "antd";
import { connect } from "react-redux";
import { Editor } from "@tinymce/tinymce-react";

//Components
import PageTitle from "../../../Components/PageTitle";
import { InboxOutlined } from "@ant-design/icons";
import Loader from "../../../Components/Generals/Loader";

//Actions
import * as actions from "../../../redux/actions/wheelActions";

// Lib
import base from "../../../base";
import axios from "../../../axios-base";
import { toastControl } from "src/lib/toasControl";
import { menuGenerateData } from "../../../lib/menuGenerate";
import { convertFromdata } from "../../../lib/handleFunction";

const requiredRule = {
  required: true,
  message: "Тус талбарыг заавал бөглөнө үү",
};

const { Dragger } = Upload;

const Add = (props) => {
  const [form] = Form.useForm();
  const [pictures, setPictures] = useState([]);
  const [setProgress] = useState(0);
  const [deleteFiles, setDeleteFiles] = useState([]);
  const [autoComplete, setAutoComplete] = useState(null);
  const [loading, setLoading] = useState({
    visible: false,
    message: "",
  });

  const [checkedRadio, setCheckedRadio] = useState({
    status: true,
    star: false,
    isDiscount: false,
  });

  // FUNCTIONS
  const init = () => {
    props.getWheel(props.match.params.id);
  };

  const clear = () => {
    props.clear();
    form.resetFields();
    setPictures([]);
    setLoading(false);
  };

  const handleChange = (event) => {
    form.setFieldsValue({ details: event });
  };

  const handleEdit = (values, status = null) => {
    if (pictures.length > 0) {
      values.pictures = pictures.map((el) => el.name);
    } else {
      values.pictures = [];
    }

    if (deleteFiles && deleteFiles.length > 0) {
      deleteFiles.map(async (deleteFile) => {
        await axios.delete("/imgupload", { data: { file: deleteFile } });
      });
    }

    const data = {
      ...values,
      star: values.star || false,
      isDiscount: values.isDiscount || false,
    };

    if (status === "draft") data.status = false;
    const sendData = convertFromdata(data);
    props.updateWheel(props.match.params.id, sendData);
  };

  const handleRemove = (stType, file) => {
    let index = pictures.indexOf(file);
    let deleteFile = pictures[index].name;
    let list = pictures.slice();
    list.splice(index, 1);
    setPictures(list);

    setDeleteFiles((bf) => [...bf, deleteFile]);
  };

  // CONFIGS

  const uploadImage = async (options) => {
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
      setPictures((bfPicture) => [...bfPicture, img]);
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
    onRemove: (file) => handleRemove("pictures", file),
    fileList: [...pictures],
    customRequest: uploadImage,
    accept: "image/*",
    name: "picture",
    multiple: true,
    listType: "picture",
  };

  // USEEFFECT
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("/wheels/groups");
      if (result && result.data) {
        setAutoComplete(() => ({ ...result.data }));
      } else if (result && result.error) {
        toastControl("error", result.error);
      }
    };

    fetchData().catch((err) => console.log(err));
    init();

    return () => clear();
  }, []);

  useEffect(() => {
    if (props.wheel) {
      form.setFieldsValue({ ...props.wheel });

      setCheckedRadio({
        status: props.wheel.status,
        star: props.wheel.star,
        isDiscount: props.wheel.isDiscount,
      });

      props.wheel.pictures &&
        props.wheel.pictures.length > 0 &&
        setPictures(
          props.wheel.pictures.map((img) => ({
            name: img,
            url: `${base.cdnUrl}${img}`,
          }))
        );
    }
  }, [props.wheel]);

  // Ямар нэгэн алдаа эсвэл амжилттай үйлдэл хийгдвэл энд useEffect барьж аваад TOAST харуулна
  useEffect(() => {
    toastControl("error", props.error);
  }, [props.error]);

  useEffect(() => {
    if (props.success) {
      toastControl("success", props.success);
      setTimeout(() => props.history.replace("/wheel"), 2000);
    }
  }, [props.success]);

  return (
    <>
      <div className="content-wrapper">
        <PageTitle name="Обуд шинэчлэх" />
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
                            label="Обудын гарчиг"
                            name="name"
                            rules={[requiredRule]}
                            hasFeedback
                          >
                            <Input placeholder="Обудын гарчиг оруулна уу" />
                          </Form.Item>
                        </div>
                        <div className="col-12">
                          <Form.Item
                            label="Багц"
                            name="setOf"
                            rules={[requiredRule]}
                            hasFeedback
                          >
                            <Input placeholder="Багцална уу" />
                          </Form.Item>
                        </div>
                        <div className="col-12">
                          <Form.Item
                            label="Үнэ"
                            name="price"
                            rules={[requiredRule]}
                            hasFeedback
                          >
                            <Input placeholder="Үнэ оруулна уу" />
                          </Form.Item>
                        </div>
                        {checkedRadio.isDiscount == true && (
                          <div className="col-12">
                            <Form.Item
                              label="Хөнгөлөлтэй үнэ"
                              name="discount"
                              rules={[requiredRule]}
                              hasFeedback
                            >
                              <Input placeholder="Хөнгөлөлтэй үнэ оруулна уу" />
                            </Form.Item>
                          </div>
                        )}
                        <div className="col-4">
                          <Form.Item
                            label="Диаметр"
                            name="diameter"
                            rules={[requiredRule]}
                            hasFeedback
                          >
                            <AutoComplete
                              style={{ width: "100%" }}
                              options={
                                autoComplete &&
                                autoComplete["diameter"] &&
                                autoComplete["diameter"].map((el) => ({
                                  value: el.name,
                                }))
                              }
                              placeholder="Диаметрын хэмжээг оруулна уу"
                            />
                          </Form.Item>
                        </div>
                        <div className="col-4">
                          <Form.Item
                            label="Өндрийг оруулна уу"
                            name="height"
                            rules={[requiredRule]}
                            hasFeedback
                          >
                            <AutoComplete
                              style={{ width: "100%" }}
                              options={
                                autoComplete &&
                                autoComplete["height"] &&
                                autoComplete["height"].map((el) => ({
                                  value: el.name,
                                }))
                              }
                              placeholder="Өндрийг оруулна уу"
                            />
                          </Form.Item>
                        </div>
                        <div className="col-4">
                          <Form.Item
                            label="Болтны хоорондын зайны хэмжээ"
                            name="boltPattern"
                            rules={[requiredRule]}
                            hasFeedback
                          >
                            <AutoComplete
                              options={
                                autoComplete &&
                                autoComplete["boltPattern"] &&
                                autoComplete["boltPattern"].map((el) => ({
                                  value: el.name,
                                }))
                              }
                              placeholder="Болтны хоорондын зайны  хэмжээг оруулна уу"
                            />
                          </Form.Item>
                        </div>
                        <div className="col-4">
                          <Form.Item
                            label="Rim хэмжээ"
                            name="rim"
                            rules={[requiredRule]}
                            hasFeedback
                          >
                            <AutoComplete
                              options={
                                autoComplete &&
                                autoComplete["rim"] &&
                                autoComplete["rim"].map((el) => ({
                                  value: el.name,
                                }))
                              }
                              placeholder="Rim хэмжээг оруулна уу"
                            />
                          </Form.Item>
                        </div>
                        <div className="col-4">
                          <Form.Item
                            label="Дотогшоо суултын хэмжээ"
                            name="inSet"
                            hasFeedback
                          >
                            <Input placeholder="Дотогшоо суултын хэмжээг оруулна уу" />
                          </Form.Item>
                        </div>
                        <div className="col-4">
                          <Form.Item
                            label="Гадагшаа offset хэмжээ"
                            name="offSet"
                            hasFeedback
                          >
                            <Input placeholder="Гадагшаа offset хэмжээг оруулна уу" />
                          </Form.Item>
                        </div>

                        <div className="col-4">
                          <Form.Item
                            label="Болтны нүхний хэмжээ"
                            name="threadSize"
                            hasFeedback
                          >
                            <AutoComplete
                              options={
                                autoComplete &&
                                autoComplete["threadSize"] &&
                                autoComplete["threadSize"].map((el) => ({
                                  value: el.name,
                                }))
                              }
                              placeholder="Болтны нүхний хэмжээг оруулна уу"
                            />
                          </Form.Item>
                        </div>
                        <div className="col-4">
                          <Form.Item
                            label="Обудын голын диаметрын хэмжээ"
                            name="centerBore"
                            hasFeedback
                          >
                            <Input placeholder="Обудын голын диаметрын хэмжээг оруулна уу" />
                          </Form.Item>
                        </div>
                        <div className="col-12">
                          <Form.Item
                            label="Дэлгэрэнгүй"
                            name="details"
                            getValueFromEvent={(e) =>
                              e.target && e.target.getContent()
                            }
                            rules={[requiredRule]}
                          >
                            <Editor
                              apiKey="2nubq7tdhudthiy6wfb88xgs36os4z3f4tbtscdayg10vo1o"
                              init={{
                                height: 300,
                                menubar: false,
                                plugins: [
                                  "advlist textcolor autolink lists link image charmap print preview anchor tinydrive ",
                                  "searchreplace visualblocks code fullscreen",
                                  "insertdatetime media table paste code help wordcount image media  code  table  ",
                                ],
                                toolbar:
                                  "mybutton | addPdf |  image | undo redo | fontselect fontsizeselect formatselect blockquote  | bold italic forecolor  backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | help | link  | quickbars | media | code | tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
                                file_picker_types: "image",
                                tinydrive_token_provider: `${base.apiUrl}users/jwt`,
                                automatic_uploads: false,
                                setup: (editor) => {
                                  editor.ui.registry.addButton("mybutton", {
                                    text: "Файл оруулах",
                                    onAction: () => {
                                      var input =
                                        document.createElement("input");
                                      input.setAttribute("type", "file");
                                      input.onchange = async function () {
                                        var file = this.files[0];
                                        const fData = new FormData();
                                        fData.append("file", file);
                                        setLoading({
                                          visible: true,
                                          message:
                                            "Түр хүлээнэ үү файл хуулж байна",
                                        });
                                        const res = await axios.post(
                                          "/file",
                                          fData
                                        );
                                        const url =
                                          `${base.cdnUrl}` + res.data.data;
                                        editor.insertContent(
                                          `<a href="${url}"> ${res.data.data} </a>`
                                        );
                                        setLoading({
                                          visible: false,
                                        });
                                      };
                                      input.click();
                                    },
                                  });
                                  editor.ui.registry.addButton("addPdf", {
                                    text: "PDF Файл оруулах",
                                    onAction: () => {
                                      let input =
                                        document.createElement("input");
                                      input.setAttribute("type", "file");
                                      input.setAttribute("accept", ".pdf");
                                      input.onchange = async function () {
                                        let file = this.files[0];
                                        const fData = new FormData();
                                        fData.append("file", file);
                                        setLoading({
                                          visible: true,
                                          message:
                                            "Түр хүлээнэ үү файл хуулж байна",
                                        });
                                        const res = await axios.post(
                                          "/file",
                                          fData
                                        );
                                        const url = base.cdnUrl + res.data.data;
                                        editor.insertContent(
                                          `<iframe src="${url}" style="width:100%; min-height: 500px"> </iframe>`
                                        );
                                        setLoading({
                                          visible: false,
                                        });
                                      };
                                      input.click();
                                    },
                                  });
                                },
                                file_picker_callback: function (
                                  cb,
                                  value,
                                  meta
                                ) {
                                  var input = document.createElement("input");
                                  input.setAttribute("type", "file");
                                  input.setAttribute("accept", "image/*");
                                  input.onchange = async function () {
                                    var file = this.files[0];
                                    const fData = new FormData();
                                    fData.append("file", file);
                                    const res = await axios.post(
                                      "/imgupload",
                                      fData
                                    );
                                    const url =
                                      `${base.cdnUrl}` + res.data.data;
                                    cb(url);
                                  };
                                  input.click();
                                },
                              }}
                              onEditorChange={(event) => handleChange(event)}
                            />
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
                        <div className="col-12">
                          <Form.Item label="Зарсан эсэх" name="status">
                            <Switch
                              size="medium"
                              checkedChildren="Зарагдаагүй"
                              unCheckedChildren="Зарагдсан"
                              checked={checkedRadio.status}
                              onChange={(checked) =>
                                setCheckedRadio((bc) => ({
                                  ...bc,
                                  status: checked,
                                }))
                              }
                            />
                          </Form.Item>
                        </div>
                        <div className="col-12">
                          <Form.Item label="Онцлох" name="star">
                            <Switch
                              size="medium"
                              checked={checkedRadio.star}
                              onChange={(checked) =>
                                setCheckedRadio((bc) => ({
                                  ...bc,
                                  star: checked,
                                }))
                              }
                            />
                          </Form.Item>
                        </div>
                        <div className="col-12">
                          <Form.Item label="Хямдрал зарлах" name="isDiscount">
                            <Switch
                              size="medium"
                              checked={checkedRadio.isDiscount}
                              onChange={(checked) =>
                                setCheckedRadio((bc) => ({
                                  ...bc,
                                  isDiscount: checked,
                                }))
                              }
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
                                handleEdit(values);
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
                                handleEdit(values, "draft");
                              })
                              .catch((info) => {
                                // console.log(info);
                              });
                          }}
                        >
                          Зарагдсан
                        </Button>
                        <Button onClick={() => props.history.goBack()}>
                          Буцах
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div class="card-header">
                      <h3 class="card-title">Зураг оруулах</h3>
                    </div>
                    <div className="card-body">
                      <Dragger
                        {...uploadOptions}
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
    success: state.wheelReducer.success,
    error: state.wheelReducer.error,
    loading: state.wheelReducer.loading,
    wheel: state.wheelReducer.wheel,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateWheel: (id, data) => dispatch(actions.updateWheel(id, data)),
    getWheel: (id) => dispatch(actions.getWheel(id)),
    clear: () => dispatch(actions.clear()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Add);
