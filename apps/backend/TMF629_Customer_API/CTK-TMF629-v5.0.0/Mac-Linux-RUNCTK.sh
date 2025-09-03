#!/bin/bash

clear

echo "This will run a TMForum API CTK"
echo "Make sure Node.js (v18 preferred), NPM, and Newman are installed."
echo

cp ./CHANGE_ME.json ./DO_NOT_CHANGE/cypress/fixtures/config.json
cd ./DO_NOT_CHANGE
mkdir -p cypress/reports/json
rm -rf cypress/reports/json/*
npm install
npx cypress run --spec='./cypress/e2e/production/ctk.cy.js'
npx mochawesome-merge cypress/reports/json/*.json > cypress/reports/index.json
npx mochawesome-report-generator cypress/reports/index.json --reportDir cypress/reports --inline
rm -f ../SENDME.json ../SENDME.html
cp ./cypress/reports/index.json ../SENDME.json
cp ./cypress/reports/index.html ../SENDME.html
