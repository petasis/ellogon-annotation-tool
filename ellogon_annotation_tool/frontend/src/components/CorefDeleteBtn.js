import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class CorefDeleteBtn extends Component {
    constructor(props) {
        super(props);

    }
    render(){
        return(
            <td rowSpan={this.props.row}>
                <button type="button" className="btn btn-danger btn-sm btn-block coref-del-btn">
                     <FontAwesomeIcon  className="fa fa-times" icon={"times"}>
                </FontAwesomeIcon>



                   </button>
            </td>
        )
        }

}

export default CorefDeleteBtn;