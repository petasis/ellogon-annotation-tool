import React, { Component } from "react";
import requestInstance from "../requestAPI";
import { useHistory } from "react-router-dom";

class ManageProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {old_password: "", new_password: "", text_message: ""};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getView=this.getView.bind(this)

        //console.log(this.props.location)
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
        //console.log(event.target.value)
    }

    async getView() {
        try {
            let response = await requestInstance.get('user/profile_manage/');
            return response;
        } catch(error) {
            //console.log("Error: ", JSON.stringify(error, null, 4));
            this.props.history.push({pathname:"/sign-in"});
            throw error;
        }
    }; // getView()

    componentDidMount() {
        // Version 1 - no async: Console.log will output something undefined.
        const response = this.getView();
    }

    async handleSubmit(event) {
        event.preventDefault();
        let email=localStorage.getItem('email');

        try {
            let response = requestInstance.post('/user/password_change/', {
                email: email,
                old_password: this.state.old_password,
                new_password: this.state.new_password,
            })
            response.then(result =>
            this.props.history.push({
                pathname: '/user/profile_manage/',
                search: '',
                state: result.data.code
            }))


            //return data;
        } catch (error) {
            console.log(error)
            this.props.history.push({
                pathname: '/user/profile_manage/',
                search: '',
                state: 0
            })
        }

    }; // handleSubmit()

    render() {
       // let email=localStorage.getItem('email');
        //console.log(this.props.location.state)
        return (
            <form onSubmit={this.handleSubmit}>
               <div style={{display:(this.props.location.state==1) ? "block":"none"}}  className="alert alert-success" role="alert">Password has changed successfully </div>
             <div style={{display:(this.props.location.state==0) ? "block":"none"}}  className="alert alert-danger" role="alert">The change of password failed </div>
                <h3>Password change</h3>

                <div className="form-group">
                    <label>Old password</label>
                    <input name="old_password" type="password" value={this.state.old_password} onChange={this.handleChange} className="form-control" placeholder="Enter current password" required />
                </div>

                <div className="form-group">
                    <label>New password</label>
                    <input name="new_password" type="password" value={this.state.new_password} onChange={this.handleChange} className="form-control" placeholder="Enter new password" required/>
                </div>
                <button type="submit" className="btn btn-primary btn-block">Change</button>

            </form>
        )
    }; // render()
}
export default ManageProfile;
