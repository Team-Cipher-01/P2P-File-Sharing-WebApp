import React, { useState, useEffect } from "react";
import { Store } from "../../flux";

const CustomFileUpload = (props) => {
  const [fileList, setFileList] = useState(Store.getLocalFilesList());

  /**
   * This function fetches the local file uploaded and sets it in the local state array.
   * @param {*} event 
   */
  const changeHandler = (event) => {
    setFileList(fileList => [...fileList, event.target.files[0]]);
    props.newUpload(event.target.files[0]);
  };

  /**
   * This function listens to any change in the fileList state object and emits the files to the parent component.
   * The onFileUpload() function is the way to share data with the parent component.
   */
  useEffect(() => {
    console.log("File List: ", fileList);
    props.onFileUpload(fileList);
    Store.updateFileList(fileList);
  }, [fileList])

  return (
    <div className="custom-file mb-3">
      <div>
        <input disabled={props.disabled} type="file" className="custom-file-input" id="customFile2" onChange={changeHandler} />
        <label className="custom-file-label" htmlFor="customFile2">
          Choose file...
        </label>
      </div>
    </div>)
};

export default CustomFileUpload;
