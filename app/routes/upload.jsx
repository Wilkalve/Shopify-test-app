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
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  const safeName = file.name.replace(/[^a-z0-9.\-_]/gi, '_');
  const filePath = path.join(uploadsDir, safeName);

  await writeFile(filePath, buffer);

  const fileUrl = `/uploads/${safeName}`;
  return json({ url: fileUrl });
};
