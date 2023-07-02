import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import base from "../../base";

// Actions
import * as actions from "../../redux/actions/loginActions";

const Side = (props) => {
  const [role, setRole] = useState("operator");
  useEffect(() => {
    setRole(props.role);
  }, [props]);

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <a href="/" className="brand-link">
        <span className="brand-text font-weight-light"> Админ удирдлага</span>
      </a>
      <div className="sidebar">
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            {props.avatar ? (
              <img
                src={`${base.cdnUrl}150x150/${props.avatar}`}
                className="img-circle elevation-2"
                alt="User avatar"
              />
            ) : (
              <img
                src={`/assets/img/no-avatar.jpg`}
                className="img-circle elevation-2"
                alt="User "
              />
            )}
          </div>
          <div className="info">
            <a href="/" className="d-block">
              {props.name}
            </a>
            <div className="user-control">
              <a href="/settings" className="user-tools">
                <i className="fas fa-tools"></i>
              </a>
              <a href="/logout" className="user-tools">
                <i className="fas fa-sign-out-alt"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column nav-legacy"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            <li className="nav-item ">
              <NavLink
                to="/"
                className="nav-link"
                exact
                activeClassName="active"
              >
                <i className="nav-icon fas fa-tachometer-alt" />
                <p>Хянах самбар</p>
              </NavLink>
            </li>
            <li className="nav-header">Контент</li>
            <li className="nav-item">
              <NavLink
                to="/wheel"
                className="nav-link"
                activeClassName="active"
              >
                <i className="nav-icon fa fa-car-side"></i>
                <p>Обуд</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/tire" className="nav-link" activeClassName="active">
                <i className="nav-icon fa fa-truck-monster" />
                <p>Дугуй</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/order"
                className="nav-link"
                activeClassName="active"
              >
                <i className="nav-icon fa fa-shopping-cart" />
                <p>Захиалгууд</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/invoice"
                className="nav-link"
                activeClassName="active"
              >
                <i className="nav-icon fa fa-book" />
                <p>Нэхэмжлэлүүд</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/news" className="nav-link" activeClassName="active">
                <i className="nav-icon fa fa-book" />
                <p>Нийтлэл</p>
              </NavLink>
            </li>
            {role != "operator" && (
              <li className="nav-item">
                <NavLink
                  to="/services"
                  className="nav-link"
                  activeClassName="active"
                >
                  <i className="nav-icon far fa-plus-square" />
                  <p>Үйлчилгээ</p>
                </NavLink>
              </li>
            )}
            <li className="nav-item">
              <NavLink
                to="/partners"
                className="nav-link"
                activeClassName="active"
              >
                <i className="nav-icon fa fa-building" />

                <p>Хамтрагчид</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/faqs" className="nav-link" activeClassName="active">
                <i className="nav-icon fa fa-comment" />
                <p>Түгээмэл асуулт хариулт</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/gallery"
                className="nav-link"
                activeClassName="active"
              >
                <i className="nav-icon fa fa-image" />
                <p>Зургийн цомог</p>
              </NavLink>
            </li>
            <li className="nav-header">Бүртгэл</li>
            {role != "operator" && (
              <li className="nav-item">
                <NavLink
                  to="/users"
                  className="nav-link"
                  activeClassName="active"
                >
                  <i className="nav-icon fa fa-users" />
                  <p>Хэрэглэгчид</p>
                </NavLink>
              </li>
            )}
            <li className="nav-header">Вэб тохиргоо</li>
            {role != "operator" && (
              <li className="nav-item">
                <NavLink
                  to="/web_settings"
                  className="nav-link"
                  activeClassName="active"
                >
                  <i className="nav-icon fa fa-cog" />
                  <p>Ерөнхий тохиргоо</p>
                </NavLink>
              </li>
            )}
            {role != "operator" && (
              <li className="nav-item">
                <NavLink
                  to="/menus"
                  className="nav-link"
                  activeClassName="active"
                >
                  <i className="nav-icon fa fa-stream" />
                  <p>Сайтын цэс</p>
                </NavLink>
              </li>
            )}
            {role != "operator" && (
              <li className="nav-item">
                <NavLink
                  to="/pages"
                  className="nav-link"
                  activeClassName="active"
                >
                  <i className="nav-icon fa fa-file" />
                  <p>Сайтын хуудас</p>
                </NavLink>
              </li>
            )}{" "}
            {role != "operator" && (
              <li className="nav-item">
                <NavLink
                  to="/paytype"
                  className="nav-link"
                  activeClassName="active"
                >
                  <i className="nav-icon fa fa-file" />
                  <p>Данс нэмэх</p>
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
        {/* /.sidebar-menu */}
      </div>
      {/* /.sidebar */}
    </aside>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.loginReducer.token,
    userId: state.tokenReducer.userId,
    name: state.tokenReducer.name,
    avatar: state.tokenReducer.avatar,
    role: state.loginReducer.role,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(actions.logout()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Side));
