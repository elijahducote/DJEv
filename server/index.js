import express from "express";
import axios from "axios";
import "dotenv/config";
import path from "path";
import multipart from "parse-multipart";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import util from "util";
import { exec } from "child_process";
const app = express();

function print(msg,status = 2) {
  const color = [
    // failure
    "\x1b[31;4;1m",
    // success
    "\x1b[32;1m",
    // info
    "\x1b[36;3;1m",
    // warning
    "\x1b[33;1;3m"][status]
    console.log(`${color}${msg}\x1b[m`)
}

const execAsync = util.promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const source = path.join(__dirname,"..","client/source");
const source2 = path.join(__dirname,"endpoint");

async function rebuild (command) {
  try {
    const {stdout, stderr} = await execAsync(command);
    if (stdout.length) print(stdout);
    if (stderr.length) print(stderr,0);
  } catch (e) {
    print(e,0);
  }
}
app.use(bodyParser.urlencoded({ extended: true })); // If using body-parser
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static(source));
app.use("/CDN",express.static(source));
//app.use("/",express.static(source2));

/*app.get('/client/source/*', (req, res) => {
const splat = req.params[0];
res.redirect(200, `/CDN/${splat}`);
});*/

// Redirect all other routes to "/index.html"

app.post("/deliver", async (req,res) => {
  const { body, query } = req,
  nametag = ["Try again","Success"],
  svg = ["<svg xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" viewBox=\"0 0 330 330\"><path fill=\"#FF0000\" d=\"M257 193c-6-6-16-6-21 0l-11 11-11-11a15 15 0 0 0-21 21l11 11-11 11a15 15 0 1 0 21 21l11-11 11 11a15 15 0 0 0 21 0c6-6 6-16 0-21l-11-11 11-11c6-5 6-15 0-21zM250 0H20l40 30 75 56z\"/><path fill=\"#FF0000\" d=\"M270 130V23l-30 22-96 72-9 3-9-3L0 23v172c0 8 7 15 15 15h106a105 105 0 0 0 104 120 105 105 0 0 0 45-200zm-45 170a75 75 0 1 1 0-150 75 75 0 0 1 0 150z\"/></svg>","<svg xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" viewBox=\"0 0 330 330\"><path fill=\"#00FF00\" d=\"M255 210h-15v-15a15 15 0 0 0-30 0v15h-15a15 15 0 0 0 0 30h15v15a15 15 0 0 0 30 0v-15h15a15 15 0 0 0 0-30zM250 0H20l40 30 75 56z\"/><path fill=\"#00FF00\" d=\"M270 130V23l-30 22-96 72-9 3-9-3L0 23v172c0 8 7 15 15 15h106a105 105 0 0 0 104 120 105 105 0 0 0 45-200zm-45 170a75 75 0 1 1 0-150 75 75 0 0 1 0 150z\"/></svg>"];
  
  let ndx = 0,
  respcode = 400,
  usrname = "Anonymous",
  contents,
  email,
  msg;
  
  try {
    if ("mailbox" in body) email = body.mailbox;
    if ("mailbox" in query) email = query.mailbox;
    if ("message" in body) msg = body.message;
    if ("message" in query) msg = query.message;
    
    if (email) usrname = email.split("@",1)[0];
    let errout = "Oops. Gone awry!",
    firstchar = usrname.charCodeAt(0);
    
    if (firstchar > 96 && firstchar < 123) {
      usrname = String.fromCharCode(firstchar - 32) + usrname.slice(1);
    }
    
    const resend = axios.create({
      baseURL: "https://api.resend.com",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      }
    }),
    {status} = await resend.post("/emails", {
      from: "Evwave Music <booking@djev.org>",
      to: ["ducote.help@gmail.com"],
      subject: `Incoming Message from ${usrname}`,
      html: `<style>:root{font-size:1px}body,html{line-height:1.5em;background:#000;font-size:35rem;font-family:Helvetica}.container{padding:0;min-width:auto;margin:0 -50% 0 -50%;width:100%;max-height:100vh;max-width:100vw;display:block;position:absolute;inset:0 50% 0 50%;box-sizing:content-box;background:#000}@media (min-height:626px) and (min-width:365px){.container{font-size:20rem}}@media (min-height:912px) and (min-width:540px){.container{font-size:40rem}.container{font-size:60rem}}@media (min-width:992px) and (min-height:654px){.container{font-size:100rem}}@media (min-width:1363px) and (min-height:559px){.container{font-size:120rem}}@media (min-width:1932px) and (min-height:1121px){.container{font-size:150rem}}.wrapper{overflow-wrap:break-word;word-wrap: break-word;word-break:break-word;hyphens:auto;font-weight:800;line-height:1.5em;letter-spacing:.075em;right:100%;margin:50% 0 0 0;color:#fff;left:0;width:100%;padding:0;position:absolute;box-sizing:border-box;display:flex;text-align:center;justify-content:center;align-content:center;object-position:center;align-items:center}svg{width:5em}.wrapper p{font-size:0.75em}h2{bottom:0.75em;position:relative}</style><div class=container><div class=wrapper style="margin:0 auto"><svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 330 330"><path fill="#00AAFF" d="m246 192-34 35-9-10a15 15 0 1 0-22 22l20 20a15 15 0 0 0 22 0l45-45a15 15 0 1 0-22-22zm4-192H20l40 30 75 56z"/><path fill="#00AAFF" d="M270 130V23l-30 22-96 72-9 3-9-3L0 23v172c0 8 7 15 15 15h106a105 105 0 0 0 104 120 105 105 0 0 0 45-200zm-45 170a75 75 0 1 1 0-150 75 75 0 0 1 0 150z"/></svg></div><div class=wrapper><h2 style=color:#00AAFF>New Message</h2></div><br/><br/><br/><div class=wrapper><p>${msg}</p></div></div>`,
      headers: {
        "X-Entity-Ref-ID": Math.floor(Date.now() / 1000).toString()
      }
    }).catch((err) => {
      errout += `\n${err}`;
    });
    
    respcode = status;
    if (status === 200) {
      ndx = 1;
      contents = "<div class=wrapper><h2 style=color:#00FF00>Success.</h2></div><br><br><br><div class=wrapper><p>Delivered message.</p></div>";
    }
    else throw new Error(errout);
  }
  catch (err) {
    contents = `<div class=wrapper><h2 style=color:#FF0000>Failed.</h2></div><br><br><br><div class=wrapper><p>${err}</p></div>`;
  }
  finally {
    return {
      statusCode:respcode,
      headers: {
        "Content-Type": "text/html"
      },
      body: `<!doctype html><html><head><meta http-equiv=refresh content="7;url=https://djev.org/booking?usr=${usrname}&status=${respcode}"><meta charset=utf-8 /><title>${nametag[ndx]}.</title><link href=../../fonts.css rel=stylesheet></head><body><style>:root{font-size:1px}body,html{background:#000;font-size:35rem;font-family:Brisa Sans}.container{padding:0;min-width:auto;margin:0 -50% 0 -50%;width:100%;max-height:100vh;max-width:100vw;display:block;position:absolute;inset:0 50% 0 50%;box-sizing:content-box;background:#000}@media (min-height:626px) and (min-width:365px){.container{font-size:20rem}}@media (min-height:912px) and (min-width:540px){.container{font-size:40rem}.container{font-size:60rem}}@media (min-width:992px) and (min-height:654px){.container{font-size:100rem}}@media (min-width:1363px) and (min-height:559px){.container{font-size:120rem}}@media (min-width:1932px) and (min-height:1121px){.container{font-size:150rem}}.wrapper{line-height:1.5em;letter-spacing:.075em;right:100%;margin:50% 0 0 0;color:#fff;left:0;width:100%;padding:0;position:absolute;box-sizing:border-box;display:flex;text-align:center;justify-content:center;align-content:center;object-position:center;align-items:center}svg{width:5em}</style><div class=container><div class=wrapper style="margin:0 auto">${svg[ndx]}</div>${contents[ndx]}</div></body></html>`
    };
  }
});


app.post("/subscribe", async (req, res) => {
  const body = req.body;
  print(body);
  const nametag = ["Try again", "Confirmed", "Success"];
  const svg = [
    "<svg xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" viewBox=\"0 0 330 330\"><path fill=\"#FF0000\" d=\"M257 193c-6-6-16-6-21 0l-11 11-11-11a15 15 0 0 0-21 21l11 11-11 11a15 15 0 1 0 21 21l11-11 11 11a15 15 0 0 0 21 0c6-6 6-16 0-21l-11-11 11-11c6-5 6-15 0-21zM250 0H20l40 30 75 56z\"/><path fill=\"#FF0000\" d=\"M270 130V23l-30 22-96 72-9 3-9-3L0 23v172c0 8 7 15 15 15h106a105 105 0 0 0 104 120 105 105 0 0 0 45-200zm-45 170a75 75 0 1 1 0-150 75 75 0 0 1 0 150z\"/></svg>",
    "<svg xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" viewBox=\"0 0 330 330\"><path fill=\"#00AAFF\" d=\"m246 192-34 35-9-10a15 15 0 1 0-22 22l20 20a15 15 0 0 0 22 0l45-45a15 15 0 1 0-22-22zm4-192H20l40 30 75 56z\"/><path fill=\"#00AAFF\" d=\"M270 130V23l-30 22-96 72-9 3-9-3L0 23v172c0 8 7 15 15 15h106a105 105 0 0 0 104 120 105 105 0 0 0 45-200zm-45 170a75 75 0 1 1 0-150 75 75 0 0 1 0 150z\"/></svg>",
    "<svg xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" viewBox=\"0 0 330 330\"><path fill=\"#00FF00\" d=\"M255 210h-15v-15a15 15 0 0 0-30 0v15h-15a15 15 0 0 0 0 30h15v15a15 15 0 0 0 30 0v-15h15a15 15 0 0 0 0-30zM250 0H20l40 30 75 56z\"/><path fill=\"#00FF00\" d=\"M270 130V23l-30 22-96 72-9 3-9-3L0 23v172c0 8 7 15 15 15h106a105 105 0 0 0 104 120 105 105 0 0 0 45-200zm-45 170a75 75 0 1 1 0-150 75 75 0 0 1 0 150z\"/></svg>"
    ];
    
    let ndx = 0;
    let respcode = 400;
    let hex = "#FF0000";
    let content;
    
    try {
      let errout = "Oops. Gone awry!";
      const mailerlite = axios.create({
        baseURL: "https://connect.mailerlite.com/api",
        headers: {
          "Authorization": `Bearer ${process.env.MAILERLITE_TOKEN}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Version": "2038-01-19"
        }
      });
      
      const response = await mailerlite.post("/subscribers", {
        email: body.mailbox
      }).catch((err) => {
        errout += `\n${err}`;
        throw err;
      });
      
      respcode = response.status;
      if (response.status === 201) {
        ndx = 2;
        content = "<div class=wrapper><h2 style=color:#00FF00>Success.</h2></div><br><br><br><div class=wrapper><p>Added to mailing list.</p></div>";
      } else if (response.status === 200) {
        ndx = 1;
        hex = "#00AAFF";
        throw new Error("Already on mailing list!");
      } else {
        throw new Error(errout);
      }
    } catch (err) {
      content = `<div class=wrapper><h2 style=color:${hex}>Failed.</h2></div><br><br><br><div class=wrapper><p>${err.message}</p></div>`;
    }
    
    const htmlContent = `<!doctype html><html><head><title>${nametag[ndx]}.</title><link href=../../fonts.css rel=stylesheet></head><body><style>:root{font-size:1px}body,html{background:#000;font-size:35rem;font-family:Brisa Sans}.container{padding:0;min-width:auto;margin:0 -50% 0 -50%;width:100%;max-height:100vh;max-width:100vw;display:block;position:absolute;inset:0 50% 0 50%;box-sizing:content-box;background:#000}@media (min-height:626px) and (min-width:365px){.container{font-size:20rem}}@media (min-height:912px) and (min-width:540px){.container{font-size:40rem}.container{font-size:60rem}}@media (min-width:992px) and (min-height:654px){.container{font-size:100rem}}@media (min-width:1363px) and (min-height:559px){.container{font-size:120rem}}@media (min-width:1932px) and (min-height:1121px){.container{font-size:150rem}}.wrapper{line-height:1.5em;letter-spacing:.075em;right:100%;margin:50% 0 0 0;color:#fff;left:0;width:100%;padding:0;position:absolute;box-sizing:border-box;display:flex;text-align:center;justify-content:center;align-content:center;object-position:center;align-items:center}svg{width:5em}</style><div class=container><div class=wrapper style="margin:0 auto">${svg[ndx]}</div>${content}</div></body></html>`;
    
    res.status(respcode).set('Content-Type', 'text/html').send(htmlContent);
});


app.post("/resend", async (req,res) => {
  try {
    // Parse multipart form data
    const bodyBuffer = Buffer.from(JSON.stringify(req.body), "base64"),
    boundary = multipart.getBoundary(req.headers["content-type"]),
    parts = multipart.Parse(bodyBuffer, boundary);
    console.log(req.body);
    const formData = {},
    attachments = [];

    parts.forEach(part => {
      if (part.filename) attachments.push({
          filename: part.filename,
          content: part.data.toString("base64"),
          contentType: part.type || "application/octet-stream"
        });
      else formData[part.name] = part.data.toString("utf8");
    });
    console.log(formData);
    // Prepare Resend API payload
    const resendPayload = {
      from: "Evwave Music <booking@djev.org>",
      to: formData.email,
      subject: `New Submission: ${formData.event}`,
      html: `
        <h1>Event Details</h1>
        <p>Date: ${formData.date}</p>
        <p>Event: ${formData.event}</p>
        <p>Locale: ${formData.locale}</p>
        <p>Requests: ${formData.requests}</p>
        <!-- Add other fields -->
      `,
      attachments
    };

    // Send to Resend API
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify(resendPayload)
    });

    if (!resendResponse.ok) {
      const error = await resendResponse.json();
      throw new Error(error.message);
    }

    let msg = {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" }),
      headers: {
        "Content-Type": "application/json"
      }
    };
    res.status(msg.statusCode).set("Content-Type", "text/html").send(msg);
  } catch (error) {
    let msg = {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers: {
        "Content-Type": "application/json"
      }
    };
    res.status(msg.statusCode).set("Content-Type", "text/html").send(msg);
  }
});

app.get("/*",(req,res) => {
  //rebuild(`esbuild ${source}/script/*.js --tree-shaking=true --legal-comments=none --charset=utf8 --format=iife --bundle --platform=browser --minify --target=chrome120,firefox120,edge120,safari16,opera103 --outdir=${source}/js`);
  print(source);
  rebuild(`esbuild "${source}/script/*.js" --keep-names --drop:debugger --tree-shaking=true --legal-comments=none --charset=utf8 --format=iife --bundle --platform=browser --minify --target=chrome120,firefox120,edge120,safari16,opera103 --outdir="${source}/js/" && esbuild "${source}/ravel.css" --loader:.css=css --loader:.ttf=file --tree-shaking=true --legal-comments=none --charset=utf8 --bundle --platform=browser --minify --target=chrome120,firefox120,edge120,safari16,opera103 --outfile="${source}/css/ravel.css"`);
  const options = {
    root: source
  };
  res.sendFile("index.html",options);
  //res.sendStatus(200);
});
app.listen(3000);