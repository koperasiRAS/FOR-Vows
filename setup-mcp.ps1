$ClaudeDir = "$env:APPDATA\Claude"
if (-not (Test-Path -Path $ClaudeDir)) {
    New-Item -ItemType Directory -Force -Path $ClaudeDir | Out-Null
    Write-Host "Created directory: $ClaudeDir"
}

$ConfigFile = "$ClaudeDir\claude_desktop_config.json"

$ConfigBody = @{}
if (Test-Path -Path $ConfigFile) {
    try {
        $ConfigBody = Get-Content -Raw -Path $ConfigFile | ConvertFrom-Json -AsHashtable
    } catch {
        Write-Host "Warning: Existing config was invalid, overriding."
    }
}

if (-not $ConfigBody.ContainsKey("mcpServers")) {
    $ConfigBody["mcpServers"] = @{}
}

# 1. Menambahkan MCP Filesystem untuk membaca file project FOR Vows.co
$ConfigBody["mcpServers"]["filesystem"] = @{
    command = "npx"
    args = @("-y", "@modelcontextprotocol/server-filesystem", "c:\Users\ACER\Downloads\FOR Vows.co")
}

# 2. Menambahkan MCP PostgreSQL jika ingin terhubung ke local database (default supabase local)
# (komentar bagian ini jika tidak diperlukan)
$ConfigBody["mcpServers"]["supabase-local"] = @{
    command = "npx"
    args = @("-y", "@modelcontextprotocol/server-postgres", "postgresql://postgres:postgres@127.0.0.1:54322/postgres")
}

$JsonStr = ConvertTo-Json -InputObject $ConfigBody -Depth 10

Set-Content -Path $ConfigFile -Value $JsonStr
Write-Host "MCP Configuration successfully saved to $ConfigFile!"
Write-Host "Please restart Claude Desktop to apply the new MCP Servers!"
