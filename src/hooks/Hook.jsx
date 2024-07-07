import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useErrors = (errors = []) => {
    useEffect(() => {
        errors.forEach(({ isError, error, fallback }) => {
            if (isError) {
                if (fallback) fallback();
                else
                    toast.error(error?.data?.message || "Something went wrong");
            }
        });
    }, [errors]);
};

// This Hook, takes a function as argument, which is basically some function that is written in backend, and is taken from their using a mutation query, to mutate/update something in backend.
const useAsyncMutation = (mutationHook) => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);

    // mutationHook = This Hook that is the rtk query, which is called here, to get the respective function from backend (i.e mutate)
    // to perform some backend operation
    const [mutate] = mutationHook();

    // Now, executeMutation is the modified version mutate (i.e. backend function) which will be used finally for the functionality.
    // That is modified with ToastMessages and Error Handling.
    const executeMutation = async (toastMessage, ...args) => {
        setIsLoading(true);
        const toastId = toast.loading(toastMessage) || "Updating data...";

        try {
            const res = await mutate(...args);
            if (res.data) {
                toast.success(res.data.message || "Data updated successfully", {
                    id: toastId,
                });
                setData(res.data);
            } else {
                toast.error(
                    res?.error?.data?.message || "Something went wrong",
                    {
                        id: toastId,
                    }
                );
            }
        } catch (error) {
            console.log(error);
            toast.error(res?.error?.data?.message || "Something went wrong", {
                id: toastId,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // executeMutation = this is the final function that will do the backend work when called.
    return [executeMutation, isLoading, data];
};

const useSocketEvents = (socket, handlers) => {
    useEffect(() => {
        Object.entries(handlers).forEach(([event, handler]) => {
            socket.on(event, handler);
        });

        return () => {
            Object.entries(handlers).forEach(([event, handler]) => {
                socket.off(event, handler);
            });
        };
    }, [socket, handlers]);
};

export { useErrors, useAsyncMutation, useSocketEvents };
