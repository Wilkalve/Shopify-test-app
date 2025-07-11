/// This file holds the shared state data between pages
import React, { createContext, useState } from 'react';

export const ModelContext = createContext();

export function ModelProvider({ children }) {
  const [fileData, setFileData] = useState(null);
  const [fileType, setFileType] = useState('');

  return (
    <ModelContext.Provider value={{ fileData, setFileData, fileType, setFileType }}>
      {children}
    </ModelContext.Provider>
  );
}

