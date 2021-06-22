import React from "react"
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom'
import {useRoutes} from "./routes";
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/AuthContext";
import {AuthPage} from "./pages/AuthPage";
import StickyFooter from "./pages/Footer";
import { mainListItems } from './pages/listItems';


function App() {
    const {token, login, logout, userId} = useAuth()
    const storageName = 'userData'
    const data = JSON.parse(localStorage.getItem(storageName))
    const isAuthenticated = !!token
    const routes = useRoutes(isAuthenticated)
    if(data.token !== null)
    {
        if (data.token || isAuthenticated) {
            return (
                <AuthContext.Provider value={{
                    token, login, logout,userId, isAuthenticated
                }}>
                    <Router>
                        <div className="container">
                            {routes}
                        </div>
                    </Router>
                </AuthContext.Provider>
            )
        }
    }

    return (
        <AuthContext.Provider value={{
            token, login, logout, userId, isAuthenticated
        }}>

            <Router>
        <Switch>
            <Route path="/" exact>
                <AuthPage />
            </Route>
            <Redirect to="/" />
        </Switch>
            </Router>
        </AuthContext.Provider>
    )

}
export default App;
