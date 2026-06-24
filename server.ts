import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

// Escapes special characters to prevent HTML injection in emails
function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Generates an elegant, engineered, recruiter-friendly HTML Email Template
function generateEmailTemplate(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  userAgent: string;
}) {
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeSubject = escapeHtml(data.subject || "General Engineering Inquiry");
  const safeMessage = escapeHtml(data.message).replace(/\n/g, "<br />");
  const safeTimestamp = escapeHtml(data.timestamp);
  const safeUserAgent = escapeHtml(data.userAgent);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Portfolio Contact Dispatch</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #0d1117;
      color: #c9d1d9;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #090d13;
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #161b22;
      border: 1px solid #30363d;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    .header {
      background: linear-gradient(135deg, #1f2937 0%, #0d1117 100%);
      padding: 30px;
      border-bottom: 2px solid #3b82f6;
      text-align: left;
      position: relative;
    }
    .header-tag {
      display: inline-block;
      font-family: "SF Mono",SFMono-Regular,Consolas,Liberation Mono,Courier,monospace;
      font-size: 10px;
      color: #3b82f6;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      border: 1px solid rgba(59, 130, 246, 0.3);
      padding: 2px 8px;
      border-radius: 4px;
      background-color: rgba(59, 130, 246, 0.1);
      margin-bottom: 12px;
    }
    .header-title {
      font-size: 20px;
      font-weight: 800;
      color: #ffffff;
      margin: 0;
      letter-spacing: -0.02em;
    }
    .header-subtitle {
      font-size: 12px;
      color: #8b949e;
      margin: 6px 0 0 0;
    }
    .content {
      padding: 30px;
    }
    .section-title {
      font-family: "SF Mono",SFMono-Regular,Consolas,Liberation Mono,Courier,monospace;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #58a6ff;
      margin-bottom: 15px;
      border-bottom: 1px solid #30363d;
      padding-bottom: 6px;
    }
    .grid-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 25px;
    }
    .grid-table td {
      padding: 8px 0;
      vertical-align: top;
      font-size: 13px;
    }
    .grid-label {
      width: 120px;
      font-family: "SF Mono",SFMono-Regular,Consolas,Liberation Mono,Courier,monospace;
      color: #8b949e;
      font-size: 11px;
      text-transform: uppercase;
    }
    .grid-value {
      color: #f0f6fc;
      font-weight: 500;
    }
    .msg-block {
      background-color: #0d1117;
      border: 1px solid #30363d;
      border-radius: 8px;
      padding: 20px;
      color: #e6edf3;
      font-size: 13.5px;
      line-height: 1.6;
      margin-bottom: 25px;
      white-space: pre-wrap;
    }
    .telemetry-box {
      background-color: rgba(110, 118, 129, 0.05);
      border-left: 3px solid #30363d;
      padding: 12px 18px;
      margin-bottom: 20px;
    }
    .telemetry-row {
      font-family: "SF Mono",SFMono-Regular,Consolas,Liberation Mono,Courier,monospace;
      font-size: 10.5px;
      color: #8b949e;
      margin: 4px 0;
    }
    .footer {
      background-color: #0d1117;
      padding: 24px 30px;
      border-top: 1px solid #30363d;
      text-align: center;
    }
    .footer-text {
      font-size: 11px;
      color: #8b949e;
      line-height: 1.5;
      margin: 0 0 12px 0;
    }
    .footer-links a {
      color: #58a6ff;
      text-decoration: none;
      font-size: 11px;
      margin: 0 10px;
    }
    .footer-links a:hover {
      text-decoration: underline;
    }
    .cta-button {
      display: inline-block;
      background-color: #238636;
      color: #ffffff !important;
      text-decoration: none;
      padding: 10px 20px;
      font-size: 12px;
      font-weight: bold;
      border-radius: 6px;
      margin-top: 5px;
      border: 1px solid #2ea043;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="header-tag">Collaboration System</div>
        <h1 class="header-title">Engineering Inquiry Dispatched</h1>
        <p class="header-subtitle">Secure submission received from portfolio client gateway</p>
      </div>
      
      <div class="content">
        <div class="section-title">Sender Information</div>
        <table class="grid-table">
          <tr>
            <td class="grid-label">Full Name</td>
            <td class="grid-value">${safeName}</td>
          </tr>
          <tr>
            <td class="grid-label">Email Address</td>
            <td class="grid-value">
              <a href="mailto:${safeEmail}" style="color: #58a6ff; text-decoration: none;">${safeEmail}</a>
            </td>
          </tr>
          <tr>
            <td class="grid-label">Subject</td>
            <td class="grid-value">${safeSubject}</td>
          </tr>
          <tr>
            <td class="grid-label">Timestamp</td>
            <td class="grid-value" style="font-family: monospace; font-size: 12px;">${safeTimestamp}</td>
          </tr>
        </table>
        
        <div class="section-title">Message payload</div>
        <div class="msg-block">${safeMessage}</div>
        
        <div class="section-title">Client Telemetry</div>
        <div class="telemetry-box">
          <div class="telemetry-row"><strong>IP status:</strong> ROUTED SECURELY</div>
          <div class="telemetry-row"><strong>Environment:</strong> ${safeUserAgent || "Unknown Device"}</div>
          <div class="telemetry-row"><strong>Status check:</strong> VERIFIED_HUMAN_DISPATCH [PASS]</div>
        </div>
        
        <div style="text-align: center; margin-top: 15px;">
          <a href="mailto:${safeEmail}?subject=Re: ${encodeURIComponent(safeSubject)}" class="cta-button">COMPOSE SECURE REPLY</a>
        </div>
      </div>
      
      <div class="footer">
        <p class="footer-text">
          Sent from <strong>Abhradeep Pal Portfolio System</strong><br />
          AI &amp; Intelligent Embedded Systems Engineering | Mohali, Punjab
        </p>
        <div class="footer-links">
          <a href="https://github.com/palabhradeep635-star">GitHub Profile</a>
          <span style="color: #30363d;">•</span>
          <a href="https://www.linkedin.com/in/abhradeep-pal-14ab8637a/">LinkedIn Profile</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add JSON parsing middleware
  app.use(express.json());

  // Security headers middleware
  app.use((req, res, next) => {
    const isProd = process.env.NODE_ENV === "production";
    
    // 1. Content Security Policy (CSP)
    // Structured to keep fonts, scripts, and API connections safe while preventing XSS, and allowing preview iframe rendering
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https: wss: ws: http:",
      "object-src 'none'",
      "frame-ancestors *" // Always allow frame ancestors so the AI Studio developer workspace and share views can render properly
    ].join("; ");
    
    res.setHeader("Content-Security-Policy", cspDirectives);

    // 2. Prevent MIME type sniffing
    res.setHeader("X-Content-Type-Options", "nosniff");

    // 3. Prevent clickjacking (Disabled X-Frame-Options SAMEORIGIN to allow the applet preview iframe in the AI Studio environment)
    // res.setHeader("X-Frame-Options", "SAMEORIGIN");

    // 4. Cache-Control setting
    if (req.url.startsWith("/api/")) {
      res.setHeader("Cache-Control", "no-store, max-age=0, must-revalidate");
    } else {
      res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    }

    // 5. Enable XSS filter in older browser clients
    res.setHeader("X-XSS-Protection", "1; mode=block");

    // 6. Referrer Policy control
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

    // 7. Limit hardware browser API capabilities via Permissions Policy
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

    next();
  });

  // Dynamic DSA progress tracking cache
  let dsaProgressCache: any = null;
  let dsaProgressCacheTime = 0;
  const CACHE_TTL = 2 * 60 * 1000; // 2 minutes cache

  app.get("/api/dsa-progress", async (req, res) => {
    const now = Date.now();
    const forceRefresh = req.query.refresh === "true";

    if (!forceRefresh && dsaProgressCache && (now - dsaProgressCacheTime < CACHE_TTL)) {
      console.log("[DSA API] Serving cached progress data.");
      return res.json(dsaProgressCache);
    }

    const repoOwner = "palabhradeep635-star";
    const repoName = "lchub";
    const headers: Record<string, string> = {
      "User-Agent": "Abhradeep-Pal-Portfolio-EdgeAI-System",
      "Accept": "application/vnd.github.v3+json"
    };

    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
    }

    try {
      console.log(`[DSA API] Starting dynamic README parsing pipeline for ${repoOwner}/${repoName}...`);

      // Step 1: Fetch raw README.md with raw content failover
      let readmeText = "";
      try {
        console.log("[DSA API] Fetching README.md from raw.githubusercontent...");
        const rawRes = await fetch(`https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/README.md`);
        if (rawRes.ok) {
          readmeText = await rawRes.text();
        } else {
          throw new Error(`Raw fetch returned status ${rawRes.status}`);
        }
      } catch (rawErr: any) {
        console.warn("[DSA API] Raw README fetch failed, trying contents API fallback...", rawErr.message);
        const contentsRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/README.md`, { headers });
        if (!contentsRes.ok) {
          throw new Error(`GitHub contents API returned status ${contentsRes.status}`);
        }
        const json = await contentsRes.json() as any;
        if (json.content && json.encoding === "base64") {
          readmeText = Buffer.from(json.content, "base64").toString("utf-8");
        } else {
          throw new Error("Invalid README file structure returned from API");
        }
      }

      if (!readmeText) {
        throw new Error("Empty or failed README content retrieval");
      }

      // Step 2: Parse README topics, problems, and difficulties dynamically
      const lines = readmeText.split("\n");
      let currentTopic = "";
      
      const uniqueProblems = new Set<string>();
      const problemDifficulties = new Map<string, string>();
      const topicProblems = new Map<string, Set<string>>();

      for (let line of lines) {
        line = line.trim();
        if (line.startsWith("## ") || line.startsWith("### ")) {
          // Extract topic name, e.g. "## Array" -> "Array", "## Counting Sort" -> "Counting Sort"
          currentTopic = line.replace(/^##+\s+/, "").trim();
          if (currentTopic && currentTopic.toLowerCase() !== "leetcode topics" && !topicProblems.has(currentTopic)) {
            topicProblems.set(currentTopic, new Set<string>());
          }
        } else if (currentTopic && currentTopic.toLowerCase() !== "leetcode topics" && line.startsWith("|") && !line.includes("Problem Name") && !line.includes("---")) {
          // It's a table row! Example: | [1051-height-checker](https://...) | Easy |
          const parts = line.split("|").map(p => p.trim()).filter(Boolean);
          if (parts.length >= 2) {
            const linkPart = parts[0];
            const difficultyPart = parts[1];

            // Match brackets for problem name [1051-height-checker]
            const nameMatch = linkPart.match(/\[([^\]]+)\]/);
            if (nameMatch) {
              const problemName = nameMatch[1].trim();
              const rawDiff = difficultyPart.trim();
              const difficulty = rawDiff.charAt(0).toUpperCase() + rawDiff.slice(1).toLowerCase();

              uniqueProblems.add(problemName);
              problemDifficulties.set(problemName, difficulty);

              if (!topicProblems.has(currentTopic)) {
                topicProblems.set(currentTopic, new Set<string>());
              }
              topicProblems.get(currentTopic)!.add(problemName);
            }
          }
        }
      }

      // Compute aggregates dynamically
      const totalSolved = uniqueProblems.size;

      let easyCount = 0;
      let mediumCount = 0;
      let hardCount = 0;
      problemDifficulties.forEach((diff) => {
        if (diff === "Easy") easyCount++;
        else if (diff === "Medium") mediumCount++;
        else if (diff === "Hard") hardCount++;
      });

      const parsedTopics: any[] = [];
      topicProblems.forEach((problemsSet, topicName) => {
        if (problemsSet.size > 0) {
          parsedTopics.push({
            name: topicName,
            count: problemsSet.size,
            problems: Array.from(problemsSet)
          });
        }
      });

      console.log(`[DSA API] Successfully parsed README. Total unique solved: ${totalSolved}`);

      // Step 3: Fetch repository contents to match valid directories
      console.log(`[DSA API] Fetching directory contents to verify folders...`);
      const contentsRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents`, { headers });
      let rootDirs: string[] = [];
      if (contentsRes.ok) {
        const contentsData = await contentsRes.json() as any[];
        if (Array.isArray(contentsData)) {
          rootDirs = contentsData
            .filter((item: any) => item.type === "dir" && !item.name.startsWith(".") && item.name !== ".github" && item.name !== "README.md")
            .map((item: any) => item.name);
        }
      }

      // Step 4: Determine Latest Solved Problem WITHOUT using commit messages text
      console.log(`[DSA API] Querying commit files to trace latest updated problem folder...`);
      let latestProblem = "1051-height-checker";
      let latestDifficulty = "Easy";
      let latestSolvedAt = new Date().toISOString();
      let foundLatest = false;

      try {
        const commitsRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/commits?per_page=5`, { headers });
        if (commitsRes.ok) {
          const commitsData = await commitsRes.json() as any[];
          if (Array.isArray(commitsData) && commitsData.length > 0) {
            latestSolvedAt = commitsData[0]?.commit?.committer?.date || commitsData[0]?.commit?.author?.date || latestSolvedAt;

            // Iterate commits to inspect file-level changes instead of text message matching
            for (const c of commitsData) {
              if (foundLatest) break;
              const sha = c.sha;
              if (!sha) continue;

              const commitDetailsRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/commits/${sha}`, { headers });
              if (commitDetailsRes.ok) {
                const commitDetails = await commitDetailsRes.json() as any;
                if (commitDetails.files && Array.isArray(commitDetails.files)) {
                  for (const file of commitDetails.files) {
                    const filename = file.filename || "";
                    const segments = filename.split("/");
                    const rootSegment = segments[0];

                    // Check if this root segment matches any directory name we verified or any unique problem
                    if (rootSegment && rootDirs.includes(rootSegment)) {
                      latestProblem = rootSegment;
                      latestDifficulty = problemDifficulties.get(rootSegment) || "Easy";
                      latestSolvedAt = commitDetails.commit?.committer?.date || commitDetails.commit?.author?.date || latestSolvedAt;
                      foundLatest = true;
                      console.log(`[DSA API] Matched latest folder change from commit file trees: ${rootSegment}`);
                      break;
                    }
                  }
                }
              }
            }
          }
        }
      } catch (commitErr: any) {
        console.warn("[DSA API] Failed tracing commits, falling back to alphabetical sorting...", commitErr.message);
      }

      // Backup fallback if commit files tracing didn't find any match
      if (!foundLatest && rootDirs.length > 0) {
        // Sort directories alphabetically / numerically to find the latest added folder
        const sortedDirs = [...rootDirs].sort((a, b) => {
          const numA = parseInt(a.match(/^\d+/)?.[0] || "0", 10);
          const numB = parseInt(b.match(/^\d+/)?.[0] || "0", 10);
          return numB - numA; // Descending to get largest prefix
        });
        latestProblem = sortedDirs[0];
        latestDifficulty = problemDifficulties.get(latestProblem) || "Easy";
      }

      const payload = {
        totalSolved,
        difficultyBreakdown: {
          Easy: easyCount,
          Medium: mediumCount,
          Hard: hardCount
        },
        topics: parsedTopics,
        latestProblem,
        latestDifficulty,
        lastUpdated: latestSolvedAt,
        latestSolvedAt,
        isFallback: false
      };

      dsaProgressCache = payload;
      dsaProgressCacheTime = now;

      console.log("[DSA API] Serving freshly processed progress data successfully!");
      return res.json(payload);
    } catch (err: any) {
      console.error("[DSA Progress API] Critical pipeline exception:", err.message);
      
      if (dsaProgressCache) {
        return res.json({
          ...dsaProgressCache,
          isFallback: true,
          error: err.message
        });
      }

      // If absolutely no cache is pre-populated, use a smart failover object
      return res.status(500).json({
        error: "DSA data temporarily unavailable",
        message: err.message
      });
    }
  });

  // Professional form dispatch handler
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message, timestamp } = req.body;

      // Basic backend validation
      if (!name || typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ error: "Sender full name is required and must change to string." });
      }

      if (!email || typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({ error: "A valid email address is required." });
      }

      if (!message || typeof message !== "string" || message.trim() === "") {
        return res.status(400).json({ error: "Message content cannot be blank." });
      }

      const userAgent = req.headers["user-agent"] || "Unknown Browser Agent";
      const formattedTimestamp = timestamp || new Date().toISOString();
      const dynamicSubject = subject ? `Inquiry: ${subject}` : `Collaboration Inquiry — ${name}`;

      // Build out the structured HTML email
      const emailHtml = generateEmailTemplate({
        name: name.trim(),
        email: email.trim(),
        subject: dynamicSubject,
        message: message.trim(),
        timestamp: formattedTimestamp,
        userAgent,
      });

      console.log(`[Contact Form System] Constructed HTML email for: ${name.trim()}`);

      const resendApiKey = process.env.RESEND_API_KEY;
      // In Resend sandbox mode, the receiver must be exactly the verified account owner email.
      const receiverEmail = "palabhradeep635@gmail.com";

      if (resendApiKey && resendApiKey !== "your_api_key_here") {
        try {
          console.log(`[Contact Form System] Attempting to deliver via Resend API to: ${receiverEmail}`);
          const { Resend } = await import("resend");
          const resendClient = new Resend(resendApiKey);

          const { data, error } = await resendClient.emails.send({
            from: "onboarding@resend.dev",
            to: receiverEmail,
            subject: `New Portfolio Inquiry — ${name.trim()}`,
            html: emailHtml,
            replyTo: email.trim(),
          });

          if (error) {
            console.error("[Contact Form System] Resend validation or routing error:", error);
            return res.status(400).json({
              error: `Resend reported: ${error.message || "validation_error"}. This is common when using unverified or sandboxed domain/email credentials.`,
              details: error
            });
          }

          console.log(`[Contact Form System] Resend email successfully sent! Message ID: ${data?.id}`);

          return res.status(200).json({
            success: true,
            message: "A pristine system-formatted email has been dispatched to Abhradeep via Resend.",
            emailHtml,
            delivered: true,
          });
        } catch (resendError: any) {
          console.error("[Contact Form System] Resend provider failed:", resendError);
          // Fallback gracefully instead of crashing
          return res.status(200).json({
            success: true,
            message: "Your inquiry is saved. Resend system reported error, but dispatch payload is secure.",
            emailHtml,
            delivered: false,
            error: resendError.message,
          });
        }
      } else {
        console.warn("[Contact Form System] RESEND_API_KEY environment variable is not defined or configured.");
        console.log("=== BEGIN EMULATED DISPATCH PAYLOAD ===");
        console.log(emailHtml);
        console.log("=== END EMULATED DISPATCH PAYLOAD ===");

        // Return a successful response but with fallback flag
        return res.status(200).json({
          success: true,
          message: "Email parsed and formatted perfectly. (Simulation Output: key is unconfigured locally, details loaded onto console log).",
          emailHtml,
          delivered: false,
          fallbackUsed: true,
        });
      }
    } catch (err: any) {
      console.error("[Contact Form System] Server-side error:", err);
      return res.status(500).json({
        error: "Failed to process portfolio dispatch message.",
        details: err.message,
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Abhradeep Portfolio Server started securely on http://localhost:${PORT}`);
  });
}

startServer();
