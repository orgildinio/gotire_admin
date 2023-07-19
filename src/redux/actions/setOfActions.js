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
    type: "CLEAR_SETOF",
  };
};

// SAVE SETOF
export const saveSetproductInit = () => {
  return {
    type: "CREATE_SETOF_INIT",
  };
};

export const saveSetproduct = (data) => {
  return function (dispatch, getState) {
    dispatch(saveSetproductStart());
    axios
      .post(`/setproducts`, data)
      .then((response) => {
        const result = response.data;
        dispatch(saveSetproductSuccess(result));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(saveSetproductError(resError));
      });
  };
};

export const saveSetproductStart = () => {
  return {
    type: "CREATE_SETOF_START",
  };
};

export const saveSetproductSuccess = (result) => {
  return {
    type: "CREATE_SETOF_SUCCESS",
    setproduct: result,
  };
};

export const saveSetproductError = (error) => {
  return {
    type: "CREATE_SETOF_ERROR",
    error,
  };
};

// Excel setproduct
export const getExcelData = (query) => {
  return function (dispatch) {
    dispatch(getExcelDataStart());
    axios
      .get("setproducts/excel?" + query)
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
    type: "GET_SETOF_EXCELDATA_START",
  };
};

const getExcelDataSuccess = (data) => {
  return {
    type: "GET_SETOF_EXCELDATA_SUCCESS",
    excel: data,
  };
};

const getExcelDataError = (error) => {
  return {
    type: "GET_SETOF_EXCELDATA_ERROR",
    error,
  };
};

// LOAD SETOF

export const loadSetproduct = (query = "") => {
  return function (dispatch, getState) {
    dispatch(loadSetproductStart());
    axios
      .get("setproducts?" + query)
      .then((response) => {
        const loadSetproduct = response.data.data;
        const pagination = response.data.pagination;
        dispatch(loadSetproductSuccess(loadSetproduct));
        dispatch(loadPagination(pagination));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(loadSetproductError(resError));
      });
  };
};

export const loadSetproductStart = () => {
  return {
    type: "LOAD_SETOF_START",
  };
};

export const loadSetproductSuccess = (setproducts, pagination) => {
  return {
    type: "LOAD_SETOF_SUCCESS",
    setproducts,
    pagination,
  };
};

export const loadSetproductError = (error) => {
  return {
    type: "LOAD_SETOF_ERROR",
    error,
  };
};

export const loadPagination = (pagination) => {
  return {
    type: "LOAD_PAGINATION",
    pagination,
  };
};

export const deleteMultSetproduct = (ids) => {
  return function (dispatch, getState) {
    dispatch(deleteMultStart());
    axios
      .delete("setproducts/delete", { params: { id: ids } })
      .then((response) => {
        const deleteSetproduct = response.data.data;
        dispatch(deleteSetproductSuccess(deleteSetproduct));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(deleteSetproductError(resError));
      });
  };
};

export const deleteMultStart = () => {
  return {
    type: "DELETE_MULT_SETOF_START",
  };
};

export const deleteSetproductSuccess = (deleteData) => {
  return {
    type: "DELETE_MULT_SETOF_SUCCESS",
    deleteSetproduct: deleteData,
  };
};

export const deleteSetproductError = (error) => {
  return {
    type: "DELETE_MULT_SETOF_ERROR",
    error,
  };
};

// GET SETOF

export const getInit = () => {
  return {
    type: "GET_SETOF_INIT",
  };
};

export const getSetproduct = (id) => {
  return function (dispatch, getState) {
    dispatch(getSetproductStart());
    axios
      .get("setproducts/" + id)
      .then((response) => {
        const setproduct = response.data.data;
        dispatch(getSetproductSuccess(setproduct));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(getSetproductError(resError));
      });
  };
};

export const getSetproductStart = () => {
  return {
    type: "GET_SETOF_START",
  };
};

export const getSetproductSuccess = (setproduct) => {
  return {
    type: "GET_SETOF_SUCCESS",
    setproduct,
  };
};

export const getSetproductError = (error) => {
  return {
    type: "GET_SETOF_ERROR",
    error,
  };
};

//UPDATE SETOF

export const updateSetproduct = (id, data) => {
  return function (dispatch) {
    dispatch(updateSetproductStart());
    axios
      .put(`setproducts/${id}`, data)
      .then((response) => {
        const result = response.data;
        dispatch(updateSetproductSuccess(result));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(updateSetproductError(resError));
      });
  };
};

export const updateSetproductStart = () => {
  return {
    type: "UPDATE_SETOF_START",
  };
};

export const updateSetproductSuccess = (result) => {
  return {
    type: "UPDATE_SETOF_SUCCESS",
    updateSetproduct: result,
  };
};

export const updateSetproductError = (error) => {
  return {
    type: "UPDATE_SETOF_ERROR",
    error,
  };
};

export const getCountSetproduct = () => {
  return function (dispatch) {
    dispatch(getCountSetproductStart());

    axios
      .get(`setproducts/count`)
      .then((response) => {
        const result = response.data.data;
        dispatch(getCountSetproductSuccess(result));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(getCountSetproductError(resError));
      });
  };
};

export const getCountSetproductStart = () => {
  return {
    type: "GET_COUNT_SETOF_START",
  };
};

export const getCountSetproductSuccess = (result) => {
  return {
    type: "GET_COUNT_SETOF_SUCCESS",
    orderCount: result,
  };
};

export const getCountSetproductError = (error) => {
  return {
    type: "GET_COUNT_SETOF_ERROR",
    error,
  };
};
