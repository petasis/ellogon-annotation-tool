import React, { Component } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";



class CorefAnnotateBtn extends Component {
    constructor(props) {
        super(props);


    }
    render(){
        return(
            <td>
                <div>
                    <button type="button" className="btn btn-primary  coref-annotate-btn" >
                        <FontAwesomeIcon  className="fas fa-plus" icon={"plus"}/>
                    </button>
                </div>
            </td>
        )
    }

}

export default CorefAnnotateBtn;