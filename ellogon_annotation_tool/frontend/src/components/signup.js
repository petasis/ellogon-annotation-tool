import React, { Component } from "react";
import requestInstance from "../requestAPI";

class Signup extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: "",
            email:"",
            errors:{username:"",password:"",email:""}
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    async handleSubmit(event) {
        event.preventDefault();
        try {
            const response = await requestInstance.post('/user/create/', {
                username: this.state.username,
                email: this.state.email,
                password: this.state.password
            });
            this.props.history.push({
              pathname: '/sign-up',
              search: '',
              state:  1
            })
            return response;
        } catch (error) {
             //console.log(error.stack);
            this.props.history.push({
              pathname: '/sign-up',
              search: '',
              state:  0
            })
            this.setState({
                errors:error.response.data
            });
        }
        //console.log(response)
    }; // handleSubmit()

    render() {
        console.log(this.props.location.state)
        return (
         <form onSubmit={this.handleSubmit}>
             <div style={{display:(this.props.location.state==1) ? "block":"none"}}  className="alert alert-success" role="alert">
                    Your account has been created, see your email
                </div>
             <div style={{display:(this.props.location.state==0) ? "block":"none"}}  className="alert alert-danger" role="alert">The creation of account failed due to invalid data</div>
                <h3>Sign Up</h3>

                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" className="form-control" placeholder="Username" value={this.state.username} onChange={this.handleChange} required />
                </div>



                <div className="form-group">
                    <label>Email address</label>
                    <input type="email"  name="email" className="form-control" placeholder="Enter email"  value={this.state.email} onChange={this.handleChange} required/>
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" className="form-control" placeholder="Enter password" value={this.state.password} onChange={this.handleChange} required />
                </div>

                <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                <p className="forgot-password text-right">
                    Already registered? <a href="/sign-in">Sign in!</a>
                </p>
            </form>
        )
    }; // render()
}
export default Signup;
