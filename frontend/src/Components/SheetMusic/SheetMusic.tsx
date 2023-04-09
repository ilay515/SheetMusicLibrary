import React from 'react';

interface SheetMusicProps {
  url: string;
}

const SheetMusic: React.FC<SheetMusicProps> = ({ url }) => {
  const openPDF = () => {
    window.open(url, '_blank');
  };

  return (
    <button onClick={openPDF}>
      View Sheet Music
    </button>
  );
};

export default SheetMusic;
