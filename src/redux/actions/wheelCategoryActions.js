import axios from "../../axios-base";

export const clear = () => {
  return function (dispatch, getState) {
    dispatch(clearStart);
    dispatch(loadWheelCategories);
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
    type: "CLEAR_WHEELCATEGORIES",
  };
};

export const loadWheelCategories = () => {
  return function (dispatch, getState) {
    dispatch(loadWheelCategoriesStart());
    axios
      .get("wheelcategories")
      .then((response) => {
        const result = response.data.data;
        dispatch(loadWheelCategoriesSuccess(result));
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(loadWheelCategoriesError(resultError));
      });
  };
};
export const loadWheelCategoriesStart = () => {
  return {
    type: "LOAD_WHEEL_CATEGORIES_START",
  };
};

export const loadWheelCategoriesSuccess = (result) => {
  return {
    type: "LOAD_WHEEL_CATEGORIES_SUCCESS",
    categories: result,
  };
};

export const loadWheelCategoriesError = (error) => {
  return {
    type: "LOAD_WHEEL_CATEGORIES_ERROR",
    error,
  };
};

// SINGLE CATEGORY

export const loadWheelCategory = (wheelCategoryId) => {
  return function (dispatch, getState) {
    dispatch(loadWheelCategoryStart());
    axios
      .get(`wheelcategories/${wheelCategoryId}`)
      .then((response) => {
        const loadedWheelCategory = response.data.data;
        dispatch(loadWheelCategorySuccess(loadedWheelCategory));
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(loadWheelCategoryError(resultError));
      });
  };
};

export const loadWheelCategoryStart = () => {
  return {
    type: "LOAD_WHEEL_CATEGORY_START",
  };
};

export const loadWheelCategorySuccess = (result) => {
  return {
    type: "LOAD_WHEEL_CATEGORY_SUCCESS",
    category: result,
  };
};

export const loadWheelCategoryError = (error) => {
  return {
    type: "LOAD_WHEEL_CATEGORY_ERROR",
    error,
  };
};

// Change positions
export const changePosition = (data) => {
  return function (dispatch) {
    dispatch(changePositionStart());

    axios
      .post("wheelcategories/change", data)
      .then((response) => {
        const result = response.data.data;
        dispatch(changePositionSuccess(result));
        dispatch(loadWheelCategories());
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(changePositionError(resultError));
      });
  };
};

export const changePositionStart = (result) => {
  return {
    type: "WHEELCATEGORIES_CHANGE_POSITION_START",
  };
};

export const changePositionSuccess = (data) => {
  return {
    type: "WHEELCATEGORIES_CHANGE_POSITION_SUCCESS",
    menus: data,
  };
};

export const changePositionError = (error) => {
  return {
    type: "WHEELCATEGORIES_CHANGE_POSITION_ERROR",
    error: error,
  };
};

// DELETE CATEGORY

export const deleteWheelCategory = (categoryId, data) => {
  return function (dispatch, getState) {
    dispatch(deleteWheelCategoryStart());

    axios
      .delete(`wheelcategories/${categoryId}`, data)
      .then((response) => {
        const resultCategory = response.data.data;
        dispatch(deleteWheelCategorySuccess(resultCategory));
        dispatch(loadWheelCategories());
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(deleteWheelCategoryError(resultError));
      });
  };
};

export const deleteWheelCategoryStart = () => {
  return {
    type: "DELETE_WHEEL_CATEGORY_START",
  };
};

export const deleteWheelCategorySuccess = (result) => {
  return {
    type: "DELETE_WHEEL_CATEGORY_SUCCESS",
    dlWheel: result,
  };
};

export const deleteWheelCategoryError = (error) => {
  return {
    type: "DELETE_WHEEL_CATEGORY_ERROR",
    error,
  };
};

// SAVE CATEGORY

export const saveWheelCategory = (category) => {
  return function (dispatch, getState) {
    dispatch(saveWheelCategoryStart());
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
      .post(`wheelcategories`, data)
      .then((response) => {
        const resultCategory = response.data.data;
        dispatch(saveWheelCategorySuccess(resultCategory));
        dispatch(loadWheelCategories());
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(saveWheelCategoryError(resultError));
      });
  };
};

export const saveWheelCategoryStart = () => {
  return {
    type: "CREATE_WHEEL_CATEGORY_START",
  };
};

export const saveWheelCategorySuccess = (resultCategory) => {
  return {
    type: "CREATE_WHEEL_CATEGORY_SUCCESS",
    resultCategory: resultCategory,
  };
};

export const saveWheelCategoryError = (error) => {
  return {
    type: "CREATE_WHEEL_CATEGORY_ERROR",
    error: error,
  };
};

// UPDATE CATEGORY

export const updateWheelCategory = (category, id) => {
  return function (dispatch) {
    dispatch(updateWheelCategoryStart());
    const data = {
      name: category.name,
    };

    axios
      .put(`wheelcategories/${id}`, data)
      .then((response) => {
        const resultCategory = response.data.data;
        dispatch(updateWheelCategorySuccess(resultCategory));
        dispatch(loadWheelCategories());
        dispatch(loadWheelCategory(id));
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(updateWheelCategoryError(resultError));
      });
  };
};

export const updateWheelCategoryStart = () => {
  return {
    type: "UPDATE_WHEEL_CATEGORY_START",
  };
};

export const updateWheelCategorySuccess = (resultCategory) => {
  return {
    type: "UPDATE_WHEEL_CATEGORY_SUCCESS",
    resultCategory: resultCategory,
  };
};

export const updateWheelCategoryError = (error) => {
  return {
    type: "UPDATE_WHEEL_CATEGORY_ERROR",
    error: error,
  };
};
