import React, { Component } from "react";



class CorefHeader extends Component {
    constructor(props) {
        super(props);


    }










    render(){

        let header

        return(

            <td colSpan={this.props.col} style={{padding:"0.5rem"}}>
                             {/*<td colSpan="2">*/}

            <div id={this.props.id} className="button-widget-header" style={{color:"#78B1F3",backgroundColor:"white"}}
                 title={this.props.title}> ► {this.props.title}</div>
            </td>



        )
        }

}

export default CorefHeader;