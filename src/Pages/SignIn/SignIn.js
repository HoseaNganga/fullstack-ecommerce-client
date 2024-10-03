import React, { useContext, useEffect, useState } from "react";
import DataContext from "../../DataContext/DataContext";
import bacolalogo from "../../ImageAssets/bacolalogo.png";
import { Button, InputAdornment, TextField, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import googleimg from "../../ImageAssets/googlesigninbutton.png";
import { Link, useNavigate } from "react-router-dom";
import { postData } from "../../utils/api";
import { toast } from "react-hot-toast";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";

const SignIn = () => {
  const auth = getAuth(firebaseApp);
  const googleProvider = new GoogleAuthProvider();
  const { setHeaderFooterShow } = useContext(DataContext);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const [registerFormFields, setRegisterFormFields] = useState({
    email: "",
    password: "",
    isAdmin: false,
  });
  const changeInputFields = (e) => {
    setRegisterFormFields(() => ({
      ...registerFormFields,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogIn = (e) => {
    e.preventDefault();
    const loginUserPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await postData("/api/user/signin", registerFormFields);
        if (response.success) {
          const user = {
            name: response?.user?.name,
            email: response?.user?.email,
            userId: response?.user?._id,
          };
          localStorage.setItem("token", response?.token);
          localStorage.setItem("user", JSON.stringify(user));

          resolve(response); // Resolve the promise on success
          window.location.href = "/";
          setRegisterFormFields({
            email: "",
            password: "",
          });
        } else {
          reject(new Error(response.error || "An error occurred")); // Reject the promise on failure
        }
      } catch (error) {
        console.log(error);
        reject();
      }
    });
    toast.promise(loginUserPromise, {
      loading: "Logging in User..",
      success: "User Logged In Successfully",
      error: (err) => `${err?.message || "An unexpected error occurred"}`,
    });
  };

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider).then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      // eslint-disable-next-line
      const token = credential.accessToken;

      const user = result.user;

      const fields = {
        name: user.providerData[0].displayName,
        email: user.providerData[0].email,
        password: null,
        image: user.providerData[0].photoURL,
        phone: user.providerData[0].phoneNumber,
      };
      const loginPromiseWithGoogle = new Promise(async (resolve, reject) => {
        try {
          const response = await postData("/api/user/authWithGoogle", fields);
          if (response.success) {
            localStorage.setItem("token", response.token);
            const user = {
              name: response?.user?.name,
              email: response?.user?.email,
              userId: response?.user?._id,
            };
            localStorage.setItem("user", JSON.stringify(user));
            resolve();
            window.location.href = "/";
          } else {
            reject(new Error(response.error || "An error occurred")); // Reject the promise on failure
          }
        } catch (error) {
          console.log(error);
          reject();
        }
      });

      toast.promise(loginPromiseWithGoogle, {
        loading: "Logging in User..",
        success: "User Logged In Successfully",
        error: (err) => `${err?.message || "An unexpected error occurred"}`,
      });
    });
  };

  useEffect(() => {
    setHeaderFooterShow(false);
  }, [setHeaderFooterShow]);

  const handleCancel = () => {
    setHeaderFooterShow(true);
    navigate("/");
  };
  return (
    <section className="section signInPage">
      <div className="container">
        <div className="imgWrapper  ">
          <img src={bacolalogo} alt="logo" />
        </div>
        <div className=" box card p-3 shadow border-0 mt-4">
          <Typography
            variant="h6"
            textTransform={"capitalize"}
            fontWeight={600}
            sx={{ padding: "10px 30px", color: "blue" }}
          >
            Sign in
          </Typography>
          <form onSubmit={handleLogIn}>
            <div className="form-group">
              <TextField
                type="email"
                label="Email"
                required
                variant="filled"
                className="w-100 mb-4"
                name="email"
                onChange={changeInputFields}
              />
              <TextField
                type={passwordVisible ? "text" : "password"}
                label="Password"
                required
                variant="filled"
                className="w-100"
                name="password"
                onChange={changeInputFields}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {passwordVisible ? (
                        <VisibilityOffIcon
                          onClick={() => setPasswordVisible(false)}
                        />
                      ) : (
                        <VisibilityIcon
                          onClick={() => setPasswordVisible(true)}
                        />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <a className="border-effect cursor" href="/">
              Forgot Password?
            </a>
            <div className="d-flex align-items-center row">
              <Button variant="contained" className="col" type="submit">
                Sign In
              </Button>
              <Button
                variant="contained"
                color="error"
                className="col ml-3"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>

            <p className="mt-3">
              Not Registered?{" "}
              <Link className="border-effect" to={"/signup"}>
                Sign Up
              </Link>{" "}
            </p>

            <Typography
              variant="subtitle2"
              textAlign={"center"}
              fontWeight={600}
            >
              Or
            </Typography>
            <Button className="" onClick={signInWithGoogle}>
              <img src={googleimg} alt="" className="w-100" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
