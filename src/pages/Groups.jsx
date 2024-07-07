import React, { Suspense, lazy, memo, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    Delete as DeleteIcon,
    Done as DoneIcon,
    Add as AddIcon,
    Edit as EditIcon,
    KeyboardBackspace as KeyboardBackspaceIcon,
    Menu as MenuIcon,
} from "@mui/icons-material";
import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Drawer,
    Grid,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { LayoutLoader } from "../components/layout/Loaders";
import AvatarCard from "../components/shared/AvatarCard";
import { bgGradient, darkGreenColor, matBlack } from "../constants/color";
import { useDispatch, useSelector } from "react-redux";
import UserItem from "../components/shared/UserItem";
import { Link } from "../components/styles/StyledComponents";
import { samepleChats, sampleUsers } from "../constants/sampleData";
import {
    useChatDetailsQuery,
    useDeleteChatMutation,
    useMyGroupsQuery,
    useRemoveGroupMemberMutation,
    useRenameGroupMutation,
} from "../redux/api/api";
import { useAsyncMutation, useErrors } from "../hooks/Hook";
import { setIsAddMember } from "../redux/reducers/misc";

const ConfirmDeleteDialog = lazy(() =>
    import("../components/dialogs/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
    import("../components/dialogs/AddMemberDialog")
);
import { motion } from "framer-motion";

const Groups = () => {
    const chatId = useSearchParams()[0].get("group");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const myGroups = useMyGroupsQuery("");
    const groupDetails = useChatDetailsQuery(
        { chatId, populate: "true" },
        { skip: !chatId }
    );

    const [updateGroup, isLoadingGroupName] = useAsyncMutation(
        useRenameGroupMutation
    );
    const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
        useRemoveGroupMemberMutation
    );
    const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(
        useDeleteChatMutation
    );

    const { isAddMember } = useSelector((state) => state.misc);

    const [members, setMembers] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [groupName, setGroupName] = useState("Group Name");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
    const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");

    const errors = [
        {
            isError: myGroups.isError,
            error: myGroups.error,
        },
        {
            isError: groupDetails.isError,
            error: groupDetails.error,
        },
    ];
    useErrors(errors);

    useEffect(() => {
        const groupData = groupDetails.data;
        if (groupData) {
            setGroupName(groupData.chat.name);
            setGroupNameUpdatedValue(groupData.chat.name);
            setMembers(groupData.chat.members);
        }
    }, [groupDetails.data]);

    const handleMobile = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

    const handleMobileClose = () => {
        setIsMobileMenuOpen(false);
    };

    const navigateBack = () => {
        navigate("/");
    };

    const updateGroupName = () => {
        setIsEdit(false);
        updateGroup("Updating Group Name...", {
            chatId,
            name: groupNameUpdatedValue,
        });
    };

    const openConfirmDeleteHandler = () => {
        setConfirmDeleteDialog(true);
    };

    const closeConfirmDeleteHandler = () => {
        setConfirmDeleteDialog(false);
    };

    const openAddMemberHandler = () => {
        dispatch(setIsAddMember(true));
    };

    const deleteHandler = () => {
        deleteGroup("Deleting Group. ..", chatId);
        closeConfirmDeleteHandler();
        navigate("/groups");
    };

    const removeMemberHandler = (userId) => {
        removeMember("Removing Member...", { chatId, userId });
    };

    useEffect(() => {
        if (chatId) {
            setGroupName(`Group Name ${chatId}`);
            setGroupNameUpdatedValue(`Group Name ${chatId}`);
        }

        return () => {
            setGroupName("");
            setGroupNameUpdatedValue("");
            setIsEdit(false);
        };
    }, [chatId]);

    const IconBtns = (
        <>
            <Box
                sx={{
                    display: {
                        xs: "block",
                        sm: "none",
                        position: "fixed",
                        right: "1rem",
                        top: "1rem",
                    },
                }}
            >
                <IconButton onClick={handleMobile}>
                    <MenuIcon />
                </IconButton>
            </Box>
            <Tooltip title="back">
                <IconButton
                    sx={{
                        position: "absolute",
                        top: "2rem",
                        left: "2rem",
                        bgcolor: matBlack,
                        color: "white",
                        ":hover": {
                            bgcolor: "rgba(0,0,0,0.7)",
                        },
                    }}
                    onClick={navigateBack}
                >
                    <KeyboardBackspaceIcon />
                </IconButton>
            </Tooltip>
        </>
    );

    const GroupName = (
        <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            spacing={"1rem"}
            padding={"3rem"}
        >
            {isEdit ? (
                <>
                    <TextField
                        value={groupNameUpdatedValue}
                        onChange={(e) =>
                            setGroupNameUpdatedValue(e.target.value)
                        }
                    />
                    <IconButton
                        onClick={updateGroupName}
                        disabled={isLoadingGroupName}
                    >
                        <DoneIcon />
                    </IconButton>
                </>
            ) : (
                <>
                    <Typography variant="h4">{groupName}</Typography>
                    <IconButton
                        disabled={isLoadingGroupName}
                        onClick={() => setIsEdit(true)}
                    >
                        <EditIcon />
                    </IconButton>
                </>
            )}
        </Stack>
    );

    const ButtonGroup = (
        <Stack
            direction={{
                xs: "column-reverse",
                sm: "row",
            }}
            spacing={"1rem"}
            p={{
                xs: "0",
                sm: "1rem",
                md: "1rem 4rem",
            }}
        >
            <Button
                size="large"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={openConfirmDeleteHandler}
            >
                Delete Group
            </Button>
            <Button
                size="large"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openAddMemberHandler}
            >
                Add Member
            </Button>
        </Stack>
    );

    return myGroups.isLoading ? (
        <LayoutLoader />
    ) : (
        <Grid container height={"100vh"}>
            <Grid
                item
                sx={{
                    display: {
                        xs: "none",
                        sm: "block",
                    },
                }}
                sm={4}
            >
                <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />
            </Grid>

            <Grid
                item
                xs={12}
                sm={8}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    padding: "1rem 3rem",
                }}
            >
                {IconBtns}

                {groupName && (
                    <>
                        {GroupName}

                        <Typography
                            margin={"2rem"}
                            alignSelf={"flex-start"}
                            variant="body1"
                        >
                            Members
                        </Typography>

                        <Stack
                            maxWidth={"45rem"}
                            width={"100%"}
                            boxSizing={"border-box"}
                            padding={{
                                sm: "1rem",
                                xs: "0",
                                md: "1rem 4rem",
                            }}
                            spacing={"2rem"}
                            height={"50vh"}
                            overflow={"auto"}
                        >
                            {isLoadingRemoveMember ? (
                                <CircularProgress />
                            ) : (
                                members.map((i) => (
                                    <UserItem
                                        user={i}
                                        key={i._id}
                                        isAdded
                                        styling={{
                                            boxShadow:
                                                "0 0 0.5rem  rgba(0,0,0,0.2)",
                                            padding: "1rem 2rem",
                                            borderRadius: "1rem",
                                        }}
                                        handler={removeMemberHandler}
                                    />
                                ))
                            )}
                        </Stack>

                        {ButtonGroup}
                    </>
                )}
            </Grid>

            {isAddMember && (
                <Suspense fallback={<Backdrop open />}>
                    <AddMemberDialog chatId={chatId} />
                </Suspense>
            )}

            {confirmDeleteDialog && (
                <Suspense fallback={<Backdrop open />}>
                    <ConfirmDeleteDialog
                        open={confirmDeleteDialog}
                        handleClose={closeConfirmDeleteHandler}
                        deleteHandler={deleteHandler}
                    />
                </Suspense>
            )}

            <Drawer
                sx={{
                    display: {
                        xs: "block",
                        sm: "none",
                    },
                }}
                open={isMobileMenuOpen}
                onClose={handleMobileClose}
            >
                <GroupsList
                    w={"50vw"}
                    myGroups={myGroups?.data?.groups}
                    chatId={chatId}
                />
            </Drawer>
        </Grid>
    );
};

const GroupsList = ({ w = "100%", myGroups = [], chatId }) => (
    <Stack
        width={w}
        sx={{
            backgroundImage: "linear-gradient(to bottom, #2F4F4F, #000000)",
            height: "100vh",
            overflow: "auto",
        }}
    >
        {myGroups.length > 0 ? (
            myGroups.map((group) => (
                <GroupListItem group={group} chatId={chatId} key={group._id} />
            ))
        ) : (
            <Typography textAlign={"center"} padding="1rem">
                No groups
            </Typography>
        )}
    </Stack>
);

const GroupListItem = memo(({ group, chatId }) => {
    const { name, avatar, _id } = group;

    return (
        <Link
            sx={{ marginTop: "0.07rem", padding: "0.001rem", width: "100%" }}
            to={`?group=${_id}`}
            onClick={(e) => {
                if (chatId === _id) e.preventDefault();
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: "-100%" }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                    hover: "none",

                    // backgroundColor: sameSender ? darkGreenColor : greenColor,
                    // color: sameSender ? "white" : "aliceblue",
                    position: "relative",
                    padding: "1rem",
                }}
            >
                <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
                    <AvatarCard avatar={avatar} />
                    <Typography sx={{ color: "white" }}>{name}</Typography>
                </Stack>
            </motion.div>
        </Link>
    );
});

export default Groups;
