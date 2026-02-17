export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // 1. Construct the target URL
        // This maps your worker path (e.g., /products/1) to the API path
        const targetUrl = `https://fakestoreapi.com${url.pathname}${url.search}`;

        // 2. Prepare Headers 
        // We strip some headers to avoid 'Cloudflare-on-Cloudflare' detection issues
        const modifiedHeaders = new Headers(request.headers);
        modifiedHeaders.set("Host", "fakestoreapi.com");
        modifiedHeaders.set("Referer", "https://fakestoreapi.com/");

        // Set a common User-Agent to look more like a browser
        modifiedHeaders.set(
            "User-Agent",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );

        try {
            const response = await fetch(targetUrl, {
                method: request.method,
                headers: modifiedHeaders,
                redirect: "follow",
            });

            // 3. Return the JSON response
            // We create a new response to ensure headers are clean
            const jsonBody = await response.blob();

            return new Response(jsonBody, {
                status: response.status,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*", // Optional: allows CORS
                },
            });
        } catch (err) {
            return new Response(JSON.stringify({ error: "Failed to fetch from API", details: err.message }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
    },
};