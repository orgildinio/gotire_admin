import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import App from "./Pages/App/";
import reportWebVitals from "./reportWebVitals";

// Reducers
import bannerReducer from "./redux/reducer/bannerReducer";
import contactReducer from "./redux/reducer/contactReducer";
import faqReducer from "./redux/reducer/faqReducer";
import footerMenuReducer from "./redux/reducer/footerMenuReducer";
import galleryReducer from "./redux/reducer/galleryReducer";
import menuReducer from "./redux/reducer/menuReducer";
import newsReducer from "./redux/reducer/newsReducer";
import newsCategoryReducer from "./redux/reducer/newsCategoryReducer";
import pageReducer from "./redux/reducer/pageReducer";
import partnerReducer from "./redux/reducer/partnerReducer";
import payTypeReducer from "./redux/reducer/payTypeReducer";
import serviceReducer from "./redux/reducer/serviceReducer";
import socialLinkReducer from "./redux/reducer/socialLinkReducer";
import tireReducer from "./redux/reducer/tireReducer";
import tireModalReducer from "./redux/reducer/tireModalReducer";
import tireMakeReducer from "./redux/reducer/tireMakeReducer";
import tokenReducer from "./redux/reducer/tokenReducer";
import invoiceReducer from "./redux/reducer/invoiceReducer";
import loginReducer from "./redux/reducer/loginReducer";
import userReducer from "./redux/reducer/userReducer";
import webInfoReducer from "./redux/reducer/webinfoReducer";
import wheelReducer from "./redux/reducer/wheelReducer";
import wheelCategoryReducer from "./redux/reducer/wheelCategoryReducer";
import tireCategoryReducer from "./redux/reducer/tireCategoryReducer";
import setOfReducer from "./redux/reducer/setOfReducer";
import setofCategoryReducer from "./redux/reducer/setofCategoryReducer";
import productReducer from "./redux/reducer/productReducer";
import productCategoryReducer from "./redux/reducer/productCategoryReducer";
import orderReducer from "./redux/reducer/orderReducer";
// styles
import "./index.css";

const loggerMiddlaware = (store) => {
  return (next) => {
    return (action) => {
      // console.log("MyLoggerMiddleware: Dispatching ==> ", action);
      // console.log("MyLoggerMiddleware: State BEFORE : ", store.getState());
      const result = next(action);
      // console.log("MyLoggerMiddleware: State AFTER : ", store.getState());
      return result;
    };
  };
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = combineReducers({
  bannerReducer,
  contactReducer,
  faqReducer,
  footerMenuReducer,
  galleryReducer,
  menuReducer,
  newsReducer,
  newsCategoryReducer,
  pageReducer,
  partnerReducer,
  payTypeReducer,
  serviceReducer,
  socialLinkReducer,
  tireReducer,
  tireModalReducer,
  tireMakeReducer,
  tokenReducer,
  invoiceReducer,
  loginReducer,
  userReducer,
  webInfoReducer,
  wheelReducer,
  wheelCategoryReducer,
  setofCategoryReducer,
  tireCategoryReducer,
  setOfReducer,
  productReducer,
  productCategoryReducer,
  orderReducer,
});

const middlewares = [loggerMiddlaware, thunk];

const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(...middlewares))
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

reportWebVitals();
