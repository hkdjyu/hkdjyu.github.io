# A bash script to push to GitHub and deploy to GitHub Pages

# Color Setting
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'

# Ask user to type commit message in yellow color
echo -e "${YELLOW}Type your commit message?${NC}"
read commitMessage
# Check commitMessage is empty or not. If empty, keep asking.
while [ -z "$commitMessage" ]
do
  echo -e "${YELLOW}Commit message cannot be empty. Please type again. (press ctrl + c to exit))${NC}"
  read commitMessage
done
echo -e "${BLUE}Your commit message is: $commitMessage${NC}"

dir=$PWD
if [[ $dir == *"hkdjyu.github.io" ]]; 
  then 
    echo -e "${YELLOW}Your current directory: $dir${NC}"
  else 
    echo -e "${RED}Your current directory does not have \"hkdjyu.github.io\"${NC}"
    # Ask user to type Yes or No. If Yes, continue the bash program. If No, exit the bash program.
    while true; do
      read -p "${YELLOW}Do you want to continue? (Y/N)${NC}" yn
      case $yn in
        [Yy]* ) echo "${GREEN}Continue${NC}"; break;;
        [Nn]* ) echo "${RED}Exit${NC}"; exit;;
        * ) echo "${YELLOW}Please answer yes or no.${NC}";;
      esac
    done
fi

echo "${BLUE}Start Pushing to GitHub...${NC}"
git add .
git commit -m "$commitMessage"
git push origin main
echo "${BLUE}Pushed to GitHub...${NC}"

# Ask if user want to deploy to GitHub Pages
while true; do
  read -p "${YELLOW}Do you want to deploy to GitHub Pages? (Y/N)${NC}" yn
  case $yn in
    [Yy]* ) echo "${BLUE}Deploying to GitHub Pages${NC}"; break;;
    [Nn]* ) echo "${RED}Exit${NC}"; exit;;
    * ) echo "${YELLOW}Please answer yes or no.${NC}";;
  esac
done
npm run deploy
echo "${BLUE}Deployed to GitHub Pages...${NC}"