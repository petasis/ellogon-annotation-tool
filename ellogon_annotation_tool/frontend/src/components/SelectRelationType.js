import React, { Component } from "react";



export default class SelectRelationType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value:"",
        };
        this.handleChange=this.handleChange.bind(this)
    }
          handleChange(event) {

            this.setState({value: event.target.value});
            this.props.selectrelationtype(event.target.value)




    }



    render(){
        return(
            <tr>
                            <td><select value={this.state.value} onChange={this.handleChange}
                                className="selectpicker"
                                data-container="body"
                                selectpicker=""
                                select-relation-type="relation_type">
                                <option value="">--- Select relation type ---</option>
                              {this.props.relation_types.map((value, index) => {
                          return <option value={value}>{value}</option>
                                  })}
                            </select>
                            </td>
                            </tr>



        )
        }

}


