const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

// Path to your JSON file
const mappingFilePath = "C://PHC/NC_OCIDENTAL/mapping.json";

// Folder containing PDF files
const pdfFolderPath = "C://PHC/NC_OCIDENTAL/";

// Function to load mapping from JSON file
function loadMapping(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error("Mapping file not found:", filePath);
    return {};
  }
  try {
    const rawData = fs.readFileSync(filePath, "utf8");
    // Combine all entries into a single object
    return rawData ? Object.assign({}, ...JSON.parse(rawData)) : {};
  } catch (err) {
    console.error("Error loading or parsing mapping file:", err);
    return {};
  }
}

// Function to send email with error handling
async function sendEmail(to, subject, body, filePath) {
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: "invoicing-grupoageas@trustsaude.pt",
      pass: "Trust!2023",
    },
  });

  const signatureImagePath = "C://PHC/NC_OCIDENTAL/sig.jpg";
  if (!fs.existsSync(signatureImagePath)) {
    console.error("Signature image not found:", signatureImagePath);
    return;
  }

  const mailOptions = {
    from: '"Invoicing Grupo AGEAS" <invoicing-grupoageas@trustsaude.pt>',
    to,
    subject,
    html: `
      ${body}
      <br/>
      <p>TRUST - Invoicing Grupo AGEAS<br><span style="color: #38849c; font-size: 12px;">Serviços administrativos e Financeiros</span></p>
      <br/>
      <img src="cid:signature_image" alt="Signature" style="height: 60px;"/>
      <br/>
      <p style="font-size: 12px; color: gray;">
        A TRUST – Gestão Integrada de Saúde, S.A. recolhe e trata os seus dados pessoais, no âmbito da prestação de serviços de cuidados de saúde. Poderá exercer os seus direitos de acesso, retificação, oposição e eliminação através do e-mail dpo@trustsaude.pt. Esta mensagem e quaisquer ficheiros anexos contêm informação privilegiada e confidencial, destinando-se exclusivamente aos respetivos destinatários. Se não é o destinatário da mensagem, saiba que a sua divulgação, total ou parcial, a cópia ou a distribuição são ilícitas. Se recebeu este e-mail por engano, agradecemos que nos contacte imediatamente, através de e-mail de resposta, e destrua a comunicação original no seu sistema informático.
      </p>
    `,
    attachments: [
      {
        filename: path.basename(filePath),
        path: filePath,
      },
      {
        filename: "signature.jpg",
        path: signatureImagePath,
        cid: "signature_image",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `Email sent successfully with attachment ${path.basename(filePath)}`
    );
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

// Main function to process PDF files
async function main() {
  try {
    const mapping = loadMapping(mappingFilePath);

    if (Object.keys(mapping).length === 0) {
      console.error("Mapping data is empty or invalid. Aborting process.");
      return;
    }

    const files = fs
      .readdirSync(pdfFolderPath)
      .filter((file) => file.endsWith(".pdf"));

    for (const file of files) {
      const filePath = path.join(pdfFolderPath, file);
      const fileNameWithoutExtension = path.parse(file).name;

      // Get the dynamic value from the mapping
      const dynamicValue = mapping[fileNameWithoutExtension];

      if (!dynamicValue) {
        console.warn(
          `No mapping found for file: ${fileNameWithoutExtension}. Skipping.`
        );
        continue; // Skip sending email for missing mappings
      }

      const emailBody = `
        <p>Exmos Senhores,</p>
        <p>Enviamos os documentos referentes ao processo ${dynamicValue}.</p>
      `;
      const subject = `${dynamicValue} - NGT`;

      const to = "faturasdigitais.ocidental@ageas.pt";

      await sendEmail(to, subject, emailBody, filePath);
    }
  } catch (err) {
    console.error("Error processing files:", err);
  }
}

main();
