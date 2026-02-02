import neo4j, { Driver, Session } from 'neo4j-driver';

let driver: Driver | null = null;

function getDriver(): Driver {
  if (!driver) {
    const uri = 'neo4j://127.0.0.1:7687'
    const user = 'neo4j';
    const password = '11223344'

    // For Neo4j Aura (neo4j+s://) connections
    const config: any = {
      maxConnectionLifetime: 3 * 60 * 60 * 1000, // 3 hours
      maxConnectionPoolSize: 50,
      connectionAcquisitionTimeout: 2 * 60 * 1000, // 2 minutes
    };

    driver = neo4j.driver(uri, neo4j.auth.basic(user, password), config);
  }
  return driver;
}

class Neo4jDatabase {
  private driver: Driver;

  constructor() {
    this.driver = getDriver();
  }

  async setupSchema() {
    const session = this.driver.session();
    try {
      console.log('Setting up Neo4j constraints and indexes...');

      await session.run(`
        CREATE CONSTRAINT user_id IF NOT EXISTS
        FOR (u:User) REQUIRE u.id IS UNIQUE
      `);

      await session.run(`
        CREATE CONSTRAINT user_email IF NOT EXISTS
        FOR (u:User) REQUIRE u.email IS UNIQUE
      `);

      await session.run(`
        CREATE CONSTRAINT message_id IF NOT EXISTS
        FOR (m:Message) REQUIRE m.id IS UNIQUE
      `);

      await session.run(`
        CREATE CONSTRAINT email_id IF NOT EXISTS
        FOR (e:EmailHistory) REQUIRE e.id IS UNIQUE
      `);

      await session.run(`
        CREATE CONSTRAINT oauth_id IF NOT EXISTS
        FOR (o:UserOAuth) REQUIRE o.id IS UNIQUE
      `);

      await session.run(`
        CREATE INDEX user_created IF NOT EXISTS
        FOR (u:User) ON (u.createdAt)
      `);

      await session.run(`
        CREATE INDEX message_created IF NOT EXISTS
        FOR (m:Message) ON (m.createdAt)
      `);

      console.log('✅ Schema setup complete!');
    } finally {
      await session.close();
    }
  }

  // USER DB FUNCTIONS WE CAN CALL FROM OUR APP

  async createOrUpdateUserWithPassword(email: string, name: string, password: string, credits: number = 10) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MERGE (u:User {email: $email})
      ON CREATE SET
        u.id = randomUUID(),
        u.name = $name,
        u.password = $password,
        u.credits = $credits,
        u.createdAt = datetime(),
        u.updatedAt = datetime()
      ON MATCH SET
        u.name = COALESCE(u.name, $name),
        u.password = $password,
        u.credits = COALESCE(u.credits, $credits),
        u.createdAt = COALESCE(u.createdAt, datetime()),
        u.updatedAt = datetime()
      RETURN u`,
        { email, name, password, credits }
      );
      const userNode = result.records[0].get('u');
      const creditsValue = userNode.properties.credits;
      const createdAt = userNode.properties.createdAt;
      const updatedAt = userNode.properties.updatedAt;

      return {
        id: userNode.properties.id,
        email: userNode.properties.email,
        name: userNode.properties.name,
        credits: typeof creditsValue === 'object' ? neo4j.int(creditsValue).toInt() : (creditsValue || 10),
        createdAt: createdAt ? new Date(createdAt.toString()) : new Date(),
        updatedAt: updatedAt ? new Date(updatedAt.toString()) : new Date(),
      };
    } finally {
      await session.close();
    }
  }

  async verifyPassword(email: string, password: string) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        'MATCH (u:User {email: $email, password: $password}) RETURN u',
        { email, password }
      );
      if (result.records.length === 0) return null;

      const userNode = result.records[0].get('u');
      return {
        id: userNode.properties.id,
        email: userNode.properties.email,
        name: userNode.properties.name,
        credits: neo4j.int(userNode.properties.credits).toInt(),
        createdAt: new Date(userNode.properties.createdAt.toString()),
        updatedAt: new Date(userNode.properties.updatedAt.toString()),
      };
    } finally {
      await session.close();
    }
  }

  async createUser(email: string, name: string = 'user', credits: number = 10) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `CREATE (u:User {
          id: randomUUID(),
          email: $email,
          name: $name,
          credits: $credits,
          createdAt: datetime(),
          updatedAt: datetime()
        })
        RETURN u`,
        { email, name, credits }
      );
      const userNode = result.records[0].get('u');
      return {
        id: userNode.properties.id,
        email: userNode.properties.email,
        name: userNode.properties.name,
        credits: neo4j.int(userNode.properties.credits).toInt(),
        createdAt: new Date(userNode.properties.createdAt.toString()),
        updatedAt: new Date(userNode.properties.updatedAt.toString()),
      };
    } finally {
      await session.close();
    }
  }

  async findUserByEmail(email: string) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        'MATCH (u:User {email: $email}) RETURN u',
        { email }
      );
      if (result.records.length === 0) return null;

      const userNode = result.records[0].get('u');
      return {
        id: userNode.properties.id,
        email: userNode.properties.email,
        name: userNode.properties.name,
        credits: neo4j.int(userNode.properties.credits).toInt(),
        createdAt: new Date(userNode.properties.createdAt.toString()),
        updatedAt: new Date(userNode.properties.updatedAt.toString()),
      };
    } finally {
      await session.close();
    }
  }

  async findUserById(userId: string) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        'MATCH (u:User {id: $userId}) RETURN u',
        { userId }
      );
      if (result.records.length === 0) return null;

      const userNode = result.records[0].get('u');
      return {
        id: userNode.properties.id,
        email: userNode.properties.email,
        name: userNode.properties.name,
        credits: neo4j.int(userNode.properties.credits).toInt(),
        createdAt: new Date(userNode.properties.createdAt.toString()),
        updatedAt: new Date(userNode.properties.updatedAt.toString()),
      };
    } finally {
      await session.close();
    }
  }

  // OAUTH

  async createOrUpdateUserOAuth(
    userId: string,
    token: string,
    refreshToken: string,
    expiry: string,
    scopes: string[]
  ) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId})
        MERGE (u)-[r:HAS_OAUTH]->(o:UserOAuth)
        ON CREATE SET
          o.id = randomUUID(),
          o.token = $token,
          o.refresh_token = $refreshToken,
          o.expiry = $expiry,
          o.scopes = $scopes,
          o.userId = $userId
        ON MATCH SET
          o.token = $token,
          o.refresh_token = $refreshToken,
          o.expiry = $expiry,
          o.scopes = $scopes
        RETURN o`,
        { userId: userId, token, refreshToken, expiry, scopes }
      );
      const oauthNode = result.records[0].get('o');
      return {
        id: oauthNode.properties.id,
        userId: oauthNode.properties.userId,
        token: oauthNode.properties.token,
        refresh_token: oauthNode.properties.refresh_token,
        expiry: oauthNode.properties.expiry,
        scopes: oauthNode.properties.scopes,
      };
    } finally {
      await session.close();
    }
  }

  async getUserOAuth(userId: string) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId})
        RETURN u`,
        {
          userId: userId
        }
      );
      if (result.records.length === 0) return null;

      const oauthNode = result.records[0].get('u');
      return {
        id: oauthNode.properties.id,
        userId: oauthNode.properties.userId,
        token: oauthNode.properties.token,
        refresh_token: oauthNode.properties.refresh_token,
        expiry: oauthNode.properties.expiry,
        scopes: oauthNode.properties.scopes,
      };
    } finally {
      await session.close();
    }
  }

  // ============================================
  // MESSAGE OPERATIONS
  // ============================================

  async createMessage(userId: string, role: string, content: string) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId})
        CREATE (m:Message {
          id: randomUUID(),
          role: $role,
          content: $content,
          createdAt: datetime(),
          userId: $userId
        })
        CREATE (u)-[:SENT_MESSAGE]->(m)
        RETURN m`,
        { userId: userId, role, content }
      );
      const msgNode = result.records[0].get('m');
      return {
        id: msgNode.properties.id,
        userId: msgNode.properties.userId,
        role: msgNode.properties.role,
        content: msgNode.properties.content,
        createdAt: new Date(msgNode.properties.createdAt.toString()),
      };
    } finally {
      await session.close();
    }
  }

  async getUserMessages(userId: string, page: number, perPage: number = 20) {
    const session = this.driver.session();
    try {
      const skip = (page - 1) * perPage;
      const result = await session.run(
        `MATCH (u:User {id: $userId})-[:SENT_MESSAGE]->(m:Message)
        RETURN m
        ORDER BY m.createdAt DESC
        SKIP $skip
        LIMIT $limit`,
        {
          userId: userId,
          skip: neo4j.int(skip),
          limit: neo4j.int(perPage)
        }
      );
      return result.records.map(record => {
        const msgNode = record.get('m');
        return {
          id: msgNode.properties.id,
          userId: msgNode.properties.userId,
          role: msgNode.properties.role,
          content: msgNode.properties.content,
          createdAt: new Date(msgNode.properties.createdAt.toString()),
          analysis: msgNode.properties.analysis ? JSON.parse(msgNode.properties.analysis) : null,
        };
      }).reverse();
    } finally {
      await session.close();
    }
  }

  // EMAIL HISTORY OPERATIONS

  async createEmailHistory(
    userId: string,
    receiverEmail: string,
    receiverName: string,
    emailType: string,
    status: string = 'sent'
  ) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId})
        CREATE (e:EmailHistory {
          id: randomUUID(),
          userId: $userId,
          receiverEmail: $receiverEmail,
          receiverName: $receiverName,
          emailType: $emailType,
          status: $status,
          sentAt: datetime()
        })
        CREATE (u)-[:SENT_EMAIL]->(e)
        RETURN e`,
        { userId: userId, receiverEmail, receiverName, emailType, status }
      );
      const emailNode = result.records[0].get('e');
      return {
        id: emailNode.properties.id,
        userId: emailNode.properties.userId,
        receiverEmail: emailNode.properties.receiverEmail,
        receiverName: emailNode.properties.receiverName,
        emailType: emailNode.properties.emailType,
        status: emailNode.properties.status,
        sentAt: new Date(emailNode.properties.sentAt.toString()),
      };
    } finally {
      await session.close();
    }
  }

  async getUserEmailHistory(userId: string, limit: number = 50) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId})-[:SENT_EMAIL]->(e:EmailHistory)
        RETURN e
        ORDER BY e.sentAt DESC
        LIMIT $limit`,
        { userId: userId, limit: neo4j.int(limit) }
      );

      return result.records.map(record => {
        const emailNode = record.get('e');
        return {
          id: emailNode.properties.id,
          userId: emailNode.properties.userId,
          receiverEmail: emailNode.properties.receiverEmail,
          receiverName: emailNode.properties.receiverName,
          emailType: emailNode.properties.emailType,
          status: emailNode.properties.status,
          sentAt: new Date(emailNode.properties.sentAt.toString()),
        };
      });
    } finally {
      await session.close();
    }
  }

  async storeOTP({
    email,
    otp,
    expiresAt
  }: {
    email: string;
    otp: string;
    expiresAt: Date;
  }) {
    const session = this.driver.session();
    try {
      await session.run(
        `
      MERGE (u:User {email: $email})
      ON CREATE SET
        u.id = randomUUID(),
        u.credits = 10,
        u.createdAt = datetime()
      SET u.otp = $otp,
          u.otpExpiresAt = datetime($expiresAt)
      `,
        {
          email,
          otp,
          expiresAt: expiresAt.toISOString()
        }
      );
    } finally {
      await session.close();
    }
  }

  async verifyOTP({
    email,
    otp
  }: {
    email: string;
    otp: string;
  }) {
    const session = this.driver.session();

    try {
      const result = await session.run(
        `
      MATCH (u:User {email: $email})
      WHERE u.otp = $otp
        AND u.otpExpiresAt > datetime()
      WITH u
      REMOVE u.otp, u.otpExpiresAt
      RETURN u
      `,
        { email, otp }
      );

      if (result.records.length === 0) {
        return null;
      }

      return result.records[0].get('u').properties;
    } finally {
      await session.close();
    }
  }



  // USER PROFILE DATA WITH EMAIL HISTORY

  async getUserProfileData(email: string) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (u:User {email: $email})
        OPTIONAL MATCH (u)-[:SENT_EMAIL]->(e:EmailHistory)
        RETURN u, collect(e) as emailHistory
        LIMIT 1`,
        { email }
      );

      if (result.records.length === 0) return null;

      const record = result.records[0];
      const userNode = record.get('u');
      const emailHistoryNodes = record.get('emailHistory');

      return {
        name: userNode.properties.name || 'User',
        userId: userNode.properties.id,
        email: userNode.properties.email,
        credits: neo4j.int(userNode.properties.credits).toInt(),
        emailHistory: emailHistoryNodes
          .filter((e: any) => e.properties)
          .slice(0, 50)
          .map((e: any) => ({
            id: e.properties.id,
            receiverEmail: e.properties.receiverEmail,
            receiverName: e.properties.receiverName,
            emailType: e.properties.emailType,
            status: e.properties.status,
            sentAt: new Date(e.properties.sentAt.toString()),
          }))
          .sort((a: any, b: any) => b.sentAt.getTime() - a.sentAt.getTime()),
      };
    } finally {
      await session.close();
    }
  }
}

// Export singleton instance
export const db = new Neo4jDatabase();
export default db;