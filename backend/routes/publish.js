const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const Publish = require("../models/publish"); // Adjust the path as necessary
const fs = require("fs");

const router = express.Router();

const password = "your-encryption-password"; 

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory for encryption
const upload = multer({ storage: storage });

const deriveKey = (password) => {
    return crypto.scryptSync(password, 'salt', 32); // Use a salt for better security
  };



const encryptFile = (buffer, password) => {
    const iv = crypto.randomBytes(16); // Generate a random initialization vector
    const key = deriveKey(password); // Derive a valid key from the password
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

    // Convert binary data (buffer) to Base64
    const base64Data = buffer.toString("base64");

    // Encrypt the Base64 string
    let encrypted = cipher.update(base64Data, "utf8", "hex");
    encrypted += cipher.final("hex");

    return { iv: iv.toString("hex"), encryptedData: encrypted };
};


// Encryption function
const encryptFile2 = (buffer, password) => {
    const iv = crypto.randomBytes(16); // Generate a random initialization vector
    const key = deriveKey(password); // Derive a valid key from the password
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(buffer);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
  };
// Decrypt Function
const decryptFile = (encryptedData, iv, password) => {
    const key = deriveKey(password);
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, Buffer.from(iv, "hex"));
    let decrypted = decipher.update(Buffer.from(encryptedData, "hex"));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted;
};


router.post("/publish-book", upload.single("pdfFile"), async (req, res) => {
    try {
      const { url, title, author, price, desc, language, userId } = req.body;
      const password = "your-encryption-password";
  
      // Encrypt the PDF file
      const { iv, encryptedData } = encryptFile(req.file.buffer, password);
  
      const newPublish = new Publish({
        userId,
        url,
        title,
        author,
        price,
        desc,
        language,
        pdfFile: { iv, data: encryptedData },
      });
  
      await newPublish.save();
      res.status(201).json({ message: "Book Published successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error publishing book", error });
    }
  });
  
// // Route to add a book
// router.post("/publish-book", upload.single("pdfFile"), async (req, res) => {
//   try {
//     const { url, title, author, price, desc, language, userId } = req.body;
//     const password = "your-encryption-password"; // Use a secure password

//     // Encrypt the PDF file
//     const { iv, encryptedData } = encryptFile(req.file.buffer, password);

//     const newPublish = new Publish({
//       userId,
//       url,
//       title,
//       author,
//       price,
//       desc,
//       language,
//       pdfFile: { iv, data: encryptedData }, // Save the encrypted data and IV
//     });

//     await newPublish.save();
//     res.status(201).json({ message: "Book Published successfully!" });
//   } catch (error) {
//     res.status(500).json({ message: "Error publishing book", error });
//   }
// });


// Route to get the books of a publisher
router.get("/get-user-books", async (req, res) => {
    try {
        const userId = req.headers.id; // Get user ID from headers
        const books = await Publish.find({ userId }).sort({ createdAt: -1 }); // Filter by userId
        return res.json({
            status: "Success",
            data: books,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});


//get-book-by-id
router.get("/get-user-book-by-id/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Publish.findById(id);
        return res.json({
          status: "Success",
          data: book,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});


//get-book-by-name
// router.get("/get-user-book-by-title/:title", async (req, res) => {
//     try {
//         const { title } = req.params;
//         const book = await Publish.findOne({ title }); // Use findOne to search by title
//         if (!book) {
//             return res.status(404).json({ message: "Book not found" });
//         }
//         return res.json({
//             status: "Success",
//             data: book,
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ message: "An error occurred" });
//     }
// });


// router.get("/get-user-book-by-title/:title", async (req, res) => {
//     try {
//         const { title } = req.params;
//         const book = await Publish.findOne({ title });

//         if (!book) {
//             return res.status(404).json({ message: "Book not found" });
//         }

        

//         return res.json({
//             status: "Success",
//             data: {
//                 title: book.title,
//                 pdf: book.pdfFile.data,
//                 iv: book.pdfFile.iv 
//             },
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ message: "An error occurred" });
//     }
// });

router.get("/get-user-book-by-title/:title", async (req, res) => {
    try {
        const { title } = req.params;
        const book = await Publish.findOne({ title });

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Ensure the password for decryption is securely stored/retrieved
        const password = "your-encryption-password"; 

        if (!password) {
            return res.status(500).json({ message: "Encryption password not set" });
        }

        // Decrypt the file
        const decryptedPdf = decryptFile(book.pdfFile.data, book.pdfFile.iv, password);

        // Convert the decrypted PDF to Base64
        const base64Pdf = decryptedPdf.toString("base64");

        return res.json({
            status: "Success",
            data: {
                title: book.title,
                pdf: base64Pdf, // Pass the Base64 encoded PDF
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});


module.exports = router;


// const decryptedFile = decryptFile(book.pdfFile.data, book.pdfFile.iv, password);
        
// const base64PDF = decryptedFile.toString("base64");


// const password = "your-encryption-password";

// const deriveKey = (password) => {
//     return crypto.scryptSync(password, 'salt', 32); // Use a salt for better security
//   };


// const encryptFile = (buffer, password) => {
//     const iv = crypto.randomBytes(16); // Generate a random initialization vector
//     const key = deriveKey(password); // Derive a valid key from the password
//     const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
//     let encrypted = cipher.update(buffer);
//     encrypted = Buffer.concat([encrypted, cipher.final()]);
//     return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
//   };


// const decryptFile = (encryptedData, iv, password) => {
//     const key = deriveKey(password); // Derive the same key for decryption
//     const decipher = crypto.createDecipheriv("aes-256-cbc", key, Buffer.from(iv, "hex"));
//     let decrypted = decipher.update(Buffer.from(encryptedData, "hex"));
//     decrypted = Buffer.concat([decrypted, decipher.final()]);
//     return decrypted;
//   };