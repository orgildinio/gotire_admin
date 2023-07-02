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
  Select,
  InputNumber,
  DatePicker,
} from "antd";
import { connect } from "react-redux";
import { Editor } from "@tinymce/tinymce-react";

//Components
import PageTitle from "../../../Components/PageTitle";
import { InboxOutlined } from "@ant-design/icons";
import Loader from "../../../Components/Generals/Loader";

//Actions
import { tinymceAddPhoto } from "../../../redux/actions/imageActions";

import { loadTireMake } from "../../../redux/actions/tireMakeActions";
import { loadTireModal } from "../../../redux/actions/tireModalActions";
import * as actions from "../../../redux/actions/tireActions";

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
  const [audios, setAudios] = useState([]);
  const [videos, setVideos] = useState([]);
  const [type, setType] = useState("default");
  const [choiseData, setChoiseDate] = useState();
  const [gData, setGData] = useState([]);
  const [setProgress] = useState(0);
  const [loading, setLoading] = useState({
    visible: false,
    message: "",
  });

  // FUNCTIONS
  const init = () => {
    props.loadTireMake();
    props.loadTireModal();
  };

  const clear = () => {
    props.clear();
    form.resetFields();
    setPictures([]);
    setAudios([]);
    setVideos([]);
    setType("default");

    setGData([]);
    setLoading(false);
  };

  const handleChange = (event) => {
    form.setFieldsValue({ details: event });
  };

  const onChangeType = (e) => {
    setType(e.target.value);
  };

  const handleAdd = (values, status = null) => {
    if (pictures.length > 0) values.pictures = pictures.map((el) => el.name);

    const data = {
      ...values,
      type,
    };
    data.year = choiseData;
    if (status === "draft") {
      data.status = false;
    }

    const sendData = convertFromdata(data);

    props.saveTire(sendData);
  };

  const handleDate = (date, dateString) => {
    setChoiseDate(dateString);
  };

  const setFunction = (stType, sData) => {
    switch (stType) {
      case "audios":
        setAudios((ba) => [...ba, sData]);
        break;
      case "pictures":
        setPictures((bp) => [...bp, sData]);
        break;
      case "videos":
        setVideos((bv) => [...bv, sData]);
        break;
      default:
        break;
    }
  };

  const handleRemove = (stType, file) => {
    let index;
    let deleteFile;
    let list;

    switch (stType) {
      case "audios":
        index = audios.indexOf(file);
        deleteFile = audios[index].name;
        list = audios.slice();
        list.splice(index, 1);
        setAudios(list);
        break;
      case "pictures":
        index = pictures.indexOf(file);
        deleteFile = pictures[index].name;
        list = pictures.slice();
        list.splice(index, 1);
        setPictures(list);
        break;
      case "videos":
        index = videos.indexOf(file);
        deleteFile = videos[index].name;
        list = videos.slice();
        list.splice(index, 1);
        setVideos(list);
        break;
      default:
        index = pictures.indexOf(list);
        deleteFile = pictures[index].name;
        list = pictures.slice();
        list.splice(index, 1);
        setPictures(list);
        break;
    }

    axios
      .delete("/imgupload", { data: { file: deleteFile } })
      .then((succ) => {
        toastControl("success", "Амжилттай файл устгагдлаа");
      })
      .catch((error) =>
        toastControl("error", "Файл устгах явцад алдаа гарлаа")
      );
  };

  // CONFIGS

  const uploadFile = async (options, stType) => {
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
      setLoading({ visible: true, message: "Түр хүлээнэ үү файл хуулж байна" });
      const res = await axios.post("/imgupload/file", fmData, config);
      const data = {
        name: res.data.data,
        status: "done",
      };
      setFunction(stType, data);
      onSuccess("Ok");
      message.success(res.data.data + " Хуулагдлаа");
      setLoading({ visible: false, message: "" });
    } catch (error) {
      toastControl("error", error);
      onError({ error });
    }
  };

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

  const videoUploadOptions = {
    onRemove: (file) => handleRemove("videos", file),
    customRequest: (options) => uploadFile(options, "videos"),
    fileList: [...videos],
    accept: "video/*",
    name: "video",
    multiple: true,
  };

  const audioUploadOptions = {
    onRemove: (file) => handleRemove("audios", file),
    customRequest: (options) => uploadFile(options, "audios"),
    fileList: [...audios],
    accept: "audio/*",
    name: "audio",
    multiple: true,
  };

  // USEEFFECT
  useEffect(() => {
    init();
    return () => clear();
  }, []);

  useEffect(() => {
    const data = menuGenerateData(props.categories);
    setGData(data);
  }, [props.categories]);

  // Ямар нэгэн алдаа эсвэл амжилттай үйлдэл хийгдвэл энд useEffect барьж аваад TOAST харуулна
  useEffect(() => {
    toastControl("error", props.error);
  }, [props.error]);

  useEffect(() => {
    if (props.success) {
      toastControl("success", props.success);
      setTimeout(() => props.history.replace("/tire"), 2000);
    }
  }, [props.success]);

  return (
    <>
      <div className="content-wrapper">
        <PageTitle name="Дугуй нэмэх" />
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
                            label="Гарчиг"
                            name="name"
                            rules={[requiredRule]}
                            hasFeedback
                          >
                            <Input placeholder="Гарчиг оруулна уу" />
                          </Form.Item>
                        </div>
                        <div className="col-12">
                          <Form.Item
                            label="Үйлдвэрлэгч"
                            name="make"
                            rules={[requiredRule]}
                            hasFeedback
                          >
                            <Select
                              options={
                                props.tiremakes &&
                                props.tiremakes.map((make) => {
                                  return {
                                    value: make._id,
                                    label: make.name,
                                  };
                                })
                              }
                              placeholder="Үйлдвэрлэгчидээс сонгох"
                            />
                          </Form.Item>
                        </div>
                        <div className="col-12">
                          <Form.Item label="Загвар" name="modal" hasFeedback>
                            <Select
                              options={
                                props.tiremodals &&
                                props.tiremodals.map((modal) => {
                                  return {
                                    value: modal._id,
                                    label: modal.name,
                                  };
                                })
                              }
                              placeholder="Загвараас сонгох"
                            />
                          </Form.Item>
                        </div>
                        <div className="col-4">
                          <Form.Item
                            label="Өргөн"
                            name="width"
                            rules={[requiredRule]}
                            hasFeedback
                          >
                            <InputNumber
                              style={{ width: "100%" }}
                              placeholder="Өргөн оруулна уу"
                            />
                          </Form.Item>
                        </div>
                        <div className="col-4">
                          <Form.Item
                            label="Хажуугийн талын хэмжээ"
                            name="height"
                            rules={[requiredRule]}
                            hasFeedback
                          >
                            <InputNumber
                              style={{ width: "100%" }}
                              placeholder="Хажуугийн талын хэмжээ оруулна уу"
                            />
                          </Form.Item>
                        </div>
                        <div className="col-4">
                          <Form.Item
                            label="Диаметрын хэмжээ"
                            name="diameter"
                            rules={[requiredRule]}
                            hasFeedback
                          >
                            <InputNumber
                              style={{ width: "100%" }}
                              placeholder="Диаметрын хэмжээ оруулна уу"
                            />
                          </Form.Item>
                        </div>
                        <div className="col-4">
                          <Form.Item
                            label="Үйлдвэрлэгдсэн огноо"
                            name="year"
                            rules={[requiredRule]}
                            hasFeedback
                          >
                            <DatePicker
                              style={{ width: "100%" }}
                              picker="year"
                              placeholder="Огноо сонгоно уу"
                              onChange={handleDate}
                            />
                          </Form.Item>
                        </div>
                        <div className="col-4">
                          <Form.Item
                            label="Ашиглалтын хувь"
                            name="use"
                            rules={[requiredRule]}
                            hasFeedback
                          >
                            <InputNumber
                              style={{ width: "100%" }}
                              placeholder="Ашиглалтын хувь оруулна уу"
                            />
                          </Form.Item>
                        </div>
                        <div className="col-4">
                          <Form.Item
                            label="Улилрал"
                            name="season"
                            rules={[requiredRule]}
                            hasFeedback
                          >
                            <Select
                              options={[
                                {
                                  value: "summer",
                                  label: "Зуны",
                                },
                                {
                                  value: "winter",
                                  label: "Өвлийн",
                                },
                                {
                                  value: "allin",
                                  label: "4 Улилралын",
                                },
                              ]}
                              placeholder="Загвараас сонгох"
                            />
                          </Form.Item>
                        </div>
                        <div className="col-4">
                          <Form.Item
                            label="Үнэ"
                            name="price"
                            rules={[requiredRule]}
                            hasFeedback
                          >
                            <InputNumber
                              style={{ width: "100%" }}
                              placeholder="Үнэ оруулна уу"
                            />
                          </Form.Item>
                        </div>
                        <div className="col-4">
                          <Form.Item
                            label="Хөнгөлөлт"
                            name="discount"
                            hasFeedback
                          >
                            <InputNumber
                              style={{ width: "100%" }}
                              placeholder="Хөнгөлөлт оруулна уу"
                            />
                          </Form.Item>
                        </div>
                        <div className="col-4">
                          <Form.Item label="Багц" name="setOf" hasFeedback>
                            <InputNumber
                              style={{ width: "100%" }}
                              placeholder="Багц оруулна уу"
                            />
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
                  <div className="row">
                    <div className="col-6">
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
                    {type === "video" && (
                      <div className="col-6">
                        <div className="card">
                          <div class="card-header">
                            <h3 class="card-title">Видео оруулах</h3>
                          </div>
                          <div className="card-body">
                            <Dragger
                              {...videoUploadOptions}
                              className="upload-list-inline"
                            >
                              <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                              </p>
                              <p className="ant-upload-text">
                                Видеогоо энэ хэсэг рүү чирч оруулна уу
                              </p>
                              <p className="ant-upload-hint">
                                Нэг болон түүнээс дээш файл хуулах боломжтой
                              </p>
                            </Dragger>
                          </div>
                        </div>
                      </div>
                    )}
                    {type === "audio" && (
                      <div className="col-6">
                        <div className="card">
                          <div class="card-header">
                            <h3 class="card-title">Аудио оруулах</h3>
                          </div>
                          <div className="card-body">
                            <Dragger
                              {...audioUploadOptions}
                              className="upload-list-inline"
                            >
                              <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                              </p>
                              <p className="ant-upload-text">
                                Аудиогоо энэ хэсэг рүү чирч оруулна уу
                              </p>
                              <p className="ant-upload-hint">
                                Нэг болон түүнээс дээш файл хуулах боломжтой
                              </p>
                            </Dragger>
                          </div>
                        </div>
                      </div>
                    )}
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
                          <Form.Item label="Идэвхтэй эсэх" name="status">
                            <Switch
                              checkedChildren="Идэвхтэй"
                              unCheckedChildren="Идэвхгүй"
                              size="medium"
                              defaultChecked
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
                          Нийтлэх
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
    success: state.tireReducer.success,
    error: state.tireReducer.error,
    loading: state.tireReducer.loading,
    tiremakes: state.tireMakeReducer.tiremakes,
    tiremodals: state.tireModalReducer.tiremodals,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    tinymceAddPhoto: (file) => dispatch(tinymceAddPhoto(file)),
    loadTireMake: () => dispatch(loadTireMake()),
    loadTireModal: () => dispatch(loadTireModal()),
    saveTire: (data) => dispatch(actions.saveTire(data)),
    clear: () => dispatch(actions.clear()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Add);
