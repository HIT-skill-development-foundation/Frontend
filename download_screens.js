import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const screens = [
  { id: 'admin_dashboard', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1ZTA0Y2M5ZTk5ODkwNzc5YTRmOGMzM2M0ZTU0EgsSBxDDlM3k8gYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDg0ODM2MzYwNjU3MzM0MTg2NQ&filename=&opi=89354086' },
  { id: 'donation_receipt', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1ZTA0Y2M4YmZiYWIwN2M0ZTRiZTBlM2JhNzNmEgsSBxDDlM3k8gYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDg0ODM2MzYwNjU3MzM0MTg2NQ&filename=&opi=89354086' },
  { id: 'home_education', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1ZTA0OWZlM2IzZWQwN2M0ZDIzODkzMDAxYjFhEgsSBxDDlM3k8gYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDg0ODM2MzYwNjU3MzM0MTg2NQ&filename=&opi=89354086' },
  { id: 'online_donation', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1ZTA0Y2QzNTUyZjcwNmZmZTEzNzMzMzkzZmE4EgsSBxDDlM3k8gYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDg0ODM2MzYwNjU3MzM0MTg2NQ&filename=&opi=89354086' },
  { id: 'student_admission', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1ZTA0OWNhZjI5MGMwMmE5OTYxZDgzMzA4NmYxEgsSBxDDlM3k8gYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDg0ODM2MzYwNjU3MzM0MTg2NQ&filename=&opi=89354086' },
  { id: 'student_portal_id', url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1ZTA0OWI4ZTA3ZWMwMmE5OTYxZDgzMzA4NmYxEgsSBxDDlM3k8gYYAZIBJAoKcHJvamVjdF9pZBIWQhQxNDg0ODM2MzYwNjU3MzM0MTg2NQ&filename=&opi=89354086' }
];

const targetDir = path.join(__dirname, 'stitch_raw');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

for (const item of screens) {
  try {
    const res = await fetch(item.url);
    const text = await res.text();
    fs.writeFileSync(path.join(targetDir, item.id + '.html'), text);
    console.log(`Saved ${item.id} (${text.length} bytes)`);
  } catch (err) {
    console.error(`Failed ${item.id}:`, err);
  }
}
console.log('Finished downloading all screens.');
