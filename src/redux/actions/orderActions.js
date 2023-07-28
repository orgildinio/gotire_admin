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
    type: "CLEAR_ORDER",
  };
};

// SAVE ORDER
export const saveOrderInit = () => {
  return {
    type: "CREATE_ORDER_INIT",
  };
};

export const saveOrder = (data) => {
  return function (dispatch, getState) {
    dispatch(saveOrderStart());
    axios
      .post(`/orders`, data)
      .then((response) => {
        const result = response.data;
        dispatch(saveOrderSuccess(result));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(saveOrderError(resError));
      });
  };
};

export const saveOrderStart = () => {
  return {
    type: "CREATE_ORDER_START",
  };
};

export const saveOrderSuccess = (result) => {
  return {
    type: "CREATE_ORDER_SUCCESS",
    order: result,
  };
};

export const saveOrderError = (error) => {
  return {
    type: "CREATE_ORDER_ERROR",
    error,
  };
};

// Excel order
export const getExcelData = (query) => {
  return function (dispatch) {
    dispatch(getExcelDataStart());
    axios
      .get("orders/excel?" + query)
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
    type: "GET_ORDER_EXCELDATA_START",
  };
};

const getExcelDataSuccess = (data) => {
  return {
    type: "GET_ORDER_EXCELDATA_SUCCESS",
    excel: data,
  };
};

const getExcelDataError = (error) => {
  return {
    type: "GET_ORDER_EXCELDATA_ERROR",
    error,
  };
};

// LOAD ORDER

export const loadOrder = (query = "") => {
  return function (dispatch, getState) {
    dispatch(loadOrderStart());
    axios
      .get("orders?" + query)
      .then((response) => {
        const loadOrder = response.data.data;
        const pagination = response.data.pagination;
        dispatch(loadOrderSuccess(loadOrder));
        dispatch(loadPagination(pagination));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(loadOrderError(resError));
      });
  };
};

export const loadOrderStart = () => {
  return {
    type: "LOAD_ORDER_START",
  };
};

export const loadOrderSuccess = (orders, pagination) => {
  return {
    type: "LOAD_ORDER_SUCCESS",
    orders,
    pagination,
  };
};

export const loadOrderError = (error) => {
  return {
    type: "LOAD_ORDER_ERROR",
    error,
  };
};

export const loadPagination = (pagination) => {
  return {
    type: "LOAD_PAGINATION",
    pagination,
  };
};

export const deleteMultOrder = (ids) => {
  return function (dispatch, getState) {
    dispatch(deleteMultStart());
    axios
      .delete("orders/delete", { params: { id: ids } })
      .then((response) => {
        const deleteOrder = response.data.data;
        dispatch(deleteOrderSuccess(deleteOrder));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(deleteOrderError(resError));
      });
  };
};

export const deleteMultStart = () => {
  return {
    type: "DELETE_MULT_ORDER_START",
  };
};

export const deleteOrderSuccess = (deleteData) => {
  return {
    type: "DELETE_MULT_ORDER_SUCCESS",
    deleteOrder: deleteData,
  };
};

export const deleteOrderError = (error) => {
  return {
    type: "DELETE_MULT_ORDER_ERROR",
    error,
  };
};

// GET ORDER

export const getInit = () => {
  return {
    type: "GET_ORDER_INIT",
  };
};

export const getOrder = (id) => {
  return function (dispatch, getState) {
    dispatch(getOrderStart());
    axios
      .get("orders/" + id)
      .then((response) => {
        const order = response.data.data;
        dispatch(getOrderSuccess(order));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(getOrderError(resError));
      });
  };
};

export const getOrderStart = () => {
  return {
    type: "GET_ORDER_START",
  };
};

export const getOrderSuccess = (order) => {
  return {
    type: "GET_ORDER_SUCCESS",
    order,
  };
};

export const getOrderError = (error) => {
  return {
    type: "GET_ORDER_ERROR",
    error,
  };
};

//UPDATE ORDER

export const updateOrder = (id, data) => {
  return function (dispatch) {
    dispatch(updateOrderStart());
    axios
      .put(`orders/${id}`, data)
      .then((response) => {
        const result = response.data;
        dispatch(updateOrderSuccess(result));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(updateOrderError(resError));
      });
  };
};

export const updateOrderStart = () => {
  return {
    type: "UPDATE_ORDER_START",
  };
};

export const updateOrderSuccess = (result) => {
  return {
    type: "UPDATE_ORDER_SUCCESS",
    updateOrder: result,
  };
};

export const updateOrderError = (error) => {
  return {
    type: "UPDATE_ORDER_ERROR",
    error,
  };
};

export const getCountOrder = () => {
  return function (dispatch) {
    dispatch(getCountOrderStart());

    axios
      .get(`orders/count`)
      .then((response) => {
        const result = response.data.data;
        dispatch(getCountOrderSuccess(result));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(getCountOrderError(resError));
      });
  };
};

export const getCountOrderStart = () => {
  return {
    type: "GET_COUNT_ORDER_START",
  };
};

export const getCountOrderSuccess = (result) => {
  return {
    type: "GET_COUNT_ORDER_SUCCESS",
    orderCount: result,
  };
};

export const getCountOrderError = (error) => {
  return {
    type: "GET_COUNT_ORDER_ERROR",
    error,
  };
};
