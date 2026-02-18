const fs = require("fs/promises");
const path = require("path");

class RefreshToken {
  constructor() {
    this.filePath = path.join(__dirname, "..", "models", "refreshTokens.json");
    this.initializeTokenFile();
  }

  async initializeTokenFile() {
    try {
      await fs.access(this.filePath);
    } catch (error) {
      await fs.writeFile(this.filePath, JSON.stringify([], null, 2));
    }
  }

  async saveToken(userId, token) {
    const tokens = await this.getAllTokens();

    // Remove existing tokens for this user
    const filteredTokens = tokens.filter((t) => t.userId !== userId);
    filteredTokens.push({ userId, token, createdAt: new Date().toISOString() });
    await fs.writeFile(this.filePath, JSON.stringify(filteredTokens, null, 2));
  }

  async removeToken(token) {
    const tokens = await this.getAllTokens();
    const filteredTokens = tokens.filter((t) => t.token !== token);
    await fs.writeFile(this.filePath, JSON.stringify(filteredTokens, null, 2));
  }

  async findToken(token) {
    const tokens = await this.getAllTokens();
    return tokens.find((t) => t.token === token);
  }

  async getAllTokens() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }
}

module.exports = new RefreshToken();
