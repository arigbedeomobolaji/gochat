import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "@screens/Auth";
const App: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<Auth />} />
			</Routes>
			
		</BrowserRouter>
	);
};
export default App;
