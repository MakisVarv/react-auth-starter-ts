export function getCookie(name: string): string | null {
  const cname = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    const cookie = ca[i].trim();
    if (cookie.startsWith(cname)) {
      return cookie.slice(cname.length);
    }
  }
  return null;
}
