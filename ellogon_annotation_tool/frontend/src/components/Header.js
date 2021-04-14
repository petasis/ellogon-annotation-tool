import React, { Component } from "react";



class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message:"",
        };

    }










    render(){

        let header

        return(
            <tr>
            <td colSpan={this.props.colspan}>
            <div id={this.props.id} className="button-widget-header" style={{color:"#78B1F3",backgroundColor:"white"}}
                 title={this.props.title}> ► {this.props.title}</div>
            </td>
            </tr>


        )
        }

}

export default Header;

