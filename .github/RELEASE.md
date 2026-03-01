# 发版与 GitHub Releases

## 一、推代码会自动打包吗？

**不会。** 普通 `git push` 只跑 CI（检查、测试），不会打包或发 Release。

要**自动打包并上传到 Releases**，需要**推送带版本号的 tag**（见下方「自动发布」）。

---

## 二、自动发布（推荐）

1. 在 `package.json` 里把 `version` 改成新版本（如 `1.0.3`），保存并提交。
2. 打 tag 并推送：
   ```bash
   git tag v1.0.3
   git push origin v1.0.3
   ```
3. 打开仓库 **Actions** 页，会看到 `Release` 工作流在跑。
4. 跑完后到 **Releases** 页，对应 tag 下会有安装包和 `latest.yml`，由 electron-builder 自动上传。

之后用户打开已安装的应用，就会按你配置的 `publish` 从该 Release 检查更新。

---

## 三、手动上传安装包和 latest.yml

不打算用 tag 自动发版时，可以本地打包后手动上传：

1. **本地打包**
   ```bash
   npm run build
   ```
   产物在项目根目录下的 **`output/`** 里（如 `SimpleClock 1.0.2.exe`、`latest.yml` 等）。

2. **在 GitHub 创建 Release**
   - 打开仓库 → **Releases** → **Create a new release**。
   - **Choose a tag**：输入新版本号并创建 tag（如 `v1.0.2`），或选已有 tag。
   - **Release title** 可填同一版本号（如 `v1.0.2`）。
   - 在 **Attach binaries** 里把 `output/` 下的 **安装包（.exe）和 `latest.yml`** 一起拖进去（两者都要，且版本要对应）。
   - 点 **Publish release**。

3. **注意**
   - `latest.yml` 里写的是当前 Release 的版本和文件名，electron-updater 靠它判断是否有新版本，**必须和安装包一起上传**。
   - 若使用自动发布，这些文件会由 CI 在打 tag 后自动生成并上传，无需手动拖。
