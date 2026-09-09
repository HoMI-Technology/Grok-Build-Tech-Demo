import JSZip from "jszip";

import { STAGES, type StageId } from "@/lib/stages";

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function downloadMarkdown(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  triggerDownload(blob, filename);
}

function zipSlug(idea: string): string {
  const slug = idea
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return slug || "spec-kit-draft";
}

export async function downloadZip(
  idea: string,
  contents: Record<StageId, string>,
): Promise<void> {
  const zip = new JSZip();
  const indexLines: string[] = [
    `# ${idea.trim() || "Spec Kit draft"}`,
    "",
    "Spec-Driven Development artifacts exported from the Spec Kit playground.",
    "",
  ];
  for (const stage of STAGES) {
    const content = contents[stage.id];
    if (!content.trim()) continue;
    zip.file(stage.filename, content);
    indexLines.push(`- \`${stage.filename}\` — ${stage.title}: ${stage.tagline}`);
  }
  zip.file("README.md", indexLines.join("\n") + "\n");
  const blob = await zip.generateAsync({ type: "blob" });
  triggerDownload(blob, `${zipSlug(idea)}.zip`);
}
