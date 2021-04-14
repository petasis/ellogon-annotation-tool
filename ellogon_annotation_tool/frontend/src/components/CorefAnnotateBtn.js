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
                    <FontAwesomeIcon  className="fas fa-plus" icon={"plus"}>
                    </FontAwesomeIcon>





                </button>
                {/*     <button type="button" className="btn btn-primary btn-block coref-annotate-btn" ><i
                    className="far fa-edit"></i>
                </button>*/}



            </div>



            </td>
        )
        }

}

export default CorefAnnotateBtn;