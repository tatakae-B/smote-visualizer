import { renderPage } from "vike/server";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const pageContextInit = { urlOriginal: req.url || "/" };
  const pageContext = await renderPage(pageContextInit);

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

