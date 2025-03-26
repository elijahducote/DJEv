import {checkValues,tabulateList,report,sendHTMLResponse} from "../lib/utility.js";
import axios from "axios";

export async function message(body) {
  try {
    const {redirect_status} = body;
    /*params = new URLSearchParams(),
    log = [];
    
    if (token) report(`Got token: ${token}`,log);
    else report("Did not receive token.",log,false);
    
    params.append("secret", process.env.HCAPTCHA_SECRET);
    params.append("response", token);
    
    await axios.post("https://api.hcaptcha.com/siteverify", params).then((resp) => {
      report(resp.data.success,log);
    }).catch((err) => {
      report(err,log,false);
    });
    
    if (checkValues([1,3,5],false)) throw new Error(tabulateList(log));*/

    if (redirect_status !== "succeeded") throw new Error("Unsuccessful.");
    
    return {
      msg: sendHTMLResponse(1,"Payment authorized."),
      type: "text/html",
      code: 200
    }
  }
  catch (err) {
    return {
      msg: sendHTMLResponse(0,err),
      type: "text/html",
      code: 400
    }
  }
}