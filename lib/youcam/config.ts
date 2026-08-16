export const YOUCAM_BASE_URL = "https://yce-api-01.makeupar.com";

export const YOUCAM_API_KEY = process.env.YOUCAM_API_KEY;

if (!YOUCAM_API_KEY) {
  console.error("YOUCAM_API_KEY is not set in environment variables");
  throw new Error("Missing YOUCAM_API_KEY in .env.local");
}

console.log("YouCam API configured. Key starts with:", YOUCAM_API_KEY.substring(0, 10) + "...");

export const YOUCAM_HEADERS = {
  Authorization: `Bearer ${YOUCAM_API_KEY}`,
  "Content-Type": "application/json",
};