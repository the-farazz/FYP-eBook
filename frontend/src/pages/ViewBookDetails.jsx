import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { GoHeartFill } from "react-icons/go";
import { GrLanguage } from "react-icons/gr";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Document, Page } from "react-pdf";
import Search from "../pages/Search"


import CryptoJS from 'crypto-js';



// import { Viewer } from "../components/Viewer"
import Loader from "./Loader";

const ViewBookDetails = () => {

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const { id } = useParams();
  const role = useSelector((state) => state.auth.role);
  const history = useNavigate();
  const [Book, setBook] = useState();
  const [base64Pdf, setBase64Pdf] = useState(""); // State for storing the Base64 string
  const [numPages, setNumPages] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetch = async () => {
      const res = role !== "publisher"
        ? await axios.get(`http://localhost:1000/api/v1/get-book-by-id/${id}`)
        : await axios.get(`http://localhost:1000/api/v1/get-user-book-by-id/${id}`);
      setBook(res.data.data);
    };
    fetch();
  }, [id, role]);

  const headers = {
    bookid: id,
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const addToFavourite = async () => {
    try {
      const response = await axios.put(
        "http://localhost:1000/api/v1/add-to-favourite",
        {},
        { headers }
      );
      alert(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = async () => {
    try {
      const response = await axios.put(
        "http://localhost:1000/api/v1/add-to-cart",
        {},
        { headers }
      );
      alert(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBook = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:1000/api/v1/delete-book",
        { headers }
      );
      alert(response.data.message);
      history("/all-books");
    } catch (error) {
      console.log(error);
    }
  };


  // Derive key using PBKDF2
  const deriveKey = (password) => {
      return CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse("salt"), {
          keySize: 256 / 32, // AES-256 key size
          iterations: 1000,
      });
  };
  
  // Decrypt file using CryptoJS
  const decryptFile = (encryptedData, iv, password) => {
      const key = deriveKey(password);
  
      // Parse encrypted data and IV (assuming both are in hex format)
      const encryptedWords = CryptoJS.enc.Hex.parse(encryptedData);
      const ivWords = CryptoJS.enc.Hex.parse(iv);
  
      // Decrypt the data
      const decrypted = CryptoJS.AES.decrypt(
          { ciphertext: encryptedWords },
          key,
          { iv: ivWords }
      );
  
      // Convert decrypted WordArray directly to Base64 string
      const decryptedBase64 = CryptoJS.enc.Base64.stringify(decrypted);
  
      return decryptedBase64; // This is the Base64 PDF string
  };
  

  const handleReadBook2 = async () => {
    setIsLoading(true);
    try {
        const response = await axios.get(
            `http://localhost:1000/api/v1/get-user-book-by-title/${Book.title}`
        );
        if (response.data.data) {
            alert("Book Found!");

            const password = "your-encryption-password";

            // Decrypt the PDF data
            const decryptedBase64 = decryptFile(response.data.data.pdf, response.data.data.iv, password);

            // Set the Base64 PDF for rendering
            setBase64Pdf(`data:application/pdf;base64,${decryptedBase64}`);
            setIsModalOpen(true);
        } else {
            alert("Not found!");
        }
    } catch (error) {
        console.error(error);
        alert("We Don't Have its PDF available!");
    } finally {
        setIsLoading(false);
    }
};

  const handleReadBook = async () => {
    setIsLoading(true); // Set loading to true when the request starts
    try {
        const response = await axios.get(`http://localhost:1000/api/v1/get-user-book-by-title/${Book.title}`);
        if (response.data.data) {
            alert("Book Found!");
            setBase64Pdf(response.data.data.pdf);
            setIsModalOpen(true);
        } else {
            alert("Not found!");
        }
    } catch (error) {
        console.log(error);
        alert("We Don't Have its PDF available!");
    } finally {
        setIsLoading(false); // Set loading to false when the request ends
    }
};

const onDocumentLoadSuccess = ({ numPages }) => {
  setNumPages(numPages); // Update the number of pages when the document is loaded
};

const closeModal = () => {
  setIsModalOpen(false);
  setBase64Pdf(null); // Clear the PDF when closing
};

const goToPreviousPage = () => {
  if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
  }
};

const goToNextPage = () => {
  if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
  }
};



  return (
    <>
      {!Book && <Loader />}
      {Book && (
        <div className="bg-zinc-900 px-12 py-8 flex flex-col lg:flex-row gap-8 h-auto">
          <div className="w-full lg:w-3/6">
            <div className="flex flex-col md:flex-row items-start justify-around bg-zinc-800 rounded px-4 py-8 gap-4">
              <img
                src={Book.url}
                alt="book"
                className="h-[50vh] md:h-[70vh] rounded"
              />
              {localStorage.getItem("id") && (
                <div className="w-full md:w-auto flex flex-row md:flex-col justify-between md:justify-start items-center mt-4 md:mt-0">
                  {role !== "admin" && (
                    <>
                      <button
                        className="bg-white p-3 rounded md:rounded-full text-2xl font-semibold hover:bg-zinc-200 transition-all duration-300 flex items-center"
                        onClick={addToFavourite}
                      >
                        <GoHeartFill />
                      </button>
                      < button
                        className="mt-0 md:mt-8 bg-blue-500 text-white p-3 rounded md:rounded-full text-2xl font-semibold flex items-center hover:bg-blue-600 transition-all duration-300"
                        onClick={addToCart}
                      >
                        <FaCartShopping className="me-4 md:me-0" />{" "}
                        <span className="block md:hidden">Add to cart</span>
                      </button>
                    </>
                  )}
                  {role === "admin" && (
                    <>
                      <Link
                        to={`/update-book/${id}`}
                        className="bg-white p-3 rounded md:rounded-full text-2xl font-semibold hover:bg-zinc-200 transition-all duration-300 flex items-center"
                      >
                        <FaRegEdit />
                      </Link>
                      <button
                        className="mt-0 md:mt-8 bg-red-500 text-white p-3 rounded md:rounded-full text-2xl font-semibold flex items-center hover:bg-red-600 transition-all duration-300"
                        onClick={deleteBook}
                      >
                        <MdDelete className="me-4 md:me-0" />{" "}
                        <span className="block md:hidden">Delete book</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="w-full lg:w-3/6 my-8">
            <h1 className="text-4xl text-zinc-300 font-semibold">
              {Book.title}
            </h1>
            <p className="text-zinc-400 mt-1">by {Book.author}</p>
            <p className="text-zinc-500 mt-4 text-xl">{Book.desc}</p>
            <p className="flex mt-4 items-center justify-start text-zinc-400">
              <GrLanguage className="me-3" /> {Book.language}
            </p>
            <p className="mt-4 text-zinc-100 text-3xl font-semibold">
              Price : USD {Book.price}{" "}
            </p>
            <div>
            {isLoggedIn === true && (
    <>
        <button
            onClick={handleReadBook}
            className="mt-4 bg-[#007E6F] text-white py-2 px-4 rounded hover:bg-[#007E6F]"
            disabled={isLoading} 
        >
            {isLoading ? 'Loading...' : 'Read Book'}
        </button>

        {isModalOpen && (
            <div className="fixed inset-0 bg-gray-400 flex">
                <div className="flex-none" style={{ width: '50%', height: '100vh' }}>
                    <button
                        onClick={closeModal}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 flex items-center justify-center"
                        style={{ width: '24px', height: '24px' }}
                    >
                        &times; {/* Close icon */}
                    </button>
                    <div className="overflow-y-auto h-full flex flex-col items-center">
                        {base64Pdf && (
                            <>
                                <Document
                                    file={`data:application/pdf;base64,${base64Pdf}`}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    style={{ height: '100%', width: '100%' }} // Ensure the document fits the container
                                >
                                    <Page
                                        pageNumber={pageNumber} // Use the current page number
                                        renderAnnotationLayer={false}
                                        renderTextLayer={false}
                                        style={{ width: '100%', height: 'auto' }} // Ensure each page fits the container
                                    />
                                </Document>
                                <div className="flex justify-between w-full mt-4">
                                    <button
                                        onClick={goToPreviousPage}
                                        disabled={pageNumber <= 1} // Disable if on the first page
                                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={goToNextPage}
                                        disabled={pageNumber >= numPages} // Disable if on the last page
                                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                    >
                                        Next
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex-grow p-1" style={{ height: '100vh', overflowY: 'auto' }}>
                               <Search/>
                            </div>
            </div>
        )}
    </>
)}
        </div>
        </div>
        </div>
      )}
    </>
  );
};

export default ViewBookDetails;



