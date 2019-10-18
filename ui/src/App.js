import React from 'react';
import Home from './components/Home';
import About from './components/About';
import Signup from './components/Signup';
import Login from './components/Login';
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom';
import useHistory from 'use-history';
import useLocation from 'wouter';
import ButtonFormat from './components/ButtonFormat';

const authCheck = {
  isLogIn: false
};

function AuthButton(props) {
  let history = useHistory();
  
  return authCheck.isLogin ? (
    <p>
      Welcome! { props.currUser.name } 
      <ButtonFormat className={ "submitButton logout" } handleSubmit={ props.handleSubmit } buttonValue = {"Log-out"} />
    </p>
  ) : (
    <p>You are not logged in.</p>
  )
};

// const AuthButton = withRouter(
//   (props) =>{
//     let history = useHistory();
//     history.push("/");
//     authCheck.isLogIn ? (
//       <p>
//         Welcome! { props.currUser.name }
        
// );

class App extends React.Component{
  constructor(props) {
    // Done this automatically if "constructor" is not used.
    super(props);
    this.state = {
      name: "",
      handle: "",
      text: "",
      likes: 0,
      password: "",
      userPosts: [],
      users: [],
      currUser: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.handleLikes = this.handleLikes.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    
    var now = new Date();
    var dateFormat = (now.getMonth()+1) + "/" + now.getDate();

    if (this.state.currUser === null) {
      alert("Please Log-in");
    }
    else {
      this.setState((prevState)=>{
        const newUserPost = { "name" : prevState.currUser.name, "handle": prevState.currUser.handle, "text": prevState.text, "likes": prevState.likes, "timestamp": dateFormat };
        return {
          ...prevState,
          text: "",
          userPosts: prevState.userPosts.concat([newUserPost])
        }
      });
    }
  }
  handleSignup = (event) => {
    console.log("reached");
    authCheck.isLogin = true;
    event.preventDefault();
    let history = useHistory();
    this.setState((prevState) => {
      const newUser = { "name":prevState.name, "handle":prevState.handle, "password":prevState.password };
      return {
        ...prevState,
        name: "",
        handle: "",
        password: "",
        currUser: newUser,
        users: prevState.users.concat([newUser])
      }
    });
    history.push("/");
    console.log(this.state);
  }
  handleLogin = (event) => {
    event.preventDefault();
    const index = this.state.users.findIndex(user => (user.handle === this.state.handle) && (user.password === this.state.password));
    if (index === -1) {
      alert("Fail to Log-in");
    } 
    else {
      authCheck.isLogIn = true;
      const selected = this.state.users[index];
      this.setState((prevState) => {
        return {
          ...prevState,
          name: "",
          handle: "",
          password: "",
          currUser: selected
        }
      });
    }
    console.log(this.state);
  }
  handleLogout = (event) => {
    authCheck.isLogIn = false;
    console.log("clicked");
    event.preventDefault();
    this.setState((prevState) => {
      return {
        ...prevState,
        currUser: null
      }
    });
  }
  
  //Working on it.
  handleLikes = (text) => {
    const index = this.state.userPosts.findIndex(userPost => userPost.text === text);
    const selected = this.state.userPosts[index];
    const nextUserPosts = [ ...this.state.userPosts ];
    nextUserPosts[index] = {
      ...selected, likes: selected.likes + 1
    };
    this.setState({
      userPosts: nextUserPosts
    });
  }
  handleChange = (input, event) => {
    this.setState({
      [input]: event.target.value
    });
  }  
 
  render() {
    return(
      <Router>
        <div>
          {/* <AuthButton currUser = { this.state.currUser } handleSubmit = { this.handleLogout }/> */}
          {/* <ButtonFormat className={ "submitButton logout" } handleSubmit={ this.handleLogout } buttonValue = {"Log-out"}  /> */}
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/signup">Sign-up</Link>
              </li>
              <li>
                <Link to="/login">Log-in</Link>
              </li>
            </ul>
          </nav>

          <Route 
            path="/"
            exact 
            render={() => {
              return ( 
                <Home 
                  text={ this.state.text }
                  handleChange={ this.handleChange } 
                  handleSubmit={ this.handleSubmit } 
                  userPosts={ this.state.userPosts } 
                  handleLikes={ this.handleLikes }
                  handleLogout={ this.handleLogout } 
                /> 
              );
             }
            } 
          />
          <Route path="/about" component={ About } />
          <Route 
            path="/signup" 
            render={() => {
              return(
                <Signup 
                  name={ this.state.name } 
                  handle={ this.state.handle }
                  password={ this.state.password }
                  handleChange={ this.handleChange } 
                  handleSignup={ this.handleSignup }  
                />
              );
             }
            }
          />
          <Route 
            path="/login" 
            render={() => {
              return(
                <Login 
                  handle={ this.state.handle }
                  password={ this.state.password }
                  handleChange={ this.handleChange } 
                  handleLogin={ this.handleLogin }  
                />
              );
             }
            }
          />
        </div>
      </Router>
    );
  }


}

export default App;
