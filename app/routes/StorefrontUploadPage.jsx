import { useState } from 'react';
import StorefrontFileUpload from './StorefrontFileUpload';
import StorefrontViewer from './StorefrontViewer';

export default function StorefrontUploadPage() {
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
