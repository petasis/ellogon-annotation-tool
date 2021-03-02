import React, { Component } from "react";
import requestInstance from "../requestAPI";

class Mainview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message:"",
        };

        this.getMessage = this.getMessage.bind(this)
    }

    async getMessage() {
        try {
            let response = await requestInstance.get('/main/');
            console.log(response)
            const message = response.data.hello;
            this.setState({
                message: message,
            });
            console.log(message)
            return message;
        } catch(error){
            //console.log("Error: ", JSON.stringify(error, null, 4));
            this.props.history.push({pathname:"/sign-in"});
            throw error;
        }
    }; // getMessage()

    componentDidMount() {
        // Version 1 - no async: Console.log will output something undefined.
        const messageData1 = this.getMessage();
       // console.log(messageData1)
       // console.log("messageData1: ", JSON.stringify(messageData1, null, 4));
    }; // componentDidMount()

    render() {
        
        if(this.props.location.state!=undefined){
            const msg=this.props.location.state.msg
            const classname=this.props.location.state.className
        return (
            <div>
                <div className={classname}>{msg}</div>
               

            </div>
        )}
        else{
            return(<div></div>)
        }
    }; // render()
}

export default Mainview;
