echo "Type your commit message?"
read commitMessage
# Check commitMessage is empty or not. If empty, keep asking.
while [ -z "$commitMessage" ]
do
  echo "Commit message cannot be empty. Please type again. (press ctrl + c to exit))"
  read commitMessage
done
echo "Your commit message is: $commitMessage"

dir=$PWD
if [[ $dir == *"hkdjyu.github.io" ]]; 
  then 
    echo "Your current directory: $dir"
  else 
    echo "Your current directory does not have \"hkdjyu.github.io\""
    # Ask user to type Yes or No. If Yes, continue the bash program. If No, exit the bash program.
    while true; do
      read -p "Do you want to continue? (Y/N)" yn
      case $yn in
        [Yy]* ) echo "Continue"; break;;
        [Nn]* ) echo "Exit"; exit;;
        * ) echo "Please answer yes or no.";;
      esac
    done
fi

echo "Start Pushing to GitHub..."
git add .
git commit -m "$commitMessage"
git push origin main
echo "Pushed to GitHub..."

# Ask if user want to deploy to GitHub Pages
while true; do
  read -p "Do you want to deploy to GitHub Pages? (Y/N)" yn
  case $yn in
    [Yy]* ) echo "Deploying to GitHub Pages"; break;;
    [Nn]* ) echo "Exit"; exit;;
    * ) echo "Please answer yes or no.";;
  esac
done
npm run deploy
echo "Deployed to GitHub Pages..."