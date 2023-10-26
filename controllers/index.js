const QRCode = require("qrcode");
const outputPath = "uploads";
const fs = require("fs");
const currentDirectory = process.cwd();
const puppeteer = require("puppeteer");

// Function to read an image file and return it as a base64 string
const getImageAsBase64 = (filePath) => {
  try {
    const data = fs.readFileSync(filePath);
    return `data:image/png;base64,${data.toString("base64")}`;
  } catch (error) {
    console.error("Error reading image:", error);
    return null;
  }
};

module.exports.qrgenerator = async (req, res) => {
  console.log("api hit");
  const originalName = req.body.name;
  const nameWithoutSpaces = originalName.replace(/\s+/g, "");
  let vCardData = `BEGIN:VCARD\nVERSION:3.0\nN:${req.body.name}\nTEL:${req.body.mobile}\nORG:${req.body.org}\nTITLE:${req.body.title}\nEMAIL;TYPE=work:${req.body.email}\nEND:VCARD`;

  try {
    QRCode.toFile(`${currentDirectory}/uploads/${nameWithoutSpaces}.png`, vCardData, async (err) => {
      if (err) {
        res.status(500).send({
          message: "Internal server Errors!",
          error: err,
        });
      } else {
        try {
          const qrCodePath = `${currentDirectory}/uploads/${nameWithoutSpaces}.png`;

          // Read images as base64
          const qrCodeBase64 = getImageAsBase64(qrCodePath);
          const companyLogoBase64 = getImageAsBase64(`${currentDirectory}/uploads/MindSprint_Logo.jpg`);

          if (!qrCodeBase64 || !companyLogoBase64) {
            throw new Error("Error reading image files as base64");
          }

          // Load the HTML template with base64-encoded images
          const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>QR Code Styling</title>
           
            <style>
            .container{
              height: 92vh;
              width:80vw;
              margin:auto;
              padding:10px;
            }
            .border{
              height: 96%;
              width: 96%;
              margin:auto;
              padding:10px;
              display: flex;
              flex-direction: column;
              border: 2px solid red;
              border-radius: 6px;
            }
            .heading{
              margin-top:-10px;
              height: 35%;
              width:96%;
            }
            #logo{
              height: 100%;
              width: 100%;
            }
            .info{
              height: 96%;
              width: 96%;
              padding:20px;
              display: flex;
              flex-direction: row;
              align-items: center;
              margin-top:-25px;
              gap:30px;
            
            }.details{
              height: 96%;
              width: 46%;
              padding:10px;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: center;
              margin-top:-15px;
              
              
              
            
            }.iconmanager{
              height: 15%;
              width: 15%;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              font-size:1.5rem;
            }
            .iconmanager img{
              height: 100%;
              width: 100%;
            }
            .name{
              font-size: 2.5rem;
            }
            </style>
          </head>
          <body>
          <div class="container">
          <div class="border">
            <div class="heading">
              <img id="logo" src="${companyLogoBase64}" alt="MindSprint Logo" />
            </div>
            <div class="info">
              <div class="details">
                <div class="name" style=" font-stretch: expanded;">
                  ${req.body.name}
                </div>
               ${req.body.title}
               <br>
               <br>
                <div  class="iconmanager">
                  <img src="https://cdn2.iconfinder.com/data/icons/font-awesome/1792/phone-512.png">
                  &nbsp;${req.body.mobile}
              </div>
                <div  class="iconmanager">
                  <img src="https://logowik.com/content/uploads/images/513_email.jpg">
                  &nbsp;${req.body.email}
                </div>
              </div>
              <div class="qrcode">
                <img src="${qrCodeBase64}" alt="qr-code" />
              </div>
            </div>
          </div>
        </div>
  
        
          </body>
          </html>
          
`;

          // Create a Puppeteer browser instance
          const browser = await puppeteer.launch();
          const page = await browser.newPage();

          // Set a reasonable viewport size
          await page.setViewport({ width: 800, height: 360 }); // Adjust width and height as needed

          // Navigate to an HTML page
          await page.setContent(htmlContent);

          // Generate a screenshot of the page in JPEG format
          const screenshotBuffer = await page.screenshot({ type: 'jpeg' });

          // Close the browser
          await browser.close();

          // Set the response headers for a JPEG image
          res.setHeader("Content-Type", "image/jpeg");
          res.setHeader("Content-Disposition", "attachment; filename=digital_card.jpg");
          screenshotBuffer.pipe(res);

          // Send the JPEG image buffer as the response
          // return res.status(200).send(screenshotBuffer);
        } catch (error) {
          console.log("error in styling: ", error);
          return res.status(500).send({
            message: "Error generating PDF",
            error: error,
          });
        }
      }
    });
  } catch (pdfError) {
    console.log("the error is ", pdfError);
    return res.status(500).send({
      message: "Error generating PDF image",
      error: pdfError,
    });
  }
};


// 
