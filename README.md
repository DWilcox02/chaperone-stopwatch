# Chaperone Stopwatch :stopwatch:

Mobile application built for chaperones to efficiently track, manage, and log time for children and group activities. Uses localized database management and customized hooks to handle concurrent timers, activity logging, and PDF session exports. Eases tracking compliance with child performance regulations such as NNCEE.

### Version Information

Developed using React Native and Expo with TypeScript for type safety. Testing relies on Jest and Vitest.

### Initialization / Setup

After ensuring your environment is set up for React Native / Expo development, run the following commands from the root folder:

1. Install node modules

```
npm install
```

2. (Optional) Setup Husky pre-commit hooks

```
npm run prepare
```

### Running

#### Start the Expo Server

From the root directory, run:

```
npx expo start
```

Note: This has been primarily developed with iOS in mind.
