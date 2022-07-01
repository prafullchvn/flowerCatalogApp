# todo

- [ ] Create the separate file for render method.
- [ ] Create separate file 'commentUtil' for helper method to Comment Handler. 

# done

- [x] Make render method generic.
- [x] Change CommentHandler to GuestBookHandler.
- [x] Make properties in CommentHandler and Comment private.
- [x] create method for 302 (redirect), 405 (bad request), 404 (not found) and 500 (can not process)
- [x] Add middleware to parse the get data.
- [x] Register comment using post.
 - [x] Change method in html to post.
 - [x] Add middleware to parse parameter if the request is post.
- [x] Consider making GuestBook entity.
- [x] Create entity called CommentHandler.
- [x] ~~Add content-type to response using middleware.~~
- [x] Move flower catalog to resource/view directory.
- [x] Add timestamp to request using middleware.
- [x] Pass configuration as parameter to handlers.
  - [x] Use template path from configuration.
  - [x] Use Json file path of comments from configuration.
- [x] Add content-type of reading file.
  - [ ] ~~Use mime package to determine the file type.~~
- [ ] ~~Abstract the server entity.~~
- [x] Initialize with npm.
- [x] Create the render method to render the html with content, errors, and success message.
- [x] Make a function toLocalString() for timestamp.
- [x] Make handler to show error on guestbook itself.
- [x] Style the guest book.
- [x] Separate landing page specific CSS in separate file from style.css
- [x] Style the CSS of flower page.
- [x] Create css file for flower page.
- [x] Fetch all comments from the json using model and display them.
- [x] Create model directory and create file comment model inside of it.
- [x] Create dummy json file inside directory called resource.
- [x] Set up server.
- [x] Reset server.
- [x] Create index route for landing page.
- [x] Create html for webpages.
