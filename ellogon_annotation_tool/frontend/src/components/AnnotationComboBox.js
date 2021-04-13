import React, { Component } from "react";






class AnnotationComboBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message:"",
        };

    }
    render(){
        return(
            <td>
                <select className="form-control coref-combobox" disabled>
                    <option value="">Please select an option</option>
                   </select>
            </td>
        )
        }

}

export default AnnotationComboBox;







