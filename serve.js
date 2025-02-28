import { print, runCmd, sendHTMLResponse } from "./utility.js";

import Busboy from "busboy";
import axios from "axios";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { cors } from "hono/cors";

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const app = new Hono();
const workingDir = dirname(fileURLToPath(import.meta.url));
const publicDir = join(workingDir, "client/source");


// Helper to parse multipart data
function parseFormData (bodyBuffer, contentType) {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: { "content-type": contentType } });
    const fields = {};
    const files = [];
  
    busboy.on("file", (name, file, info) => {
      const chunks = [];
      file.on("data", (data) => chunks.push(data));
      file.on("end", () => {
        files.push({
          filename: info.filename,
          contentType: info.mimeType,
          content: Buffer.concat(chunks)
        });
      });
    });
  
    busboy.on("field", (name, value) => {
      fields[name] = fields[name] || [];
      fields[name].push(value);
    });
  
    busboy.on("finish", () => resolve({ fields, files }));
    busboy.on("error", reject);
    busboy.end(bodyBuffer);
  });
}

// Helper to build HTML email content
function buildEmailHtml (fields) {
  return `
  <h1>New Form Submission</h1>
  <p><strong>Date:</strong> ${fields.date?.[0] || "N/A"}</p>
  <p><strong>Email:</strong> ${fields.email?.[0] || "N/A"}</p>
  <p><strong>Event:</strong> ${fields.event?.[0] || "N/A"}</p>
  <p><strong>Selection:</strong> ${fields.selection?.join(", ") || "None"}</p>
  <p><strong>Requests:</strong> ${fields.requests?.[0] || "N/A"}</p>
  <p><strong>Dislikes:</strong> ${fields.dislikes?.[0] || "N/A"}</p>
  <p><strong>Comments:</strong> ${fields.comments?.[0] || "N/A"}</p>
  `;
}



// Step 1: Apply CORS to all routes
//app.use("*", cors());

// Step 2: Specific route for /cdn/* (takes precedence)
app.get(
  "/cdn/*",
  serveStatic({
    root: "client/source",
    rewriteRequestPath: (path) => path.replace(/^\/cdn/, "/"),
  })
);




// Step 3: Serve static files for non-/cdn/* paths
app.use("*", async (c, next) => {
  if (!c.req.path.startsWith("/cdn") && !c.req.path.startsWith("/resend")) {
    await runCmd(
      `esbuild "${publicDir}/script/*.js" --keep-names --drop:debugger --pure:console --tree-shaking=true --legal-comments=none --charset=utf8 --format=iife --bundle --platform=browser --minify --target=chrome131,safari18.2,edge131,firefox133,opera115 --outdir="${publicDir}/js" && esbuild "${publicDir}/ravel.css" --loader:.css=css --loader:.ttf=file --tree-shaking=true --legal-comments=none --charset=utf8 --bundle --platform=browser --minify --target=chrome131,safari18.2,edge131,firefox133,opera115 --outfile="${publicDir}/css/ravel.css"`
    );
    return await serveStatic({ root: "client/source", path:"index.html" })(c, next);
    //return await serveStatic({ root: "client/source" })(c,next);
  }
  await next();
});

app.post("/resend", async (c) => {
  try {
    const body = await c.req.arrayBuffer();
    const contentType = await c.req.header("Content-Type");
    const bodyBuffer = Buffer.from(body, 'base64');

    // Parse multipart form data (unchanged)
    const { fields, files } = await parseFormData(bodyBuffer, contentType);
    console.log(files);
    // Prepare Resend email payload (unchanged)
    const emailPayload = {
      from: 'Evwave Music <booking@djev.org>',
      to: fields.email?.[0] || 'ducote.help@gmail.com',
      subject: `New Submission: ${fields.event?.[0] || 'No Event'}`,
      html: buildEmailHtml(fields),
      attachments: files.map(file => ({
        content: file.content.toString('base64'),
        filename: file.filename,
        contentType: file.contentType
      }))
    };
    
    let error = false;
    // Send to Resend API using Axios
    const resendResponse = await axios.post('https://api.resend.com/emails', emailPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      }
    }).catch((err) => {
      error = err;
    });
    
    if (error) throw new Error(error);
    return c.html(sendHTMLResponse(1));
    /*return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: resendResponse.data })
    };*/

  } catch (error) {
    return c.html(sendHTMLResponse(0,error));
    /*return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({ 
        error: error.message,
        details: error.response?.data 
      })
    };*/
  }
})
.get(async (c) => {
 // console.log(JSON.stringify(await c.req.body));
  return c.html(sendHTMLResponse(0,"Not implemented."));
});


// Step 4: Catch-all route for SPA (e.g., serve index.html)
//app.get("*", serveStatic({ path: "client/source/index.html" }));

// Start the server
serve(app, (info) => {
  console.log(`Running on http://127.0.0.1:${info.port}`);
});