---
# 🚓 FiveM SQL Discord Bot

A custom-built Discord bot designed to interact with your FiveM server database, execute utility commands, and manage in-game data through Discord.


## ✨ Features

- 🔄 Real-time presence updates.
- 💬 Custom `/say`, `/ping`, and `/server` commands.
- 💸 Player money transactions using `/pay`.
- 📜 View and manage database entries via `/showdb` and `/getuser`.
- 🖼️ Avatar animation and nickname setting.
- 🧠 Interaction-based command handling.

## ⚙️ Setup

1. **Clone the repository**:
   ```
   git clone https://github.com/yourusername/fivem-sql-discord-bot.git
   ```
   ```
   cd fivem-sql-discord-bot
   ```


2. **Install Dependencies**:

   ```
   npm install
   ```

3. **Configure your bot**:

   * Edit `config.json` with your bot token and database credentials.

4. **Deploy commands to Discord**:

   ```
   node deploy-commands.js
   ```

5. **Run the bot**:

   ```
   node index.js
   ```

## 🧾 Requirements

* Node.js v16+
* A Discord bot token
* A MySQL-compatible database connected to your FiveM server

## 📌 Notes

* Make sure the bot has appropriate permissions in your Discord server.
* You may need to whitelist bot IP for database access if it's hosted remotely.

---

**Made for FiveM roleplay servers to easily interact with in-game data through Discord!**

---

