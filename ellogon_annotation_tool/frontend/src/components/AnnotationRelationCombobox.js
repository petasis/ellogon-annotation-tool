import React, { Component } from "react";



export default class AnnotationRelationCombobox extends Component {
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
<select
        class="selectpicker"
        data-container="body"
        selectpicker=""
        select-collection="annotations">
  <option value="">--- Select annotation ---</option>
</select>
</div>
            </td>
        )
        }

}


