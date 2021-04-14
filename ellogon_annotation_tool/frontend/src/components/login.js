import React, { Component } from "react";
import requestInstance from "../requestAPI";

import { useHistory } from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import {getSchema, schemerequestInstance} from "../AnnotationSchemeAPI";
import AnnotationDateEntry from "./AnnotationDateEntry";





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






     componentDidMount(){
       //  let languages=getLanguages(schemerequestInstance,"button")
/*
      //  console.log("Requests")
       /*  let languages=getLanguages(schemerequestInstance,"button")
            languages=getLanguages(schemerequestInstance,"coreference");
        let types=getTypes(schemerequestInstance,"button","greek")
         types=getTypes(schemerequestInstance,"button","english")
         types=getTypes(schemerequestInstance,"button","EN-EL")
         types=getTypes(schemerequestInstance,"button","igbo")
         types=getTypes(schemerequestInstance,"button","neutral")
         types=getTypes(schemerequestInstance,"coreference","greek")
          types=getTypes(schemerequestInstance,"coreference","english")
         types=getTypes(schemerequestInstance,"coreference","EN-EL")
         types=getTypes(schemerequestInstance,"coreference","igbo")
         types=getTypes(schemerequestInstance,"coreference","neutral")
         let type="coreference"
         let lang="neutral"
         let  annotation_type="character"
     //    let annotation_attribute="type"
         let annotation_attribute_alternatives=["NCSR"]
        // let  annotation_type="polarity"
       //  let annotation_attribute=null
       //  let attribute_alternatives=getAttributeAlternatives(schemerequestInstance,type,lang,annotation_type,annotation_attribute)
      // for(let i=0;i<1;i++){
             let attributes = getCoreferenceAttributes(schemerequestInstance, type, lang, annotation_type,annotation_attribute_alternatives[0])
       //  }
           // let attributes = getAttributes(schemerequestInstance, type, lang, annotation_type[5])


 /*
      //  console.log(languages)*/
}





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
                    <input name="password" type={this.state.isPasswordShown ? "text" : "password"} value={this.state.password} onChange={this.handleChange} className="form-control" placeholder="Enter password" required/>
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
