import React, { Component } from "react";
import requestInstance from "../requestAPI";
import ReactDOM from "react-dom";
import { useHistory } from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {email: "", password: "", remember:false, isPasswordShown:false};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheckboxChange= this.handleCheckboxChange.bind(this)
        this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this);
    }; // constructor

    togglePasswordVisibility(event){
        this.setState({
            isPasswordShown: !this.state.isPasswordShown })
    };

    handleCheckboxChange(event){
       this.setState({
           remember:!this.state.remember
       })
    }; // handleCheckboxChange()


    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
       // console.log(event.target.value)
    }; // handleChange()

    async handleSubmit(event) {
        event.preventDefault();
        console.log(this.state.remember)
        try {
            const response = await requestInstance.post('/user/token/obtain/', {
                email: this.state.email,
                password: this.state.password
            });

            const data=response.data
            requestInstance.defaults.headers['Authorization'] = "JWT " + data.access;
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            localStorage.setItem('email',this.state.email);
            localStorage.setItem('remember',this.state.remember);
            console.log("data_access: "+data.access)
            console.log("data_refresh: "+data.refresh)
            this.props.history.push("/main")

            return data;
        } catch (error) {
             this.props.history.push({
                    pathname: '/sign-in',
                    search: '',
                    state: 0
             })
        }
    }; // handleSubmit()

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h3>Sign In</h3>
     <div style={{display:(this.props.location.state==0) ? "block":"none"}}  className="alert alert-danger" role="alert">Wrong Credentials </div>
                <div className="form-group">
                    <label>Email address</label>
                    <input name="email" type="email" value={this.state.email} onChange={this.handleChange} className="form-control" placeholder="Enter email" required />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input name="password"
                           type={this.state.isPasswordShown ? "text" : "password"}
                           value={this.state.password}
                           onChange={this.handleChange} className="form-control"
                           placeholder="Enter password" required/>


                        <FontAwesomeIcon className="password-icon" icon={  this.state.isPasswordShown ? "eye-slash" : "eye"}
                                         onClick={this.togglePasswordVisibility}>
                        </FontAwesomeIcon>
                    <i>{  this.state.isPasswordShown ? " Hide Password" : " Show Password"}</i>
                </div>

                <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input  name="remember" type="checkbox" className="custom-control-input" id="customCheck1"  checked={this.state.remember} onChange={this.handleCheckboxChange}/>
                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>

                    </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block">Submit</button>
                <p className="forgot-password text-right">
                    <a href="/forget_password/">Forgot password?</a>
                </p>
            </form>
        )
    }; // render()
}

export default Login;
