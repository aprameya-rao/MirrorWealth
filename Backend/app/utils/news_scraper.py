# app/utils/news_scraper.py
import feedparser
import asyncio
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.news import NewsArticle
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# Using the new, high-def embedding model
embedder = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")

# THE FIREHOSE: Multiple top-tier Indian financial feeds
RSS_FEEDS = {
    "Yahoo Finance": "https://feeds.finance.yahoo.com/rss/2.0/headline?s=^NSEI,^BSESN,INR=X",
    "Economic Times": "https://economictimes.indiatimes.com/markets/rssfeeds/2146842.cms",
    "LiveMint": "https://www.livemint.com/rss/markets",
    "Moneycontrol": "https://www.moneycontrol.com/rss/latestnews.xml" # <-- Added Moneycontrol
}

async def scrape_and_embed_news(db: AsyncSession, limit_per_feed: int = 25):
    """
    Scrapes multiple RSS feeds and embeds up to `limit_per_feed` articles from each.
    """
    print(f"📰 Fetching latest financial news from {len(RSS_FEEDS)} sources...")
    new_articles_count = 0

    for source_name, url in RSS_FEEDS.items():
        print(f"\n📡 Connecting to {source_name}...")
        
        # Fetch the RSS Feed
        feed = await asyncio.to_thread(feedparser.parse, url)
        
        if not feed.entries:
            print(f"⚠️ No news found for {source_name}.")
            continue

        # Process the articles for this specific source
        for entry in feed.entries[:limit_per_feed]:
            title = entry.title
            summary = entry.get('summary', title) 
            
            content_to_embed = f"Headline: {title}\nSummary: {summary}"
            
            print(f"🧠 Embedding: [{source_name}] {title[:45]}...")
            
            try:
                # Generate the Vector
                vector = await embedder.aembed_query(content_to_embed)

                # Prepare Database Object
                article = NewsArticle(
                    title=title,
                    summary=summary,
                    source=source_name,
                    published_at=datetime.now(timezone.utc),
                    embedding=vector
                )
                db.add(article)
                new_articles_count += 1
                
                # Sleep for 0.5 seconds to avoid hitting Google's API rate limits
                await asyncio.sleep(0.5)
                
            except Exception as e:
                print(f"❌ Failed to embed '{title[:30]}': {e}")

    # Commit the massive batch of new articles to Supabase
    await db.commit()
    print(f"\n✅ SUCCESS: Embedded and saved {new_articles_count} new articles to the database!")