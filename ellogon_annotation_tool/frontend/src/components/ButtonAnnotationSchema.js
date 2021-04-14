import React, { Component } from "react";



class ButtonAnnotationSchema extends Component {
    constructor(props) {
        super(props);
        this.state = {
            relation_disabled:true,
        };

    }










    render(){





        return(
            <div id="x" className="button-widget-wrapper">
                <table className="annotation-table  table">
                    <tbody>
                    {this.props.uielement}
                    </tbody>
                </table>
            </div>


        )
        }

}

export default ButtonAnnotationSchema;



