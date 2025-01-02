const fs = require("fs");
const path = require("path");

// Folder containing PDF files
const pdfFolderPath = "C://PHC/NC_AGEAS/";

// Function to rename PDF files
function renamePDFFiles() {
  try {
    // Get list of files in the folder
    const files = fs
      .readdirSync(pdfFolderPath)
      .filter((file) => file.endsWith(".pdf"));

    files.forEach((file) => {
      // Check if the file starts with "ageas_pdf"
      if (file.startsWith("2024-NOTA DE CRÉDITO AG--")) {
        // New file name without the prefix
        const newFileName = file
          .replace(/^2024-NOTA DE CRÉDITO AG--/, "2024-NOTA DE CRÉDITO AG-")
          .trim();
        const oldFilePath = path.join(pdfFolderPath, file);
        const newFilePath = path.join(pdfFolderPath, newFileName);

        // Rename the file
        fs.renameSync(oldFilePath, newFilePath);
        console.log(`Renamed: ${file} -> ${newFileName}`);
      }
    });

    console.log("All files renamed successfully.");
  } catch (err) {
    console.error("Error renaming files:", err);
  }
}

// Run the function
renamePDFFiles();
