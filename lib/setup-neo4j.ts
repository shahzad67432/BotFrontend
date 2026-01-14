import { config } from 'dotenv'
import { resolve } from 'path'
import db from "./neo4j"

config({ path: resolve(process.cwd(), '.env') });

async function setupDatabase() {
  try {
    console.log('🚀 Starting Neo4j schema setup...');
    console.log('URI:', process.env.NEO4J_URI);
    console.log('USER:', process.env.NEO4J_USERNAME);
    console.log('PASSWORD:', process.env.NEO4J_PASSWORD ? '***set***' : 'NOT SET');
    
    await db.setupSchema();
    console.log('✅ Schema setup completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();