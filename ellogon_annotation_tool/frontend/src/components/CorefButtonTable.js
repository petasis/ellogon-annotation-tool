import React, { Component } from "react";
import {paddingVert} from "codemirror/src/measurement/position_measurement";



class CorefButtonTable extends Component {
    constructor(props) {
        super(props);


    }
    render(){
        return(
             <td colSpan={this.props.col}>

            <div class="button-widget-header">
                <table class="table">
                    <tbody></tbody>
             {this.props.buttons}
            </table>
            </div>
            </td>
        )
        }

}

export default CorefButtonTable;