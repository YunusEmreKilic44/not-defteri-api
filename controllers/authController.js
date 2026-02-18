const fs = require("fs").promises;
const path = require("path");
const bcryptjs = require("bcryptjs");
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const {
  secret,
  expiresIn,
  accessToken,
  accessToken: token,
  refreshToken: refreshTok,
} = require("../config/jwtConfig");
const refreshTokenController = require("./refreshTokenController");

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Tüm alanlar zorunludur!" });
  }

  try {
    const usersFilePath = path.join(__dirname, "..", "models", "users.json");

    const data = await fs.readFile(usersFilePath, "utf-8");
    const users = JSON.parse(data);

    const findUser = users.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() ||
        user.username.toLowerCase() === username.toLowerCase(),
    );

    if (findUser) {
      return res
        .status(400)
        .json({ message: "Bu email veya username zaten kayıtlı!" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = {
      id: uuid(),
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    };

    users.push(newUser);

    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email ve password zorunlu!" });
  }

  try {
    const usersFilePath = path.join(__dirname, "..", "models", "users.json");
    const data = await fs.readFile(usersFilePath, "utf-8");
    const users = JSON.parse(data);

    const findUser = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );

    if (!findUser) {
      return res.status(401).json({ message: "Geçersiz email veya şifre" });
    }

    const validPassword = await bcryptjs.compare(password, findUser.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Geçersiz email veya şifre" });
    }

    const { password: _, ...user } = findUser;

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      token.secret,
      {
        expiresIn: token.expiresIn,
      },
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      refreshTok.secret,
      {
        expiresIn: refreshTok.expiresIn,
      },
    );

    await refreshTokenController.saveToken(user.id, refreshToken);

    res
      .status(200)
      .json({ message: "Giriş başarılı!", user, accessToken, refreshToken });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const refresh = async (req, res, next) => {
  try {
    const oldRefreshToken = req.body.refreshToken;

    if (!oldRefreshToken) {
      return res.status(403).json({ message: "Refresh token gerekli!" });
    }

    const decoded = jwt.verify(oldRefreshToken, refreshTok.secret);

    await refreshTokenController.removeToken(oldRefreshToken);

    const newAccessToken = jwt.sign({ id: decoded.id }, token.secret, {
      expiresIn: token.expiresIn,
    });

    const newRefreshToken = jwt.sign({ id: decoded.id }, refreshTok.secret, {
      expiresIn: refreshTok.expiresIn,
    });

    await refreshTokenController.saveToken(decoded.id, newRefreshToken);

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  refresh,
};
