import React, {Component} from "react";

class Subheader extends Component {
    constructor(props) {
        super(props);

    }
    render(){
        return(
            <td colSpan={this.props.col}>
                             {/*<td colSpan="2">*/}
                <div  className="button-widget-subheader" title={this.props.title}>{this.props.title}
                </div>
            </td>
        )
        }

}

export default Subheader;