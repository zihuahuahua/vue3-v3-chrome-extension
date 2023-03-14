import { fetchSSE } from "./plugins/fetch-sse";

console.log("hello background");

chrome.runtime.onConnect.addListener((port) => {
    console.log('port',port)
    port.onMessage.addListener(async(msg) =>{
      console.log(msg,"msg")
      if(msg){
        try {
          await getAnswer(port, msg.question);
        } catch (err:any) {
          port.postMessage({ error: err.message });
        }
      }
    })
    return
  }
);
async function getAccessToken() {
  const data = await fetch("https://chat.openai.com/api/auth/session")
    .then((r) => r.json())
    .catch(() => ({}));
  if (!data.accessToken) {
    throw new Error("UNAUTHORIZED");
  }
  return data.accessToken;
}
async function getAnswer(question, callback) {
  const accessToken = await getAccessToken();
  await fetchSSE("https://chat.openai.com/backend-api/conversation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      action: "next",
      messages: [
        {
          role: "user",
          content: {
            content_type: "text",
            parts: [question],
          },
        },
      ],
      model: "text-davinci-002-render",
    }),
    onMessage(message) {
      console.debug("sse message", message);
      if (message === "[DONE]") {
        return;
      }
      const data = JSON.parse(message);
      const text = data.message?.content?.parts?.[0];
      if (text) {
        callback(text);
      }
    },
  });
}
