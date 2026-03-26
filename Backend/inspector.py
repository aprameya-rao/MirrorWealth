import os
from sqlalchemy import create_engine, inspect

from dotenv import load_dotenv

# 1. Load your .env file
load_dotenv()

# 2. Get the URL
raw_url = os.getenv("DATABASE_URL")
if not raw_url:
    print("❌ Error: DATABASE_URL not found in .env file")
    exit()

# 3. Clean the URL for Sync usage
# Remove the async driver prefix
sync_url = raw_url.replace("postgresql+asyncpg://", "postgresql://")
sync_url = sync_url.replace("postgres://", "postgresql://")

# Strip out query parameters like ?ssl=true because we will pass them manually
if "?" in sync_url:
    sync_url = sync_url.split("?")[0]

# 4. Create the Engine with SSL requirements
engine = create_engine(
    sync_url,
    connect_args={"sslmode": "require"} # This tells Supabase "Yes, I am encrypted"
)

def inspect_supabase():
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names(schema="public")
        
        print("\n🚀 --- SUPABASE SCHEMA INSPECTION ---")
        
        if not tables:
            print("No tables found in the 'public' schema.")
            return

        for table_name in tables:
            print(f"\n📍 TABLE: {table_name}")
            
            # Get Columns
            columns = inspector.get_columns(table_name)
            for column in columns:
                pk = "🔑 [PK]" if column.get('primary_key') else ""
                nullable = "NULL" if column.get('nullable') else "NOT NULL"
                default = f"DEFAULT {column.get('default')}" if column.get('default') else ""
                
                print(f"  - {column['name']}: {column['type']} {nullable} {pk} {default}")
                
            # Check for Foreign Keys
            fks = inspector.get_foreign_keys(table_name)
            for fk in fks:
                print(f"    🔗 FK: {fk['constrained_columns']} -> {fk['referred_table']}.{fk['referred_columns']}")

        print("\n✅ Inspection Complete.")

    except Exception as e:
        print(f"❌ Error connecting to Supabase: {e}")

if __name__ == "__main__":
    inspect_supabase()