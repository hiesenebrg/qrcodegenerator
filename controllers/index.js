const QRCode = require("qrcode");
const outputPath = "uploads";
const fs = require('fs');
const { error } = require("console");
if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }
  const currentDirectory = process.cwd();
  console.log(``)
module.exports.qrgenerator = async function (req, res) {
  try {
    let vCardData = `BEGIN:VCARD\nVERSION:3.0\nFN:${req.body.name}\nTEL:${req.body.mobile}\nORG:${req.body.org}\nTITLE:${req.body.title}\nEMAIL;TYPE=work:${req.body.email}\nEND:VCARD`;

    QRCode.toFile(`${currentDirectory}/uploads/${req.body.name}.png`, vCardData, (err) => {
      if (err) {
        console.log(error)
        res.status(500).send({
          message: "Internal server Errors!",
          error: err,
        });
      } else {
        const originalName = req.body.name; // The name with spaces
const nameWithoutSpaces = originalName.replace(/\s+/g, '');
        res.status(200).send({
          message: "Hurray!QR Code geneerated!",
          data: `http://localhost:8000/${outputPath}/${nameWithoutSpaces}.png`,
        });
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Internal server Error!",
      error: error,
    });
  }
};
