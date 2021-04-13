import React, { Component } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


class AnnotationButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            background_color:"transparent",
        };
  this.onselect = this.onselect.bind(this)
    this.ondeselect = this.ondeselect.bind(this)
       this.onclick = this.onclick.bind(this)
    }

    onselect(event){
        if (this.props.markedfield!=this.props.label) {
             event.target.style.background = '#e7e7e7';
             this.setState({background_color: "#e7e7e7"})
         }
    }
    ondeselect(event){
       // console.log(this.props.markedcolor)
        // console.log(this.props.color)
       // console.log(this.state.background_color)
      if (this.props.markedfield!=this.props.label) {
           event.target.style.background = 'transparent';
          this.setState({background_color: "transparent"})

       }
    }
    onclick(event){
         event.target.style.background = this.props.color;
         this.setState({background_color:this.props.color})




        this.props.SetMarkedColor(this.props.color,this.props.label,this.props.title)
    }


    componentDidUpdate(prevProps, prevState, snapshot)

        {

            if (this.props.markedfield!=prevProps.markedfield){
                if (this.props.markedfield==this.props.label){

                    this.setState({background_color:this.props.color})

            // this.setState({background_color:this.props.markedcolor})

        }
        else{

            this.setState({background_color:"transparent"})

        }



            }





            }



    render(){



        return(
            <td style={{backgroundColor:this.state.background_color}}onMouseOver={this.onselect} onMouseOut={this.ondeselect} onClick={this.onclick}>
            <button type="button" title={this.props.title} className="btn btn-default btn-sm btn-block annotation-btn"
                style={{backgroundColor:(this.props.markedfield==this.props.label)?this.props.color: this.state.background_color}}

                    label= {this.props.label}>
                <span style={{backgroundColor:this.state.background_color,float:"left"}}>
                    <FontAwesomeIcon style={{
                        float: "left",
                        color:this.props.color,

                        height: "auto"
                    }} className="fa fa-minus fa-rotate-90" icon={"minus"}>
                    </FontAwesomeIcon>
                   {this.props.label}
                </span>
            </button>
            </td>
        )
    }

}

export default AnnotationButton;







