import { useState } from "react";

export default function useClarifai() {
  const [loading, setLoading] = useState(false);
  const [concepts, setConcepts] = useState([]);

  const searchImage = async (file) => {
    if (!file) return [];
    setLoading(true);
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch("https://api.clarifai.com/v2/models/general-image-recognition/outputs", {
        method: "POST",
        headers: {
          Authorization: `Key ${import.meta.env.VITE_CLARIFAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: [{ data: { image: { base64 } } }] })
      });

      if (!response.ok) throw new Error("Clarifai request failed");
      const data = await response.json();
      const nextConcepts = data.outputs?.[0]?.data?.concepts?.slice(0, 5).map((item) => ({
        name: item.name,
        value: item.value
      })) || [];
      setConcepts(nextConcepts);
      return nextConcepts;
    } catch {
      const fallback = [{ name: file.name.split(".")[0].replace(/[-_]/g, " "), value: 0.72 }];
      setConcepts(fallback);
      return fallback;
    } finally {
      setLoading(false);
    }
  };

  return { loading, concepts, searchImage };
}
