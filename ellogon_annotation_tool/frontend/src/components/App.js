import React, {Component} from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login           from "./login";
import Signup          from "./signup";
import MainView        from "./mainview";
import requestInstance from "../requestAPI";
import Activation      from "./Activation";
import ManageProfile   from "./manage_profile";
import Reset_password  from "./reset_password"
import {withRouter}    from "react-router-dom";


class App extends Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    async handleLogout() {
        try {
            const response = await requestInstance.post('/user/logout/', {
                "refresh_token": localStorage.getItem("refresh_token")
            });
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem(('email'))
            localStorage.removeItem("remember");
            requestInstance.defaults.headers['Authorization'] = null;
            this.props.history.push("/sign-in");

            return response;
        } catch (e) {
            console.log(e);
        }
    };

    componentDidMount() {
        let access_token  = localStorage.getItem('access_token');
        let refresh_token = localStorage.getItem('refresh_token');
        let remember      = JSON.parse(localStorage.getItem("remember"));
        if (access_token != null && refresh_token != null) {
            if (remember == false) {
                const response=this.handleLogout()
            } else {
                if (remember == true) {
                    this.props.history.push("/main"); //go to current?
                }
            }
        }
    }

    render() {
        let login_state=this.props.location.pathname;
        console.log(this.props.location.pathname)
        console.log(login_status)
        let login_status=false
        if (login_state=="/main" || login_state=="/main/"|| login_state=="/user/profile_manage" || login_state=="/user/profile_manage/") {
            //if (!(this.props.location.state=="home")) {
                    login_status=true
            //}
        }

        return (
            //<Router>
                <div className="App">
                    <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                        <div className="container">
                            <Link className="navbar-brand" to={"/sign-in"}>Ellogon</Link>
                            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                                <ul className="navbar-nav ml-auto">
                                    <li className="nav-item" style={{display:(!login_status) ? "block":"none"}}>
                                        <Link className="nav-link" to={"/sign-in"}>Login</Link>
                                    </li>
                                    <li className="nav-item" style={{display:(!login_status) ? "block":"none"}} >
                                        <Link className="nav-link" to={"/sign-up"}>Sign up</Link>
                                    </li>
                                     <li className="nav-item" style={{display:(login_status) ? "block":"none"}}>

                                        <Link className="nav-link"  onClick={this.handleLogout}>Logout</Link>
                                    </li>
                                     <li className="nav-item" style={{display:(login_status) ? "block":"none"}}>

                                        <Link className="nav-link" to={"/user/profile_manage"}>Manage Profile</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>

                    <div className="auth-wrapper">
                        <div className="auth-inner">
                            <Switch>
                               // <Route exact path='/'                      component={Login}/>
                                <Route path="/login"                       component={Login}/>
                                <Route path="/sign-in"                     component={Login}/>
                                <Route path="/sign-up"                     component={Signup}/>
                                <Route path="/main"                        component={MainView}/>
                                <Route path="/forget_password"             component={Reset_password}/>
                                <Route path="/user/profile_manage"         component={ManageProfile}/>
                                <Route path="/api/user/activate/:uidb64/:token" component={Activation}/>
                            </Switch>
                        </div>
                    </div>
                </div>
        );
    }; // render()
}; // class App()

export default withRouter(App);
