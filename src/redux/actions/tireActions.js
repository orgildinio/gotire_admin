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
    type: "CLEAR_TIRE",
  };
};

// SAVE TIRE
export const saveTireInit = () => {
  return {
    type: "CREATE_TIRE_INIT",
  };
};

export const saveTire = (data) => {
  return function (dispatch, getState) {
    dispatch(saveTireStart());
    axios
      .post(`/tires`, data)
      .then((response) => {
        const result = response.data;
        dispatch(saveTireSuccess(result));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(saveTireError(resError));
      });
  };
};

export const saveTireStart = () => {
  return {
    type: "CREATE_TIRE_START",
  };
};

export const saveTireSuccess = (result) => {
  return {
    type: "CREATE_TIRE_SUCCESS",
    tire: result,
  };
};

export const saveTireError = (error) => {
  return {
    type: "CREATE_TIRE_ERROR",
    error,
  };
};

// Excel tire
export const getExcelData = (query) => {
  return function (dispatch) {
    dispatch(getExcelDataStart());
    axios
      .get("tires/excel?" + query)
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
    type: "GET_TIRE_EXCELDATA_START",
  };
};

const getExcelDataSuccess = (data) => {
  return {
    type: "GET_TIRE_EXCELDATA_SUCCESS",
    excel: data,
  };
};

const getExcelDataError = (error) => {
  return {
    type: "GET_TIRE_EXCELDATA_ERROR",
    error,
  };
};

// LOAD TIRE

export const loadTire = (query = "") => {
  return function (dispatch, getState) {
    dispatch(loadTireStart());
    axios
      .get("tires?" + query)
      .then((response) => {
        const loadTire = response.data.data;
        const pagination = response.data.pagination;
        dispatch(loadTireSuccess(loadTire));
        dispatch(loadPagination(pagination));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(loadTireError(resError));
      });
  };
};

export const loadTireStart = () => {
  return {
    type: "LOAD_TIRE_START",
  };
};

export const loadTireSuccess = (tires, pagination) => {
  return {
    type: "LOAD_TIRE_SUCCESS",
    tires,
    pagination,
  };
};

export const loadTireError = (error) => {
  return {
    type: "LOAD_TIRE_ERROR",
    error,
  };
};

export const loadPagination = (pagination) => {
  return {
    type: "LOAD_PAGINATION",
    pagination,
  };
};

export const deleteMultTire = (ids) => {
  return function (dispatch, getState) {
    dispatch(deleteMultStart());
    axios
      .delete("tires/delete", { params: { id: ids } })
      .then((response) => {
        const deleteTire = response.data.data;
        dispatch(deleteTireSuccess(deleteTire));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(deleteTireError(resError));
      });
  };
};

export const deleteMultStart = () => {
  return {
    type: "DELETE_MULT_TIRE_START",
  };
};

export const deleteTireSuccess = (deleteData) => {
  return {
    type: "DELETE_MULT_TIRE_SUCCESS",
    deleteTire: deleteData,
  };
};

export const deleteTireError = (error) => {
  return {
    type: "DELETE_MULT_TIRE_ERROR",
    error,
  };
};

// GET TIRE

export const getInit = () => {
  return {
    type: "GET_TIRE_INIT",
  };
};

export const getTire = (id) => {
  return function (dispatch, getState) {
    dispatch(getTireStart());
    axios
      .get("tires/" + id)
      .then((response) => {
        const tire = response.data.data;
        dispatch(getTireSuccess(tire));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(getTireError(resError));
      });
  };
};

export const getTireStart = () => {
  return {
    type: "GET_TIRE_START",
  };
};

export const getTireSuccess = (tire) => {
  return {
    type: "GET_TIRE_SUCCESS",
    tire,
  };
};

export const getTireError = (error) => {
  return {
    type: "GET_TIRE_ERROR",
    error,
  };
};

//UPDATE TIRE

export const updateTire = (id, data) => {
  return function (dispatch) {
    dispatch(updateTireStart());
    axios
      .put(`tires/${id}`, data)
      .then((response) => {
        const result = response.data;
        dispatch(updateTireSuccess(result));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(updateTireError(resError));
      });
  };
};

export const updateTireStart = () => {
  return {
    type: "UPDATE_TIRE_START",
  };
};

export const updateTireSuccess = (result) => {
  return {
    type: "UPDATE_TIRE_SUCCESS",
    updateTire: result,
  };
};

export const updateTireError = (error) => {
  return {
    type: "UPDATE_TIRE_ERROR",
    error,
  };
};

export const getCountTire = () => {
  return function (dispatch) {
    dispatch(getCountTireStart());

    axios
      .get(`tires/count`)
      .then((response) => {
        const result = response.data.data;
        dispatch(getCountTireSuccess(result));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(getCountTireError(resError));
      });
  };
};

export const getCountTireStart = () => {
  return {
    type: "GET_COUNT_TIRE_START",
  };
};

export const getCountTireSuccess = (result) => {
  return {
    type: "GET_COUNT_TIRE_SUCCESS",
    orderCount: result,
  };
};

export const getCountTireError = (error) => {
  return {
    type: "GET_COUNT_TIRE_ERROR",
    error,
  };
};
