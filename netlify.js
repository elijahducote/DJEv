import Busboy from "busboy";
import axios from "axios";

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


function handler async (event, context) => {
  try {
    const contentType = event.headers['content-type'];
    const bodyBuffer = Buffer.from(event.body, 'base64');

    // Parse multipart form data (unchanged)
    const { fields, files } = await parseFormData(bodyBuffer, contentType);

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

    // Send to Resend API using Axios
    const resendResponse = await axios.post('https://api.resend.com/emails', emailPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      }
    });
    
    /*return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: resendResponse.data })
    };*/

  } catch (error) {
    /*return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({ 
        error: error.message,
        details: error.response?.data 
      })
    };*/
  }
};