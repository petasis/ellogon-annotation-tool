import React, { Component } from "react";



class AnnotationRelationButton extends Component {
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
                    <button type="button" class="btn btn-primary btn-block coref-annotate-btn">Annotate</button>
                    <button type="button" class="btn btn-primary btn-block coref-annotate-btn">Update</button>
                    </div>



            </td>
        )
        }

}

export default AnnotationRelationButton;