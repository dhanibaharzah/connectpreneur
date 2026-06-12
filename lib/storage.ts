import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { del as deleteVercelBlob } from "@vercel/blob"
import {
  isDeletableStorageUrl,
  isManagedStorageUrl,
  isR2PublicHost,
  LEGACY_BLOB_HOST,
} from "@/lib/storage-urls"

export { isDeletableStorageUrl, isManagedStorageUrl } from "@/lib/storage-urls"

function getR2Config() {
  const accountId = process.env.R2_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  const bucketName = process.env.R2_BUCKET_NAME
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicBaseUrl) {
    throw new Error("R2 storage is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_PUBLIC_BASE_URL.")
  }

  return { accountId, accessKeyId, secretAccessKey, bucketName, publicBaseUrl: publicBaseUrl.replace(/\/$/, "") }
}

let r2Client: S3Client | null = null

function getR2Client(): S3Client {
  if (!r2Client) {
    const { accountId, accessKeyId, secretAccessKey } = getR2Config()
    r2Client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  }
  return r2Client
}

export function getPublicUrl(key: string): string {
  const { publicBaseUrl } = getR2Config()
  return `${publicBaseUrl}/${key}`
}

export async function uploadObject(
  key: string,
  buffer: Buffer,
  contentType: string,
): Promise<{ url: string; key: string }> {
  const { bucketName } = getR2Config()
  const client = getR2Client()

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  )

  return { url: getPublicUrl(key), key }
}

function getR2KeyFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (!isR2PublicHost(parsed.hostname)) {
      const { publicBaseUrl } = getR2Config()
      const base = new URL(publicBaseUrl)
      if (parsed.hostname !== base.hostname) return null
    }

    const key = parsed.pathname.replace(/^\/+/, "")
    if (!key || key.includes("..")) return null

    return key
  } catch {
    return null
  }
}

function isLegacyVercelBlobUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return (
      parsed.protocol === "https:" &&
      (parsed.hostname === LEGACY_BLOB_HOST || parsed.hostname.endsWith(`.${LEGACY_BLOB_HOST}`)) &&
      !parsed.pathname.includes("..")
    )
  } catch {
    return false
  }
}

async function deleteFromR2(url: string): Promise<void> {
  const key = getR2KeyFromUrl(url)
  if (!key) {
    throw new Error("Invalid R2 URL")
  }

  const { bucketName } = getR2Config()
  const client = getR2Client()

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    }),
  )
}

export async function deleteObject(url: string): Promise<void> {
  if (!isDeletableStorageUrl(url)) {
    throw new Error("URL tidak valid")
  }

  if (isLegacyVercelBlobUrl(url)) {
    await deleteVercelBlob(url)
    return
  }

  await deleteFromR2(url)
}
