import React, {useState, useEffect, useRef} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FixedSizeList } from 'react-window';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ButtonAnnotationSchema from "./ButtonAnnotationSchema";
import {Button, FormControl, InputLabel, List, ListItem, ListItemText, MenuItem, Select} from "@material-ui/core";
import {
    getAttributeAlternatives,
    getAttributes, getCoreferenceAttributes,
    getLanguages, getSchema,
    getTypes, getValues,
    schemerequestInstance
} from "../AnnotationSchemeAPI";
import AnnotationSchemeSelection from "./Define_annotation";
import Header from "./Header";
import AnnotationButton from "./AnnotationButton";
import AnnotationDateEntry from "./AnnotationDateEntry";
import AnnotationEntry from "./AnnotationEntry";
import AnnotationComboBox from "./AnnotationComboBox";
import AnnotationRelation from "./AnnotationRelation";
import AnnotationRelationCombobox from "./AnnotationRelationCombobox";
import AnnotationRelationTable from "./AnnotationRelationTable";
import CorefHeader from "./CorefHeader";
import Subheader from "./Subheader";
import CorefSegmentEntry from "./CorefSegmentEntry";
import RelationImportButton from "./RelationImportButton";
import CorefDeleteBtn from "./CorefDeleteBtn";
import CorefComboBox from "./CorefComboBox";
import CorefAnnotateBtn from "./CorefAnnotateBtn";
import RelationClearButton from "./RelationClearButton";
import CorefEntry from "./CorefEntry";
import CorefImageBtn from "./CorefImageBtn";
import CorefSpan from "./CorefSpan";
import CorefButtonTable from "./CorefButtonTable";
import CorefCheckbox from "./CorefCheckbox";
import CorefMultiEntry from "./CorefMultiEntry";
//import {schemerequestInstance,getLanguages, getTypes, getAttributes, getAttributeAlternatives, getValues, getCoreferenceAttributes
//} from "../AnnotationSchemeAPI"
const useStyles = makeStyles((theme) => ({
    button: {
        display: 'inline',
        marginLeft: 30,
    },
    myButtons: {
        textAlign: 'right',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 300,
        maxWidth: 300,
        position: "relative",
    },
    root: {
        width: '100%',
        height: 200,
        maxWidth: 200,
        backgroundColor: theme.palette.background.paper,
        marginTop: 30,
    },
    myTab:{
        maxWidth: 700,
    },
    titleStyle:{
    color: 'red',
    },
}));

// switches content according to selected tab
function TabPanel(props) {
  const { children, value, index} = props;
  const classes = useStyles();
  return (
    <div className={classes.myTab}>
      {value === index && (
          <h6>{children}</h6>
      )}
    </div>
  );
}

function TabPanelC(props) {
  const { children, value, index} = props;
  const classes = useStyles();
  return (
    <div className={classes.myTab} style={{overflow: 'auto', display:'block', height: '90vh'}}>
      {value === index && (
          <h6>{children}</h6>
      )}
    </div>
  );
}



export default function Annotator(props) {
    const classes = useStyles();
    const [annotatedisabled,SetAnnotateDisabled]=useState(true);
    const [markedcolor,SetMarkedColor]=React.useState("");
     const [markedfield,SetMarkedField]=React.useState("");
      const [markedfieldtitle,SetMarkedFieldTitle]=React.useState("");
     const [extraproperty,SetExtraProperty]=React.useState("");
    const [whenstatus,SetWhenStatus]=useState(true);
    const [wherestatus,SetWhereStatus]=useState(true);
    const [mainstatus,SetMainStatus]=useState(true);
    const [secondarystatus,SetSecondaryStatus]=useState(true);
     const [reporterlocationstatus,SetReporterLocationStatus]=useState(true);
    const prevmarkedfieldRef = useRef();
    const [viewshow, setViewshow] = useState(false);
    const [tabValue, setTabValue] = React.useState(0);
    const [table_content,setTableContent]=React.useState([]);
    const [rtable_content,setrTableContent]=React.useState([]);
    const [corefCounter, setCorefCounter] = useState(0);
    //const [relation_disabled,setRelationdisabled]=useState(true);


    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }
   // let languages=[]
  //  let annotation_attribute_state=true

const handleClose=() =>{
        props.HideSchemaForm("annotator")
         setViewshow(false)
        window.$('#AnnotationModal').modal('hide')
}

// const changeDisplay=() =>{
//         setDisplayCoref(true)
// }

const ClickButton=(value,label,title)=>{

       // prevmarkedcolorRef.current=markedcolor
        SetMarkedColor(value)
        SetMarkedField(label)
        SetMarkedFieldTitle(title)
        SetWhenStatus(true)
        SetWhereStatus(true)
        SetMainStatus(true)
        SetSecondaryStatus(true)
        SetReporterLocationStatus(true)
        switch(label) {
            case "when":
                console.log(label)
                SetWhenStatus(false)
                break;
            case "where":
                console.log(label)
                SetWhereStatus(false)
                break;
            case "main":
                console.log(label)
                SetMainStatus(false)
                break;
             case "secondary":
                  console.log(label)
                SetSecondaryStatus(false)
                break;
              case "reporter_location":
                  console.log(label)
                SetReporterLocationStatus(false)
                break;
        }
        SetAnnotateDisabled(false)
    }

    const SetProperty=(value)=>{
        SetExtraProperty(value)
        console.log(value)
    }

const CreateAnnottatorCUI=(uistructure)=> {
        console.log(uistructure)
    let ui = []
    let uielements=[]
   //let rowelements=[]
    for (const [index, value] of uistructure["ui_structure"].entries()) {
           let row_items=value["items"]
           for (const [index2, value2] of row_items.entries()) {
                    switch(value2["type"]){
                        case "corefheader":
                            uielements.push(<CorefHeader id={index2} title={value2["title"]} col={value2["cols"]}/>)
                            break
                        case "header":
                             uielements.push(<Header colspan={value2["colspan"]} id={index2} title={value2["title"]}/>)
                            break
                        case "subheader":
                              uielements.push(<Subheader col={value2["cols"]} title={value2["title"]} />)
                                break
                        case "corefsegmententry":
                            uielements.push(<CorefSegmentEntry col={value2["cols"]}  />)
                            break
                        case "corefspan":
                                 uielements.push(<CorefSpan styleclass={value2["class"]} col={value2["cols"]}   />)
                                 break
                        case "corefentry":
                            uielements.push(<CorefEntry col={value2["cols"]}  />)
                            break
                        case "corefmultitentry":
                            uielements.push(<CorefMultiEntry col={value2["cols"]}  />)
                            break
                        case "add_btn":
                            uielements.push(<RelationImportButton row={value2["row"]} status={false}  />)
                            break
                        case "del_btn":
                                uielements.push(<CorefDeleteBtn row={value2["row"]}   />)
                                break
                        case "corefcombobox":
                            uielements.push(<CorefComboBox cols={value2["cols"]} options={value2["options"]}   />)
                            break
                        case "corefcheckbox":
                             uielements.push(<CorefCheckbox cols={value2["cols"]} title={value2["checkbox_tag"]}   />)
                             break;

                        case "table":
                           let  table=[]
                           let rowelements=[]
                             for (const [index3, value3] of value2["elements"].entries()) {
                                 //console.log(value3)
                                 for (const [index4, value4] of value3.entries()) {
                                            if (value4["type"]=="corefbutton"){
                                               // console.log(value4)
                                                rowelements.push(<AnnotationButton title={value4.title} label={value4.label}
                                                          color={value4.color}/>)
                                            }
                                            else{
                                                  if (value4["type"]=="corefimagebutton"){
                                                      rowelements.push(<CorefImageBtn title={value4.title} />)
                                                  }
                                            }

                                  }
                                 table.push(<tr>{rowelements}</tr>)
                                 rowelements=[]
                             }
                             uielements.push(<CorefButtonTable col={value2["cols"]} buttons={table}/>)
                            break
                        case "annotate_btn":
                              uielements.push(<CorefAnnotateBtn  />)
                              break;
                         case "clear_btn":
                              uielements.push(<RelationClearButton  />)
                              break;
                    }

           }
            ui.push(<tr>{uielements}</tr>)
            uielements = []
    }

setTableContent(ui)

}



const CreateAnnottatorUI=(uistructure)=> {




    let ui = []
    let uielements=[]
   let relations=[]
    let uir=[]
    let disabled_states=[wherestatus,reporterlocationstatus,mainstatus,secondarystatus]
     let count=0



    for (const [index, value] of uistructure["ui_structure"].entries()) {
         if (value.title.includes("relations") || value.title.includes("stance")){
                 uir.push(<Header colspan={value.colspan} id={value.id} title={value.title}/>)
            }
        else {
                ui.push(<Header colspan={value.colspan} id={value.id} title={value.title}/>)
            }



        if("rows" in value) {
            //console.log(uir.length)
            if(uir.length>0)
          {
            //  console.log(value["rows"])
               // uir.push(<Header colspan={value.colspan} id={value.id} title={value.title}/>)
               for (const [index2, value2] of value["rows"].entries()) {
                    for (const [index3, value3] of value2["rows"].entries()) {

                        switch(index3)
                        {
                            case 0:
                                relations.push(<tr><AnnotationRelation title={value3.title}/></tr>)
                                break;
                            case 1:
                            case 2:
                                relations.push(<tr><Header colspan={1} id={value3["argument_header"].id} title={value3["argument_header"].title}/>
                                <AnnotationRelationCombobox/>
                                </tr>)
                                break;


                        }




                    }
                     uir.push(<AnnotationRelationTable uielement={relations}/>)
                     relations=[]
                }

           }
           else {




            for (const [index2, value2] of value["rows"].entries()) {

                for (const [index3, value3] of value2.entries()) {
                    if (value3.type == "annotation-button") {
                        uielements.push(<AnnotationButton markedfield={markedfield}  markedcolor={markedcolor} SetMarkedColor={ClickButton} title={value3.title} label={value3.label}
                                                          color={value3.color}/>)
                    } else if (value3.type == "annotation-dateentry") {
                        uielements.push(<AnnotationDateEntry SetProperty={SetProperty}  disabled={whenstatus} annotationType={value3.annotation_type}
                                                             annotationAttribute={value3.annotation_attribute}
                                                             format={value3.dateentry_format}/>)
                    } else if (value3.type == "annotation-entry") {
                        let disabled=disabled_states[count]

                      //  console.log(String(index3)+":"+String(disabled))
                        uielements.push(<AnnotationEntry SetProperty={SetProperty} disabled={disabled}/>)
                        count=count+1
                    } else {
                        uielements.push(<AnnotationComboBox/>)
                    }
                }
                ui.push(<tr>{uielements}</tr>)
                uielements = []
            }

       }
     //   }
          /*  else{
                if(value["rows"].type=="annotation-relation_table"){
                     uir.push(<Header colspan={value.colspan} id={value.id} title={value.title}/>)
                    for (const [indexr, valuer] of value["rows"]["rows"].entries()) {
                        switch(indexr)
                        {
                            case 0:
                                relations.push(<tr><AnnotationRelation title={valuer.title}/></tr>)
                                break;
                            case 1:
                            case 2:
                                relations.push(<tr><Header colspan={1} id={valuer["argument_header"].id} title={valuer["argument_header"].title}/>
                                <AnnotationRelationCombobox/>
                                </tr>)
                                break;


                        }

                    }
                }
            }*/
    }

    }
setTableContent(ui)
setrTableContent(uir)
}

const Annotate=()=>{
        props.AnnotateSelectedText(markedcolor,markedfieldtitle,markedfield,extraproperty)
        handleClose()



}


useEffect(() => {
       // console.log(viewshow)
    //    console.log(props.viewshow)
        if (viewshow==false && props.viewshow==true) {
                console.log("a")
               // console.log(props.uistructure)
            if(props.uistructure.kind=="button"){
                 CreateAnnottatorUI(props.uistructure)
                 window.$('#AnnotationModal').modal('show')
                 setViewshow(props.viewshow)}
            // else{
            //     CreateAnnottatorCUI(props.uistructure)
            //      window.$('#AnnotationModal').modal('show')//
            //      setViewshow(props.viewshow)
            // }
        }

        if (props.displayCoref === true && corefCounter < props.corefCount){
            console.log("COREF")
            CreateAnnottatorCUI(props.uistructure)
            setCorefCounter(props.corefCount)
        }
    //    let textfields=["when","where","reporter_location","main","secondary"]
        if( prevmarkedfieldRef.current!=markedfield){
             if(props.uistructure.kind=="button") {
                   // console.log("rerender")
                    CreateAnnottatorUI(props.uistructure)
             }
        }



        // console.log(prevmarkedcolorRef.current)
         //console.log(markedcolor)
         prevmarkedfieldRef.current=markedfield

      });

/*useEffect(() => {
    console.log("display")
    if (width: 60%;
float: left;props.viewshow) {
        console.log("alex1")
        setViewshow(props.viewshow);
    }

    // if it was shown and then hidden, clear notifications
    if (viewshow==false && props.viewshow==false) {
        console.log("alex2")
        window.$('#AnnotationModal').modal('show')
    }
}, [props.viewshow]);

*/


 return (

      <div>
                <div className="modal" id="AnnotationModal" tabIndex="-1" role="dialog"
                     aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">Select Annotation Schema</h5>
                                <button type="button" onClick={handleClose} className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                                  <div className="modal-body">
                                    <AppBar position="static">
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Annotator"    />{/*disabled>*/}
                    <Tab label="Relations" disabled={rtable_content.length>0?false:true} />
                </Tabs>
            </AppBar>
            <TabPanel value={tabValue} index={0}> {/*0 stands for Button Annotator / 1 for Coreference Annotator*/}
            <ButtonAnnotationSchema uielement={table_content}/>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <ButtonAnnotationSchema uielement={rtable_content}/>
            </TabPanel>


                            </div>
                            <div className="modal-footer">
                                <div className={classes.myButtons}>
                    <Button className={classes.button} variant="outlined" color="secondary" onClick={handleClose}>Cancel</Button>
                    <Button type="button" className={classes.button} variant="outlined" color="secondary" disabled={annotatedisabled} onClick={Annotate}>Annotate</Button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

          {/*Coreference Annotator*/}

          <div className="coreference-bar" style={{display: props.displayCoref ? "block" : "none", float:"right", width:"40%" }}>
              <div className="modal-body">
                  <AppBar position="static">
                      <Tabs value={tabValue} onChange={handleTabChange}>
                          <Tab label="Annotator"    />{/*disabled>*/}
                          <Tab label="Relations" disabled={rtable_content.length>0?false:true} />
                      </Tabs>
                  </AppBar>
                  <TabPanelC classname="corefTabPanel" value={tabValue} index={0}>
                      <ButtonAnnotationSchema uielement={table_content}/>
                      <div className="modal-footer">
                          <div className={classes.myButtons}>
                              <Button className={classes.button} variant="outlined" color="secondary" onClick={handleClose}>Cancel</Button>
                              <Button type="button" className={classes.button} variant="outlined" color="secondary" disabled={annotatedisabled} onClick={Annotate}>Annotate</Button>
                          </div>
                      </div>
                  </TabPanelC>
                  <TabPanelC value={tabValue} index={1}>
                      <ButtonAnnotationSchema uielement={rtable_content}/>
                  </TabPanelC>
              </div>
          </div>


            </div>







    );

}