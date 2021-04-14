import React, { Component } from "react";






class AnnotationEntry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text:"",
        };
 this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({text: event.target.value});
        this.props.SetProperty(event.target.value)



    }




    render(){

        return(
            <td colSpan={2}>
               <textarea className="form-control annotation-entry"  value={this.state.text} onChange={this.handleChange} style={{resize:"none"}}  rows={1} disabled={this.props.disabled}></textarea>
            </td>
        )
        }

}

export default AnnotationEntry;







