import axios from "axios";

const youcam = axios.create({
  baseURL: "https://api.perfectcorp.com",
  timeout: 30000,
  headers: {
    Authorization: `Bearer ${process.env.YOUCAM_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export default youcam;