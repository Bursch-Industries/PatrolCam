# Source Directory

This directory contains the source code for the PatrolCam project, which contains the backend and frontend of the project. Below is a breakdown of the files and subdirectories:

## Files

- **[middleware.js](https://github.com/Bursch-Industries/PatrolCam/blob/final-dev/src/middleware.js)**  
  This file contains middleware logic for handling authentication and session management. It uses the `next-auth` library to verify session tokens and applies middleware to protected routes like `/dashboard`.

  Example snippet:
  ```javascript
  export const config = {
      matcher: ["/dashboard/:path*"], // Apply middleware to these routes
  };
  ```

## Folders

### [app](https://github.com/Bursch-Industries/PatrolCam/tree/final-dev/src/app)
This folder contains the main application files and entry points for the PatrolCam project. It includes routing, views, and other core application components.

### [components](https://github.com/Bursch-Industries/PatrolCam/tree/final-dev/src/components)
This folder holds reusable UI components that help build the user interface of PatrolCam. Examples include buttons, headers, and form elements.

### [context](https://github.com/Bursch-Industries/PatrolCam/tree/final-dev/src/context)
The context directory is used for managing global state using React's context API. It provides shared data and functions to various parts of the application.

### [hooks](https://github.com/Bursch-Industries/PatrolCam/tree/final-dev/src/hooks)
This folder contains custom React hooks that encapsulate logic for reuse across components. These hooks are used to fetch data in the dashboard page when logged in.

### [lib](https://github.com/Bursch-Industries/PatrolCam/tree/final-dev/src/lib)
The library directory is designed for utility functions, helpers, and other shared logic that doesn't belong to a specific application module.
