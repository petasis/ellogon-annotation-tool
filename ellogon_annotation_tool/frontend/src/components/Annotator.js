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
import DocumentAttributeTextArea from "./DocumentAttributeTextArea";
import CorefMultiEntry from "./CorefMultiEntry";
import SelectRelationType from "./SelectRelationType";

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
        // maxWidth: 700,
    },
    titleStyle:{
color: 'red',
// fontSize: 20,
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
     const [tabValuec, setTabValuec] = React.useState(0);
    const [table_content,setTableContent]=React.useState([]);
    const [rtable_content,setrTableContent]=React.useState([]);
     const [dtable_content,setdTableContent]=React.useState([]);
     const [document_attributes,setDocumentAttributes]=React.useState({});
     const [relation_type,setRelationType]=React.useState("")
     const prevrelationtypeRef = useRef();
     const prev_arg1=useRef();
     const prev_arg2=useRef();
     const [relation_arg1,setRelationArg1]=React.useState(-1)
      const [relation_arg2,setRelationArg2]=React.useState(-1)
      const [anBarCounter, setAnBarCounter] = useState(0);
      let relval=0
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    //const [relation_disabled,setRelationdisabled]=useState(true);
  /*  const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }*/
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
        SetAnnotateDisabled(true)
    }
   // let languages=[]
  //  let annotation_attribute_state=true

 const Reset=()=>{

        SetAnnotateDisabled(true)
        SetMarkedColor("")
        SetMarkedField("")
        SetMarkedFieldTitle("")
        SetExtraProperty("")
       SetWhenStatus(true)
        SetWhereStatus(true)
        SetMainStatus(true)
        SetSecondaryStatus(true)
        SetReporterLocationStatus(true)
        setViewshow(false)
        setTableContent([])
        setRelationType("")
        setRelationArg1(-1)
         setRelationArg2(-1)
        setdTableContent([])
        setrTableContent([])
       relval=0

 }


const handleClose=() =>{
        props.HideSchemaForm("annotator")
       //  setViewshow(false)
       //  SetAnnotateDisabled(true)
        Reset()
        window.$('#AnnotationModal').modal('hide')
}

const updateDocumentAttributes=(key,value)=>{
        if(value!="") {


            setDocumentAttributes(prevState => ({
                ...prevState,
           [key]: value
            }));
            SetAnnotateDisabled(false)
        }
    }


const setRelationArg=(id,value)=>{

        if(id=="Arg 1"){

            setRelationArg1(value)

            relval=relval+1

        }
        if(id=="Arg 2"){

            setRelationArg2(value)
             relval=relval+1


        }
        if (value==-1){
            relval=0
        }

        console.log(relval)

        if (relation_type!="" && relval==2 ){
            console.log("here")
            SetAnnotateDisabled(false)
            relval=0
        }


}

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
               // console.log(label)
                let today = new Date();
                const dd = String(today.getDate()).padStart(2, '0');
                const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                const yyyy = today.getFullYear();

                today =yyyy + '-' + mm + '-' + dd;
                SetExtraProperty(today)
                SetWhenStatus(false)
                break;
            case "where":
               // console.log(label)
                SetWhereStatus(false)
                break;
            case "main":
               // console.log(label)
                SetMainStatus(false)
                break;
             case "secondary":
                 // console.log(label)
                SetSecondaryStatus(false)
                break;
              case "reporter_location":
                  //console.log(label)
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


const selectrelationtype=(type)=>{

    setRelationType(type)
    setRelationArg1(-1)
    setRelationArg2(-1)
  //  SetAnnotateDisabled(true)
 //   return () => SetAnnotateDisabled(value => !value);
  //  CreateAnnottatorUI(props.uistructure)

}


const CreateAnnottatorUI=(uistructure)=> {




    let ui = []
    let uielements=[]
   let relations=[]
    let uir=[]
    let uid=[]
    let relation_types=[]

    let disabled_states=[wherestatus,reporterlocationstatus,mainstatus,secondarystatus]
    let property_labels=["where","reporter_location","main","secondary"]

    //let extra_properties=[(!wherestatus)?extraproperty:"",(!reporterlocationstatus)?extraproperty:"",(!mainstatus)?extraproperty:"",(!secondarystatus)?extraproperty:""]


    let dateproperty=(markedfield=="when")?extraproperty:""
    let count=0
     let da_state=false
    console.log(markedfield)
    console.log(markedfieldtitle)
    console.log(disabled_states)
  //  console.log(extra_properties)
    console.log(dateproperty)
    let args={"Arg 1":relation_arg1,"Arg 2":relation_arg2}







    for (const [index, value] of uistructure["ui_structure"].entries()) {
         if (value.title.includes("relations") || value.title.includes("stance")){
                 uir.push(<Header colspan={value.colspan} id={value.id} title={value.title}/>)
            }


        else {
            if (value.title.includes("Document Metadata")){
               uid.push(<Header colspan={value.colspan} id={value.id} title={value.title}/>)
                da_state=true
            }
            else{
                ui.push(<Header colspan={value.colspan} id={value.id} title={value.title}/>)


            }
            }



        if("rows" in value) {
            if (uid.length > 0 && da_state == true) {
                  for (const [index2, value2] of value["rows"].entries()) {
                      for (const [index3, value3] of value2["rows"].entries()) {

                          switch (index3) {
                              case 0:
                                  uid.push(<Header colspan={value3.colspan} id={value3.id} title={value3.title}/>)
                                  break
                              case 1:

                                  let prev_value=document_attributes[value3.title]

                                  if(prev_value==undefined || props.document_attributes[value3.title]==undefined){
                                      prev_value=""
                                  }

                                  uid.push(<DocumentAttributeTextArea prev_value={prev_value}  updateDocumentAttributes={updateDocumentAttributes} title={value3.title}/>)
                                  break
                          }
                      }
                  }
                    da_state=false

            } else {
                //console.log(uir.length)
                let element_type=""
                if (uir.length > 0) {

                    //  console.log(value["rows"])
                    // uir.push(<Header colspan={value.colspan} id={value.id} title={value.title}/>)
                    for (const [index2, value2] of value["rows"].entries()) {
                        for (const [index3, value3] of value2["rows"].entries()) {

                            switch (index3) {
                                case 0:
                                    relations.push(<tr><AnnotationRelation title={value3.title}/></tr>)
                                    relation_types.push(value3.title)
                                    element_type=value3.title
                                    console.log(element_type)
                                    break;
                                case 1:
                                case 2:




                                    relations.push(<tr><Header colspan={1} id={value3["argument_header"].id}
                                                               title={value3["argument_header"].title}/>
                                        <AnnotationRelationCombobox annotation_contents={props.annotation_contents} current_type={relation_type} element_type={element_type}
                                                arg={value3["argument_header"].title} args={args}
                                                setRelationArg={setRelationArg}



                                        />
                                    </tr>)
                                    break;


                            }


                        }


                        uir.push(<AnnotationRelationTable uielement={relations}/>)
                        relations = []
                    }


                        /*uir.unshift(<tr>
                            <td><select
                                className="selectpicker"
                                data-container="body"
                                selectpicker=""
                                select-relation-type="relation_type">
                                <option value="">--- Select relation type ---</option>
                              {relation_types.map((value, index) => {
                          return <option value={value}>{value}</option>
                                  })}
                            </select>
                            </td>
                            </tr>)*/
                        console.log(uir.length)




                } else {


                    for (const [index2, value2] of value["rows"].entries()) {

                        for (const [index3, value3] of value2.entries()) {
                            if (value3.type == "annotation-button") {
                                uielements.push(<AnnotationButton markedfield={markedfield} markedcolor={markedcolor}
                                                                  SetMarkedColor={ClickButton} title={value3.title}
                                                                  label={value3.label}
                                                                  color={value3.color}/>)
                            } else if (value3.type == "annotation-dateentry") {
                                uielements.push(<AnnotationDateEntry SetProperty={SetProperty} disabled={whenstatus} default_value={dateproperty} markedfield={markedfield}
                                                                     annotationType={value3.annotation_type}
                                                                     annotationAttribute={value3.annotation_attribute}
                                                                     format={value3.dateentry_format}/>)
                            } else if (value3.type == "annotation-entry") {
                                let disabled = disabled_states[count]
                                let label_val=property_labels[count]
                                //  console.log(String(index3)+":"+String(disabled))
                                uielements.push(<AnnotationEntry SetProperty={SetProperty} disabled={disabled} markedfield={markedfield} label={label_val}
                                                                 property_labels={property_labels} prevmarkedfield={prevmarkedfieldRef.current}

                                                                 property_value={extraproperty}/>)
                                count = count + 1
                            } else {
                                uielements.push(<AnnotationComboBox/>)
                            }
                        }
                        ui.push(<tr>{uielements}</tr>)
                        uielements = []
                    }

                }

            }
        }

    }
setTableContent(ui)
if (uir.length>0)    {
    uir.unshift(<tr><td>{annotatedisabled}</td></tr>)
    uir.unshift(<SelectRelationType selectrelationtype={selectrelationtype} relation_types={relation_types}/>)
    uir.push(<tr>
        <td>
            <textarea style={{marginTop:"4%",resize:"vertical"}}  readOnly={true}
                                                                                                         value={(relation_arg1!=-1)?props.annotation_contents[relation_arg1]:"No selected"}></textarea>
        </td>
         <td>
            <textarea style={{marginTop:"4%",resize:"vertical"}}  readOnly={true}
                                                                                                         value={(relation_arg2!=-1)?props.annotation_contents[relation_arg2]:"No selected"}></textarea>
        </td>


    </tr>)





}

setrTableContent(uir)
setdTableContent(uid)
if(tabValue==1){
   if (relation_arg1==-1 || relation_arg2==-1) {
  SetAnnotateDisabled(true)
    console.log("disabled")}
   else{
       SetAnnotateDisabled(false)
   }
}




}

const Annotate=()=>{
        let prop_val=extraproperty
        if(markedfield!="when"){
            let parsedDate = Date.parse(extraproperty);
           if (!(isNaN(parsedDate))) {
                    prop_val=""
                    SetExtraProperty("")
           }
           }


        if (tabValue==0){

        props.AnnotateSelectedText(markedcolor,markedfieldtitle,markedfield,prop_val)}
        else{
            if(tabValue==2){
                props.setDocumentAttributes(document_attributes)}
            else{
                console.log("relations")
                    props.setRelation(relation_arg1,relation_arg2,relation_type)
            }
                //console.log(document_attributes)

        }
        handleClose()



}





useEffect(() => {
      //  console.log(viewshow)
    //    console.log(props.viewshow)
        if (viewshow==false && props.viewshow==true) {


            if(props.uistructure.kind=="button"){

                if(props.annotator_disabled==true){

                    if(props.uistructure["params"]["annotation"] == "argument"){
                         setTabValue(1)
                    }
                    if(props.uistructure["params"]["annotation"] == "VAST_value"){
                         setTabValue(2)
                    }

                  //  setTabValue(2)

                }
                else{

                     setTabValue(0)
                }





                //load prev values
                 SetMarkedField(props.selected_annotation_label)
                SetMarkedFieldTitle(props.selected_annotation_title)
                SetExtraProperty(props.selected_annotation_property)
                SetWhenStatus((props.selected_annotation_label=="when")?false:true)
                SetWhereStatus((props.selected_annotation_label=="where")?false:true)
                SetMainStatus((props.selected_annotation_label=="main")?false:true)
                SetSecondaryStatus((props.selected_annotation_label=="secondary")?false:true)
                SetReporterLocationStatus((props.selected_annotation_label=="reporter_location")?false:true)
                if (props.selected_annotation_label!=""){
                    SetAnnotateDisabled(false)
                }
                 CreateAnnottatorUI(props.uistructure)
                 window.$('#AnnotationModal').modal('show')
                 setViewshow(props.viewshow)}

            /*else{
                CreateAnnottatorCUI(props.uistructure)
                 window.$('#AnnotationModal').modal('show')//
                 setViewshow(props.viewshow)}*/
            }

            if (props.displayAnBar === true && anBarCounter < props.barCount){
                console.log("DRAW ANNOTATOR SIDE BAR")
                if (props.uistructure.kind=="button") CreateAnnottatorUI(props.uistructure)
                    else  CreateAnnottatorCUI(props.uistructure)
                setAnBarCounter(props.barCount)
            }

    //    let textfields=["when","where","reporter_location","main","secondary"]
        if( prevmarkedfieldRef.current!=markedfield){
             if(props.uistructure.kind=="button") {
                   console.log("rerender")

                    CreateAnnottatorUI(props.uistructure)
             }
        }

        if( (prevrelationtypeRef.current!=relation_type && relation_type!="") || (prev_arg1.current!=relation_arg1) ||(prev_arg2.current!=relation_arg2)){
             if(props.uistructure.kind=="button") {
                   console.log("rerender")

                 //   SetAnnotateDisabled(true)
                    CreateAnnottatorUI(props.uistructure)
             }
        }

        // console.log(prevmarkedcolorRef.current)

         prevmarkedfieldRef.current=markedfield
         prevrelationtypeRef.current=relation_type
         prev_arg1.current=relation_arg1
         prev_arg2.current=relation_arg2
      })

/*useEffect(() => {
    console.log("display")
    if (props.viewshow) {
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
                                <h5 className="modal-title" id="exampleModalLongTitle">Select Annotation Options</h5>
                                <button type="button" onClick={handleClose} className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                                  <div className="modal-body">
                                    <AppBar position="static">
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Annotator"  disabled={props.annotator_disabled}  />{/*disabled>*/}
                    <Tab label="Relations" disabled={(rtable_content.length>0 && props.annotation_contents.length>=2)?false:true} />
                    <Tab label="Document Attributes" disabled={dtable_content.length>0?false:true} />
                </Tabs>
            </AppBar>
            <TabPanel value={tabValue} index={0}> {/*0 stands for Button Annotator / 1 for Coreference Annotator*/}
            <ButtonAnnotationSchema uielement={table_content}/>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <ButtonAnnotationSchema uielement={rtable_content}/>
            </TabPanel>
             <TabPanel value={tabValue} index={2}>
                <ButtonAnnotationSchema uielement={dtable_content}/>


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

<div className="coreference-bar" style={{display: props.displayAnBar ? "block" : "none", float:"right"}}>
              <div className="modal-body">
                  <AppBar position="static">
                      <Tabs value={tabValuec} onChange={handleTabChange}>
                          <Tab label="Annotator"    />{/*disabled>*/}
                          <Tab label="Relations" disabled={rtable_content.length>0?false:true} />
                      </Tabs>
                  </AppBar>
                  <TabPanelC classname="corefTabPanel" value={tabValuec} index={0}>
                      <ButtonAnnotationSchema uielement={table_content}/>
                      <div className="modal-footer">
                          <div className={classes.myButtons}>
                              <Button className={classes.button} variant="outlined" color="secondary" onClick={handleClose}>Cancel</Button>
                              <Button type="button" className={classes.button} variant="outlined" color="secondary" disabled={annotatedisabled} onClick={Annotate}>Annotate</Button>
                          </div>
                      </div>
                  </TabPanelC>
                  <TabPanelC value={tabValuec} index={1}>
                      <ButtonAnnotationSchema uielement={rtable_content}/>
                  </TabPanelC>

              </div>
          </div>




            </div>







    );

}