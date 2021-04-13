import React, { Component } from "react";



class AnnotationRelation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message:"",
        };

    }
    render(){
        return(
            <td>
            <div style={{fontWeight:"bold"}}>
                <span >
                    <span title={this.props.title}>{this.props.title}</span>
                </span>
                </div>
            </td>
        )
        }

}

export default AnnotationRelation;







