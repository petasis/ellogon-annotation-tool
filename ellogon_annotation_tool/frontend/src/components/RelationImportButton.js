import React, { Component } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";



class RelationImportButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message:"",
        };

    }
    render(){
        return(
            <td rowSpan={this.props.row}>
            <div>
            <button type="button" class="btn btn-success btn-sm btn-block coref-add-btn" disabled={this.props.status}>
                <FontAwesomeIcon  className="fa fa-arrow-circle-left" icon={"arrow-circle-left"}>
                </FontAwesomeIcon></button>



            </div>



            </td>
        )
        }

}

export default RelationImportButton;