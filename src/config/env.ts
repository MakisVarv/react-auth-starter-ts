const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl || apiUrl.trim() === "") {
  throw new Error("VITE_API_URL environment variable is missing or empty.");
}

export default apiUrl;
