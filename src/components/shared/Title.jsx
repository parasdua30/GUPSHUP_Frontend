import React from "react";
import { Helmet } from "react-helmet-async";

function Title({
    title = "GupShup",
    description = "GupShup is a chat app that allows you to communicate with your friends and family.",
}) {
    return (
        <div>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
            </Helmet>
        </div>
    );
}

export default Title;
