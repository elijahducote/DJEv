import {htm} from "./utility";
import "@hcaptcha/vanilla-hcaptcha";
import { Form } from "@forms.js/core";
import axios from "axios";
import { formatCurrency } from "./utility.js";
import { handleServerResponse } from "./utility.js";
import { v4 as uuid } from "@lukeed/uuid";

const stripe = Stripe("pk_live_51PVFAM07xQtIlHl5nneheqyHshNmnrBOzRIgxXQs6GYp7cmtOWsgQnRlQYwUFez0teYb8OYUlIKi91XLMvEm4gts00iISFGmfg");

let paymentfillout,
portnumbr = "",
srcURL,
idempotencyKey = uuid(),
idempotencyKey2 = uuid(),
idempotencyKey3 = uuid();

if (window.location.port.length > 1) portnumbr = `:${window.location.port}`;
srcURL = `${window.location.protocol}//${window.location.hostname}${portnumbr}`;

const elements = stripe.elements({
  mode: "payment",
  locale: "en",
  currency: "usd",
  amount: 50, // minium value, update this later
  externalPaymentMethodTypes: [
   "external_line_pay",
   "external_paysafecard",
   "external_samsung_pay",
   "external_sezzle"
  ],
  captureMethod: "automatic_async", // manual automatic_async
  loader: "always",
  appearance: {
    theme: "flat",
    labels: "above",
    disableAnimations: true
  }
}),
paymentElement = elements.create("payment", {
  layout: {
    type: "tabs",
    defaultCollapsed: false
  },
  defaultValues: {
    billingDetails: {
      name: "",
      email: "",
      phone: "",
      address: {
        line1: "",
        city: "",
        state: "TX",
        country: "US",
        postal_code: ""
      }
    }
  },
  business: {
    name: "DJ EV"
  }
});

export function Payment() {
  window.rqid = false;
  const captcha = htm(undefined,"h-captcha",{"auto-render":"true","id":"captcha","site-key":"e2480948-c1cc-4f46-ac56-81ea236a50c8","size":"compact","tabindex":"0"}),
  paymentForm = htm(undefined, "div");
  
  captcha.addEventListener("verified", function (e) {
    window.rqid = e.token;
    document.getElementById("payment-submit").disabled = false;
  });
  captcha.addEventListener("error", function (e) {
    window.rqid = false;
    console.log(e.error);
  });

  paymentfillout = new Form(paymentForm, {
      id: "payment-form",
      schema: [
        {
         id: "stripe-amount",
         type:"text",
         name:"amount",
         label: "Amount",
         placeholder: "Ex: US$ 1,000,000.00...",
         required: true
        },
        {
          id: "token",
          name: "token",
          type: "hidden"
        },
        {
          id: "payment-submit",
          type: "button",
          buttonType:"submit",
          template: "Pay",
          className: "pure-button-primary pure-button",
        }
        ]
    });

    window.addEventListener("load", function () {
      document.getElementById("payment-submit").disabled = true;
      document.getElementById("payment-form").classList.add("pure-form","pure-form-stacked");
      
      
      const form = document.getElementById("payment-form"),
      pay = htm(undefined,"div",{id:"payment-element"}),
      currency = document.getElementById("stripe-amount");
      //currency.setAttribute("pattern","^US\$ \d{1,3}(,\d{3})*(\.\d+)?$");
      currency.setAttribute("autofocus","");
      

      currency.addEventListener("keyup", function() {
            formatCurrency(this);
      });
      currency.addEventListener("blur", function() {
            formatCurrency(this, "blur");
      });

      van.add(form.childNodes[form.childNodes.length - 3],htm(undefined,"br"));
      van.add(form.childNodes[form.childNodes.length - 3],pay);
      van.add(form.childNodes[form.childNodes.length - 2],captcha);
      van.add(form.childNodes[form.childNodes.length - 2],htm(undefined,"div",{id:"payment-message"}));
      
      paymentElement.mount(pay);

      document.getElementById("payment-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        // elements on the page
        const money = document.getElementById("stripe-amount").value,
        submitBtn = document.getElementById("payment-submit"),
        statusMsg = document.getElementById("payment-message");
        
        statusMsg.textContent = "Processing payment...";
        submitBtn.disabled = true;
        
        let bal = money.indexOf("US$ ");
        if (!bal) ++bal;
        const formatted = money.substring(bal*4).split(",").join(""),
        amount = Math.round((parseFloat(formatted) * 100));
        
        
        
        const {selectedPaymentMethod: payment_method, error: submitError} = await elements.submit();
        
        if (submitError) {
         statusMsg.textContent = submitError.message;
         submitBtn.disabled = false;
         return;
        }
        
        const {confirmationToken: {id: confirmation_token}, error: tokenError} = await stripe.createConfirmationToken({
          elements,
          params: {
            return_url: `${srcURL}/go/message`
          }
        },
        {
          idempotencyKey
        });
        
        /*if (confirmation_token && hasMadeTransaction) return;
        else if (confirmation_token) {
          hasMadeTransaction = true;
        }*/
        
        
        if (tokenError) {
          statusMsg.textContent = tokenError;
          return;
        }
        
        const intent_data = {
            amount,
            confirmation_token,
            payment_method,
            idempotencyKey: idempotencyKey2,
            idempotencyKey1: idempotencyKey3
        };
        const {data: msg, data: status} = await axios.post(`${srcURL}/go/create-intent`,
          intent_data
          ,{
          headers: {
            "Content-Type": "application/json"
          },
          //responseType: "json"
        });
        
        if (status !== "succeeded") {
          idempotencyKey = uuid();
          idempotencyKey2 = uuid();
          idempotencyKey3 = uuid();
        }
        
        /*const {error: {message: confirmError}} = await stripe.confirmPayment({
          elements: elements,
          clientSecret,
          confirmParams: {
            // Return URL where the customer should be redirected after the PaymentIntent is confirmed.
            return_url: "https://example.com"
          }
        });
      
        if (confirmError) statusMsg.textContent = confirmError;*/
        handleServerResponse(msg,stripe);
      });
    });

    return paymentForm;
}