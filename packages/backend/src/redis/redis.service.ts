import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  private client: RedisClientType;
  private readonly logger = new Logger(RedisService.name);

  constructor(private configService: ConfigService) {
    this.initializeRedis();
  }

  /**
   * Initialize Redis client
   */
  private async initializeRedis() {
    const host = this.configService.get('redis.host');
    const port = this.configService.get('redis.port');
    const password = this.configService.get('redis.password');

    this.client = createClient({
      host,
      port,
      password,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
      },
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis error:', err);
    });

    this.client.on('connect', () => {
      this.logger.log('Redis connected');
    });

    await this.client.connect();
  }

  /**
   * Get value
   */
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  /**
   * Get JSON value
   */
  async getJSON(key: string): Promise<any> {
    const value = await this.get(key);
    return value ? JSON.parse(value) : null;
  }

  /**
   * Set value
   */
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setEx(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  /**
   * Set JSON value
   */
  async setJSON(key: string, value: any, ttl?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttl);
  }

  /**
   * Delete key
   */
  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  /**
   * Add to set
   */
  async addToSet(key: string, value: string): Promise<void> {
    await this.client.sAdd(key, value);
  }

  /**
   * Get set members
   */
  async getSet(key: string): Promise<string[]> {
    return this.client.sMembers(key);
  }

  /**
   * Check if member in set
   */
  async isMemberOfSet(key: string, value: string): Promise<boolean> {
    return this.client.sIsMember(key, value);
  }

  /**
   * Push to list
   */
  async pushToList(key: string, value: string): Promise<void> {
    await this.client.rPush(key, value);
  }

  /**
   * Get list range
   */
  async getListRange(key: string, start: number, stop: number): Promise<string[]> {
    return this.client.lRange(key, start, stop);
  }

  /**
   * Increment counter
   */
  async increment(key: string, amount: number = 1): Promise<number> {
    return this.client.incrBy(key, amount);
  }

  /**
   * Flush all (use with caution)
   */
  async flushAll(): Promise<void> {
    await this.client.flushDb();
  }
}
