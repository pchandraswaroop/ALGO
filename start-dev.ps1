Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

Write-Host 'Checking Docker availability...'
docker version | Out-Null

Write-Host 'Building judge sandbox images...'
Push-Location (Join-Path $projectRoot 'backend')
try {
    .\docker\build.ps1
}
finally {
    Pop-Location
}

Write-Host 'Starting full stack with Docker Compose...'
docker compose up --build