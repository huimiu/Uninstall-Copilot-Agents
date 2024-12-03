# Uninstall-Agents.ps1

This PowerShell script helps you uninstall Copilot Agents.

## Prerequisites

 - Teams Toolkit CLI: `npm install -g @microsoft/teamsapp-cli`

## Usage

1. Open [M365 Copilot](https://m365.cloud.microsoft/chat?auth=2) in Browser.
2. Press **F12** to open the Developer Tools.
3. Go to **Network** tab, filter with `GetGptList`, refresh the web page.
4. Find the request named `GetGptList?request=...`.
5. Click on the request, go to **Preview** tab, right click the response body, and select **Copy value**.
6. Paste the value into `GptList.json` file.
7. Navigate to the directory containing the **Uninstall-Agents.ps1** script.
8. Run the script:
   ```powershell
   .\Uninstall-Agents.ps1
   ```

Notes:
- You can add agent names to the `$whiteList` array to skip uninstalling them.
- This script will uninstall all agents owned by the current user except the ones in the white list.