# Script Name: Uninstall-Agents.ps1
# Description: Uninstall agents from GptList.json
# Author: Hui Miao
# Date: 2024

# White list of agent names to skip uninstalling.
$whiteList = @(
   "AgentName1"
)

# Function to read and parse JSON file
function Read-GptList {
    param(
        [string]$jsonPath = ".\GptList.json"
    )
    
    try {
        $jsonContent = Get-Content $jsonPath -Raw | ConvertFrom-Json
        return $jsonContent
    } catch {
        Write-Error "Error reading JSON file: $_"
        exit 1
    }
}

# Function to execute uninstall commands
function Execute-UninstallCommands {
    param(
        $gptList
    )

    $totalAgents = $gptList.gptList

    Write-Host "Total agents: $($totalAgents.Count)" -ForegroundColor Green

    $totalItems = $totalAgents.Count
    $current = 0
    
    foreach ($item in $totalAgents) {
        # Skip if isOwner isn't true, or acquisitionContext isn't User
        if ($item.isOwner -ne $true -or $item.acquisitionContext -ne "User") {
            continue
        }

        # Skip if agent name is in the white list
        if ($whiteList -contains $item.name) {
            continue
        }

        if ($item.gptIdentifier && $item.gptIdentifier.metaOSSharedServicesTitleId) {
            $current++
            $titleId = $item.gptIdentifier.metaOSGlobalIdentifier.metaOSSharedServicesTitleId
            $agentName = $item.name
            Write-Host "[$current/$totalItems] Uninstalling agent: $agentName" -ForegroundColor Yellow
            
            try {
                # Execute the command and capture any errors
                $command = "teamsapp uninstall -i false --mode title-id --title-id $titleId"
                Write-Host "Executing: $command" -ForegroundColor Cyan
                Invoke-Expression $command
                Write-Host "Successfully uninstalled agent: $agentName" -ForegroundColor Green
            } catch {
                Write-Host "Failed to uninstall title ID: $titleId" -ForegroundColor Red
                Write-Host "Error: $_" -ForegroundColor Red
                continue
            }
        }
    }
}

# Main script logic
try {
    # Read the JSON file
    $gptList = Read-GptList
    
    Write-Host "Starting uninstall agents..." -ForegroundColor Green
    
    # Execute the uninstall commands
    Execute-UninstallCommands $gptList
    
} catch {
    Write-Error "An error occurred: $_"
} finally {
    Write-Host "Script execution completed." -ForegroundColor Green
} 