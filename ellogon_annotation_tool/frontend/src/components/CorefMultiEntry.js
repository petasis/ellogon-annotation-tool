import React, {Component} from "react";

class CorefMultiEntry extends Component {
    constructor(props) {
        super(props);

    }
    render(){
        return(
            <td colSpan={this.props.col}>

               <textarea class="form-control coref-segment-entry" readOnly={true} cols={16} rows={5}></textarea>

            </td>
        )
        }

}

export default CorefMultiEntry;