# IDCS w/react

## Having trouble getting this to work
- So `cd prod_app/backend && npm install && nodemon` to get the backend up and running
- Then in a new tab navigate to `prod_app/frontend` and `npm install && npm start` to get the frontend.
- Click the doctor button.
- What I am doing here is making an `axios` call to the backend and getting the html for it in the call (you can see that happening in the browser console). Then attempting to get the log in page to display by `dangerouslySetInnerHTML`.
## This isn't working, not sure how to fix.
- Ideally I should be able to get the endpts for the login and the password from IDCS, but I'm not sure how. Can someone advise?
