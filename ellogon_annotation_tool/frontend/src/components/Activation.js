import React, { Component } from "react";
import Login from "./login";
import requestInstance from "../requestAPI";


class Activation extends Component {
    constructor(props) {
        super(props);
    }

    render() {
       console.log(this.props.match.params)
       //console.log(this.props.match.params.token)
       let class_name = "alert alert-success"
       return (
           <div className={class_name} role="alert">Your account has been activated. Click login to connect</div>
       )
    }; // render()
}; // class Activation

export default Activation;
