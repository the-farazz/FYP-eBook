import React, { useState } from "react";
import axios from "axios";

const Publish = () => {
    const [Data, setData] = useState({
        url: "",
        title: "",
        author: "",
        price: "",
        desc: "",
        language: "",
        pdfFile: null,
    });

    const defaultUrl = "https://static.wikia.nocookie.net/gijoe/images/b/bf/Default_book_cover.jpg/revision/latest?cb=20240508080922";

    const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const change = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setData({ ...Data, [name]: files[0] }); // Handle file input
        } else {
            setData({ ...Data, [name]: value });
        }
    };
    const submit = async () => {
      try {
          if (
              Data.title === "" ||
              Data.author === "" ||
              Data.price === "" ||
              Data.desc === "" ||
              Data.language === "" ||
              !Data.pdfFile // Check if .pdf file is selected
          ) {
              alert("All fields with (*) are required!");
          } else {
              // Prepare payload for publish-book API
              const publishPayload = new FormData();
              const userId = localStorage.getItem("id"); // Retrieve user ID

              publishPayload.append("userId", userId); // Append user ID to the payload
              publishPayload.append("url", Data.url || defaultUrl);
              publishPayload.append("title", Data.title);
              publishPayload.append("author", Data.author);
              publishPayload.append("price", Data.price);
              publishPayload.append("desc", Data.desc);
              publishPayload.append("language", Data.language);
              publishPayload.append("pdfFile", Data.pdfFile); // Append .pdf file

              // Send to publish-book API
              const publishResponse = await axios.post(
                  "http://localhost:1000/api/v1/publish-book",
                  publishPayload,
                  { headers }
              );

              // Prepare payload for add-book API
              const addBookPayload = {
                  url: Data.url || defaultUrl,
                  title: Data.title,
                  author: Data.author,
                  price: Data.price,
                  desc: Data.desc,
                  language: Data.language,
              };

              // Send to add-book API
              const addBookResponse = await axios.post(
                  "http://localhost:1000/api/v1/add-book",
                  addBookPayload,
                  { headers }
              );

              // Reset form data
              setData({
                  url: "",
                  title: "",
                  author: "",
                  price: "",
                  desc: "",
                  language: "",
                  pdfFile: null,
              });

              alert(publishResponse.data.message);
              alert(addBookResponse.data.message);
          }
      } catch (error) {
          alert(error.response.data.message);
      }
  };

  return (
    <div className="h-[100%] p-0 md:p-4">
      <h1 className=" text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
        Publish Book
      </h1>
      <div className="p-4 bg-zinc-800 rounded">
        <div>
          <label htmlFor="" className="text-zinc-400">
            Image
          </label>
          <input
            type="text"
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
            placeholder="url of image"
            name="url"
            required
            value={Data.url}
            onChange={change}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="" className="text-zinc-400">
            Title of book *
          </label>
          <input
            type="text"
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
            placeholder="title of book"
            name="title"
            required
            value={Data.title}
            onChange={change}
          />
        </div>
        <div className="mt-4">
          <label htmlFor="" className="text-zinc-400">
            Author of book *
          </label>
          <input
            type="text"
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
            placeholder="author of book"
            name="author"
            required
            value={Data.author}
            onChange={change}
          />
        </div>
        <div className="mt-4 flex gap-4">
          <div className="w-3/6">
            <label htmlFor="" className="text-zinc-400">
              Language *
            </label>
            <input
              type="text"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="language of book"
              name="language"
              required
              value={Data.language}
              onChange={change}
            />
          </div>
          <div className="w-3/6">
            <label htmlFor="" className="text-zinc-400">
              Price *
            </label>
            <input
              type="number"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="price of book"
              name="price"
              required
              value={Data.price}
              onChange={change}
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="" className="text-zinc-400">
            Description of book *
          </label>
          <textarea
            className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none "
            rows="5"
            placeholder="description of book"
            name="desc"
            required
            value={Data.desc}
            onChange={change}
          />
        </div>

        <div className="mt-4">
                    <label htmlFor="pdfFile" className="text-zinc-400">
                        Upload .pdf file *
                    </label>
                    <input
                        type="file"
                        className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
                        name="pdfFile"
                        accept=".pdf"
                        onChange={change}
                        required
                    />
        </div>
               
        <button
          className=" mt-4 px-3 bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition-all duration-300"
          onClick={submit}
        >
          Publish Book
        </button>
      </div>
    </div>
  )
}

export default Publish



// import React, { useState } from 'react';
// import { Document, Page } from 'react-pdf';




// const Viewer = () => {
//   const [numPages, setNumPages] = useState();
//   const [pageNumber, setPageNumber] = useState(1);

//   function onDocumentLoadSuccess({ numPages }){
//     setNumPages(numPages);
//   }

//   return (
//     <div>
//       <Document file="/Title.pdf" onLoadSuccess={onDocumentLoadSuccess}>
//         <Page pageNumber={pageNumber} />
//       </Document>
//       <p>
//         Page {pageNumber} of {numPages}
//       </p>
//     </div>
//   );
// }

// export default Viewer;