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
    type: "CLEAR_PAYTYPE",
  };
};

// SAVE PAYTYPE
export const savePaytypeInit = () => {
  return {
    type: "CREATE_PAYTYPE_INIT",
  };
};

export const savePaytype = (data) => {
  return function (dispatch) {
    dispatch(savePaytypeStart());
    axios
      .post(`/paytypes`, data)
      .then((response) => {
        const result = response.data;
        dispatch(savePaytypeSuccess(result));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(savePaytypeError(resError));
      });
  };
};

export const savePaytypeStart = () => {
  return {
    type: "CREATE_PAYTYPE_START",
  };
};

export const savePaytypeSuccess = (result) => {
  return {
    type: "CREATE_PAYTYPE_SUCCESS",
    paytype: result,
  };
};

export const savePaytypeError = (error) => {
  return {
    type: "CREATE_PAYTYPE_ERROR",
    error,
  };
};

// Excel paytype
export const getExcelData = (query) => {
  return function (dispatch) {
    dispatch(getExcelDataStart());
    axios
      .get("paytypes/excel?" + query)
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
    type: "GET_PAYTYPE_EXCELDATA_START",
  };
};

const getExcelDataSuccess = (data) => {
  return {
    type: "GET_PAYTYPE_EXCELDATA_SUCCESS",
    excel: data,
  };
};

const getExcelDataError = (error) => {
  return {
    type: "GET_PAYTYPE_EXCELDATA_ERROR",
    error,
  };
};

// LOAD PAYTYPE

export const loadPaytype = (query = "") => {
  return function (dispatch) {
    dispatch(loadPaytypeStart());
    axios
      .get("/paytypes?" + query)
      .then((response) => {
        const loadPaytype = response.data.data;
        const pagination = response.data.pagination;
        dispatch(loadPaytypeSuccess(loadPaytype));
        dispatch(loadPagination(pagination));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(loadPaytypeError(resError));
      });
  };
};

export const loadPaytypeStart = () => {
  return {
    type: "LOAD_PAYTYPES_START",
  };
};

export const loadPaytypeSuccess = (paytypes, pagination) => {
  return {
    type: "LOAD_PAYTYPES_SUCCESS",
    paytypes,
    pagination,
  };
};

export const loadPaytypeError = (error) => {
  return {
    type: "LOAD_PAYTYPES_ERROR",
    error,
  };
};

export const loadPagination = (pagination) => {
  return {
    type: "LOAD_PAYTYPE_PAGINATION",
    pagination,
  };
};

export const deleteMultPaytype = (ids) => {
  return function (dispatch) {
    dispatch(deleteMultStart());
    axios
      .delete("paytypes/delete", { params: { id: ids } })
      .then((response) => {
        const deletePaytype = response.data.data;
        dispatch(deletePaytypeSuccess(deletePaytype));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(deletePaytypeError(resError));
      });
  };
};

export const deleteMultStart = () => {
  return {
    type: "DELETE_MULT_PAYTYPE_START",
  };
};

export const deletePaytypeSuccess = (deleteData) => {
  return {
    type: "DELETE_MULT_PAYTYPE_SUCCESS",
    deletePaytype: deleteData,
  };
};

export const deletePaytypeError = (error) => {
  return {
    type: "DELETE_MULT_PAYTYPE_ERROR",
    error,
  };
};

// GET PAYTYPE

export const getInit = () => {
  return {
    type: "GET_PAYTYPE_INIT",
  };
};

export const getPaytype = (id) => {
  return function (dispatch) {
    dispatch(getPaytypeStart());
    axios
      .get("paytypes/" + id)
      .then((response) => {
        const paytype = response.data.data;
        dispatch(getPaytypeSuccess(paytype));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(getPaytypeError(resError));
      });
  };
};

export const getPaytypeStart = () => {
  return {
    type: "GET_PAYTYPE_START",
  };
};

export const getPaytypeSuccess = (paytype) => {
  return {
    type: "GET_PAYTYPE_SUCCESS",
    paytype,
  };
};

export const getPaytypeError = (error) => {
  return {
    type: "GET_PAYTYPE_ERROR",
    error,
  };
};

//UPDATE PAYTYPE

export const updatePaytype = (id, data) => {
  return function (dispatch) {
    dispatch(updatePaytypeStart());
    axios
      .put(`paytypes/${id}`, data)
      .then((response) => {
        const result = response.data;
        dispatch(updatePaytypeSuccess(result));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(updatePaytypeError(resError));
      });
  };
};

export const updatePaytypeStart = () => {
  return {
    type: "UPDATE_PAYTYPE_START",
  };
};

export const updatePaytypeSuccess = (result) => {
  return {
    type: "UPDATE_PAYTYPE_SUCCESS",
    updatePaytype: result,
  };
};

export const updatePaytypeError = (error) => {
  return {
    type: "UPDATE_PAYTYPE_ERROR",
    error,
  };
};

export const getCountPaytype = () => {
  return function (dispatch) {
    dispatch(getCountPaytypeStart());

    axios
      .get(`paytypes/count`)
      .then((response) => {
        const result = response.data.data;
        dispatch(getCountPaytypeSuccess(result));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(getCountPaytypeError(resError));
      });
  };
};

export const getCountPaytypeStart = () => {
  return {
    type: "GET_COUNT_PAYTYPE_START",
  };
};

export const getCountPaytypeSuccess = (result) => {
  return {
    type: "GET_COUNT_PAYTYPE_SUCCESS",
    orderCount: result,
  };
};

export const getCountPaytypeError = (error) => {
  return {
    type: "GET_COUNT_PAYTYPE_ERROR",
    error,
  };
};
