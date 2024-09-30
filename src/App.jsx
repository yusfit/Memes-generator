import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";

export default function Meme() {
  const [meme, setMeme] = useState({
    topText: "",
    bottomText: "",
    randomImg: "https://i.imgflip.com/1g8my4.jpg",
  });

  const [memesArray, setMemesArray] = useState([]);
  const [topTextBg, setTopTextBg] = useState("transparent");
  const [bottomTextBg, setBottomTextBg] = useState("transparent");

  useEffect(() => {
    async function fetchMemes() {
      try {
        const res = await fetch("https://api.imgflip.com/get_memes");
        const data = await res.json();
        const memesData = data.data.memes;
        setMemesArray(memesData);
      } catch (error) {
        alert(`${error} Failed to fetch memes `);
      }
    }
    fetchMemes();
  }, []);

  const canvasRef = useRef(null);
  const downloadLinkRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeme((prevState) => ({ ...prevState, [name]: value }));
    if (name === "topText") {
      setTopTextBg("#000");
    } else if (name === "bottomText") {
      setBottomTextBg("#000");
    }
  };

  const handleGetMeme = () => {
    const randomIndex = Math.floor(Math.random(0, 100) * memesArray.length);
    const url = memesArray[randomIndex].url;
    setMeme((prevState) => ({ ...prevState, randomImg: url }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = meme.randomImg;
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      ctx.font = "30px Impact";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.textAlign = "center";
      ctx.fillText(meme.topText, canvas.width / 2, 40);
      ctx.strokeText(meme.topText, canvas.width / 2, 40);
      ctx.fillText(meme.bottomText, canvas.width / 2, canvas.height - 20);
      ctx.strokeText(meme.bottomText, canvas.width / 2, canvas.height - 20);
      downloadLinkRef.current.href = canvas.toDataURL("image/png");
    };
  }, [meme]);

  return (
    <main>
      <Header />
      <div className="bg-blue-200 min-h-screen flex flex-col justify-center items-center p-4">
        <div className="flex flex-col justify-center items-center space-y-6">
          <section className="form flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 bg-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-col items-center">
              <label htmlFor="topText" className="font-semibold mb-2">
                Top Text
              </label>
              <input
                type="text"
                id="topText"
                name="topText"
                value={meme.topText}
                onChange={(e) => handleChange(e)}
                className="w-full p-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="flex flex-col items-center">
              <label htmlFor="bottomText" className="font-semibold mb-2">
                Bottom Text
              </label>
              <input
                type="text"
                id="bottomText"
                name="bottomText"
                value={meme.bottomText}
                onChange={(e) => handleChange(e)}
                className="w-full p-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-400"
              />
            </div>
          </section>

          <button
            type="submit"
            onClick={handleGetMeme}
            className="bg-blue-500 text-black text-xl text-semibold p-4 rounded hover:bg-blue-600 transition duration-200 w-full"
          >
            Get a new meme image
          </button>

          <section className="meme relative mt-8 flex flex-col items-center">
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            <img
              src={meme.randomImg}
              alt=""
              className="w-full max-w-lg border-4 border-gray-300 rounded-lg shadow-lg"
            />
            <h2
              className="top-text absolute mt-12  left-1/2 transform -translate-x-1/2 text-3xl font-bold text-white"
              style={{ backgroundColor: topTextBg }}
            >
              {meme.topText}
            </h2>
            <h2
              className="bottom-text absolute mb-12 bottom-2 left-1/2 transform -translate-x-1/2 text-3xl font-bold text-white"
              style={{ backgroundColor: bottomTextBg }}
            >
              {meme.bottomText}
            </h2>
          </section>

          <button className="download-btn flex items-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200">
            <a
              ref={downloadLinkRef}
              download="meme.png"
              className="font-semibold"
            >
              Download Meme
            </a>
          </button>
        </div>
      </div>
    </main>
  );
}
