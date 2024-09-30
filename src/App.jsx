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
    } else return;
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
      <section className="form">
        <div>
          <label htmlFor="topText">Top text</label>
          <input
            type="text"
            id="topText"
            name="topText"
            value={meme.topText}
            onChange={(e) => handleChange(e)}
          />
        </div>

        <div>
          <label htmlFor="bottomText">Bottom text</label>
          <input
            type="text"
            id="bottomText"
            name="bottomText"
            value={meme.bottomText}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <button type="submit" onClick={handleGetMeme}>
          Get a new meme image 🖼️
        </button>
      </section>

      <section className="meme">
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        <img src={meme.randomImg} alt="" />
        <h2 className="top-text" style={{ backgroundColor: topTextBg }}>
          {meme.topText}
        </h2>
        <h2 className="bottom-text" style={{ backgroundColor: bottomTextBg }}>
          {meme.bottomText}
        </h2>
      </section>

      <button className="dowmload-btn">
        <img src="/download-icon.svg" alt="download-meme" />
        <a ref={downloadLinkRef} download="meme.png" className="download-icon">
          Download Meme
        </a>
      </button>
    </main>
  );
}
