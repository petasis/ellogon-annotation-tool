import React, { Component } from "react";
import requestInstance from "../requestAPI";

import AnnotationSchemeSelection from "./Define_annotation";
class SelectAnnotationSchema extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    //this.handleChange=this.handleChange.bind(this)
    this.handleClose=this.handleClose.bind(this)
  //  this.handleSubmit=this.handleSubmit.bind(this)
     this.SelectMyAnnotationScheme=this.SelectMyAnnotationScheme.bind(this)
    }



handleClose(){
        this.props.HideSchemaForm("schema")
        window.$('#AnnotationSchemaModal').modal('hide')
}

componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.viewshow==true && prevProps.viewshow==false){

        window.$('#AnnotationSchemaModal').modal('show')
        }
    }



    //console.log(response)


    componentDidMount(){
        // It's not the most straightforward thing to run an async method in componentDidMount
       // window.addEventListener('onbeforeunload', this.props.handleWindowClose);

        // Version 1 - no async: Console.log will output something undefined.

    }








/*
    componentDidMount(){

         switch (this.state.item) {
            case "document":

            this.setState({
                     name: this.props.location.state.filename,
                             });
                break;
            case "collection":
                 this.setState({
                     name: this.props.location.state.collection,
                             });
                break;
            case "project":

                    this.setState({
                     name: this.props.location.state.project,
                             });


                break
            default:

        }
       window.$('#RenameModal').modal('show')




        // It's not the most straightforward thing to run an async method in componentDidMount
       // window.addEventListener('onbeforeunload', this.props.handleWindowClose);

        // Version 1 - no async: Console.log will output something undefined.

    }
*/
    SelectMyAnnotationScheme(response){



        this.props.SelectAnnotationScheme(response)
    }



    render(){
       // console.log(this.props.location.state)
        return (
            <div>
                <div className="modal" id="AnnotationSchemaModal" tabIndex="-1" role="dialog"
                     aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">Select Annotation Schema</h5>
                                <button type="button" onClick={this.handleClose} className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                                  <div className="modal-body">
                                    <AnnotationSchemeSelection SelectMyAnnotationScheme={this.SelectMyAnnotationScheme} handleClose={this.handleClose}/>


                            </div>
                            <div className="modal-footer">
                            </div>

                        </div>
                    </div>
                </div>


            </div>
        )
    }
}

export default SelectAnnotationSchema;