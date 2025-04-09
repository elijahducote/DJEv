import {htm} from "./utility";
import "@hcaptcha/vanilla-hcaptcha";
import { Form } from "@forms.js/core";
import axios from "axios";

let fillout;

export function Booking() {
  window.rqid = false;
  const captcha = htm(undefined,"h-captcha",{"auto-render":"true","id":"captcha","site-key":"e2480948-c1cc-4f46-ac56-81ea236a50c8","size":"compact","tabindex":"0"}),
  bookingForm = htm(undefined, "div");
  
  captcha.addEventListener("verified", function (e) {
    window.rqid = e.token;
    document.getElementById("submit-button").disabled = false;
  });
  captcha.addEventListener("error", function (e) {
    window.rqid = false;
    console.log(e.error);
  });

  fillout = new Form(bookingForm, {
      id: "form",
      method:"POST",
      action:"/go/resend",
      //className: "pure-form pure-form-stacked",
      schema: [
        {
          id: "date",
          type:"datetime",
          name:"date",
          label: "Date of Event",
          enhance: true,
          placeholder: "MM/DD/YY 00:00 AM/PM",
          required: true
        },
        {
         id: "email",
         type:"email",
         name:"email",
         label: "Email",
         placeholder: "Username@Website.Ext",
         required: true
        },
        {
          id: "attachment",
          type:"file",
          name:"attachment",
          options:{
            fileSizeBase: 1024,
            allowBrowse: true,
            storeAsFile: true,
            checkValidity: true,
            maxFiles: 1,
            dropValidation: true
          },
          label: "Attachment?",
          required: false,
          enhanced: true
        },
        {
          id: "event",
          type:"text",
          name:"event",
          label: "Type of Event",
          placeholder: "Ex: Jennifer’s 50th Bday Party",
          required: true
        },
        {
          id: "locale",
          type:"text",
          name: "locale",
          label: "Address of Event",
          placeholder: "Ex: 1787 Botanical Boulevard, Houston, Texas",
          required: true
        },
        {
          id: "selection",
          type:"select",
          name: "selection",
          label: "Type of Music",
          enhance: true,
          multiple: true,
          required: true,
          options: {
            plugins: ["remove_button","checkbox_options"]
          },
          placeholder: "Choose as many from the selection.",
          optionsList: [
            {
              value: "Top 40",
              label: "Top 40",
            },
            {
              value: "Pop",
              label: "Pop",
            },
            {
              value: "Rock",
              label: "Rock",
            },
            {
              value: "R&B",
              label: "R&B",
            },
            {
              value: "Hip-Hop/Rap",
              label: "Hip-Hop/Rap",
            },
            {
              value: "Country",
              label: "Country",
            },
            {
              value: "Disco",
              label: "Disco",
            },
            {
              value: "Oldies",
              label: "Oldies",
            },
            {
              value: "Motown",
              label: "Motown",
            },
            {
              value: "Classical",
              label: "Classical",
            },
            {
              value: "Alternative",
              label: "Alternative",
            },
            {
              value: "Jazz",
              label: "Jazz",
            },
            {
              value: "Techno/House",
              label: "Techno/House",
            },
            {
              value: "Dubstep",
              label: "Dubstep",
            },
          ],
        },
        {
          id: "requests",
          type:"textarea",
          name: "requests",
          label: "Requests?",
          placeholder: "List Artist and Song; or send link playlist (website, Spotify, YouTube)",
          required: false
        },
        {
          id:"dislikes",
          type:"textarea",
          name:"dislikes",
          label:"Dislikes?",
          placeholder:"Songs or artists that you do not want to be played.",
          required: false
        },
        {
         id: "comments",
         type:"textarea",
         name:"comments",
         label: "Comments?",
         placeholder: "Please list anything or any notes that you want DJ EV to know beforehand.",
         required: false
        },
        {
          id: "token",
          name: "token",
          type: "hidden"
        },
        {
          id: "submit-button",
          type: "button",
          buttonType:"submit",
          template: "Submit",
          className: "pure-button-primary pure-button",
        }
        /*{
          id:"button-group",
          type:"group",
          schema:[
            {
              id: "submit-button",
              type:"button",
              label: "Submit",
              className: "pure-button-primary pure-button"
            },
          ]
        },*/
        ]
    });
    window.addEventListener("load", function () {
      document.getElementById("submit-button").disabled = true;
      document.getElementById("form").setAttribute("enctype","multipart/form-data");
      document.getElementById("form").classList.add("pure-form","pure-form-stacked");
      document.getElementById("form").addEventListener("submit", (e) => {
        e.preventDefault();
        fillout.validate();
        if (window.rqid && fillout.isValid()) {
          fillout.getField("token").setValue(window.rqid);
          e.currentTarget.submit();
        }
      });
      let offspring = document.getElementById("form").childNodes;
      van.add(offspring[offspring.length- 2],captcha);
    });
    return bookingForm;
}