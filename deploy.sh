# A bash script to push to GitHub and deploy to GitHub Pages

# REPONAME
REPO_NAME="hkdjyu.github.io"

# Color Setting
RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
NC='\033[0m' # No Color

# Ask user to type commit message in yellow color
echo -e "${YELLOW}Type your commit message?${NC}"
read commitMessage
# Check commitMessage is empty or not. If empty, keep asking.
while [ -z "$commitMessage" ]
do
  echo -e "${YELLOW}Commit message cannot be empty. Please type again. (press ctrl + c to exit))${NC}"
  read commitMessage
done
echo -e "${GREEN}Your commit message is: ${BLUE}$commitMessage${NC}"

dir=$PWD
if [[ $dir == *"$REPO_NAME" ]]; 
  then 
    echo -e "${YELLOW}Your current directory: ${BLUE}$dir${NC}"
  else 
    echo -e "${RED}Your current directory does not have \"$REPO_NAME\"${NC}"
    # Ask user to type Yes or No. If Yes, continue the bash program. If No, exit the bash program.
    while true; do
      echo -e "${YELLOW}Do you want to continue? (Y/N)${NC}"
      read yn
      case $yn in
        [Yy]* ) echo -e "${GREEN}Continue${NC}"; break;;
        [Nn]* ) echo -e "${RED}Exit${NC}"; exit;;
        * ) echo -e "${YELLOW}Please answer yes or no.${NC}";;
      esac
    done
fi

echo -e "${GREEN}Start Pushing to GitHub... Please wait the pushed message.${NC}"
git add .
git commit -m "$commitMessage"
git push origin main
echo -e "${GREEN}Pushed to GitHub...${NC}"

# Ask if user want to deploy to GitHub Pages
while true; do
  echo -e "${YELLOW}Do you want to deploy to GitHub Pages? (Y/N)${NC}"
  read yn
  case $yn in
    [Yy]* ) echo -e "${BLUE}Deploying to GitHub Pages... Please wait the deployed message.${NC}"; break;;
    [Nn]* ) echo -e "${RED}Exit${NC}"; exit;;
    * ) echo -e "${YELLOW}Please answer yes or no.${NC}";;
  esac
done
npm run deploy
echo -e "${GREEN}Deployed to GitHub Pages...${NC}"