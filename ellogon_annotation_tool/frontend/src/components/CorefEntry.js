import React, { Component } from "react";






class CorefEntry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message:"",
        };

    }
    render(){
        return(
            <td colSpan={this.props.col}>
               <textarea class="form-control annotation-entry" style={{resize:"none"}}  rows={1} ></textarea>
            </td>
        )
        }

}

export default CorefEntry;







