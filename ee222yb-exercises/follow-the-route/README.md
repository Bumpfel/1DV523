# Follow the route

In this exercise, you should train your ability to create routes in the Node.js web application framework [Express](https://expressjs.com/) and render some simple views.

## The assignment

You should set up a web application that follows these rules:

1. The web application should listen to port 8000.

2. When the client asks for the root URL a static HTML file (index.html) should be responded to the client.

3. The application should have a main layout defining a template for all dynamic views.

4. When the client asks for the `/product` URL a view should be rendered that output an HTML document with a simple list of links to the persistent products (the URL is described in point 5).

5. When the client asks for the `/product/:id` URL a view should be rendered that output an HTML document displaying the product. If the client request `/product/231` the product with id 231 should be displayed.

6. When the client asks for the `/product/create` URL a view should be rendered with a simple HTML form should be displayed. The form should have a button that posts the form to the URL described in point 7.

7. When the client sends an HTTP POST to `/product/create` a function should be called that saves the form data and redirects the client to the URL `/product`.

8. When the client calls a URL that is undefined a 404 page should be rendered.

9. The application should be able to handle errors and respond with a 500 status.

## Solution

- <https://github.com/1dv023/SOLUTION-follow-the-route>
