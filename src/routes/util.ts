export async function toJson(body: any) {
  let fullBody = "";
  for await (const data of body) {
    fullBody += data.toString();
  }
  if (!fullBody) return null;
  return JSON.parse(fullBody);
}
