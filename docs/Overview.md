# Flow

## Main Page

The flow of the website is:

1. You go to the website (Say for example `link.aces-rmdssoe.tech`)
2. Put a link in an input box, and you **optionally** can choose for a *custom alias*
3. Then backend processes and saves to database a unique shortened URL like `link.aces-rmdssoe.tech/f1axyr`
4. If custom alias is provided then it is going to be `link.aces-rmdssoe.tech/whateverAlias`
5. Then this URL is provided in frontend and also a QR code is given (Using [`qrcode.react`](https://www.npmjs.com/package/qrcode.react/v/4.1.0))
6. See if there's a way to add captcha like cloudflare 

## Admin Dashboard

1. Apart from actual shortener page there should also be an admin dashboard
2. Basically we want to see how many people used the link (So number of uses AND timestamps too for whenever accessed)
3. The above should be for each link so in the admin dashboard ideally we should see:
   1. All the links created showing the shortened URL, the original URL, the creation timestamp and number of times used also should show QR code for it
   2. A button or something that shows a popup or sidebar which shows recent accesses (Paginated)
   3. Utility buttons *if possible* for exporting link and QR code
4. Add a search functionality too for links 
5. Maybe add charts (Future scope)

# Technologies

1. Frontend + Backend: Nextjs ([Docs](https://nextjs.org/docs))
2. Database: [MongoDB](https://www.mongodb.com/)
3. 