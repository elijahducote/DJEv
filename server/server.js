// Utility
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { print, runCmd, sendHTMLResponse } from "../utility.js";

// Network
import { Hono } from "hono";
import { every } from "hono/combine";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { cors } from "hono/cors";
import axios from "axios";

const app = new Hono(),
workingDir = dirname(fileURLToPath(import.meta.url));

function tabulate(msg, size) {
  const order = size || 1;
  return `${order}. ${msg}\n`;
}
// Middleware changes the respondee or requester before its delivered to the server/user
app.use("/*",
// "every" combines multiple middleware into one
  every(cors(),
    serveStatic(
      {
        root: join(workingDir,"convoy/")
      }
    )
  )
);

app.get("test", async (c,next) =>
{
  await runCmd(`esbuild ${workingDir}/convoy/nexus.js --keep-names --drop:debugger --pure:console --tree-shaking=true --legal-comments=none --charset=utf8 --format=iife --bundle --platform=browser --minify --target=chrome131,safari18.2,edge131,firefox133,opera115 --outfile=${workingDir}/convoy/shipment/nexus.js && esbuild ${workingDir}/convoy/ravel.css --loader:.css=css --tree-shaking=true --legal-comments=none --charset=utf8 --bundle --platform=browser --minify --target=chrome131,safari18.2,edge131,firefox133,opera115 --outfile=${workingDir}/convoy/shipment/ravel.css`);
  await next();
},(c)=>c.html(sendHTMLResponse(1)));


app.get("", async (c,next) =>
{
  let msg = "";
  try {
    let isError = false;
    
    const gh = axios.create({
      baseURL: "https://api.github.com/repos/elijahducote/trifectshow",
      headers: {
        "Authorization": `Bearer ${process.env.GIT}`,
        "Accept": "application/vnd.github.object+json,text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
        "Referer": "https://example.com/",
        "Connection": "keep-alive"
      },
      withCredentials: false
    });
    
    await Promise.allSettled(
    [
      gh.get("/commits/main"),
      gh.get("/contents/important.json")
    ]).then(vow => {
      const {status: commitStatus} = vow[0].value,
      errlog = [];
          
      if (commitStatus === 200) {
        const {sha: latestCommit} = vow[0].value.data,
        {status: fileStatus} = vow[1].value;
        
        if (latestCommit && fileStatus === 200) {
          const {content: fileContent, sha: blobHash} = vow[1].value.data,
          jsonObject = JSON.parse(atob(fileContent));
          jsonObject.hash = latestCommit;
          gh.put("/contents/important.json",
          {
            sha: blobHash,
            content: btoa(JSON.stringify(jsonObject)),
            message: "Update on file contents."
          })
          .catch(err => {
            errlog[errlog.length] = tabulate(`Couldn't update requested file: "${err}"`, errlog.length);
          });
        }
        else errlog[errlog.length] = tabulate("File wasn't able to be reached.", errlog.length);
      }
      else errlog[errlog.length] = tabulate("Unable to fulfill request.", errlog.length);
          
      if (errlog.length !== 0) throw errlog.join();
    }).catch(err => {
      msg = msg + err;
      isError = true;
    });
    
    if (isError) throw new Error(msg);
    else if (passedChecks) return c.html(sendHTMLResponse(1,"Successful!"));
  }
  catch (err) {
    return c.html(sendHTMLResponse(0,err));
  }
  finally {
    return c.html(sendHTMLResponse(2));
  }
});

serve(app, (info) =>
{
  console.log(`Running on http://127.0.0.1:${info.port}`);
});