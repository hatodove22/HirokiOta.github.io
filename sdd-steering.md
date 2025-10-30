# SDD Steering - 2025-10-10 (Preview markdown pipeline)
- Markdown preview now flows through generateJSON/generateHTML; simple-editor tests remain skipped due to jsdom pointer gaps.
- Next: replace skipped tests with mock-based coverage or run e2e via chrome-devtools MCP when pointer APIs are available.

# SDD Steering - 2025-10-10 (News publish flow)
- Popup-based authentication removed; publish now expects the session token from ota_portfolio_auth, but we still need an end-to-end check via chrome-devtools MCP once the dev server is running.
- Follow-up: implement the real draft-save path and add automated coverage for the publish helper/token resolution.
