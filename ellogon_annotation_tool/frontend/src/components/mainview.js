import React, { Component } from "react";
import requestInstance from "../requestAPI";
import UserItemView from "./userItemView";


class Mainview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message:"",
        };
        this.handleClose=this.handleClose.bind(this)
        this.getMessage = this.getMessage.bind(this)
    }

    async getMessage(){
    try {
        let response = await requestInstance.get('/main/');
       // console.log(response)
        const message = response.data.hello;
        this.setState({
            message: message,
        });
       // console.log(message)
        return message;
    }catch(error){
        //console.log("Error: ", JSON.stringify(error, null, 4));
        this.props.history.push({pathname:"/sign-in"});
        throw error;
    }
}





    componentDidMount(){
        // It's not the most straightforward thing to run an async method in componentDidMount
       // window.addEventListener('onbeforeunload', this.props.handleWindowClose);

        // Version 1 - no async: Console.log will output something undefined.
        const messageData1 = this.getMessage();
       // console.log(messageData1)
     //   console.log("messageData1: ", JSON.stringify(messageData1, null, 4));
    }

handleClose(){
         this.props.history.push("/main");
          window.$('#MsgModal').modal('hide')
}



    render(){
        let login_status=this.props.login_status
        if(this.props.location.state!=undefined){
            const msg=this.props.location.state.msg
            const classname=this.props.location.state.className
            window.$('#MsgModal').modal('show')




        return (
              <div>
                <div className="modal" id="MsgModal" tabIndex="-1" role="dialog"
                     aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header ">
                                <h5 className="modal-title" id="exampleModalLongTitle"><div className={classname}>Change Message</div> {this.state.item}</h5>
                                <button type="button" onClick={this.handleClose} className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                                  <div className="modal-body">

                                      <div className={classname}>{msg}</div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={this.handleClose} className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="submit" onClick={this.handleClose} className="btn btn-primary">OK</button>

                            </div>

                        </div>
                    </div>
                </div>
                <UserItemView login_status={login_status} />





            </div>)}
          else{
            return(<UserItemView login_status={login_status} />)
        }
    }
}

export default Mainview;




       {/*         <div className={classname}>{msg}</div>
                  <p> Hello:</p>
                <p>{this.state.message}</p>


            </div>*/}

