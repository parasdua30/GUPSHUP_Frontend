import React, { memo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { darkGreenColor, greenColor } from "../../constants/color";
import AvatarCard from "./AvatarCard";
import { Link } from "../styles/StyledComponents";
import { motion } from "framer-motion";

const ChatItem = ({
    avatar = [],
    name,
    _id,
    groupChat = false,
    sameSender,
    isOnline,
    newMessageAlert,
    index = 0,
    handleDeleteChat,
}) => {
    return (
        <Link
            sx={{ marginTop: "0.07rem", padding: "0.001rem", width: "100%" }}
            to={`/chat/${_id}`}
            onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
        >
            <motion.div
                initial={{ opacity: 0, y: "-100%" }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                    hover: "none",
                    // backgroundColor: sameSender ? "black" : "unset",
                    // color: sameSender ? "white" : "black",

                    backgroundColor: sameSender ? darkGreenColor : greenColor,
                    color: sameSender ? "white" : "aliceblue",
                    position: "relative",
                    padding: "1rem",
                }}
            >
                <AvatarCard avatar={avatar} />

                <Stack>
                    <Typography>{name}</Typography>
                    {newMessageAlert && (
                        <Typography>
                            {newMessageAlert.count} New Message{" "}
                        </Typography>
                    )}
                </Stack>

                {isOnline && (
                    <Box
                        sx={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: "lightgreen", //-->
                            position: "absolute",
                            top: "50%",
                            right: "1rem",
                            transform: "translateY(-50%)",
                        }}
                    />
                )}
            </motion.div>
        </Link>
    );
};

export default memo(ChatItem);
