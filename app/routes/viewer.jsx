import { useLoaderData } from '@remix-run/react';
import StorefrontViewer from '../routes/modelViewer';
import { useState } from 'react';

export async function loader({ request }) {
  const url = new URL(request.url);
  const modelUrl = url.searchParams.get('modelUrl');

  if (!modelUrl) {
    throw new Response('Missing modelUrl', { status: 400 });
  }

  return { modelUrl };
}

export default function ViewerRoute() {
  const { modelUrl } = useLoaderData();
  const [copied, setCopied] = useState(false);

  const fullLink = typeof window !== 'undefined'
    ? `${window.location.origin}/storefront/viewer?modelUrl=${modelUrl}`
    : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '960px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px' }}>Preview Your 3D Model</h2>
      
      <StorefrontViewer modelUrl={modelUrl} />

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button
          onClick={copyToClipboard}
          style={{
            padding: '10px 20px',
            background: '#6a1b9a',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          📋 Copy Viewer Link
        </button>
        {copied && <p style={{ marginTop: '10px', color: '#28a745' }}>Link copied!</p>}
      </div>
    </div>
  );
}
