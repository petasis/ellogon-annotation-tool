import React, { Component } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


//?
export default class RelationClearButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message:"",
        };

    }
    render(){
        return(
            <td>

                <div>
                    <div>
<button type="button" class="btn btn-danger  coref-clear-btn" ><i className="fas fa-trash-alt"></i>
 <FontAwesomeIcon  className="fas fa-trash-alt" icon={"trash-alt"}>
                    </FontAwesomeIcon>


</button>
                        {/*    <button type="button" class="btn btn-danger btn-block coref-clear-btn" ><i class="fas fa-undo"></i></button>*/}
</div>

                    </div>



            </td>
        )
        }

}

