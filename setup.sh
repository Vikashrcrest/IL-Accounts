#!/bin/bash

# Creating src directory and navigating into it
mkdir -p src && cd src

# Creating main folder structure
mkdir -p assets components screens models redux/slices services navigation utils

# Creating components files
touch components/AccountCard.js
touch components/TransactionItem.js

# Creating screens files
touch screens/KhatavahiScreen.js
touch screens/RojmelScreen.js

# Creating models files
touch models/AccountModel.js
touch models/EntryModel.js

# Creating redux files
touch redux/slices/accountSlice.js
touch redux/slices/entrySlice.js
touch redux/store.js
touch redux/persistConfig.js

# Creating services files
touch services/database.js

# Creating navigation files
touch navigation/AppNavigator.js

# Creating utils files
touch utils/formatters.js

# Creating main app entry file
touch App.js

echo "Project structure created successfully!"