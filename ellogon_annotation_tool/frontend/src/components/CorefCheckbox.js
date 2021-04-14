import React, { Component } from "react";



class CorefCheckbox extends Component {
    constructor(props) {
        super(props);


    }
    render(){
        return(
            <td colspan={this.props.col}>

                <div className="checkbox coref-checkbox"><label><input
                    type="checkbox"/> {this.props.title}</label></div>






            </td>
        )
        }

}

export default CorefCheckbox;