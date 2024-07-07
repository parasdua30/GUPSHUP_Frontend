import { useFileHandler, useInputValidation } from "6pp";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import {
    Avatar,
    Button,
    Container,
    IconButton,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/validators";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";

function Login() {
    const [isLogin, setIsLogin] = React.useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const toggleLogin = () => setIsLogin((prev) => !prev);

    const [showBlankScreen, setShowBlankScreen] = useState(false);

    const name = useInputValidation("");
    const bio = useInputValidation("");
    const username = useInputValidation("", usernameValidator);
    const password = useInputValidation(""); // --->> useStrongPassword()
    const avatar = useFileHandler("single");
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Logging In...");

        setIsLoading(true);
        const config = {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const { data } = await axios.post(
                `${server}/api/v1/user/login`,
                {
                    username: username.value,
                    password: password.value,
                },
                config
            );
            dispatch(userExists(data.user));
            toast.success(data.message, {
                id: toastId,
            });

            // ---->>
            setShowBlankScreen(true);
            window.location.reload();
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Something Went Wrong",
                {
                    id: toastId,
                }
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        const toastId = toast.loading("Signing Up...");
        setIsLoading(true);

        const formData = new FormData();
        formData.append("avatar", avatar.file);
        formData.append("name", name.value);
        formData.append("bio", bio.value);
        formData.append("username", username.value);
        formData.append("password", password.value);

        const config = {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };

        try {
            const { data } = await axios.post(
                `${server}/api/v1/user/new`,
                formData,
                config
            );

            dispatch(userExists(data.user));
            toast.success(data.message, {
                id: toastId,
            });

            // ---->>
            window.location.reload();
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Something Went Wrong",
                {
                    id: toastId,
                }
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            style={{
                backgroundImage: "linear-gradient(black, #2F4F4F)", // --->> #696969
            }}
        >
            {showBlankScreen ? (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "white",
                    }}
                />
            ) : (
                <Container
                    component={"main"}
                    maxWidth="xs"
                    sx={{
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Paper
                        style={{
                            background: "rgba(255, 255, 255, 0.80)",
                            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                            backdropFilter: "blur(3px)",
                            WebkitBackdropFilter: "blur(3px)",
                            borderRadius: "10px",
                            border: "1px solid rgba(255, 255, 255, 0.18)",
                        }}
                        elevation={3}
                        sx={{
                            padding: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        {/*  For Login */}
                        {isLogin ? (
                            <>
                                <Typography variant="h5">Login</Typography>
                                <form
                                    style={{
                                        width: "100%",
                                        marginTop: "1rem",
                                    }}
                                    onSubmit={handleLogin}
                                >
                                    <TextField
                                        required
                                        fullWidth
                                        label="Username"
                                        margin="normal"
                                        variant="outlined"
                                        value={username.value}
                                        onChange={username.changeHandler}
                                    />

                                    <TextField
                                        required
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        margin="normal"
                                        variant="outlined"
                                        value={password.value}
                                        onChange={password.changeHandler}
                                    />

                                    <Button
                                        sx={{
                                            marginTop: "1rem",
                                        }}
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        fullWidth
                                        disabled={isLoading}
                                    >
                                        Login
                                    </Button>

                                    <Typography textAlign={"center"} m={"1rem"}>
                                        OR
                                    </Typography>

                                    <Button
                                        disabled={isLoading}
                                        fullWidth
                                        variant="text"
                                        onClick={toggleLogin}
                                    >
                                        Sign Up Instead
                                    </Button>
                                </form>
                            </>
                        ) : (
                            // For Sign Up
                            <>
                                <Typography variant="h5">Sign Up</Typography>
                                <form
                                    style={{
                                        width: "100%",
                                        marginTop: "1rem",
                                    }}
                                    onSubmit={handleSignUp}
                                >
                                    <Stack
                                        position={"relative"}
                                        width={"10rem"}
                                        margin={"auto"}
                                    >
                                        <Avatar
                                            sx={{
                                                width: "10rem",
                                                height: "10rem",
                                                objectFit: "contain",
                                            }}
                                            src={avatar.preview}
                                        />

                                        <IconButton
                                            sx={{
                                                position: "absolute",
                                                bottom: "0",
                                                right: "0",
                                                color: "white",
                                                bgcolor: "rgba(0,0,0,0.5)",
                                                ":hover": {
                                                    bgcolor: "rgba(0,0,0,0.7)",
                                                },
                                            }}
                                            component="label"
                                        >
                                            <>
                                                <CameraAltIcon />
                                                <VisuallyHiddenInput
                                                    type="file"
                                                    onChange={
                                                        avatar.changeHandler
                                                    }
                                                />
                                            </>
                                        </IconButton>
                                    </Stack>

                                    {/* --->>> */}

                                    {avatar.error && (
                                        <Typography
                                            m={"1rem auto"}
                                            width={"fit-content"}
                                            display={"block"}
                                            color="error"
                                            variant="caption"
                                        >
                                            {avatar.error}
                                        </Typography>
                                    )}

                                    <TextField
                                        required
                                        fullWidth
                                        label="Name"
                                        margin="normal"
                                        variant="outlined"
                                        value={name.value}
                                        onChange={name.changeHandler}
                                    />

                                    <TextField
                                        required
                                        fullWidth
                                        label="Bio"
                                        margin="normal"
                                        variant="outlined"
                                        value={bio.value}
                                        onChange={bio.changeHandler}
                                    />

                                    <TextField
                                        required
                                        fullWidth
                                        label="Username"
                                        margin="normal"
                                        variant="outlined"
                                        value={username.value}
                                        onChange={username.changeHandler}
                                    />

                                    {username.error && (
                                        <Typography
                                            variant="caption"
                                            color="error"
                                        >
                                            {username.error}
                                        </Typography>
                                    )}

                                    <TextField
                                        required
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        margin="normal"
                                        variant="outlined"
                                        value={password.value}
                                        onChange={password.changeHandler}
                                    />

                                    {password.error && (
                                        <Typography
                                            variant="caption"
                                            color="error"
                                        >
                                            {password.error}
                                        </Typography>
                                    )}

                                    <Button
                                        sx={{
                                            marginTop: "1rem",
                                        }}
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        fullWidth
                                        // disabled={isLoading}
                                    >
                                        Sign Up
                                    </Button>

                                    <Typography textAlign={"center"} m={"1rem"}>
                                        OR
                                    </Typography>

                                    <Button
                                        disabled={isLoading}
                                        fullWidth
                                        variant="text"
                                        onClick={toggleLogin}
                                    >
                                        Login Instead
                                    </Button>
                                </form>
                            </>
                        )}
                    </Paper>
                </Container>
            )}
        </div>
    );
}

export default Login;
