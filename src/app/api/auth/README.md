# Authentication API Directory

This directory contains various authentication-related APIs and utilities utilized in the PatrolCam application. Each subdirectory is responsible for handling specific functionalities related to authentication.

## Directory Structure

- **`[...nextauth]`**:Handles dynamic routing for authentication using the NextAuth.js library.
- **`audioAPI`**: Manages authentication or access control for the audio ai feature. It is a feature that Nate provided, we used hes API to transcribe it.
- **`camerasAPI`**: Handles authentication or access control for camera-related functionalities.
- **`emailAPI`**: Manages the emails Nate recives to people who are intrested in the product. (To be tested)
- **`myOrgAPI`**: Handles authentication or access control specific to organizational data. Fetches the organization info and diplays it in the myOrg page.
- **`officersAPI`**: Manages authentication or access control for officers within an organization.

## Usage

- Each subdirectory encapsulates an independent module to handle specific authentication functionalities.
- These modules work together to provide a secure authentication mechanism for the PatrolCam platform.
