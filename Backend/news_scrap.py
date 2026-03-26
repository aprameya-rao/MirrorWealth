# run_scraper.py
import asyncio
from app.core.db import AsyncSessionLocal
from app.utils.news_scraper import scrape_and_embed_news

async def main():
    print("🚀 Starting manual news scraper...")
    
    # Open a dedicated database session for the background task
    async with AsyncSessionLocal() as session:
        try:
            await scrape_and_embed_news(session)
        except Exception as e:
            print(f"❌ Error running scraper: {e}")
            await session.rollback()
        finally:
            await session.close()
            
    print("🏁 Scraper finished executing.")

if __name__ == "__main__":
    asyncio.run(main())