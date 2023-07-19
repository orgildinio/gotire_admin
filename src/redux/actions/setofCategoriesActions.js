import axios from "../../axios-base";

export const clear = () => {
  return function (dispatch, getState) {
    dispatch(clearStart);
    dispatch(loadSetProductCategories);
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
    type: "CLEAR_SETOFCATEGORIES",
  };
};

export const loadSetProductCategories = () => {
  return function (dispatch, getState) {
    dispatch(loadSetProductCategoriesStart());
    axios
      .get("setproductcategories")
      .then((response) => {
        const result = response.data.data;
        dispatch(loadSetProductCategoriesSuccess(result));
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(loadSetProductCategoriesError(resultError));
      });
  };
};
export const loadSetProductCategoriesStart = () => {
  return {
    type: "LOAD_SETOF_CATEGORIES_START",
  };
};

export const loadSetProductCategoriesSuccess = (result) => {
  return {
    type: "LOAD_SETOF_CATEGORIES_SUCCESS",
    categories: result,
  };
};

export const loadSetProductCategoriesError = (error) => {
  return {
    type: "LOAD_SETOF_CATEGORIES_ERROR",
    error,
  };
};

// SINGLE CATEGORY

export const loadSetProductCategory = (setproductCategoryId) => {
  return function (dispatch, getState) {
    dispatch(loadSetProductCategoryStart());
    axios
      .get(`setproductcategories/${setproductCategoryId}`)
      .then((response) => {
        const loadedSetProductCategory = response.data.data;
        dispatch(loadSetProductCategorySuccess(loadedSetProductCategory));
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(loadSetProductCategoryError(resultError));
      });
  };
};

export const loadSetProductCategoryStart = () => {
  return {
    type: "LOAD_SETOF_CATEGORY_START",
  };
};

export const loadSetProductCategorySuccess = (result) => {
  return {
    type: "LOAD_SETOF_CATEGORY_SUCCESS",
    category: result,
  };
};

export const loadSetProductCategoryError = (error) => {
  return {
    type: "LOAD_SETOF_CATEGORY_ERROR",
    error,
  };
};

// Change positions
export const changePosition = (data) => {
  return function (dispatch) {
    dispatch(changePositionStart());

    axios
      .post("setproductcategories/change", data)
      .then((response) => {
        const result = response.data.data;
        dispatch(changePositionSuccess(result));
        dispatch(loadSetProductCategories());
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(changePositionError(resultError));
      });
  };
};

export const changePositionStart = (result) => {
  return {
    type: "SETOFCATEGORIES_CHANGE_POSITION_START",
  };
};

export const changePositionSuccess = (data) => {
  return {
    type: "SETOFCATEGORIES_CHANGE_POSITION_SUCCESS",
    menus: data,
  };
};

export const changePositionError = (error) => {
  return {
    type: "SETOFCATEGORIES_CHANGE_POSITION_ERROR",
    error: error,
  };
};

// DELETE CATEGORY

export const deleteSetProductCategory = (categoryId, data) => {
  return function (dispatch, getState) {
    dispatch(deleteSetProductCategoryStart());

    axios
      .delete(`setproductcategories/${categoryId}`, data)
      .then((response) => {
        const resultCategory = response.data.data;
        dispatch(deleteSetProductCategorySuccess(resultCategory));
        dispatch(loadSetProductCategories());
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(deleteSetProductCategoryError(resultError));
      });
  };
};

export const deleteSetProductCategoryStart = () => {
  return {
    type: "DELETE_SETOF_CATEGORY_START",
  };
};

export const deleteSetProductCategorySuccess = (result) => {
  return {
    type: "DELETE_SETOF_CATEGORY_SUCCESS",
    dlSetProduct: result,
  };
};

export const deleteSetProductCategoryError = (error) => {
  return {
    type: "DELETE_SETOF_CATEGORY_ERROR",
    error,
  };
};

// SAVE CATEGORY

export const saveSetProductCategory = (category) => {
  return function (dispatch, getState) {
    dispatch(saveSetProductCategoryStart());
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
      .post(`setproductcategories`, data)
      .then((response) => {
        const resultCategory = response.data.data;
        dispatch(saveSetProductCategorySuccess(resultCategory));
        dispatch(loadSetProductCategories());
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(saveSetProductCategoryError(resultError));
      });
  };
};

export const saveSetProductCategoryStart = () => {
  return {
    type: "CREATE_SETOF_CATEGORY_START",
  };
};

export const saveSetProductCategorySuccess = (resultCategory) => {
  return {
    type: "CREATE_SETOF_CATEGORY_SUCCESS",
    resultCategory: resultCategory,
  };
};

export const saveSetProductCategoryError = (error) => {
  return {
    type: "CREATE_SETOF_CATEGORY_ERROR",
    error: error,
  };
};

// UPDATE CATEGORY

export const updateSetProductCategory = (category, id) => {
  return function (dispatch) {
    dispatch(updateSetProductCategoryStart());
    const data = {
      name: category.name,
    };

    axios
      .put(`setproductcategories/${id}`, data)
      .then((response) => {
        const resultCategory = response.data.data;
        dispatch(updateSetProductCategorySuccess(resultCategory));
        dispatch(loadSetProductCategories());
        dispatch(loadSetProductCategory(id));
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(updateSetProductCategoryError(resultError));
      });
  };
};

export const updateSetProductCategoryStart = () => {
  return {
    type: "UPDATE_SETOF_CATEGORY_START",
  };
};

export const updateSetProductCategorySuccess = (resultCategory) => {
  return {
    type: "UPDATE_SETOF_CATEGORY_SUCCESS",
    resultCategory: resultCategory,
  };
};

export const updateSetProductCategoryError = (error) => {
  return {
    type: "UPDATE_SETOF_CATEGORY_ERROR",
    error: error,
  };
};
