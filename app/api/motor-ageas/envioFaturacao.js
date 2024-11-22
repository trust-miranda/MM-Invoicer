const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const xlsx = require("xlsx"); // Import the xlsx library

// Folder paths
const pdfFolderPath = "C://PHC/PDFs_AGEAS_POR_ENVIAR_TESTE/"; // Source folder
const destinationFolderPath = "C://PHC/PDFs_AGEAS_ENVIADOS/"; // Destination folder

// Load mapping from an Excel file
function loadSubjectMappingFromExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]]; // Read the first sheet
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 }); // Convert sheet to a 2D array

  const mapping = {};
  data.forEach((row) => {
    const [pdfName, identifier, invoiceNumber] = row;
    if (pdfName && identifier && invoiceNumber) {
      // Normalize filenames (trim and convert to lowercase for case-insensitive matching)
      mapping[pdfName.trim().toLowerCase()] = {
        identifier: String(identifier).trim(), // Ensure it's a string and trim
        invoiceNumber: String(invoiceNumber).trim(), // Ensure it's a string and trim
      };
    }
  });

  return mapping;
}

// Load the subject mapping from the Excel file
const subjectMappingFilePath =
  "C://PHC/PDFs_AGEAS_POR_ENVIAR_TESTE/mapping.xlsx"; // Replace with your Excel file path
const subjectMapping = loadSubjectMappingFromExcel(subjectMappingFilePath);

// Function to send email with PDF as attachment
async function sendEmail(to, subject, body, filePath, cc = null) {
  // Ensure cc has a default value
  // Configure transport
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: "invoicing-grupoageas@trustsaude.pt",
      pass: "Trust!2023",
    },
  });

  // Email options
  const mailOptions = {
    from: '"invoicing-grupoageas@trustsaude.pt',
    to: to,
    cc: cc, // Add CC address here, can be null or string
    subject: subject,
    html: body,
    attachments: [
      {
        filename: path.basename(filePath),
        path: filePath,
      },
    ],
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `Email sent successfully with attachment ${path.basename(filePath)}`
    );
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

const ccRecipient = "invoicing-grupoageas@trustsaude.pt"; // Define your CC recipient, or leave it as null if not needed

// Function to move a file to a new folder
function moveFile(sourcePath, destinationPath) {
  fs.rename(sourcePath, destinationPath, (err) => {
    if (err) {
      console.error(
        `Error moving file ${sourcePath} to ${destinationPath}:`,
        err
      );
    } else {
      console.log(`File moved successfully: ${path.basename(sourcePath)}`);
    }
  });
}

// Main function to read PDFs from folder, send emails, and move files
async function main() {
  try {
    // Ensure the destination folder exists, create it if not
    if (!fs.existsSync(destinationFolderPath)) {
      fs.mkdirSync(destinationFolderPath, { recursive: true });
    }

    // Get list of PDF files in the folder
    const files = fs
      .readdirSync(pdfFolderPath)
      .filter((file) => file.endsWith(".pdf"));

    // Loop through each file, send it via email, and then move it
    for (const file of files) {
      const filePath = path.join(pdfFolderPath, file);
      const destinationPath = path.join(destinationFolderPath, file);

      // Normalize the filename for lookup (trim and convert to lowercase)
      const normalizedFileName = file.trim().toLowerCase();

      // Get the mapping for the file
      const mappingEntry = subjectMapping[normalizedFileName];
      let subject = `Default Subject for ${file}`;
      if (mappingEntry) {
        const { identifier, invoiceNumber } = mappingEntry;
        subject = `Sintratado: ${identifier} - Fatura Nº ${invoiceNumber} - Trust`; // Construct the subject using identifier and invoiceNumber
      } else {
        console.warn(`Warning: No mapping found for ${file}`);
      }

      const emailBody = `<p>Exmos Senhores,</p><p>Enviamos os documentos referentes ao processo ${subject}.</p>`;

      // Send the email
      await sendEmail(
        // "documentacaoat@ageas.pt, faturassinistrostrabalho@ageas.pt", // Replace with actual recipient
        "faturassinistrostrabalho@ageas.pt, documentacaoat@ageas.pt",
        subject,
        emailBody,
        filePath,
        "invoicing-grupoageas@trustsaude.pt" // CC recipient
      );

      // Move the file after sending the email
      moveFile(filePath, destinationPath);
    }
  } catch (err) {
    console.error("Error processing files:", err);
  }
}

// Run the main function
main();
