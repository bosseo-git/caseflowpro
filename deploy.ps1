# Deploy script for Vercel project
Write-Host "Starting deployment for caseflowpro..."

# First, make sure all changes are committed
$status = git status --porcelain
if ($status) {
    Write-Host "You have uncommitted changes:"
    Write-Host $status
    $continue = Read-Host "Do you want to continue anyway? (y/n)"
    if ($continue -ne "y") {
        Write-Host "Deployment aborted."
        exit
    }
}

# Push to GitHub
Write-Host "Pushing latest changes to GitHub..."
try {
    git push
    Write-Host "Successfully pushed to GitHub."
} 
catch {
    Write-Host "Failed to push to GitHub: $_"
    $continue = Read-Host "Do you want to continue with manual deployment? (y/n)"
    if ($continue -ne "y") {
        Write-Host "Deployment aborted."
        exit
    }
}

# Manually trigger Vercel deployment
Write-Host "Triggering manual Vercel deployment..."
try {
    # Use Vercel CLI for direct deployment
    vercel --prod
    Write-Host "Deployment triggered successfully!"
    Write-Host "Visit the Vercel dashboard to see deployment progress: https://vercel.com/bosseogits-projects/caseflowpro"
} 
catch {
    Write-Host "Failed to trigger deployment with Vercel CLI: $_"
    Write-Host "Please check your Vercel CLI installation or create a deploy hook in the Vercel dashboard."
    Write-Host "You can trigger a deployment with: Invoke-RestMethod -Method POST -Uri your-deploy-hook-url"
}

Write-Host "Deployment process completed." 