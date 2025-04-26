# My Organization Dashboard

This directory contains React components and logic for managing the "My Organization" section of the PatrolCam application dashboard. Each file serves a specific purpose in rendering and handling functionality for organizational management.

## Files in This Directory

### [`edit-camera.jsx`](https://github.com/Bursch-Industries/PatrolCam/blob/final-dev/src/app/dashboard/myOrg/edit-camera.jsx)
This component provides a modal interface for editing camera details such as name, model, status, and location. It makes a `PUT` request to update the camera details via the backend API and reloads the page upon successful updates.

- **Key Features**:
  - Form to edit camera details.
  - API interaction with `/api/auth/camerasAPI`.
  - State management for form data and submission feedback.

- **Related API**:
  - [Cameras API](../../../../api/auth/camerasAPI)

---

### [`my-org-content.jsx`](https://github.com/Bursch-Industries/PatrolCam/blob/final-dev/src/app/dashboard/myOrg/my-org-content.jsx)
This file contains multiple components for rendering the content of the "My Organization" dashboard, such as organization details, camera management, and officer management.

- **Key Features**:
  - **Sidebar**: Provides navigation between sections (organization info, cameras, officers, privacy).
  - **OrganizationSection**: Fetches and displays organization details from the backend.
  - **CamerasSection**: Lists all cameras, allows editing existing cameras.
  - **OfficerSection**: Manages officer data, including search functionality.

- **Related APIs**:
  - [Organization API](../../../../api/auth/myOrgAPI)
  - [Cameras API](../../../../api/auth/camerasAPI)
  - [Officers API](../../../../api/auth/officersAPI)

---

### [`page.jsx`](https://github.com/Bursch-Industries/PatrolCam/blob/final-dev/src/app/dashboard/myOrg/page.jsx)
This file serves as the main entry point for the "My Organization" dashboard. It organizes the layout and integrates all the dashboard sections such as organization info, cameras, officers, and privacy settings.

- **Key Features**:
  - Renders the `Sidebar`, `OrganizationSection`, `CamerasSection`, and `OfficerSection`.
  - Provides a unified layout for the "My Organization" dashboard.

- **Related APIs**:
  - [Organization API](../../../../api/auth/myOrgAPI)
  - [Cameras API](../../../../api/auth/camerasAPI)
  - [Officers API](../../../../api/auth/officersAPI)

---
For additional information or assistance, refer to the [repository's main documentation](https://github.com/Bursch-Industries/PatrolCam).
