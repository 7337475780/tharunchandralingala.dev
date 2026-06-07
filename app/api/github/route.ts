import { NextResponse } from "next/server";

export async function GET() {
  const username = "7337475780";
  
  // Sensible default fallbacks if GitHub API limits us or is down
  const fallbackStats = {
    repos: 59,
    stars: 1,
    followers: 1,
    forks: 0,
    languages: [
      { name: "TypeScript", count: 24 },
      { name: "JavaScript", count: 18 },
      { name: "CSS", count: 6 },
    ],
    avatarUrl: "https://avatars.githubusercontent.com/u/115937728?v=4",
    bio: "Full Stack Dev • React / Next.js 15 / TypeScript • Building real-time apps, AI platforms & scalable UIs",
    source: "fallback",
  };

  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "portfolio-github-stats-fetcher",
    };

    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    // Fetch user details
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers,
      next: { revalidate: 3600 }, // Cache in Next.js for 1 hour
    });
    
    let contributions = "150+";
    try {
      const pageRes = await fetch(`https://github.com/${username}`, {
        headers: { "User-Agent": "Mozilla/5.0" },
        next: { revalidate: 3600 }
      });
      if (pageRes.ok) {
        const html = await pageRes.text();
        const match = html.match(/(\d+,?\d*)\s+contributions\s+in\s+the\s+last\s+year/i);
        if (match) {
          contributions = match[1];
        }
      }
    } catch (e) {
      console.warn("Failed to scrape contributions count:", e);
    }
    
    if (!userRes.ok) {
      console.warn(`GitHub user API returned status: ${userRes.status}. Using fallback stats.`);
      return NextResponse.json({ success: true, data: { ...fallbackStats, contributions } });
    }
    
    const userData = await userRes.json();

    // Fetch repositories
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
      headers,
      next: { revalidate: 3600 },
    });

    if (!reposRes.ok) {
      console.warn(`GitHub repos API returned status: ${reposRes.status}. Using partial fallback.`);
      return NextResponse.json({
        success: true,
        data: {
          ...fallbackStats,
          repos: userData.public_repos || fallbackStats.repos,
          followers: userData.followers || fallbackStats.followers,
          avatarUrl: userData.avatar_url || fallbackStats.avatarUrl,
          bio: userData.bio || fallbackStats.bio,
          contributions,
          source: "partial-fallback",
        },
      });
    }

    const reposData = await reposRes.json();

    if (!Array.isArray(reposData)) {
      return NextResponse.json({ success: true, data: { ...fallbackStats, contributions } });
    }

    let totalStars = 0;
    let totalForks = 0;
    const langMap: Record<string, number> = {};

    reposData.forEach((repo: any) => {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;
      if (repo.language) {
        langMap[repo.language] = (langMap[repo.language] || 0) + 1;
      }
    });

    // Sort and take top 3 languages
    const languages = Object.entries(langMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    const finalStats = {
      repos: userData.public_repos || reposData.length,
      stars: totalStars,
      followers: userData.followers || 1,
      forks: totalForks,
      languages,
      avatarUrl: userData.avatar_url,
      bio: userData.bio || "Full Stack Dev",
      contributions,
      source: "live",
    };

    return NextResponse.json({ success: true, data: finalStats });
  } catch (err) {
    console.error("Error in github stats API route:", err);
    return NextResponse.json({ success: true, data: fallbackStats });
  }
}
