This is an experimental app built with React and Supabase. I'm just scratching an itch, it may become something... I don't know.
If you're reading this sorry for the lack of a documentation, I'll get to that and also a major refactoring sooner or later.

#### Available scripts as provided by Create React App

**npm start** Runs app in development on port `3000`

**npm test** Launch tests [documentation](https://facebook.github.io/create-react-app/docs/running-tests)

**npm buid** Build app for production [documenation](https://facebook.github.io/create-react-app/docs/deployment)

**npm eject** Once you go eject you can't go back


# Project setup
- Create a project on supabase
- Create a `.env` file at the root of the project add the following inside
	```
	REACT_APP_SUPABASE_URL=""
	REACT_APP_SUPABASE_KEY=""
	```
	The value of `REACT_APP_SUPABASE_URL` should be the url of the supabase project and `REACT_APP_SUPABASE_KEY` is the project API key. Both of these strings can be found at https://app.supabase.com/project/<project_id_i_think>/settings/api
		