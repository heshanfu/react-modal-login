/**
 * Created by piotr.pozniak@thebeaverhead.com on 10/07/2017.
 */

import React from "react";

import FormLoginButton from "./FormLoginButton";
import FormRegisterButton from "./FormRegisterButton";


export default class FormWrap extends React.Component {

  constructor(props) {
    super(props);
  }

  /**
   *
   * @constructor
   */
  render() {

    const formProps = this.props.form;

    const loginBtn = formProps && formProps.loginBtn
      ? <FormLoginButton
          buttonClass={formProps.loginBtn.buttonClass ? formProps.loginBtn.buttonClass : "RML-btn"}
          inactive={formProps.loginBtn.inactive ? formProps.loginBtn.inactive : false}
          click={formProps.onLogin ? formProps.onLogin : null}
          label={formProps.loginBtn.label ? formProps.loginBtn.label : "Sign in"}
        />
      : <FormLoginButton
          buttonClass={"RML-btn"}
          disabled={false}
          click={formProps.onLogin ? formProps.onLogin : null}
          label={"Sign in"}
      />;

    const registerBtn = formProps.registerBtn
      ? <FormRegisterButton
          buttonClass={formProps.registerBtn.buttonClass ? formProps.registerBtn.buttonClass : "RML-btn"}
          inactive={formProps.registerBtn.inactive ? formProps.registerBtn.inactive : false}
          click={formProps.onRegister ? formProps.onRegister : null}
          label={formProps.registerBtn.label ? formProps.registerBtn.label : "Sign up"}
        />
      : <FormRegisterButton
          buttonClass={"RML-btn"}
          disabled={false}
          click={formProps.onRegister ? formProps.onRegister : null}
          label={"Sign up"}
      />;

    const formLoginInputs = formProps.loginInputs
      ? formProps.loginInputs.map((input, index) => {
        return (
          <div className={input.containerClass} key={index}>
            <label htmlFor={input.id}>{input.label}</label>
            <input
              type={input.type}
              className={input.inputClass}
              id={input.id}
              name={input.name}
              placeholder={input.placeholder}
            />
          </div>
        )
      })
      : null;

    const formRegisterInputs = formProps.registerInputs
      ? formProps.registerInputs.map((input, index) => {
        return (
          <div className={input.containerClass} key={index}>
            <label htmlFor={input.id}>{input.label}</label>
            <input
              type={input.type}
              className={input.inputClass}
              id={input.id}
              name={input.name}
              placeholder={input.placeholder}
            />
          </div>
        )
      })
      : null;

    const formWrap = this.props.register
      ? <div className={formProps.registerContainerClass ? formProps.registerContainerClass : "RML-login-modal-form"}>

          {formRegisterInputs}
          {this.props.errorWrap}
          {registerBtn}
          {this.props.loader}

          <div className="clearfix" />
        </div>
      : <div className={formProps.loginContainerClass ? formProps.loginContainerClass : "RML-login-modal-form"}>

          {formLoginInputs}
          {this.props.errorWrap}
          {loginBtn}
          {this.props.loader}

        <div className="clearfix" />
      </div>;

    return (
      formWrap
    )
  }
};