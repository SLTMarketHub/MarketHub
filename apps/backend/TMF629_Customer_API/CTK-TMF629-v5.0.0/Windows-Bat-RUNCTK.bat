@echo off

copy CHANGE_ME.json DO_NOT_CHANGE\cypress\fixtures\config.json
cd DO_NOT_CHANGE
npm install
npm start
npm run report
copy cypress\reports\index.html ..\SENDME.HTML
copy cypress\reports\index.json ..\SENDME.JSON