import axios from "../../axios-base";

export const clear = () => {
  return function (dispatch, getState) {
    dispatch(clearStart);
    dispatch(loadTireCategories);
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
    type: "CLEAR_TIRECATEGORIES",
  };
};

export const loadTireCategories = () => {
  return function (dispatch, getState) {
    dispatch(loadTireCategoriesStart());
    axios
      .get("tirecategories")
      .then((response) => {
        const result = response.data.data;
        dispatch(loadTireCategoriesSuccess(result));
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(loadTireCategoriesError(resultError));
      });
  };
};
export const loadTireCategoriesStart = () => {
  return {
    type: "LOAD_TIRE_CATEGORIES_START",
  };
};

export const loadTireCategoriesSuccess = (result) => {
  return {
    type: "LOAD_TIRE_CATEGORIES_SUCCESS",
    categories: result,
  };
};

export const loadTireCategoriesError = (error) => {
  return {
    type: "LOAD_TIRE_CATEGORIES_ERROR",
    error,
  };
};

// SINGLE CATEGORY

export const loadTireCategory = (tireCategoryId) => {
  return function (dispatch, getState) {
    dispatch(loadTireCategoryStart());
    axios
      .get(`tirecategories/${tireCategoryId}`)
      .then((response) => {
        const loadedTireCategory = response.data.data;
        dispatch(loadTireCategorySuccess(loadedTireCategory));
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(loadTireCategoryError(resultError));
      });
  };
};

export const loadTireCategoryStart = () => {
  return {
    type: "LOAD_TIRE_CATEGORY_START",
  };
};

export const loadTireCategorySuccess = (result) => {
  return {
    type: "LOAD_TIRE_CATEGORY_SUCCESS",
    category: result,
  };
};

export const loadTireCategoryError = (error) => {
  return {
    type: "LOAD_TIRE_CATEGORY_ERROR",
    error,
  };
};

// Change positions
export const changePosition = (data) => {
  return function (dispatch) {
    dispatch(changePositionStart());

    axios
      .post("tirecategories/change", data)
      .then((response) => {
        const result = response.data.data;
        dispatch(changePositionSuccess(result));
        dispatch(loadTireCategories());
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(changePositionError(resultError));
      });
  };
};

export const changePositionStart = (result) => {
  return {
    type: "TIRECATEGORIES_CHANGE_POSITION_START",
  };
};

export const changePositionSuccess = (data) => {
  return {
    type: "TIRECATEGORIES_CHANGE_POSITION_SUCCESS",
    menus: data,
  };
};

export const changePositionError = (error) => {
  return {
    type: "TIRECATEGORIES_CHANGE_POSITION_ERROR",
    error: error,
  };
};

// DELETE CATEGORY

export const deleteTireCategory = (categoryId, data) => {
  return function (dispatch, getState) {
    dispatch(deleteTireCategoryStart());

    axios
      .delete(`tirecategories/${categoryId}`, data)
      .then((response) => {
        const resultCategory = response.data.data;
        dispatch(deleteTireCategorySuccess(resultCategory));
        dispatch(loadTireCategories());
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(deleteTireCategoryError(resultError));
      });
  };
};

export const deleteTireCategoryStart = () => {
  return {
    type: "DELETE_TIRE_CATEGORY_START",
  };
};

export const deleteTireCategorySuccess = (result) => {
  return {
    type: "DELETE_TIRE_CATEGORY_SUCCESS",
    dlTire: result,
  };
};

export const deleteTireCategoryError = (error) => {
  return {
    type: "DELETE_TIRE_CATEGORY_ERROR",
    error,
  };
};

// SAVE CATEGORY

export const saveTireCategory = (category) => {
  return function (dispatch, getState) {
    dispatch(saveTireCategoryStart());
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
      .post(`tirecategories`, data)
      .then((response) => {
        const resultCategory = response.data.data;
        dispatch(saveTireCategorySuccess(resultCategory));
        dispatch(loadTireCategories());
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(saveTireCategoryError(resultError));
      });
  };
};

export const saveTireCategoryStart = () => {
  return {
    type: "CREATE_TIRE_CATEGORY_START",
  };
};

export const saveTireCategorySuccess = (resultCategory) => {
  return {
    type: "CREATE_TIRE_CATEGORY_SUCCESS",
    resultCategory: resultCategory,
  };
};

export const saveTireCategoryError = (error) => {
  return {
    type: "CREATE_TIRE_CATEGORY_ERROR",
    error: error,
  };
};

// UPDATE CATEGORY

export const updateTireCategory = (category, id) => {
  return function (dispatch) {
    dispatch(updateTireCategoryStart());
    const data = {
      name: category.name,
    };

    axios
      .put(`tirecategories/${id}`, data)
      .then((response) => {
        const resultCategory = response.data.data;
        dispatch(updateTireCategorySuccess(resultCategory));
        dispatch(loadTireCategories());
        dispatch(loadTireCategory(id));
      })
      .catch((error) => {
        const resultError = errorMessage(error);
        dispatch(updateTireCategoryError(resultError));
      });
  };
};

export const updateTireCategoryStart = () => {
  return {
    type: "UPDATE_TIRE_CATEGORY_START",
  };
};

export const updateTireCategorySuccess = (resultCategory) => {
  return {
    type: "UPDATE_TIRE_CATEGORY_SUCCESS",
    resultCategory: resultCategory,
  };
};

export const updateTireCategoryError = (error) => {
  return {
    type: "UPDATE_TIRE_CATEGORY_ERROR",
    error: error,
  };
};
