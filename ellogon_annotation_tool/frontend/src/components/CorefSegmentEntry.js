import React, {Component} from "react";

class CorefSegmentEntry extends Component {
    constructor(props) {
        super(props);

    }
    render(){
        return(
            <td colSpan={this.props.col}>

               <textarea class=" form-control coref-segment-entry" style={{resize:"none"}} readOnly={true} rows={1} cols={16}></textarea>
            </td>
        )
        }

}

export default CorefSegmentEntry;