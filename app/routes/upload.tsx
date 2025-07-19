import { json } from '@remix-run/node';
import { writeFile } from 'fs/promises';
import path from 'path';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || typeof file === 'string') {
    return json({ error: 'Invalid file upload' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const timestamp = Date.now(); 
  const safeName = `${timestamp}_${file.name.replace(/[^a-z0-9.\-_]/gi, '_')}`; // Timestamped filename
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  await writeFile(path.join(uploadsDir, safeName), buffer);

  return json({ url: `/uploads/${safeName}` });
};

export default function UploadRoute() {
  return null;
}
