# SEO Verification Checklist: TN Vote Vision

## 1. Technical Validation
- [ ] **Sitemap Submission**: Submit `https://tnvotevision.netlify.app/sitemap.xml` to Google Search Console (GSC).
- [ ] **Robots.txt Check**: Verify that `robots.txt` is accessible at root and not blocking essential pages.
- [ ] **Structured Data Test**: Test the homepage and result pages at [Google Rich Results Test](https://search.google.com/test/rich-results).
- [ ] **Mobile-Friendly Test**: Confirm layout responsiveness for "voter on the move".

## 2. Performance & Security
- [ ] **PageSpeed Insights**: Run a mobile test; target a Performance score of 90+ to satisfy Google News speed requirements.
- [ ] **CSP Validation**: Ensure no external scripts (like dynamic data APIs) are blocked by the `netlify.toml` headers.
- [ ] **SSL Check**: Verify HTTPS redirect is forced (handled by Netlify redirects).

## 3. Pre-Election Day Actions (T-Minus 24h)
- [ ] **Manual Indexing Request**: In GSC, use "Inspect URL" on the homepage and "Request Indexing" to ensure the latest meta-tags are live.
- [ ] **Check Meta Descriptions**: Ensure the "Real-time" and "Live" messaging is present and catchy.
- [ ] **Favicon Check**: Confirm the app icon appears correctly in mobile search results.

## 4. Counting Day Monitoring
- [ ] **Real-time Traffic**: Monitor Google Analytics 4 (GA4) for traffic spikes and landing page performance.
- [ ] **Crawl Errors**: Check the "Indexing" report in GSC for any 404s or crawl anomalies.
- [ ] **Search Queries**: Track which long-tail keywords (e.g., specific constituencies) are driving traffic.

## 5. Post-Election Cleanup
- [ ] **Update Changefreq**: Change `hourly` to `weekly` in `sitemap.xml` once the results are final and traffic stabilizes.
- [ ] **Archive Metadata**: Update meta descriptions to reflect "Final Results" instead of "Live Counting".
