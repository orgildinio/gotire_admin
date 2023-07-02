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
    type: "CLEAR_TIREMAKE",
  };
};

// SAVE TIREMAKE
export const saveTireMakeInit = () => {
  return {
    type: "CREATE_TIREMAKE_INIT",
  };
};

export const saveTireMake = (data) => {
  return function (dispatch, getState) {
    dispatch(saveTireMakeStart());
    axios
      .post(`/tiremakes`, data)
      .then((response) => {
        const result = response.data;
        dispatch(saveTireMakeSuccess(result));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(saveTireMakeError(resError));
      });
  };
};

export const saveTireMakeStart = () => {
  return {
    type: "CREATE_TIREMAKE_START",
  };
};

export const saveTireMakeSuccess = (result) => {
  return {
    type: "CREATE_TIREMAKE_SUCCESS",
    tikemake: result,
  };
};

export const saveTireMakeError = (error) => {
  return {
    type: "CREATE_TIREMAKE_ERROR",
    error,
  };
};

// Excel
export const getExcelData = (query) => {
  return function (dispatch) {
    dispatch(getExcelDataStart());
    axios
      .get("tiremakes/excel?" + query)
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
    type: "GET_TIREMAKE_EXCELDATA_START",
  };
};

const getExcelDataSuccess = (data) => {
  return {
    type: "GET_TIREMAKE_EXCELDATA_SUCCESS",
    excel: data,
  };
};

const getExcelDataError = (error) => {
  return {
    type: "GET_TIREMAKE_EXCELDATA_ERROR",
    error,
  };
};

// LOAD TIREMAKE

export const loadTireMake = (query = "") => {
  return function (dispatch, getState) {
    dispatch(loadTireMakeStart());
    axios
      .get("tiremakes?" + query)
      .then((response) => {
        const loadTireMake = response.data.data;
        const pagination = response.data.pagination;
        dispatch(loadTireMakeSuccess(loadTireMake));
        dispatch(loadPagination(pagination));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(loadTireMakeError(resError));
      });
  };
};

export const loadTireMakeStart = () => {
  return {
    type: "LOAD_TIREMAKE_START",
  };
};

export const loadTireMakeSuccess = (tiremakes, pagination) => {
  return {
    type: "LOAD_TIREMAKE_SUCCESS",
    tiremakes,
    pagination,
  };
};

export const loadTireMakeError = (error) => {
  return {
    type: "LOAD_TIREMAKE_ERROR",
    error,
  };
};

export const loadPagination = (pagination) => {
  return {
    type: "LOAD_PAGINATION",
    pagination,
  };
};

export const deleteMultTireMake = (ids) => {
  return function (dispatch, getState) {
    dispatch(deleteMultStart());
    axios
      .delete("tiremakes/delete", { params: { id: ids } })
      .then((response) => {
        const deleteTireMake = response.data.data;
        dispatch(deleteTireMakeSuccess(deleteTireMake));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(deleteTireMakeError(resError));
      });
  };
};

export const deleteMultStart = () => {
  return {
    type: "DELETE_MULT_TIREMAKE_START",
  };
};

export const deleteTireMakeSuccess = (deleteData) => {
  return {
    type: "DELETE_MULT_TIREMAKE_SUCCESS",
    deleteTireMake: deleteData,
  };
};

export const deleteTireMakeError = (error) => {
  return {
    type: "DELETE_MULT_TIREMAKE_ERROR",
    error,
  };
};

// GET TIREMAKE

export const getInit = () => {
  return {
    type: "GET_TIREMAKE_INIT",
  };
};

export const getTireMake = (id) => {
  return function (dispatch, getState) {
    dispatch(getTireMakeStart());
    axios
      .get("tiremakes/" + id)
      .then((response) => {
        const result = response.data.data;
        dispatch(getTireMakeSuccess(result));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(getTireMakeError(resError));
      });
  };
};

export const getTireMakeStart = () => {
  return {
    type: "GET_TIREMAKE_START",
  };
};

export const getTireMakeSuccess = (tiremake) => {
  return {
    type: "GET_TIREMAKE_SUCCESS",
    tiremake,
  };
};

export const getTireMakeError = (error) => {
  return {
    type: "GET_TIREMAKE_ERROR",
    error,
  };
};

//UPDATE TIREMAKE

export const updateTireMake = (id, data) => {
  return function (dispatch) {
    dispatch(updateTireMakeStart());
    axios
      .put(`tiremakes/${id}`, data)
      .then((response) => {
        const result = response.data;
        dispatch(updateTireMakeSuccess(result));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(updateTireMakeError(resError));
      });
  };
};

export const updateTireMakeStart = () => {
  return {
    type: "UPDATE_TIREMAKE_START",
  };
};

export const updateTireMakeSuccess = (result) => {
  return {
    type: "UPDATE_TIREMAKE_SUCCESS",
    updateTireMake: result,
  };
};

export const updateTireMakeError = (error) => {
  return {
    type: "UPDATE_TIREMAKE_ERROR",
    error,
  };
};

export const getCountTireMake = () => {
  return function (dispatch) {
    dispatch(getCountTireMakeStart());

    axios
      .get(`tiremakes/count`)
      .then((response) => {
        const result = response.data.data;
        dispatch(getCountTireMakeSuccess(result));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(getCountTireMakeError(resError));
      });
  };
};

export const getCountTireMakeStart = () => {
  return {
    type: "GET_COUNT_TIREMAKE_START",
  };
};

export const getCountTireMakeSuccess = (result) => {
  return {
    type: "GET_COUNT_TIREMAKE_SUCCESS",
    orderCount: result,
  };
};

export const getCountTireMakeError = (error) => {
  return {
    type: "GET_COUNT_TIREMAKE_ERROR",
    error,
  };
};
