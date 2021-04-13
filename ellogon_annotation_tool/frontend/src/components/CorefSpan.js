import React, {Component} from "react";

class CorefSpan extends Component {
    constructor(props) {
        super(props);

    }
    render(){
        return(
            // <td colSpan={this.props.col}>
                <td colSpan="1">

                    {/* style class:form-control coref-span-end,form-control coref-span-start*/}
               <textarea class={this.props.styleclass} style={{resize:"none"}} readOnly={true} rows={1} cols={7}></textarea>

            </td>
        )
        }

}

export default CorefSpan;