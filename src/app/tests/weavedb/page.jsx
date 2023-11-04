"use client";
import { useEffect, useState } from "react";
import WeaveDB from "weavedb-sdk";

export default function Test() {
  const [db, setDB] = useState();
  const initDB = async () => {
    const db = new WeaveDB({ contractTxId: "oj9GzEHQDlK_VQfvGBKFXvyq_zDHdr5m8N0PAU8GysM" });
    await db.init();
    setDB(db);
  }

  useEffect(() => {
    initDB();
  }, []);

  const addForm = async () => {
    const formData = {
      id: "s3dj89",
      author: db.signer(),
      title: "Sample Form",
      description: "This is the description for the sample form",
      fields: [
        {
          id: "1",
          title: "Name",
          type: "text",
          required: true,
        }
      ]
    };

    await db.add(formData, "forms");

    alert("Form added!");
  }

  return (
    <div className="m-5">
      <h1>WeaveDB</h1>
      <button className="btn btn-primary" onClick={addForm}>Add Form</button>
    </div>
  )
}
