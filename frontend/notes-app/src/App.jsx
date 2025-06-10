import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { Login } from "./pages/Login/Login";
import { Signup } from "./pages/Signup/Signup";
import "./index.css";
import NotFoundPage from "./pages/404/NotFoundPage";

const routes = (
	<Router>
		<Routes>
			<Route path="/dashboard" element={<Home />} />
			<Route path="/login" element={<Login />} />
			<Route path="/signUp" element={<Signup />} />
			<Route path="*" element={<NotFoundPage/>} />
		</Routes>
	</Router>
);
const App = () => {
	return <div>{routes}</div>;
};
export default App;
