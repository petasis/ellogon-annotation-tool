import React, { Component } from "react";



class AnnotationRelationTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message:"",
        };

    }
    render(){
        return(
             <td colSpan="2">

            <div class="button-widget-relation"><table class="table"><tbody>
            </tbody>
             {this.props.uielement}
            </table>
            </div>
            </td>
        )
        }

}

export default AnnotationRelationTable;