import axios from "../../axios-base";

export const clear = () => {
  return function (dispatch, getState) {
    dispatch(clearStart);
    dispatch(loadProductCategories);
  };
};

const errorMessage = (error) => {
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

export const clearStart = () => {
  return {
    type: "CLEAR_PRODUCTCATEGORIES",
  };
};

export const loadProductCategories = () => {
  return function (dispatch, getState) {
    dispatch(loadProductCategoriesStart());
    axios
      .get("productcategories")
      .then((response) => {
        const result = response.data.data;
        dispatch(loadProductCategoriesSuccess(result));
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(loadProductCategoriesError(resultError));
      });
  };
};
export const loadProductCategoriesStart = () => {
  return {
    type: "LOAD_PRODUCT_CATEGORIES_START",
  };
};

export const loadProductCategoriesSuccess = (result) => {
  return {
    type: "LOAD_PRODUCT_CATEGORIES_SUCCESS",
    categories: result,
  };
};

export const loadProductCategoriesError = (error) => {
  return {
    type: "LOAD_PRODUCT_CATEGORIES_ERROR",
    error,
  };
};

// SINGLE CATEGORY

export const loadProductCategory = (productCategoryId) => {
  return function (dispatch, getState) {
    dispatch(loadProductCategoryStart());
    axios
      .get(`productcategories/${productCategoryId}`)
      .then((response) => {
        const loadedProductCategory = response.data.data;
        dispatch(loadProductCategorySuccess(loadedProductCategory));
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(loadProductCategoryError(resultError));
      });
  };
};

export const loadProductCategoryStart = () => {
  return {
    type: "LOAD_PRODUCT_CATEGORY_START",
  };
};

export const loadProductCategorySuccess = (result) => {
  return {
    type: "LOAD_PRODUCT_CATEGORY_SUCCESS",
    category: result,
  };
};

export const loadProductCategoryError = (error) => {
  return {
    type: "LOAD_PRODUCT_CATEGORY_ERROR",
    error,
  };
};

// Change positions
export const changePosition = (data) => {
  return function (dispatch) {
    dispatch(changePositionStart());

    axios
      .post("productcategories/change", data)
      .then((response) => {
        const result = response.data.data;
        dispatch(changePositionSuccess(result));
        dispatch(loadProductCategories());
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(changePositionError(resultError));
      });
  };
};

export const changePositionStart = (result) => {
  return {
    type: "PRODUCTCATEGORIES_CHANGE_POSITION_START",
  };
};

export const changePositionSuccess = (data) => {
  return {
    type: "PRODUCTCATEGORIES_CHANGE_POSITION_SUCCESS",
    menus: data,
  };
};

export const changePositionError = (error) => {
  return {
    type: "PRODUCTCATEGORIES_CHANGE_POSITION_ERROR",
    error: error,
  };
};

// DELETE CATEGORY

export const deleteProductCategory = (categoryId, data) => {
  return function (dispatch, getState) {
    dispatch(deleteProductCategoryStart());

    axios
      .delete(`productcategories/${categoryId}`, data)
      .then((response) => {
        const resultCategory = response.data.data;
        dispatch(deleteProductCategorySuccess(resultCategory));
        dispatch(loadProductCategories());
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(deleteProductCategoryError(resultError));
      });
  };
};

export const deleteProductCategoryStart = () => {
  return {
    type: "DELETE_PRODUCT_CATEGORY_START",
  };
};

export const deleteProductCategorySuccess = (result) => {
  return {
    type: "DELETE_PRODUCT_CATEGORY_SUCCESS",
    dlProduct: result,
  };
};

export const deleteProductCategoryError = (error) => {
  return {
    type: "DELETE_PRODUCT_CATEGORY_ERROR",
    error,
  };
};

// SAVE CATEGORY

export const saveProductCategory = (category) => {
  return function (dispatch, getState) {
    dispatch(saveProductCategoryStart());
    let data = {
      name: category.name,
      status: category.status,
    };

    if (category.parentId !== null) {
      data = {
        name: category.name,
        parentId: category.parentId,
      };
    }

    data.language = category.language;
    data.status = category.status;

    axios
      .post(`productcategories`, data)
      .then((response) => {
        const resultCategory = response.data.data;
        dispatch(saveProductCategorySuccess(resultCategory));
        dispatch(loadProductCategories());
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(saveProductCategoryError(resultError));
      });
  };
};

export const saveProductCategoryStart = () => {
  return {
    type: "CREATE_PRODUCT_CATEGORY_START",
  };
};

export const saveProductCategorySuccess = (resultCategory) => {
  return {
    type: "CREATE_PRODUCT_CATEGORY_SUCCESS",
    resultCategory: resultCategory,
  };
};

export const saveProductCategoryError = (error) => {
  return {
    type: "CREATE_PRODUCT_CATEGORY_ERROR",
    error: error,
  };
};

// UPDATE CATEGORY

export const updateProductCategory = (category, id) => {
  return function (dispatch) {
    dispatch(updateProductCategoryStart());
    const data = {
      name: category.name,
    };

    axios
      .put(`productcategories/${id}`, data)
      .then((response) => {
        const resultCategory = response.data.data;
        dispatch(updateProductCategorySuccess(resultCategory));
        dispatch(loadProductCategories());
        dispatch(loadProductCategory(id));
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(updateProductCategoryError(resultError));
      });
  };
};

export const updateProductCategoryStart = () => {
  return {
    type: "UPDATE_PRODUCT_CATEGORY_START",
  };
};

export const updateProductCategorySuccess = (resultCategory) => {
  return {
    type: "UPDATE_PRODUCT_CATEGORY_SUCCESS",
    resultCategory: resultCategory,
  };
};

export const updateProductCategoryError = (error) => {
  return {
    type: "UPDATE_PRODUCT_CATEGORY_ERROR",
    error: error,
  };
};
