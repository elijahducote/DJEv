import { Form } from '@forms.js/core';

const options = {
  id: "booking-section",
  schema: [
    {
      id: "file",
      type:"file",
      name:"",
      options:{
        
      },
      label: "File",
      required: false,
      //className
   },
   {
     id: "submit",
     type: "button",
     buttonType:"submit",
     template: "Submit",
     className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
   }
  ]
}

const form = new Form("booking-form", options);