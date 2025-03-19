import { ClickHouseClient, createClient } from '@clickhouse/client';
import { CommonAccessToken, ITokenLogger } from '@eyevinn/cat';

export class ClickHouseLogger implements ITokenLogger {
  private dbClient: ClickHouseClient;
  private tableExists = false;

  constructor(url: URL) {
    this.dbClient = createClient({
      url: url.toString()
    });
  }

  private async createTableIfNotExists() {
    if (this.tableExists) {
      return;
    }
    try {
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS cat_tokens (
          cti String,
          timestamp DateTime,
          iat DateTime,
          exp DateTime,
          sub String
        )
        ENGINE = MergeTree()
        PARTITION BY toYYYYMM(timestamp)
        ORDER BY (cti, timestamp)
      `;
      await this.dbClient.query({
        query: createTableQuery
      });
      console.log('Table cat_tokens created');
      this.tableExists = true;
    } catch (err) {
      console.log(`Failed to create table: ${err}`);
    }
  }

  async logToken(token: CommonAccessToken): Promise<void> {
    await this.createTableIfNotExists();
    const data = [
      {
        cti: token.cti,
        timestamp: Date.now(),
        iat: token.claims.iat,
        exp: token.claims.exp,
        sub: token.claims.sub
      }
    ];
    await this.dbClient.insert({
      table: 'cat_tokens',
      values: data,
      format: 'JSONEachRow'
    });
  }
}
