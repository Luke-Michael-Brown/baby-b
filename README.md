# Baby B

<div style="text-align: center;">
  <div style="background-color: white; border-radius: 50%; display: inline-block; padding: 10px;">
    <img src="./public/source.svg" alt="Baby B Logo" width="250" height="250">
  </div>
</div>

App URL: <b>https://baby-b-tracker.netlify.app</b>

Baby B is a secure baby tracking app that stores your baby's data in your Google Drive, giving you full control and privacy.

## User Guide for Baby B

### Getting Started

1. **Sign In**: Open the app and click "Sign in with Google" to authenticate using your Google Drive account.

2. **Add a Baby**: After signing in, navigate to the baby list and add a new baby by providing their name and birth date.

### Using the App

- **Log Entries**: Select a baby and add entries like feeding, diaper changes, or sleep times using the entry form.
- **View Data**: Browse your baby's history in the entry list, filtered by date or type.
- **Manage Babies**: Switch between babies or edit their details in the selector.
- **View Summaries**: Check out the summary tab to see averages and stats.

### Tips

- All data is stored securely in your Google Drive.
- Use the date picker for accurate logging.
- To share your baby data with another google user simply share the baby_b_tracker folder in your google drive with them (Note: Is they already have a baby_b_tracker folder their personal one takes priority)

### How to add app to home screen

#### Android (using Chrome)

1. Open Chrome and navigate to https://baby-b-tracker.netlify.app.
2. Tap the three-dot menu icon (vertical ellipsis) in the top-right corner.
3. Select "Add to Home screen" from the menu.
4. Give the shortcut a name (e.g., "Baby B") and tap Add.
5. A shortcut icon will now appear on your home screen just like a native app.

### IOS (using Safari)

1. Open Safari and navigate to https://baby-b-tracker.netlify.app.
2. Tap the Share button (the square with an upward arrow) at the bottom of the screen.
3. Scroll down the list of options and tap "Add to Home Screen".
4. Confirm the name "Baby B" and tap Add in the top-right corner.
5. The app will now be accessible from your home screen for a full-screen, app-like experience.

## Developer Guide for Baby B

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Setup

1. **Clone the Repository**:

   ```
   git clone https://github.com/yourusername/baby-b.git
   cd baby-b
   ```

2. **Install Dependencies**:

   ```
   npm install
   ```

3. **Configure Google API**:
   - Ask maintainer for client id api key.
   - Ask maintainer to add your google account as a test account.
   - Add them to a `.env` file as `VITE_GOOGLE_CLIENT_ID` and `VITE_GOOGLE_API_KEY`.

4. **Run the App**:
   ```
   npm run dev
   ```
   The app will run on `http://localhost:5173/`.

### Building

- For production: `npm run build`
- Lint: `npm run lint`
- Format: `npm run format`

### CI/CD

This project uses Netlify for continuous integration and deployment. Push to the main branch to trigger automatic builds and deploys.

### Contributing

- Follow the code style in the existing files.
- Submit pull requests to the main branch.
- Avoid too many pushes to main as I have limited netlify deploys
