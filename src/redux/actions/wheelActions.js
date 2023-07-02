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
    type: "CLEAR_WHEEL",
  };
};

// SAVE WHEEL
export const saveWheelInit = () => {
  return {
    type: "CREATE_WHEEL_INIT",
  };
};

export const saveWheel = (data) => {
  return function (dispatch, getState) {
    dispatch(saveWheelStart());
    axios
      .post(`/wheels`, data)
      .then((response) => {
        const result = response.data;
        dispatch(saveWheelSuccess(result));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(saveWheelError(resError));
      });
  };
};

export const saveWheelStart = () => {
  return {
    type: "CREATE_WHEEL_START",
  };
};

export const saveWheelSuccess = (result) => {
  return {
    type: "CREATE_WHEEL_SUCCESS",
    wheel: result,
  };
};

export const saveWheelError = (error) => {
  return {
    type: "CREATE_WHEEL_ERROR",
    error,
  };
};

// Excel wheel
export const getExcelData = (query) => {
  return function (dispatch) {
    dispatch(getExcelDataStart());
    axios
      .get("wheels/excel?" + query)
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
    type: "GET_WHEEL_EXCELDATA_START",
  };
};

const getExcelDataSuccess = (data) => {
  return {
    type: "GET_WHEEL_EXCELDATA_SUCCESS",
    excel: data,
  };
};

const getExcelDataError = (error) => {
  return {
    type: "GET_WHEEL_EXCELDATA_ERROR",
    error,
  };
};

// LOAD WHEEL

export const loadWheel = (query = "") => {
  return function (dispatch, getState) {
    dispatch(loadWheelStart());
    axios
      .get("wheels?" + query)
      .then((response) => {
        const loadWheel = response.data.data;
        const pagination = response.data.pagination;
        dispatch(loadWheelSuccess(loadWheel));
        dispatch(loadPagination(pagination));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(loadWheelError(resError));
      });
  };
};

export const loadWheelStart = () => {
  return {
    type: "LOAD_WHEEL_START",
  };
};

export const loadWheelSuccess = (wheels, pagination) => {
  return {
    type: "LOAD_WHEEL_SUCCESS",
    wheels,
    pagination,
  };
};

export const loadWheelError = (error) => {
  return {
    type: "LOAD_WHEEL_ERROR",
    error,
  };
};

export const loadPagination = (pagination) => {
  return {
    type: "LOAD_PAGINATION",
    pagination,
  };
};

export const deleteMultWheel = (ids) => {
  return function (dispatch, getState) {
    dispatch(deleteMultStart());
    axios
      .delete("wheels/delete", { params: { id: ids } })
      .then((response) => {
        const deleteWheel = response.data.data;
        dispatch(deleteWheelSuccess(deleteWheel));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(deleteWheelError(resError));
      });
  };
};

export const deleteMultStart = () => {
  return {
    type: "DELETE_MULT_WHEEL_START",
  };
};

export const deleteWheelSuccess = (deleteData) => {
  return {
    type: "DELETE_MULT_WHEEL_SUCCESS",
    deleteWheel: deleteData,
  };
};

export const deleteWheelError = (error) => {
  return {
    type: "DELETE_MULT_WHEEL_ERROR",
    error,
  };
};

// GET WHEEL

export const getInit = () => {
  return {
    type: "GET_WHEEL_INIT",
  };
};

export const getWheel = (id) => {
  return function (dispatch, getState) {
    dispatch(getWheelStart());
    axios
      .get("wheels/" + id)
      .then((response) => {
        const wheel = response.data.data;
        dispatch(getWheelSuccess(wheel));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(getWheelError(resError));
      });
  };
};

export const getWheelStart = () => {
  return {
    type: "GET_WHEEL_START",
  };
};

export const getWheelSuccess = (wheel) => {
  return {
    type: "GET_WHEEL_SUCCESS",
    wheel,
  };
};

export const getWheelError = (error) => {
  return {
    type: "GET_WHEEL_ERROR",
    error,
  };
};

//UPDATE WHEEL

export const updateWheel = (id, data) => {
  return function (dispatch) {
    dispatch(updateWheelStart());
    axios
      .put(`wheels/${id}`, data)
      .then((response) => {
        const result = response.data;
        dispatch(updateWheelSuccess(result));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(updateWheelError(resError));
      });
  };
};

export const updateWheelStart = () => {
  return {
    type: "UPDATE_WHEEL_START",
  };
};

export const updateWheelSuccess = (result) => {
  return {
    type: "UPDATE_WHEEL_SUCCESS",
    updateWheel: result,
  };
};

export const updateWheelError = (error) => {
  return {
    type: "UPDATE_WHEEL_ERROR",
    error,
  };
};

export const getCountWheel = () => {
  return function (dispatch) {
    dispatch(getCountWheelStart());

    axios
      .get(`wheels/count`)
      .then((response) => {
        const result = response.data.data;
        dispatch(getCountWheelSuccess(result));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(getCountWheelError(resError));
      });
  };
};

export const getCountWheelStart = () => {
  return {
    type: "GET_COUNT_WHEEL_START",
  };
};

export const getCountWheelSuccess = (result) => {
  return {
    type: "GET_COUNT_WHEEL_SUCCESS",
    orderCount: result,
  };
};

export const getCountWheelError = (error) => {
  return {
    type: "GET_COUNT_WHEEL_ERROR",
    error,
  };
};
