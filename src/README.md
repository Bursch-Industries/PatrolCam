# Source Directory

This directory contains the source code for the PatrolCam project. Below is a breakdown of the files and subdirectories:

## Files
- **middleware.js**  
  This file contains middleware logic for handling authentication and session management. It uses the `next-auth` library to verify session tokens and applies middleware to protected routes like `/dashboard`.

  Example snippet:
  ```javascript
  export const config = {
      matcher: ["/dashboard/:path*"], // Apply middleware to these routes
  };
