# Baby B

<div style="text-align: center;">
  <div style="background-color: white; border-radius: 50%; display: inline-block; padding: 10px;">
    <img src="./public/source.svg" alt="Baby B Logo" width="250" height="250">
  </div>
</div>

Baby B is a secure baby tracking app that stores your baby's data in your Google Drive, giving you full control and privacy.

## User Guide for Baby B

### Getting Started

1. **Sign In**: Open the app and click "Sign in with Google" to authenticate using your Google Drive account.

2. **Add a Baby**: After signing in, navigate to the baby list and add a new baby by providing their name and birth date.

### Using the App

- **Log Entries**: Select a baby and add entries like feeding, diaper changes, or sleep times using the entry form.
- **View Data**: Browse your baby's history in the entry list, filtered by date or type.
- **Manage Babies**: Switch between babies or edit their details in the selector.

### Tips

- All data is stored securely in your Google Drive.
- Use the date picker for accurate logging.
- The app works offline once data is synced.

For more help, contact support.

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
   - Ask maintainer for client id/secret
   - Add them to a `.env` file as `REACT_APP_GOOGLE_CLIENT_ID` and `REACT_APP_GOOGLE_CLIENT_SECRET`.

4. **Run the App**:
   ```
   npm start
   ```
   The app will run on `http://localhost:3000`.

### Building

- For production: `npm run build`
- Lint: `npm run lint`
- Format: `npm run format`

### CI/CD

This project uses Netlify for continuous integration and deployment. Push to the main branch to trigger automatic builds and deploys.

### Contributing

- Follow the code style in the existing files.
- Submit pull requests to the main branch.
- Avoid too many pushes to main as has limited netlify deploys
