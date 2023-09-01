import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [messageInput, setMessageInput] = useState("");
  const [jsonData, setJsonData] = useState("");
  // const [result, setResult] = useState();

  async function onSubmit(event) {
    console.log(event);
    event.preventDefault();
    try {
      // const response = await fetch("/api/generate", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ animal: animalInput }),
      // });
      const response = await fetch("/api/gpt-turbo-3-completion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setJsonData(data.result);
      setMessageInput(""); 
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Generate semi-structured data (JSON)</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="message"
            placeholder="Enter a message"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <input type="submit" value="Generate Json" />
        </form>
        <div className={styles.result}>
          <pre>
            <code className={styles.code}>
              {jsonData}
            </code>
          </pre>
        </div>
      </main>
    </div>
  );
}
