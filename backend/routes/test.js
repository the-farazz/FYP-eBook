const crypto = require('crypto');
const mongoose = require('mongoose');

// MongoDB model (replace with your actual model)
const PdfModel = mongoose.model('Pdf', new mongoose.Schema({
    encryptedData: String,
    iv: String,
    // other fields...
}));

// Your encryption password
const password = "your-encryption-password";

// Function to derive a key from the password
const deriveKey = (password) => {
    return crypto.scryptSync(password, 'salt', 32); // Use a salt for better security
};

// Function to decrypt the file
const decryptFile = (encryptedData, iv, password) => {
    const key = deriveKey(password); // Derive the same key for decryption
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, Buffer.from(iv, "hex"));
    
    let decrypted = decipher.update(Buffer.from(encryptedData, "hex"));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted; // Return the decrypted data as a Buffer
};

// Function to convert decrypted PDF to Base64
const convertPdfToBase64 = (pdfBuffer) => {
    return pdfBuffer.toString('base64');
};

// Main function to retrieve, decrypt, and convert to Base64
const retrieveAndConvertPdf = async (pdfId) => {
    try {
        // Retrieve the encrypted PDF from MongoDB
        const pdfDocument = await PdfModel.findById(pdfId);
        if (!pdfDocument) {
            throw new Error('PDF not found');
        }

        const { encryptedData, iv } = pdfDocument;

        // Decrypt the PDF
        const decryptedPdfBuffer = decryptFile(encryptedData, iv, password);

        // Convert to Base64
        const base64Pdf = convertPdfToBase64(decryptedPdfBuffer);

        console.log("Base64 PDF:", base64Pdf);
        return base64Pdf; // Return or use the Base64 string as needed
    } catch (error) {
        console.error("Error retrieving and converting PDF:", error);
    }
};

// Example usage
const pdfId = "your-pdf-document-id"; // Replace with your actual PDF document ID
retrieveAndConvertPdf(pdfId);