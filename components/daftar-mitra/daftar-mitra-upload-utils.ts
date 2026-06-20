import { isDeletableStorageUrl } from "@/lib/integrations/storage-urls"

export async function deleteStorageUrl(url: string): Promise<void> {
  if (!isDeletableStorageUrl(url)) return

  try {
    await fetch("/api/register-mitra/upload/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })
  } catch (error) {
    console.error("Failed to delete blob:", error)
  }
}

export async function uploadToFolder(
  file: File,
  folder: string,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("folder", folder)

  const res = await fetch("/api/register-mitra/upload", {
    method: "POST",
    body: formData,
  })
  const data = await res.json()

  if (res.ok) {
    return { ok: true, url: data.url }
  }
  return { ok: false, error: data.error || "Gagal upload file" }
}
