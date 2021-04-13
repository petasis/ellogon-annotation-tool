import React, { Component } from "react";






class CorefComboBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message:"",
        };

    }
    render(){
        return(
            <td colSpan={this.props.cols}>
                <select className="form-control coref-combobox">
                    <option value="">Please select an option</option>
                    {this.props.options.map((value, index) => {
                          return <option value={value}>{value}</option>
                                  })}



                   </select>
            </td>
        )
        }

}

export default CorefComboBox;







