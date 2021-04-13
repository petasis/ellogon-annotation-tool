import React, { Component } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import logops from '../images/PolarityPositive.png';
import logong from '../images/PolarityNegative.png';
import logont from '../images/PolarityNeutral.png';
class CorefImageBtn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logo:null,
        };

    }
     componentDidMount(){
        let buttonlogo=null
        switch(this.props.title){
            case "positive":
                buttonlogo=logops
                break;
             case "negative":
                buttonlogo=logong
                break;
              case "neutral":
                buttonlogo=logont
                break;
        }
        this.setState({logo:buttonlogo})



     }






    render(){
        return(
            <td>
            <button type="button" title={this.props.title} className="btn btn-default btn-sm btn-block annotation-btn">
               <img src={this.state.logo} width="16" height="16"/>
            </button>
            </td>
        )
    }

}

export default CorefImageBtn;







