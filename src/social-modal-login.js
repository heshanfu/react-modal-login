/**
 * Created by piotr.pozniak@thebeaverhead.com on 10/07/2017.
 */

import React from "react";
import PropTypes from "prop-types";

import FacebookLoginButton from "./components/FacebookLoginButton";
import GoogleLoginButton from "./components/GoogleLoginButton";
import Tabs from "./components/Tabs";
import CloseBtn from "./components/Close";

import LoginError from "./components/LoginError";
import RegisterError from "./components/RegisterError";

import Separator from "./components/Separator";
import Loader from "./components/Loader";

import FormWrap from "./components/FormWrap";


export default class SocialModalLogin extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      register: false,
    };

    this.keyHandler = this.keyHandler.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
  }

  /**
   *
   * @param e
   */
  keyHandler(e) {

      e = e || window.event;

      let isEscape = false;
      let isEnter = false;

      if ("key" in e) {
        isEscape = (e.key === "Escape" || e.key === "Esc");
        isEnter = (e.key === "Enter" || e.key === "enter");
      } else {
        isEscape = (e.keyCode === 27);
        isEnter = (e.keyCode === 13);
      }

      if (isEscape) {
        this.onCloseModal();
      }
      if (isEnter) {

        if (this.state.register && form && form.onRegister) {
          form.onRegister();
        } else if (!this.state.register && form && form.onLogin) {
          form.onLogin();
        }
      }
  }

  /**
   *
   */
  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyHandler);
  }

  /**
   *
   */
  componentDidUpdate(prevProps, prevState) {

    /* Initialize Facebook */
    if (this.props.providers && this.props.providers.facebook && typeof FB === 'undefined' && this.props.visible && !this.props.loading) {
      this.props.startLoading();
      this.initFBConnect();
    }

    /* Initialize Google */
    if (this.props.providers && this.props.providers.google && typeof window.gapi === 'undefined' && this.props.visible && !this.props.loading) {
      this.props.startLoading();
      this.initGoogleConnect();
    }

    document.removeEventListener("keydown", this.keyHandler);

    if (this.props.visible) {
      document.addEventListener("keydown", this.keyHandler);
    }

    if (prevState.register !== this.state.register) {

      if (this.props.tabs.onChange) {
        this.props.tabs.onChange();
      }

      // let loginError = document.getElementById("loginError");
      // let registerError = document.getElementById("registerError");
      // let socialRegisterError = document.getElementById("socialRegisterError");
      //
      // if (loginError) {
      //   loginError.innerHTML = '';
      // }
      // if (registerError) {
      //   registerError.innerHTML = '';
      // }
      // if (socialRegisterError) {
      //   socialRegisterError.innerHTML = '';
      // }
    }
  }


  /**
   *
   * @constructor
   */
  initFBConnect() {

      window.fbAsyncInit = () => {
        FB.init({
          appId: this.props.providers.facebook.config.id,
          cookie: this.props.providers.facebook.config.cookie,
          xfbml: this.props.providers.facebook.config.xfbml,
          version: this.props.providers.facebook.config.version
        });

        FB.AppEvents.logPageView();

      };
      ((d, s, id) => {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
          return;
        }
        js = d.createElement(s);
        js.id = id;
        js.onload = () => {
          this.props.finishLoading();
        };
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      })(document, 'script', 'facebook-jssdk');
  }

  /**
   *
   * @constructor
   */
  initGoogleConnect() {

    (() => {
      var e = document.createElement("script");
      e.type = "text/javascript";
      e.async = true;
      e.onload = () => {

        window.gapi.load('auth2', () => {

          window.gapi.auth2.init({
            client_id: this.props.providers.google.config.id,
          });
          this.props.finishLoading();
        })
      };

      e.src = "https://apis.google.com/js/platform.js";
      var t = document.getElementsByTagName("script")[0];
      t.parentNode.insertBefore(e, t);
    })();

  }

  /**
   *
   */
  tabsLoginClick() {

    if (this.props.tabs && this.props.tabs.onLoginClickBeforeTransition) {
      this.props.tabs.onLoginClickBeforeTransition();
    }

    this.setState({
      register: false
    }, () => {

      if (this.props.tabs && this.props.tabs.onLoginClickAfterTransition) {
        this.props.tabs.onLoginClickAfterTransition();
      }
    })
  }

  /**
   *
   */
  tabsRegisterClick() {

    if (this.props.tabs && this.props.tabs.onRegisterClickBeforeTransition) {
      this.props.tabs.onRegisterClickBeforeTransition();
    }

    this.setState({
      register: true
    }, () => {

      if (this.props.tabs && this.props.tabs.onRegisterClickAfterTransition) {
        this.props.tabs.onRegisterClickAfterTransition();
      }
    })
  }

  /**
   *
   */
  onCloseModal() {
    if (this.props.onBeforeCloseModal) {
      this.props.onBeforeCloseModal();
    }

    this.props.onCloseModal();

    if (this.props.onAfterCloseModal) {
      this.props.onAfterCloseModal();
    }
  }

  /**
   *
   * @constructor
   */
  render() {

    const {facebook, google} = this.props.providers;

    const tabs = this.props.tabs
      ? <Tabs
          containerClass={this.props.tabs.containerClass ? this.props.tabs.containerClass : "RML-login-modal-mode"}
          inactive={this.props.loading ? this.props.loading : false}
          loginClick={this.tabsLoginClick.bind(this)}
          registerClick={this.tabsRegisterClick.bind(this)}
          registerActive={this.state.register}
          loginLabel={this.props.tabs.loginLabel ? this.props.tabs.loginLabel : "Sign in"}
          registerLabel={this.props.tabs.registerLabel ? this.props.tabs.registerLabel : "Sign up"}
        />
      : null;

    const closeBtn = this.props.closeBtn
      ? <CloseBtn
          containerClass={this.props.closeBtn.containerClass ? this.props.closeBtn.containerClass : "RML-login-modal-close"}
          click={() => this.onCloseModal()}
        />
      : null;

    let facebookButton = null;

    if (this.props.providers && this.props.providers.facebook) {
      facebookButton = this.props.providers.facebook.btn
        ? <facebook.btn
            btnClass={facebook.btnClass ? facebook.btnClass : "RML-facebook-login-button"}
            onStartLoading={this.props.startLoading}
            onSuccess={facebook.onLoginSuccess ? facebook.onLoginSuccess : null}
            onFail={facebook.onLoginFail ? facebook.onLoginFail : null}
            inactive={this.props.loading ? this.props.loading : false}
            label={facebook.label ? facebook.label : "Continue with Facebook"}
          />
        : <FacebookLoginButton
            btnClass={facebook.btnClass ? facebook.btnClass : "RML-facebook-login-button"}
            onStartLoading={this.props.startLoading}
            onSuccess={facebook.onLoginSuccess ? facebook.onLoginSuccess : null}
            onFail={facebook.onLoginFail ? facebook.onLoginFail : null}
            inactive={this.props.loading ? this.props.loading : false}
            label={facebook.label ? facebook.label : "Continue with Facebook"}
        />;
    }

    let googleButton = null;

    if (this.props.providers && this.props.providers.google) {
      googleButton = this.props.providers.google.btn
        ? <google.btn
            btnClass={google.btnClass ? google.btnClass : "RML-google-login-button"}
            onStartLoading={this.props.startLoading}
            onSuccess={google.onLoginSuccess ? google.onLoginSuccess : null}
            onFail={google.onLoginFail ? google.onLoginFail : null}
            inactive={this.props.loading ? this.props.loading : false}
            label={google.label ? google.label : "Continue with Google"}
          />
        : <GoogleLoginButton
            btnClass={google.btnClass ? google.btnClass : "RML-google-login-button"}
            onStartLoading={this.props.startLoading}
            onSuccess={google.onLoginSuccess ? google.onLoginSuccess : null}
            onFail={google.onLoginFail ? google.onLoginFail : null}
            inactive={this.props.loading ? this.props.loading : false}
            label={google.label ? google.label : "Continue with Google"}
        />;
    }

    const loginError = this.props.error
      ? <LoginError
          containerClass={this.props.loginError.containerClass
            ? this.props.loginError.containerClass : "RML-login-modal-error--login"}
          label={this.props.loginError.label
            ? this.props.loginError.label : "Unable to login. Please try again later"}
        />
      : null;

    const registerError = this.props.error
      ? <RegisterError
          containerClass={this.props.registerError.containerClass
            ? this.props.registerError.containerClass : "RML-login-modal-error--register"}
          label={this.props.registerError.label
            ? this.props.registerError.label : "Unable to register. Please try again later"}
        />
      : null;

    let errorWrap = null;

    if (this.props.error) {
      errorWrap = this.state.register
        ? registerError
        : loginError;
    }

    const separator = this.props.separator
      ? <Separator
          containerClass={this.props.separator.containerClass ? this.props.separator.containerClass : "RML-social-methods-separator"}
          label={this.props.separator.label ? this.props.separator.label : "Or"}
        />
      : null;


    const loader = this.props.loading && !this.props.loader.disabled
      ? <Loader
          containerClass={this.props.loader.containerClass ? this.props.loader.containerClass : "RML-login-modal-indicator"}
          onStartLoading={this.props.startLoading}
          size={24}
        />
      : null;

    const formWrap = this.props.form && !this.props.form.disabled
      ? <FormWrap
          register={this.state.register}
          form={this.props.form}
          loader={loader}
          errorWrap={errorWrap}
        />
      : null;

    const additionalWrap = (!this.props.form || this.props.form.disabled) && (!this.props.additionalWrap.disabled)
          && (this.props.loading || this.props.error)
      ? <div
          className={this.props.additionalWrap.containerClass ? this.props.additionalWrap.containerClass : "RML-login-modal-additional-wrap"}
        >
          {errorWrap}
          {loader}
        </div>
      : null;

    return (
      <div className={(this.props.mainWrapClass ? this.props.mainWrapClass : "RML-login-modal-wrap ") +
        (this.props.visible ? "" : "hidden")}
      >
        <div
          className={this.props.overlayClass ? this.props.overlayClass : "RML-login-modal-overlay"}
          onClick={() => this.onCloseModal()}
        />

        <div
          className={(this.props.visible ? "RML-login-modal-box" : "hidden")}
        >
          <div className={(this.props.visible ? "RML-login-modal-box-content" : "hidden")}>
            {closeBtn}
            {tabs}
            <div className="RML-social-modal-content-wrap">
              {facebookButton}
              {googleButton}

              {separator}

              {formWrap}
              {additionalWrap}
            </div>
          </div>
        </div>

      </div>
    )
  }
};


SocialModalLogin.defaultProps = {
  closeBtn: {},
  tabs: {},
  providers: {},
  loader: {},
  additionalWrap: {}
};

SocialModalLogin.propTypes = {
  mainWrapClass: PropTypes.string,

  visible: PropTypes.bool.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  onBeforeCloseModal: PropTypes.func,
  onAfterCloseModal: PropTypes.func,

  overlayClass: PropTypes.string,

  loginError: PropTypes.shape({
    containerClass: PropTypes.string,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ])
  }),
  registerError: PropTypes.shape({
    containerClass: PropTypes.string,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ])
  }),
  loader: PropTypes.shape({
    disabled: PropTypes.bool,
    containerClass: PropTypes.string,
  }),

  separator: PropTypes.shape({
    containerClass: PropTypes.string,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ])
  }),

  closeBtn: PropTypes.shape({
    containerClass: PropTypes.string
  }),
  tabs: PropTypes.shape({
    containerClass: PropTypes.string,
    onChange: PropTypes.func,
    loginLabel: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    registerLabel: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ])
  }),
  additionalWrap: PropTypes.shape({
    containerClass: PropTypes.string,
    show: PropTypes.bool,
  }),


  providers: PropTypes.shape({
    facebook: PropTypes.shape({
      config: PropTypes.object.isRequired,
      btn: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.element,
      ]),
      onBtnClick: PropTypes.func,
      onLoginSuccess: PropTypes.func,
      onLoginFail: PropTypes.func,
      inactive: PropTypes.bool,
      label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
      ]),
    }),
    google: PropTypes.shape({
      config: PropTypes.object.isRequired,
      btn: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.element,
      ]),
      onBtnClick: PropTypes.func,
      onLoginSuccess: PropTypes.func,
      onLoginFail: PropTypes.func,
      inactive: PropTypes.bool,
      label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
      ]),
    }),
  }),

  form: PropTypes.shape({
    onLogin: PropTypes.func,
    onRegister: PropTypes.func,
    registerContainerClass: PropTypes.string,
    loginContainerClass: PropTypes.string,
    loginBtn: PropTypes.shape({
      buttonClass: PropTypes.string,
      inactive: PropTypes.bool,
      label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
      ]),
    }),
    registerBtn: PropTypes.shape({
      buttonClass: PropTypes.string,
      inactive: PropTypes.bool,
      label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
      ]),
    }),
    loginInputs: PropTypes.arrayOf(
      PropTypes.shape({
        containerClass: PropTypes.string,
        type: PropTypes.string,
        inputClass: PropTypes.string,
        id: PropTypes.string,
        name: PropTypes.string,
        placeholder: PropTypes.string,

        label: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.element,
        ]),
      })
    ),
    registerInputs: PropTypes.arrayOf(
      PropTypes.shape({
        containerClass: PropTypes.string,
        type: PropTypes.string,
        inputClass: PropTypes.string,
        id: PropTypes.string,
        name: PropTypes.string,
        placeholder: PropTypes.string,

        label: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.element,
        ]),
      })
    ),
  })

};