read -p "Enter a resource group name that is used for generating resource names:" resourceGroupName &&
read -p "Enter the location (like 'eastus' or 'northeurope'):" location &&
templateFile="./template.json" &&
az group create --name $resourceGroupName --location "$location" &&
az deployment group create --resource-group $resourceGroupName --template-file  $templateFile --parameter appName="SpotifyRefreshPlaylist" &&
echo "Press [ENTER] to continue ..." &&
read