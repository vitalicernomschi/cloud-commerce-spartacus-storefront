echo "Running citest.sh ..."

pwd

ls -l

cd ..

npm install -g @angular/cli@6.2.4

ng new e2estorefront --styles=scss

cd e2estorefront

pwd

ls -l

ng e2e
