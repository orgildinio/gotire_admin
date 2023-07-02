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
    type: "CLEAR_INVOICE",
  };
};

// SAVE INVOICE
export const saveInvoiceInit = () => {
  return {
    type: "CREATE_INVOICE_INIT",
  };
};

export const saveInvoice = (data) => {
  return function (dispatch, getState) {
    dispatch(saveInvoiceStart());
    axios
      .post(`invoices`, data)
      .then((response) => {
        const result = response.data;
        dispatch(saveInvoiceSuccess(result));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(saveInvoiceError(resError));
      });
  };
};

export const saveInvoiceStart = () => {
  return {
    type: "CREATE_INVOICE_START",
  };
};

export const saveInvoiceSuccess = (result) => {
  return {
    type: "CREATE_INVOICE_SUCCESS",
    invoice: result,
  };
};

export const saveInvoiceError = (error) => {
  return {
    type: "CREATE_INVOICE_ERROR",
    error,
  };
};

// LOAD INVOICE

export const loadInvoice = (query = "") => {
  return function (dispatch, getState) {
    dispatch(loadInvoiceStart());
    axios
      .get("invoices?" + query)
      .then((response) => {
        const loadInvoice = response.data.data;
        const pagination = response.data.pagination;
        dispatch(loadInvoiceSuccess(loadInvoice));
        dispatch(loadPagination(pagination));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(loadInvoiceError(resError));
      });
  };
};

export const loadInvoiceStart = () => {
  return {
    type: "LOAD_INVOICE_START",
  };
};

export const loadInvoiceSuccess = (invoices, pagination) => {
  return {
    type: "LOAD_INVOICE_SUCCESS",
    invoices,
    pagination,
  };
};

export const loadInvoiceError = (error) => {
  return {
    type: "LOAD_INVOICE_ERROR",
    error,
  };
};

export const loadPagination = (pagination) => {
  return {
    type: "LOAD_INVOICE_PAGINATION",
    pagination,
  };
};

export const deleteMultInvoice = (ids) => {
  return function (dispatch, getState) {
    dispatch(deleteMultStart());
    axios
      .delete("invoices/delete", { params: { id: ids } })
      .then((response) => {
        const deleteInvoice = response.data.data;
        dispatch(deleteInvoiceSuccess(deleteInvoice));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(deleteInvoiceError(resError));
      });
  };
};

export const deleteMultStart = () => {
  return {
    type: "DELETE_MULT_INVOICE_START",
  };
};

export const deleteInvoiceSuccess = (deleteData) => {
  return {
    type: "DELETE_MULT_INVOICE_SUCCESS",
    deleteInvoice: deleteData,
  };
};

export const deleteInvoiceError = (error) => {
  return {
    type: "DELETE_MULT_INVOICE_ERROR",
    error,
  };
};

// GET INVOICE

export const getInit = () => {
  return {
    type: "GET_INVOICE_INIT",
  };
};

export const getInvoice = (id) => {
  return function (dispatch, getState) {
    dispatch(getInvoiceStart());
    axios
      .get("invoices/" + id)
      .then((response) => {
        const invoice = response.data.data;
        dispatch(getInvoiceSuccess(invoice));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(getInvoiceError(resError));
      });
  };
};

export const getInvoiceStart = () => {
  return {
    type: "GET_INVOICE_START",
  };
};

export const getInvoiceSuccess = (invoice) => {
  return {
    type: "GET_INVOICE_SUCCESS",
    invoice,
  };
};

export const getInvoiceError = (error) => {
  return {
    type: "GET_INVOICE_ERROR",
    error,
  };
};

//UPDATE INVOICE

export const updateInvoice = (id, data) => {
  return function (dispatch) {
    dispatch(updateInvoiceStart());
    axios
      .put(`invoices/${id}`, data)
      .then((response) => {
        const result = response.data;
        dispatch(updateInvoiceSuccess(result));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(updateInvoiceError(resError));
      });
  };
};

export const updateInvoiceStart = () => {
  return {
    type: "UPDATE_INVOICE_START",
  };
};

export const updateInvoiceSuccess = (result) => {
  return {
    type: "UPDATE_INVOICE_SUCCESS",
    updateInvoice: result,
  };
};

export const updateInvoiceError = (error) => {
  return {
    type: "UPDATE_INVOICE_ERROR",
    error,
  };
};

export const getCountInvoice = () => {
  return function (dispatch) {
    dispatch(getCountInvoiceStart());

    axios
      .get(`orders/count`)
      .then((response) => {
        const result = response.data.data;
        dispatch(getCountInvoiceSuccess(result));
      })
      .catch((error) => {
        const resError = errorBuild(error);
        dispatch(getCountInvoiceError(resError));
      });
  };
};

export const getCountInvoiceStart = () => {
  return {
    type: "GET_COUNT_INVOICE_START",
  };
};

export const getCountInvoiceSuccess = (result) => {
  return {
    type: "GET_COUNT_INVOICE_SUCCESS",
    orderCount: result,
  };
};

export const getCountInvoiceError = (error) => {
  return {
    type: "GET_COUNT_INVOICE_ERROR",
    error,
  };
};
