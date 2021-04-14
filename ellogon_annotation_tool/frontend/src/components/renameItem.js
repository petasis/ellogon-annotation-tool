import React, { Component } from "react";
import requestInstance from "../requestAPI";
import {Redirect} from "react-router-dom";

class RenameItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:"",
            item:""
        };

    this.handleChange=this.handleChange.bind(this)
    this.handleClose=this.handleClose.bind(this)
    this.handleSubmit=this.handleSubmit.bind(this)
    }


 handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
      //  console.log(event.target.value)

    }
handleClose(){
         this.props.history.push("/main");
}




 async handleSubmit(event) {

    event.preventDefault();
    window.$('#RenameModal').modal('hide')
    console.log("here")
    const type=this.props.location.state.item
    const useremail=localStorage.getItem("email")
    let userproject =""
    let url="/fileoperation/"
    let data={}
    let message
    switch(type) {
       case "project":
          url=url+"project/update/"
          data={"current_name":this.props.location.state.project, "name":this.state.name,email:useremail}
          message="The name of project "+data.current_name+" changed into "+ data.name
           break;
     case "collection":
           url=url+"collection/update/"
           userproject=this.props.location.state.project
           data={"current_name":this.props.location.state.collection,"name":this.state.name,email:useremail,project:userproject}
            message="The name of collection "+data.current_name+" of project "+userproject+" changed into "+ data.name
           break;
      case "document":
            url=url+"document/update/"
            userproject=this.props.location.state.project
            const  usercollection=this.props.location.state.collection
            data={"current_name":this.props.location.state.filename,name:this.state.name,email:useremail,updated_by:useremail,project:userproject,collection:usercollection}
             message="The name of document "+data.current_name+" of collection "+usercollection +" of project "+userproject+" changed into "+ data.name
            break;
    // code block
}
    // console.log(url)
     //console.log(data)
    let msg
    try {
        const response = await requestInstance.put(url, data);
        msg=message

         this.props.history.push({
            pathname: '/main',
            search: '',
                 state: {msg:msg,className:"alert alert-success",change:true}
                        })
        return response;
    } catch (error) {
        msg=" The selected "+type +" "+data.current_name+" was not be renamed"
        this.props.history.push({
  pathname: '/main',
  search: '',
  state: {msg:msg,className:"alert alert-danger",change:false}
})}

    }
    //console.log(response)


    componentDidMount(){
        // It's not the most straightforward thing to run an async method in componentDidMount
       // window.addEventListener('onbeforeunload', this.props.handleWindowClose);

        // Version 1 - no async: Console.log will output something undefined.

    }









    componentDidMount(){
        if(this.props.location.state!=null){
         switch (this.props.location.state.item) {
            case "document":

            this.setState({
                     name: this.props.location.state.filename,
                    item:this.props.location.state.item
                             });
                break;
            case "collection":
                 this.setState({
                     name: this.props.location.state.collection,
                     item:this.props.location.state.item
                             });
                break;
            case "project":

                    this.setState({
                     name: this.props.location.state.project,
                      item:this.props.location.state.item
                             });


                break
            default:

        }
       window.$('#RenameModal').modal('show')}



        // It's not the most straightforward thing to run an async method in componentDidMount
       // window.addEventListener('onbeforeunload', this.props.handleWindowClose);

        // Version 1 - no async: Console.log will output something undefined.

    }

    render(){


      if(this.props.location.state==null){

                return <Redirect to='/sign-in' />
            }


       // console.log(this.props.location.state)
        return (
            <div>
                <div className="modal" id="RenameModal" tabIndex="-1" role="dialog"
                     aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">Rename {this.state.item}</h5>
                                <button type="button" onClick={this.handleClose} className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                             <form onSubmit={this.handleSubmit}>
                                  <div className="modal-body">

                               <div className="form-group">
                                     <label>New name</label>
                                    <input name="name" type="text" value={this.state.name} onChange={this.handleChange} className="form-control" placeholder="Enter new name" required />
                                 </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={this.handleClose} className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Rename</button>

                            </div>
                              </form>
                        </div>
                    </div>
                </div>


            </div>
        )
    }
}

export default RenameItem;