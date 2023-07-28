import { useEffect } from "react";
import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useCookies, CookiesProvider } from "react-cookie";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import { ConfigProvider } from "antd";
import Cookies from "js-cookie";

//Styles
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/antd.css";

// Import components
import Header from "../../Components/Header";
import Side from "../../Components/Side";

// Import page

//Faq
import Faq from "../Faq";
import FaqAdd from "../Faq/Add";
import FaqEdit from "../Faq/Edit";
//Gallery
import Gallery from "../Gallery";
import GalleryAdd from "../Gallery/Add";
import GalleryEdit from "../Gallery/Edit";
// Invoice
import Invoice from "../Invoice";
import InvoiceView from "../Invoice/Views";
//MENU
import Menus from "../Menus";
import FooterMenu from "../Menus/footer";
//NEWS
import News from "../News";
import NewsAdd from "../News/Add";
import NewsEdit from "../News/Edit";
import NewsCategories from "../News/News_categories";
// ORDER
import Order from "../Order";
import OrderView from "../Order/Views";
// Page
import PageAdd from "../Page/Add";
import PageEdit from "../Page/Edit";
import Page from "../Page";
//Partner
import Partner from "../Partner";
import PartnerAdd from "../Partner/Add";
import PartnerEdit from "../Partner/Edit";
// paidtype
import Paytype from "../Paytype";
import PaytypeAdd from "../Paytype/Add";
import PaytypeEdit from "../Paytype/Edit";
//Services
import Service from "../Service";
import ServiceAdd from "../Service/Add";
import ServiceEdit from "../Service/Edit";
// TIRE
import Tire from "../Tire";
import TireAdd from "../Tire/Add";
import TireEdit from "../Tire/Edit";

// TIRE Make
import TireMake from "../Tire/Make";
import TireMakeAdd from "../Tire/Make/Add";
import TireMakeEdit from "../Tire/Make/Edit";

// TIRE MODAL
import TireModal from "../Tire/Modal";
import TireModalAdd from "../Tire/Modal/Add";
import TireModalEdit from "../Tire/Modal/Edit";
// TIRE CATEGORIES
import TireCategory from "../Tire/Tire_categories";
// PRODUCT
import Product from "../Product";
import ProductAdd from "../Product/Add";
import ProductEdit from "../Product/Edit";
// PRODUCT CATEGORIES
import ProductCategory from "../Product/Product_categories";
//User
import User from "../Users";
import UserAdd from "../Users/Add";
import UserEdit from "../Users/Edit";

// WEBSETTINGS
import WebSettings from "../WebSettings";
import Socials from "../WebSettings/socials";
import Banner from "../WebSettings/banner";
import BannerAdd from "../WebSettings/banner/Add";
import BannerEdit from "../WebSettings/banner/Edit";
import Logout from "../Logout";
import LoginPage from "../Login";
import Dashboard from "../Dashboard";

// WHEEL
import Wheel from "../Wheel";
import WheelAdd from "../Wheel/Add";
import WheelEdit from "../Wheel/Edit";
// WHEEL CATEGORIES
import WheelCategory from "../Wheel/Wheel_categories";
// SETOF
import Setof from "../Setof";
import SetofAdd from "../Setof/Add";
import SetofEdit from "../Setof/Edit";
import SetOfCategories from "../Setof/SetOf_categories";
// Actions
import { tokenCheck } from "../../redux/actions/tokenActions";

function App(props) {
  const validateMessages = {
    required: "Заавал бөглөнө үү!",
  };

  const [cookies] = useCookies(["gotiretoken", "language"]);

  useEffect(() => {
    if (cookies.gotiretoken) {
      const token = cookies.gotiretoken;
      props.checkToken(token);
    }
  }, cookies);

  useEffect(() => {
    if (props.tokenError) {
      Cookies.remove("gotiretoken");
      document.location.href = "/login";
    }
  }, props.tokenError);

  return (
    <>
      {cookies.gotiretoken ? (
        <ConfigProvider form={{ validateMessages }}>
          <CookiesProvider>
            <Header />
            <Side />
            <Switch>
              <Route path="/" exact component={Dashboard} />
              //FAQ
              <Route path={"/faqs/edit/:id"} component={FaqEdit} />
              <Route path="/faqs/add" component={FaqAdd} />
              <Route path="/faqs" exact component={Faq} />
              //Gallery
              <Route path={"/gallery/edit/:id"} component={GalleryEdit} />
              <Route path="/gallery/add" component={GalleryAdd} />
              <Route path="/gallery" exact component={Gallery} />
              // Invoice
              <Route path={"/invoice/view/:id"} component={InvoiceView} />
              <Route path="/invoice" exact component={Invoice} />
              // Order
              <Route path={"/order/view/:id"} component={OrderView} />
              <Route path="/order" exact component={Order} />
              //Page
              <Route path={"/pages/edit/:id"} component={PageEdit} />
              <Route path="/pages/add" component={PageAdd} />
              <Route path="/pages" exact component={Page} />
              // Partner
              <Route path={"/partners/edit/:id"} component={PartnerEdit} />
              <Route path="/partners/add" component={PartnerAdd} />
              <Route path="/partners" exact component={Partner} />
              //Padtype
              <Route path={"/paytype/edit/:id"} component={PaytypeEdit} />
              <Route path="/paytype/add" component={PaytypeAdd} />
              <Route path="/paytype" exact component={Paytype} />
              //Service
              <Route path={"/services/edit/:id"} component={ServiceEdit} />
              <Route path="/services/add" component={ServiceAdd} />
              <Route path="/services" exact component={Service} />
              //Tire
              <Route path={"/tire/edit/:id"} component={TireEdit} />
              <Route path={"/tire/categories"} component={TireCategory} />
              <Route path="/tire/add" component={TireAdd} />
              <Route path="/tire" exact component={Tire} />
              //Tire make
              <Route
                path="/tire/make/edit/:id"
                exact
                component={TireMakeEdit}
              />
              <Route path="/tire/make/add" exact component={TireMakeAdd} />
              <Route path="/tire/make" exact component={TireMake} />
              //Tire modal
              <Route path="/tire/modal/edit/:id" component={TireModalEdit} />
              <Route path="/tire/modal/add" component={TireModalAdd} />
              <Route path="/tire/modal" exact component={TireModal} />
              // SETOF
              <Route path="/set/edit/:id" component={SetofEdit} />
              <Route path="/set/categories" component={SetOfCategories} />
              <Route path="/set/add" component={SetofAdd} />
              <Route path="/set" exact component={Setof} />
              //users
              <Route path="/users/add" exact component={UserAdd} />
              <Route path="/users/edit/:id" exact component={UserEdit} />
              <Route path="/users" exact component={User} />
              //NEWS
              <Route path={"/news/edit/:id"} component={NewsEdit} />
              <Route path="/news/categories" exact component={NewsCategories} />
              <Route path="/news/add" component={NewsAdd} />
              <Route path="/news" exact component={News} />
              //Product
              <Route path={"/product/edit/:id"} component={ProductEdit} />
              <Route
                path="/product/categories"
                exact
                component={ProductCategory}
              />
              <Route path="/product/add" component={ProductAdd} />
              <Route path="/product" exact component={Product} />
              //Wheel
              <Route path={"/wheel/edit/:id"} component={WheelEdit} />
              <Route path="/wheel/categories" exact component={WheelCategory} />
              <Route path="/wheel/add" component={WheelAdd} />
              <Route path="/wheel" exact component={Wheel} />
              // Websettings
              <Route
                path="/web_settings/banners/add"
                exact
                component={BannerAdd}
              />
              <Route
                path="/web_settings/banners/edit/:id"
                exact
                component={BannerEdit}
              />
              <Route path="/web_settings/banners" exact component={Banner} />
              <Route path="/menus" exact component={Menus} />
              <Route path="/menus/footer" exact component={FooterMenu} />
              <Route path="/web_settings/socials" exact component={Socials} />
              <Route path="/web_settings" exact component={WebSettings} />
              <Route path="/logout" component={Logout} />
              <Redirect to="/" />
            </Switch>
          </CookiesProvider>
        </ConfigProvider>
      ) : (
        <Switch>
          <Route path="/" exact component={LoginPage} />
          <Route path="/login" component={LoginPage} />
          <Redirect to="/login" />
        </Switch>
      )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    tokenError: state.tokenReducer.error,
  };
};

const mapDispatchToProp = (dispatch) => {
  return {
    checkToken: (token) => dispatch(tokenCheck(token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProp)(App);
