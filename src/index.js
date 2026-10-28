export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    let productId = url.searchParams.get("id");
    if (!productId && pathParts.length > 0) {
      productId = pathParts[pathParts.length - 1];
    }
    const lat = url.searchParams.get("lat") || "23.0225";
    const lon = url.searchParams.get("lon") || "72.5714";

    if (!productId || isNaN(Number(productId))) {
      return new Response(JSON.stringify({
        status: "ok",
        message: "Cloudflare Blinkit Proxy Active! Pass ?id=PRODUCT_ID or /api/product/PRODUCT_ID"
      }), { headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*" } });
    }

    const blinkitUrl = `https://blinkit.com/v6/api/products/${productId}?lat=${lat}&lon=${lon}&l=${lat},${lon}`;

    try {
      const resp = await fetch(blinkitUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
          "Referer": "https://blinkit.com/",
          "app_client": "consumer_web",
          "lat": lat,
          "lon": lon,
          "Cookie": `lat=${lat}; lon=${lon};`
        }
      });
      const data = await resp.text();
      return new Response(data, {
        status: resp.status,
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
  }
};
