const fs = require("fs").promises;
const path = require("path");
const bcryptjs = require("bcryptjs");
const { v4: uuid } = require("uuid");

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

    res.status(200).json({ message: "Giriş başarılı!", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const refreshToken = (req, res, next) => {};

module.exports = {
  register,
  login,
  refreshToken,
};
