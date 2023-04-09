import React, { useState, useEffect } from 'react';
import SheetMusic from './Components/SheetMusic/SheetMusic';
import UploadSheetMusic from './Components/UploadSheetMusic/UploadSheetMusic';
import config from './config';
import './App.css';

interface SheetMusicLink {
  name: string;
  url: string;
}

const App: React.FC = () => {
  const [sheetMusicLinks, setSheetMusicLinks] = useState<SheetMusicLink[]>([]);

  const fetchMusicLinks = () => {
    fetch(`${config.serverUrl}/pdfs`)
      .then((response) => response.json())
      .then((data) => {
        const pdfs: string[] = data["pdfNames"];
        const links = pdfs.map((pdfName: string) => ({
            name: pdfName,
            url: `${config.serverUrl}/${pdfName}.pdf`,
          }))
        setSheetMusicLinks(links);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchMusicLinks();
  }, []);

  return (
    <div className="container">
      <h1 className="title">Sheet Music Library</h1>
      <div className="link-container">
        <UploadSheetMusic onUploadSuccess={fetchMusicLinks} />
        <ul className="link-list">
          {sheetMusicLinks.map((link) => (
            <li key={link.url} className="link-item">
              <div className="link-name">{link.name}</div>
              <SheetMusic url={link.url} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
