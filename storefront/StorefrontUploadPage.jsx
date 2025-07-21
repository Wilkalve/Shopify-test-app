import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import StorefrontFileUpload from './StorefrontFileUpload';
import StorefrontViewer from './StorefrontViewer';

function ViewerApp({ shop }) {
  const [modelUrl, setModelUrl] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);

  return (
    <div style={{ padding: '40px' }}>
      <h2>Upload Your 3D Model</h2>
      <StorefrontFileUpload
        onSuccess={(url) => {
          setLoadingPreview(true);
          setModelUrl(url);
        }}
      />
      {loadingPreview && <p>🔄 Rendering preview...</p>}
      {modelUrl && (
        <>
          <hr style={{ margin: '40px 0' }} />
          <StorefrontViewer modelUrl={modelUrl} onLoad={() => setLoadingPreview(false)} />
        </>
      )}
    </div>
  );
}

// Mount the component
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('nv-3d-viewer');
  if (container) {
    const shop = container.dataset.shop;
    const root = createRoot(container);
    root.render(<ViewerApp shop={shop} />);
  }
});
