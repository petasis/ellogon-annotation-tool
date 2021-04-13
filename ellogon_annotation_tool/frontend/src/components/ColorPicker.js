import React, {useEffect, useRef, useState} from "react";
import {HexColorPicker} from "react-colorful";//install

export default function ColorPicker(props) {
  const [color, setColor] = useState("#aabbcc");
 const prevselectedcolordRef = useRef();

const getColor=(value)=>{
   // console.log(value)
    setColor(value)
    props.getcolor(value)
}


  /*useEffect(() => {
     if (color!=prevselectedcolordRef){
        // console.log(props)
        // props.getcolor(color)
     }

        prevselectedcolordRef.current=color
  })*/





  return <HexColorPicker color={color} onChange={getColor} />;
};