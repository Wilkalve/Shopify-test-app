// --- Imports ---
import { json } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// --- Backend Action Handler ---
export const action = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || typeof file === 'string') {
    return json({ error: 'Invalid file upload' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const timestamp = Date.now();
  const safeName = `${timestamp}_${file.name.replace(/[^a-z0-9.\-_]/gi, '_')}`;
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  // Ensure uploads directory exists
  await mkdir(uploadsDir, { recursive: true });

  // Save file to public/uploads
  await writeFile(path.join(uploadsDir, safeName), buffer);

  return json({ url: `/uploads/${safeName}`, originalName: file.name });
};

// --- Frontend Component ---
export default function UploadRoute() {
  const fetcher = useFetcher();
  const data = fetcher.data;

  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      padding: '2rem',
      maxWidth: '600px',
      margin: 'auto',
      textAlign: 'center',
      border: '1px solid #ddd',
      borderRadius: '8px',
      background: '#fafafa',
    }}>
      <h1 style={{ marginBottom: '1rem' }}>Upload Your 3D Model</h1>

      <fetcher.Form method="post" encType="multipart/form-data">
        <input
          type="file"
          name="file"
          accept=".glb,.gltf,.obj,.stl"
          required
          style={{
            padding: '0.5rem',
            marginBottom: '1rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '100%',
          }}
        />
        <br />
        <button type="submit" style={{
          backgroundColor: '#00bfa5',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}>
          Upload
        </button>
      </fetcher.Form>

      {data?.url && (
        <div style={{ marginTop: '1.5rem' }}>
          <p><strong>Model Uploaded!</strong></p>
          <a href={data.url} target="_blank" rel="noopener noreferrer">
            View File →
          </a>
        </div>
      )}

      {data?.error && (
        <p style={{ color: 'red', marginTop: '1rem' }}>{data.error}</p>
      )}
    </div>
  );
}
