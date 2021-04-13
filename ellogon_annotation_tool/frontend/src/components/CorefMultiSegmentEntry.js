import React, {Component} from "react";

class CorefMultiSegmentEntry extends Component {
    constructor(props) {
        super(props);

    }
    render(){
        return(
            <td>

               <textarea class="form-control coref-segment-entry" readOnly={true}></textarea>

            </td>
        )
        }

}

export default CorefMultiSegmentEntry;