"use client";
import { formGenerationPrompt } from "../../../utils/util";
import OpenAI from "openai";
import { useState } from "react";

export default function Tests() {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");

  const [formData, setFormData] = useState();

  const generateForm = async () => {
    console.log("key", process.env.NEXT_PUBLIC_OPENAI_API_KEY);

    setLoading(true);
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: formGenerationPrompt },
        { role: "user", content: prompt },
      ],
    });

    setLoading(false);

    console.log(completion);

    console.log(completion.choices[0].message.content);

    setFormData(JSON.parse(completion.choices[0].message.content));
  };

  return (
    <div className="m-5">
      <h1>Enter your prompt:</h1>
      <br />
      <textarea
        onChange={(x) => setPrompt(x.target.value)}
        className="textarea textarea-bordered w-[50%]"
        placeholder="Tell us about your form.."
      ></textarea>
      <br />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <button onClick={generateForm} className="btn">
          Generate Form
        </button>
      )}
      {formData ? (
        <div className="border p-10">
          <h1 className="font-bold text-2xl">{formData?.title}</h1>
          <p className="text-md">{formData?.description}</p>
          {formData?.fields?.map((field, index) => {
            return (
              <div className="mt-5" key={index}>
                <label className="label">{field?.title}</label>
                {field?.type === "multiplechoice" ? (
                  <select className="select select-bordered">
                    {field?.choices?.map((option, idx) => {
                      return <option key={idx}>{option}</option>;
                    })}
                  </select>
                ) : field?.type === "longtext" ? (
                  <textarea
                    className="textarea textarea-bordered"
                    placeholder={field?.title}
                  ></textarea>
                ) : (
                  <input
                    className="input input-bordered"
                    type={field?.type}
                    placeholder={field?.title}
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
