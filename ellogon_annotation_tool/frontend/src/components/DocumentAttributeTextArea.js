import React, { Component } from "react";






class DocumentAttributeTextArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text:"",
            s:0

        };
 this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({text: event.target.value,s:1});
        this.props.updateDocumentAttributes(this.props.title,event.target.value)
      //  this.props.SetProperty(event.target.value)



    }

 componentDidMount(){
    this.setState({text:this.props.prev_value})


 }



componentDidUpdate(prevProps, prevState, snapshot)
        {
           console.log(this.props.prev_value)
            console.log(prevProps.prev_value)
            console.log(this.state.text)
            console.log(prevState.text)
            if(this.props.prev_value=="" && prevProps.prev_value!=""){
              if(this.state.text==prevProps.prev_value){
                  this.setState({text:""})
              }
            }
            else{
                 if(this.props.prev_value=="" && prevProps.prev_value==""){
                     if(this.state.text==prevState.text!="" && this.state.text!=""){
                         this.setState({text:""})
                     }


                 }




            }

          /*  if(this.props.prev_value=="" && prevProps.prev_value!=""){
                this
            }*/
           // console.log(this.state.text)
          //  console.log(prevState.text)
           // console.log(prevState)

        /*    if(prevProps.disabled==false && this.props.disabled==true){
                this.setState({text:""})
                 this.props.SetProperty("")
            }*/


        }





    render(){

        return(
            <tr>
            <td>
               <textarea className="button-widget-paragraph-text" annotation-type="VAST_value" annotation-attribute="type" annotation-value={this.props.title}annotation-document-attribute={this.props.title}  group-type="document_attributes"  value=


                   {this.state.text} onChange={this.handleChange}  rows={12} cols={80} ></textarea>
            </td>
                </tr>
        )
        }

}

export default DocumentAttributeTextArea;

