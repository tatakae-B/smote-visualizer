import type { VercelRequest, VercelResponse } from "@vercel/node";

// Use the built server bundle emitted by `vike build`.
// This keeps runtime logic aligned with the production build.
const renderPage = async (urlOriginal: string) => {
  const { renderPage: render } = await import("../dist/server/entry.mjs");
  return render({ urlOriginal });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const pageContext = await renderPage(req.url || "/");
  const { httpResponse } = pageContext;

  if (!httpResponse) {
    res.status(404).send("Not found");
    return;
  }

  res.status(httpResponse.statusCode);
  httpResponse.headers?.forEach(([name, value]) => {
    res.setHeader(name, value);
  });
  res.send(httpResponse.body);
}

