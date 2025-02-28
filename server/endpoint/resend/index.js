import { Buffer } from 'node:buffer';
import Busboy from 'busboy';
import axios from 'axios';
import { sendHTMLResponse } from '../../../utility.js'; // Adjust path as needed

export async function handler(event) {
  try {
    // Handle binary body
    const contentType = event.headers['content-type'],
    bodyBuffer = Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8'),
    statum,
    error = false;

    // Parse multipart form data
    const { fields, files } = await parseFormData(bodyBuffer, contentType);
    
    await hcaptcha.post("https://api.hcaptcha.com/siteverify", {secret:process.env.HCAPTCHA_SECRET,response:fields.token}).then((resp) => {
      statum = resp.data.success;
    }).catch((err) => {
      error = err;
    });
    if (error) throw new Error(error);
    // Prepare email payload
    const emailPayload = {
      from: 'Evwave Music <booking@djev.org>',
      to: fields.email?.[0] || 'ducote.help@gmail.com',
      headers: {
        "X-Entity-Ref-ID": Math.floor(Date.now() / 1000).toString()
      },
      subject: `New Submission: ${fields.event?.[0] || 'No Event'}`,
      html: buildEmailHtml(fields)
    };
    if (files[files.length - 1].content.length) emailPayload.attachments = files.map(file => ({
        content: file.content.toString('base64'),
        filename: file.filename,
        contentType: file.contentType
    }));

    // Send to Resend API
    await axios.post('https://api.resend.com/emails', emailPayload, {
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: sendHTMLResponse(1)
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/html' },
      body: sendHTMLResponse(0, error.message)
    };
  }
}

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