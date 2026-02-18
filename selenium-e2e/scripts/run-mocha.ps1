# 1) create timestamped run dir
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Root = Resolve-Path (Join-Path $ScriptDir "..")
Set-Location $Root

$Artifacts = Join-Path $Root ".artifacts"
if (!(Test-Path $Artifacts)) { New-Item -ItemType Directory -Path $Artifacts | Out-Null }

$Stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$RunDir = Join-Path $Artifacts ("runs\" + $Stamp)
New-Item -ItemType Directory -Path $RunDir | Out-Null
$env:RUN_DIR = $RunDir

# 2) run mocha -> mochawesome JSONs (NO html, NO merge here)
npx mocha --reporter mochawesome `
  --reporter-option reportDir=$RunDir `
  --reporter-option reportFilename=mocha `
  --reporter-option overwrite=false `
  --reporter-option html=false `
  --reporter-option json=true `
  --reporter-option quiet=true `
  --timeout 60000 "tests/**/*.spec.js"

Write-Host "Specs written to $RunDir"
