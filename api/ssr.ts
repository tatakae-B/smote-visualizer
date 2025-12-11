import { createPageRenderer } from "vike/server";
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Create a renderer against the production build output.
const renderPage = createPageRenderer({
  isProduction: true,
  root: process.cwd(),
  outDir: "dist",
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const pageContext = await renderPage({
      urlOriginal: req.url || "/",
    });

    const { httpResponse } = pageContext;
    if (!httpResponse) {
      res.status(404).send("Not found");
      return;
    }

    res.status(httpResponse.statusCode);
    (httpResponse.headers as Array<[string, string]> | undefined)?.forEach(
      ([name, value]: [string, string]) => {
        res.setHeader(name, value);
      },
    );
    res.send(httpResponse.body);
  } catch (err) {
    console.error("SSR handler error", err);
    res.status(500).send("Internal Server Error");
  }
}

