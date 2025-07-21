import { useLoaderData, Link } from '@remix-run/react';
import StorefrontViewer from '../../storefront/StorefrontViewer';
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
      <h1 style={{ marginBottom: '10px', textAlign: 'center' }}>🧿 3D Model Preview</h1>
      <p style={{ textAlign: 'center', marginBottom: '30px' }}>
        View and interact with your uploaded model below. You can also copy a sharable link or return to the storefront.
      </p>

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
            marginRight: '15px',
          }}
        >
          📋 Copy Viewer Link
        </button>

        <Link
          to="/storefront"
          style={{
            padding: '10px 20px',
            background: '#555',
            color: '#fff',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          ← Back to Storefront
        </Link>

        {copied && <p style={{ marginTop: '10px', color: '#28a745' }}>✅ Link copied to clipboard!</p>}
      </div>
    </div>
  );
}
