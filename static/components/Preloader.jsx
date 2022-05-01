import React from "react";
import { Loader } from "../vibe";
export default ({ loading, children }) => {
    if (!loading)
        return (
            <>{children}</>
        );

    return (
        <Loader type="spin" />
    );
};
