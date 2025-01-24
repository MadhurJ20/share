# Setup

1. Go to your MongoDB Atlas account and then get the connection string and put it `.env` file
2. Start the server by `npm start dev` or similarly for whatever else you are using
3. Go to `localhost:3000` and enjoy
   1. Try wit `google.com`, `http://google.com`, `www.bing`, `https://google.com`
   2. Above is just to ensure all the link types work as expected

## For any Issues

1. Always do a simple `git pull` before anything and check `.env`
2. Any issues in home form: Drop the `urls` Database and try again
3. Some unexpected behavior occurs then you can try deleting `.next` and restarting the server
4. If still there are issues then as last resort just delete `node_modules`, `package-lock.json` and `pnpm-lock.yaml` and then reinstall and see if it persists
