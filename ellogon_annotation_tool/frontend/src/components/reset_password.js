import React, { Component } from "react";
import requestInstance from "../requestAPI";
import { useHistory } from "react-router-dom";

class Reset_password extends Component {
    constructor(props) {
        super(props);
        this.state = {email: ""};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
        console.log(event.target.value)
    }

    async handleSubmit(event) {
        event.preventDefault();

        try {
            let response=requestInstance.post('/user/password_reset/', {
                 email: this.state.email
            })
            // const data = response.data
            response.then(result =>
            this.props.history.push({
                pathname: '/forget_password',
                search: '',
                state: result.data.code
            }))

            return 205;
        } catch (error) {
            console.log(error)
            this.props.history.push({
                pathname: '/forget_password',
                search: '',
                state:  0
            })
        }
    }; // handleSubmit()

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h3>Forget Password</h3>
                <div style={{display:(this.props.location.state==1) ? "block":"none"}}  className="alert alert-success" role="alert">
                    Reset Password success.Look your email
                </div>
             <div style={{display:(this.props.location.state==0) ? "block":"none"}}  className="alert alert-danger" role="alert">There is not account with this email </div>
                <div className="form-group">
                    <label>Email address</label>
                    <input name="email" type="email" value={this.state.email} onChange={this.handleChange} className="form-control" placeholder="Enter email" required />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Reset</button>

            </form>
        )
    }; // render()
}
export default Reset_password;
