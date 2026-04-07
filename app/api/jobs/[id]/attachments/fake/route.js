import fs from "fs";
import path from "path";
import { addAttachmentToJob } from "@/lib/data-store";

function writeFile(fullPath, content) {
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, "utf-8");
}

export async function POST(_req, { params }) {
  const uploadsDir = path.join(process.cwd(), "public", "uploads", params.id);
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const fakeFiles = [
    {
      type: "Rendering",
      name: "booth_rendering_mock.pdf",
      content: "FAKE RENDERING FILE\n\nMock rendering content for testing packet builder.",
    },
    {
      type: "Floor Plan",
      name: "floor_plan_mock.pdf",
      content: "FAKE FLOOR PLAN FILE\n\nMock floor plan content for testing packet builder.",
    },
    {
      type: "Install Notes",
      name: "install_notes_mock.txt",
      content: "Mock install notes:\n- Check booth location\n- Review graphics\n- Confirm lighting",
    },
    {
      type: "Graphics",
      name: "graphics_package_mock.txt",
      content: "Mock graphics package listing for testing only.",
    },
  ];

  const created = [];
  for (const file of fakeFiles) {
    const storedName = `${Date.now()}_${file.name}`;
    const fullPath = path.join(uploadsDir, storedName);
    writeFile(fullPath, file.content);

    const attachment = {
      type: file.type,
      name: file.name,
      storedName,
      url: `/uploads/${params.id}/${storedName}`,
    };

    addAttachmentToJob(params.id, attachment);
    created.push(attachment);
  }

  return Response.json({ ok: true, created });
}
