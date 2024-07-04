// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import cors from 'cors';


import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;


    const app = express();
    // Set up Shopify authentication and webhook handling
    app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.get('/api/2024-04/products', async(req,res)=>{
  let productsInfo = await shopify.api.rest.Product.all({
    session: res.locals.shopify.session,
    // ids: "632910392,921728736",
  });
  res.status(200).send(productsInfo);
})

// app.get('/api/2024-04/products/metafields.json', async(req,res)=>{
//   let productsMetaData = await shopify.api.rest.Metafield.all({
//     session: res.locals.shopify.session,
//     metafield: {"product_id": "8387996614807"}
//     // ids: "632910392,921728736",
//   });
//   res.status(200).send(productsMetaData);
// })

// app.get('/admin/api/2024-04/blogs.json', async (req, res) => {
//   const blogData = await shopify.api.rest.Blog.all({
//     session: res.locals.shopify.session
//   });
//   res.status(200).send(blogData);
// })



// app.post('/admin/api/2024-04/script_tags.json', async (req, res) => {
//   try {
//     const script_tag = new shopify.api.rest.ScriptTag({session: res.locals.shopify.session});
// script_tag.event = "onload";
// script_tag.src = "https://github.com/RAJASHEKARGUNAGANTI/script-Inject/blob/master/language_dropdown.js";
// await script_tag.save({
//   update: true,
// });
// } catch (error) {
//     console.error('Error proxying request to Shopify:', error);
//     res.status(500).json({ error: 'Failed to proxy request to Shopify' });
//   }
// });

app.get("/api/2024-07/themes", async (req, res) => {
  await shopify.api.rest.Theme.all({
    session: res.locals.shopify.session,
  });
  console.log("Theme json")
res.status(200).send(res);
})



app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.post("/api/products", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
