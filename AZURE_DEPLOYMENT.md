# ResumePro - Azure Deployment Overview

## Overview
This document outlines how we deployed **ResumePro** to Microsoft Azure, leveraging various Azure services for scalability, security, and automated CI/CD.

### Azure Services Used:
- **Azure Resource Group**: Centralized management for all resources.
- **Azure SQL Server & Database**: Storing user and resume data.
- **Azure Key Vault**: Securely storing secrets and credentials.
- **Azure App Service**: Hosting the web application.
- **GitHub Actions (CI/CD)**: Automating deployment.
- **Application Insights**: Monitoring application performance.

---

## Resource Group Creation
Using the **Azure Portal**, we created a **Resource Group** named `ResumePro_Group` in the Canada Central region. This serves as a container for all related resources.

## Database Configuration
To store our application data, we set up an **Azure SQL Server** and an **Azure SQL Database** through the **Azure Portal**:

### Steps Taken:
1. Navigated to **Azure Portal > SQL Server > Create**.
2. Named the server **resume-pro-db-server** and assigned an admin user.
3. Created a new **SQL Database** called `ResumeProDB` under this server.
4. Configured firewall rules to allow access from Azure services.

## Key Vault for Secret Management
To securely store secrets such as our **database connection string** and **OPENAI Api Key**, we set up an **Azure Key Vault**:

### Steps Taken:
1. Navigated to **Azure Portal > Key Vaults > Create**.
2. Named the vault **ResumePro-KeyVault** and linked it to `ResumePro_Group`.
3. Added two **secrets**: **database connection string** and **OPENAI Api Key**.
4. Configured access policies to allow the **App Service** to retrieve secrets.

## Web Application Deployment
We chose **Azure App Service** to host the web application, deploying it via GitHub Actions.

### Steps Taken:
1. Navigated to **Azure Portal > App Services > Create**.
2. Chose a **.NET runtime** and selected a **Basic B1 Linux Plan**.
3. Named the app **ResumePro**.
4. Configured application settings to retrieve the database connection string and api key from Key Vault.

## Monitoring with Application Insights
To track application performance, we enabled **Application Insights**:

## Automating Deployment with GitHub Actions
To streamline deployment, we configured **GitHub Actions** for automatic deployment upon each push to the `main` branch.

### Steps Taken:
1. Created a **Service Principal** in Azure Portal with Contributor access to `ResumePro_Group`.
2. Stored the service principal credentials as a **GitHub Secret (`AZURE_CREDENTIALS`)**.
3. Configured a **GitHub Actions workflow** to build and deploy the application to **Azure App Service**.

### GitHub Actions Workflow
We added the following `.github/workflows/deploy.yml` file:
```yaml
name: Build and deploy ASP.Net Core app to Azure Web App - ResumeProProject
 
on:
  push:
    branches:
      - main
  workflow_dispatch:
 
jobs:
  build:
    runs-on: windows-latest
    permissions:
      contents: read
 
    steps:
      - uses: actions/checkout@v4
 
      - name: Set environment to production
        run: echo "NODE_ENV=production" >> $GITHUB_ENV

      - name: Set environment variable for ASP.NET Core
        run: echo "ASPNETCORE_ENVIRONMENT=Production" >> $GITHUB_ENV
        
      - name: Set API Key for Production
        run: echo "OPENAI_API_KEY_PROD=${{ secrets.OPENAI_API_KEY_PROD }}" >> $GITHUB_ENV
        
      - name: Set up .NET Core
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.x'
 
      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
 
      - name: Install dependencies
        run: npm install --legacy-peer-deps
        working-directory: ./ResumeProProject/resumeproproject.client
 
      - name: Build frontend
        run: npm run build -- --config ./vite.config.js
        working-directory: ./ResumeProProject/resumeproproject.client
 
      - name: Build backend
        run: dotnet publish -c Release -o ${{ github.workspace }}/publish
        working-directory: ./ResumeProProject/resumeproproject.server
 
      - name: Verify published files
        run: dir ${{ github.workspace }}/publish
 
      - name: Upload artifact for deployment job
        uses: actions/upload-artifact@v4
        with:
          name: dotnet-app
          path: ${{ github.workspace }}/publish
          retention-days: 1
 
  deploy:
    runs-on: windows-latest
    needs: build
    environment:
      name: 'Production'
    permissions:
      id-token: write
      contents: read
 
    steps:
      - name: Download artifact from build job
        uses: actions/download-artifact@v4
        with:
          name: dotnet-app
          path: ${{ github.workspace }}/dotnet-app
 
      - name: Verify downloaded files
        run: dir ${{ github.workspace }}/dotnet-app
 
      - name: Login to Azure
        uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZUREAPPSERVICE_CLIENTID }}
          tenant-id: ${{ secrets.AZUREAPPSERVICE_TENANTID }}
          subscription-id: ${{ secrets.AZUREAPPSERVICE_SUBSCRIPTIONID }}
 
      - name: Deploy to Azure Web App
        id: deploy-to-webapp
        uses: azure/webapps-deploy@v3
        with:
          app-name: 'ResumePro'
          slot-name: 'Production'
          package: ${{ github.workspace }}/dotnet-app
```

## Deployment and Monitoring
Once changes are pushed to the `main` branch, GitHub Actions automatically builds and deploys the application to Azure.
- **Application Logs and Performance Metrics**: Monitored via **Application Insights**.
- **Deployment Logs**: Available in **GitHub Actions**.

---

## Summary
We successfully deployed **ResumePro** to Azure using the **Azure Portal** for resource creation and **GitHub Actions** for automated deployments. The application now runs on **Azure App Service**, with **Key Vault securing credentials** and **Application Insights providing monitoring**.

**Deployment Complete!** 🎉
