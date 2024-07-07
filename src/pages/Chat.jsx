import React, {
    Fragment,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import AppLayout from "../components/layout/AppLayout";
import { IconButton, Skeleton, Stack } from "@mui/material";

import {
    bgDarkGradient,
    bgGradient,
    grayColor,
    greenColor,
    bgDarkColor,
    darkGrayColor,
} from "../constants/color";
import {
    AttachFile as AttachFileIcon,
    Send as SendIcon,
} from "@mui/icons-material";
import { InputBox } from "../components/styles/StyledComponents";
import FileMenu from "../components/dialogs/FileMenu";
import { sampleMessage } from "../constants/sampleData";
import MessageComponent from "../components/shared/MessageComponent";
import { getSocket } from "../Socket";
import {
    ALERT,
    CHAT_JOINED,
    CHAT_LEAVED,
    NEW_MESSAGE,
    START_TYPING,
    STOP_TYPING,
} from "../constants/events";
import { useInfiniteScrollTop } from "6pp";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { useErrors, useSocketEvents } from "../hooks/Hook";
import { setIsFileMenu } from "../redux/reducers/misc";
import { useDispatch } from "react-redux";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { TypingLoader } from "../components/layout/Loaders";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Chat({ chatId, user }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const socket = getSocket();

    const containerRef = useRef(null);
    const bottomRef = useRef(null);

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
    const [IamTyping, setIamTyping] = useState(false);
    const [userTyping, setUserTyping] = useState(false);
    const typingTimeout = useRef(null);

    const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
    const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

    const members = chatDetails?.data?.chat?.members;

    const errors = [
        { isError: chatDetails.isError, error: chatDetails.error },
        { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
    ];
    const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
        containerRef,
        oldMessagesChunk.data?.totalPages,
        page,
        setPage,
        oldMessagesChunk.data?.messages
    );

    // UI Handling
    const handleFileOpen = (e) => {
        dispatch(setIsFileMenu(true));
        setFileMenuAnchor(e.currentTarget);
    };

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // From Senders POV
    // Typing Event
    const messageOnChange = (e) => {
        setMessage(e.target.value);

        if (!IamTyping) {
            socket.emit(START_TYPING, { members, chatId });
            setIamTyping(true);
        }

        if (typingTimeout.current) clearTimeout(typingTimeout.current);

        typingTimeout.current = setTimeout(() => {
            socket.emit(STOP_TYPING, { members, chatId });
            setIamTyping(false);
        }, [1100]);
    };

    // Sending Message Event To Backend
    const submitHandler = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        // Emitting the message to the server
        socket.emit(NEW_MESSAGE, { chatId, members, message });
        setMessage("");
    };

    // Handling Chats Messages that were Overlapping in different chats.
    useEffect(() => {
        socket.emit(CHAT_JOINED, { userId: user._id, members });
        dispatch(removeNewMessagesAlert(chatId));

        return () => {
            setMessage("");
            setMessages([]);
            setOldMessages([]);
            setPage(1);
            socket.emit(CHAT_LEAVED, { userId: user._id, members });
        };
    }, [chatId]);

    useEffect(() => {
        if (chatDetails.isError) return navigate("/");
    }, [chatDetails.isError]);

    // From Receivers POV
    // Event Listeners For Backend Emiters.
    const newMessagesListener = useCallback(
        // useCallBack -> so that it just memoizes
        (data) => {
            if (data.chatId !== chatId) return;
            setMessages((prev) => [...prev, data.message]);
        },
        [chatId]
    );

    const startTypingListener = useCallback(
        (data) => {
            // console.log("typing ", chatId);
            if (data.chatId !== chatId) return;
            setUserTyping(true);
        },
        [chatId]
    );

    const stopTypingListener = useCallback(
        (data) => {
            if (data.chatId !== chatId) return;
            setUserTyping(false);
        },
        [chatId]
    );

    // ---->> Specific Alert for Add or Remove of member of a group.
    const alertListener = useCallback(
        (data) => {
            if (data.chatId !== chatId) return;
            const messageForAlert = {
                content: (
                    <span>
                        <span style={{ fontWeight: "bold" }}>
                            {data.message}
                        </span>{" "}
                        {data.flag === "removed"
                            ? "has been removed from the group"
                            : ""}
                        {data.flag === "added"
                            ? "has been added in the group"
                            : ""}
                    </span>
                ),
                sender: {
                    _id: "djasdhajksdhasdsadasdas",
                    name: "Admin",
                },
                chat: chatId,
                createdAt: new Date().toISOString(),
            };

            // toast.success(data.message);
            setMessages((prev) => [...prev, messageForAlert]);
        },
        [chatId]
    );

    /* Explaination
        {
            [NEW_MESSAGE]: newMessagesHandler,
        };
        [NEW_MESSAGE] = because it is dynamic variable, thus this syntax, [] inside this is the read as String.
    */
    const eventHandler = {
        [ALERT]: alertListener,
        [NEW_MESSAGE]: newMessagesListener,
        [START_TYPING]: startTypingListener,
        [STOP_TYPING]: stopTypingListener,
    };

    useSocketEvents(socket, eventHandler);
    useErrors(errors);

    const allMessages = [...oldMessages, ...messages];

    return chatDetails.isLoading ? (
        <Skeleton />
    ) : (
        <>
            <Stack
                ref={containerRef}
                boxSizing={"border-box"}
                padding={"1rem"}
                spacing={"1rem"}
                height={"90%"}
                sx={{
                    // backgroundImage: bgGradient,
                    // backgroundImage: bgDarkGradient,
                    bgcolor: grayColor,
                    // bgcolor: bgDarkColor,
                    // bgcolor: darkGrayColor,

                    overflowX: "hidden",
                    overflowY: "auto",
                }}
            >
                {allMessages.map((i) => (
                    <MessageComponent key={i._id} message={i} user={user} />
                ))}

                {userTyping && <TypingLoader />}
                <div ref={bottomRef} />
            </Stack>

            <form
                style={{
                    height: "10%",
                }}
                onSubmit={submitHandler}
            >
                <Stack
                    direction={"row"}
                    height={"100%"}
                    padding={"1rem"}
                    alignItems={"center"}
                    position={"relative"}
                >
                    <IconButton
                        sx={{
                            position: "absolute",
                            left: "1.5rem",
                            rotate: "30deg",
                        }}
                        onClick={handleFileOpen}
                    >
                        <AttachFileIcon />
                    </IconButton>

                    <InputBox
                        placeholder="Type Message Here..."
                        value={message}
                        onChange={messageOnChange}
                    />

                    <IconButton
                        type="submit"
                        sx={{
                            rotate: "-30deg",
                            bgcolor: greenColor,
                            color: "white",
                            marginLeft: "1rem",
                            padding: "0.5rem",
                            "&:hover": {
                                bgcolor: "#009900",
                            },
                        }}
                    >
                        <SendIcon />
                    </IconButton>
                </Stack>
            </form>
            <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
        </>
    );
}

export default AppLayout()(Chat);
