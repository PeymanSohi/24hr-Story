# 24hr-Story

24hr-Story is a web application that replicates the story feature found in popular social media platforms like Instagram and WhatsApp. Users can upload, view, and interact with stories that disappear after 24 hours.

## Features

- **Story Viewer**: View stories with a progress bar and auto-advance functionality.
- **Story Bar**: Displays all available stories in a horizontal scrollable bar.
- **Upload Button**: Allows users to upload new stories.
- **Image Previews**: Preview the next story image on the navigation button.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd 24hr-Story
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open the application in your browser at `http://localhost:3000`.

## Usage

- **Viewing Stories**: Click on a story in the story bar to view it. Stories auto-advance after a few seconds.
- **Uploading Stories**: Use the upload button to add new stories.
- **Navigation**: Use the "Next" button to manually navigate to the next story.

## Docker Support

To run the application using Docker:

1. Build the Docker image:
   ```bash
   docker build -t 24hr-story .
   ```

2. Run the Docker container:
   ```bash
   docker-compose up
   ```

3. Access the application at `http://localhost:3000`.

## Technologies Used

- **Frontend**: React.js
- **Styling**: CSS
- **Utilities**: Custom utility functions for image handling and local storage
- **Build Tools**: Docker, npm
