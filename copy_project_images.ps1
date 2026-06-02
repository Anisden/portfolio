# Script de copie avec chemins UTF-8 directs
$uploadDir = "e:\CV Anis BOUDEN\Site CV portfolio\portfolio-app\public\uploads"

function CopyFile([string]$src, [string]$name) {
    $ts = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
    Start-Sleep -Milliseconds 3
    if (Test-Path -LiteralPath $src) {
        $dest = Join-Path $uploadDir "${ts}_${name}"
        Copy-Item -LiteralPath $src -Destination $dest -Force
        Write-Host "  OK: $name -> $ts" -ForegroundColor Green
        return "/uploads/${ts}_${name}"
    } else {
        Write-Host "  MANQUANT: $src" -ForegroundColor Red
        return ""
    }
}

$results = [ordered]@{}

# ---- 684 - Centre communautaire VAL - Salle multi ----
Write-Host "=== Projet 684 (salle multi) ===" -ForegroundColor Cyan
$base684sm = "D:\Projets Anis LDA\Projets 2023\LDA-2023-684 VAL Construction d'un nouveau centre communautaire\04-Dossier de Travail\01-Modélisation\03-Rendus\20240920 Salle multi"

$f684v3 = Join-Path $base684sm "Proposition1 (Concept).jpg"
$f684v4 = Join-Path $base684sm "Proposition2 Plafond pâle.jpg"
$f684v5 = Join-Path $base684sm "Proposition2 Plafond pâle lattage visible.jpg"
$f684v6 = Join-Path $base684sm "Proposition3 poutre, plafond et plancher pâles.jpg"

$results["684_v3"] = CopyFile $f684v3 "684_v3.jpg"
$results["684_v4"] = CopyFile $f684v4 "684_v4.jpg"
$results["684_v5"] = CopyFile $f684v5 "684_v5.jpg"
$results["684_v6"] = CopyFile $f684v6 "684_v6.jpg"

# ---- 689 - Aréna de Lévis ----
Write-Host "=== Projet 689 (façades) ===" -ForegroundColor Cyan
$base689 = "D:\Projets Anis LDA\Projets 2023\LDA-2023-689 VL Mise à jour du PFT ajout d'une glace à l'aréna de Lévis\04-Dossier de Travail\01-Modélisation\03-Rendus"

$f689main = Join-Path $base689 "Vue façade principale.jpg"
$f689v5   = Join-Path $base689 "Vue façade Est.jpg"
$f689v6   = Join-Path $base689 "Vue façade Ouest.jpg"

$results["689_main"] = CopyFile $f689main "689_main.jpg"
$results["689_v5"]   = CopyFile $f689v5 "689_v5.jpg"
$results["689_v6"]   = CopyFile $f689v6 "689_v6.jpg"

# ---- 661 - Chalet Maréchal-Joffre - Lumion ----
Write-Host "=== Projet 661 (Lumion) ===" -ForegroundColor Cyan
$base661lum = "D:\Projets Anis LDA\Projets 2022\LD-2022-661 VL Reconstruction du chalet du parc Maréchal-Joffre\04-Dossier de Travail\01-Modélisation\04-Lumion\Rendu 15-11-2022"

$f661main = Join-Path $base661lum "Arrivée1_Modifiée.jpg"
$f661v2   = Join-Path $base661lum "Vue générale.jpg"

$results["661_main"] = CopyFile $f661main "661_main.jpg"
$results["661_v2"]   = CopyFile $f661v2 "661_v2.jpg"

# ---- 661 - Chalet Maréchal-Joffre - SketchUp rendus ----
$base661rnd = "D:\Projets Anis LDA\Projets 2022\LD-2022-661 VL Reconstruction du chalet du parc Maréchal-Joffre\04-Dossier de Travail\01-Modélisation\03-Rendus\27-10-2022"

$f661v6 = Join-Path $base661rnd "Chalet Maréchal-Joffre_1.png"
$f661v7 = Join-Path $base661rnd "Chalet Maréchal-Joffre_2.png"

$results["661_v6"] = CopyFile $f661v6 "661_v6.png"
$results["661_v7"] = CopyFile $f661v7 "661_v7.png"

# ---- 629A - Piscine Sainte-Geneviève ----
Write-Host "=== Projet 629A ===" -ForegroundColor Cyan
$base629A = "D:\Projets Anis LDA\Projets 2021\LD-2021-629A VQ  Réfection de la piscine Sainte-Geneviève\04-Dossier de Travail\01-Modélisation\03-Rendus"

$f629Am  = Join-Path $base629A "Ste-Geneviève rendu 2.png"
$f629Av2 = Join-Path $base629A "Ste-Geneviève rendu 3.png"
$f629Av3 = Join-Path $base629A "Ste-Geneviève rendu 4.png"
$f629Av4 = Join-Path $base629A "Ste-Geneviève rendu 5.png"
$f629Av5 = Join-Path $base629A "Ste-Geneviève rendu 10.png"
$f629Av6 = Join-Path $base629A "Ste-Geneviève rendu 11.png"
$f629Av7 = Join-Path $base629A "Ste-Geneviève Bleu+douches.png"

$results["629A_main"] = CopyFile $f629Am "629A_main.png"
$results["629A_v2"]   = CopyFile $f629Av2 "629A_v2.png"
$results["629A_v3"]   = CopyFile $f629Av3 "629A_v3.png"
$results["629A_v4"]   = CopyFile $f629Av4 "629A_v4.png"
$results["629A_v5"]   = CopyFile $f629Av5 "629A_v5.png"
$results["629A_v6"]   = CopyFile $f629Av6 "629A_v6.png"
$results["629A_v7"]   = CopyFile $f629Av7 "629A_v7.png"

# Output results
Write-Host "`n=== RESULTATS FINAUX ===" -ForegroundColor Yellow
$results.GetEnumerator() | ForEach-Object {
    Write-Host "$($_.Key) = $($_.Value)"
}
