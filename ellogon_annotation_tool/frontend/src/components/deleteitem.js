import React, { Component } from "react";
import requestInstance from "../requestAPI";
import { confirmAlert } from 'react-confirm-alert';

class DeleteItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
        };
        this.handleClickDelete = this.handleClickDelete.bind(this)
        this.CloseDialog = this.CloseDialog.bind(this)
    }


   async handleClickDelete() {
    const type=this.props.location.state.item
    const useremail=localStorage.getItem("email")
    let userproject =""
    let url="/fileoperation/"
    let data={}
    let usercollection
    let message
    switch(type) {
       case "project":
           url=url+"project/delete/"
           userproject=this.props.location.state.project
          data={"name":userproject,email:useremail}
          message="The selected project "+data.name
           break;
     case "collection":
           url=url+"collection/delete/"
           userproject=this.props.location.state.project
           usercollection=this.props.location.state.collection
           data={"name":usercollection,email:useremail,project:userproject}
            message="The selected collection "+data.name+" of project "+userproject
           break;
      case "document":
            url=url+"document/delete/"
            userproject=this.props.location.state.project
              usercollection=this.props.location.state.collection
            data={"name":this.props.location.state.filename,email:useremail,updated_by:useremail,project:userproject,collection:usercollection}
             message="The selected document "+data.name+" of collection "+usercollection +" of project "+userproject
            break;
    // code block
}
    // console.log(url)
     //console.log(data)
    let msg
    try {
        const response = await requestInstance.post(url, data);
        msg=message+" was deleted successfully"

         this.props.history.push({
            pathname: '/main',
            search: '',
                 state: {msg:msg,className:"alert alert-success",change:true}
                        })
        return response;
    } catch (error) {
        msg= message+"was not  deleted due to  some failure"
        this.props.history.push({
  pathname: '/main',
  search: '',
  state: {msg:msg,className:"alert alert-danger",change:false}
})}

    }

    CloseDialog(){
        this.props.history.push({
        pathname: '/main'})
    }



    componentDidMount() {
        // It's not the most straightforward thing to run an async method in componentDidMount
        // window.addEventListener('onbeforeunload', this.props.handleWindowClose);

        // Version 1 - no async: Console.log will output something undefined.

    }

    render() {
        console.log(this.props.location.state)
        const type = this.props.location.state.item
       // console.log(type)
        let message_params=[];
        let i;
        switch (type) {
            case "document":

                message_params.push(<span>file {this.props.location.state.filename}  from collection {this.props.location.state.collection}  of project {this.props.location.state.project}.</span>)
                break;
            case "collection":
                let doc_list = [<span>This process will delete all files of this collection:<br/></span>]
                for (i = 0; i < this.props.location.state.filename.length; i++) {
                    doc_list.push(<span>{this.props.location.state.filename[i]}<br/></span>)
                }
              //  console.log("1")
                message_params = [<span>collection {this.props.location.state.collection}  of project {this.props.location.state.project}.<br/></span>]
             //    console.log("2")
                for(i=0;i<doc_list.length;i++){
                    message_params.push(doc_list[i])
                }
                break;
            case "project":
                let col_list = [<span>This process will delete all collections of this project and their files:<br/></span>]
                for (i = 0; i < this.props.location.state.collection.length; i++) {
                    col_list.push(<span> {this.props.location.state.collection[i].collection} :(</span>)
                    let docs = this.props.location.state.collection[i].documents
                    for (let j = 0; j < docs.length; j++) {
                        col_list.push(<span>{docs[j]}</span>)
                    }
                   col_list.push(<span>)<br/></span>);
                }


                message_params = [<span>project  {this.props.location.state.project}<br/></span>]
                for (let j = 0; j < col_list.length; j++) {
                    message_params.push(col_list[j])
                }
                break
            default:
                message_params = [<span>Invalid Item</span>];
        }

        let render_component = confirmAlert({
            customUI: ({onClose}) => {
                return (
                    <div className='custom-ui'>
                        <h1>Delete Alert</h1>
                        <p>Are you sure that you want to delete {message_params}</p>
                        <button onClick={() => {
                                this.CloseDialog();
                                onClose();
                            }}


                        >No</button>
                        <button
                            onClick={() => {
                                this.handleClickDelete();
                                onClose();
                            }}
                        >
                            Yes
                        </button>
                    </div>
                );
            }
        })

        return (
            <div>
                {render_component}
            </div>
        )

        {/*  <div>
                Delete item
                  <p> Hello:</p>
                <p>{this.state.message}</p>

            </div>*/
        }

    }

}
export default DeleteItem;