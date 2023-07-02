import axios from "../../axios-base";

const errorBuild = (error) => {
  let resError = "Алдаа гарлаа дахин оролдож үзнэ үү";

  if (resError) {
    resError = error.message;
  }

  if (error.response !== undefined && error.response.status !== undefined) {
    resError = error.response.status;
  }
  if (
    error.response !== undefined &&
    error.response.data !== undefined &&
    error.response.data.error !== undefined
  ) {
    resError = error.response.data.error.message;
  }
  return resError;
};

export const clear = () => {
  return {
    type: "CLEAR_TIREMODAL",
  };
};

// SAVE TIREMODAL
export const saveTireModalInit = () => {
  return {
    type: "CREATE_TIREMODAL_INIT",
  };
};

export const saveTireModal = (data) => {
  return function (dispatch, getState) {
    dispatch(saveTireModalStart());
    axios
      .post(`/tiremodals`, data)
      .then((response) => {
        const result = response.data;
        dispatch(saveTireModalSuccess(result));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(saveTireModalError(resError));
      });
  };
};

export const saveTireModalStart = () => {
  return {
    type: "CREATE_TIREMODAL_START",
  };
};

export const saveTireModalSuccess = (result) => {
  return {
    type: "CREATE_TIREMODAL_SUCCESS",
    tiremodal: result,
  };
};

export const saveTireModalError = (error) => {
  return {
    type: "CREATE_TIREMODAL_ERROR",
    error,
  };
};

// Excel tiremodal
export const getExcelData = (query) => {
  return function (dispatch) {
    dispatch(getExcelDataStart());
    axios
      .get("tiremodals/excel?" + query)
      .then((response) => {
        const data = response.data.data;
        dispatch(getExcelDataSuccess(data));
      })
      .catch((error) => {
        let resError = errorBuild(error);
        dispatch(getExcelDataError(resError));
      });
  };
};

const getExcelDataStart = () => {
  return {
    type: "GET_TIREMODAL_EXCELDATA_START",
  };
};

const getExcelDataSuccess = (data) => {
  return {
    type: "GET_TIREMODAL_EXCELDATA_SUCCESS",
    excel: data,
  };
};

const getExcelDataError = (error) => {
  return {
    type: "GET_TIREMODAL_EXCELDATA_ERROR",
    error,
  };
};

// LOAD TIREMODAL

export const loadTireModal = (query = "") => {
  return function (dispatch, getState) {
    dispatch(loadTireModalStart());
    axios
      .get("tiremodals?" + query)
      .then((response) => {
        const loadTireModal = response.data.data;
        const pagination = response.data.pagination;
        dispatch(loadTireModalSuccess(loadTireModal));
        dispatch(loadPagination(pagination));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(loadTireModalError(resError));
      });
  };
};

export const loadTireModalStart = () => {
  return {
    type: "LOAD_TIREMODAL_START",
  };
};

export const loadTireModalSuccess = (tiremodals, pagination) => {
  return {
    type: "LOAD_TIREMODAL_SUCCESS",
    tiremodals,
    pagination,
  };
};

export const loadTireModalError = (error) => {
  return {
    type: "LOAD_TIREMODAL_ERROR",
    error,
  };
};

export const loadPagination = (pagination) => {
  return {
    type: "LOAD_PAGINATION",
    pagination,
  };
};

export const deleteMultTireModal = (ids) => {
  return function (dispatch, getState) {
    dispatch(deleteMultStart());
    axios
      .delete("tiremodals/delete", { params: { id: ids } })
      .then((response) => {
        const deleteTireModal = response.data.data;
        dispatch(deleteTireModalSuccess(deleteTireModal));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(deleteTireModalError(resError));
      });
  };
};

export const deleteMultStart = () => {
  return {
    type: "DELETE_MULT_TIREMODAL_START",
  };
};

export const deleteTireModalSuccess = (deleteData) => {
  return {
    type: "DELETE_MULT_TIREMODAL_SUCCESS",
    deleteTireModal: deleteData,
  };
};

export const deleteTireModalError = (error) => {
  return {
    type: "DELETE_MULT_TIREMODAL_ERROR",
    error,
  };
};

// GET TIREMODAL

export const getInit = () => {
  return {
    type: "GET_TIREMODAL_INIT",
  };
};

export const getTireModal = (id) => {
  return function (dispatch, getState) {
    dispatch(getTireModalStart());
    axios
      .get("tiremodals/" + id)
      .then((response) => {
        const tiremodal = response.data.data;
        dispatch(getTireModalSuccess(tiremodal));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(getTireModalError(resError));
      });
  };
};

export const getTireModalStart = () => {
  return {
    type: "GET_TIREMODAL_START",
  };
};

export const getTireModalSuccess = (tiremodal) => {
  return {
    type: "GET_TIREMODAL_SUCCESS",
    tiremodal,
  };
};

export const getTireModalError = (error) => {
  return {
    type: "GET_TIREMODAL_ERROR",
    error,
  };
};

//UPDATE TIREMODAL

export const updateTireModal = (id, data) => {
  return function (dispatch) {
    dispatch(updateTireModalStart());
    axios
      .put(`tiremodals/${id}`, data)
      .then((response) => {
        const result = response.data;
        dispatch(updateTireModalSuccess(result));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(updateTireModalError(resError));
      });
  };
};

export const updateTireModalStart = () => {
  return {
    type: "UPDATE_TIREMODAL_START",
  };
};

export const updateTireModalSuccess = (result) => {
  return {
    type: "UPDATE_TIREMODAL_SUCCESS",
    updateTireModal: result,
  };
};

export const updateTireModalError = (error) => {
  return {
    type: "UPDATE_TIREMODAL_ERROR",
    error,
  };
};

export const getCountTireModal = () => {
  return function (dispatch) {
    dispatch(getCountTireModalStart());

    axios
      .get(`tiremodals/count`)
      .then((response) => {
        const result = response.data.data;
        dispatch(getCountTireModalSuccess(result));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(getCountTireModalError(resError));
      });
  };
};

export const getCountTireModalStart = () => {
  return {
    type: "GET_COUNT_TIREMODAL_START",
  };
};

export const getCountTireModalSuccess = (result) => {
  return {
    type: "GET_COUNT_TIREMODAL_SUCCESS",
    orderCount: result,
  };
};

export const getCountTireModalError = (error) => {
  return {
    type: "GET_COUNT_TIREMODAL_ERROR",
    error,
  };
};
